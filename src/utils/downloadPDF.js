import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

/**
 * Converts any CSS color string (including oklch) to rgb/rgba by painting it
 * onto a 1×1 canvas and reading back the pixel. This works because the browser
 * supports oklch natively in Canvas 2D fillStyle but html2canvas does not.
 */
function colorToRgb(color) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillStyle = color.trim();
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a < 255) return `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`;
    return `rgb(${r},${g},${b})`;
  } catch {
    return color;
  }
}

/**
 * Serializes all accessible style rules from the current document,
 * replacing any oklch color references with their standard rgb/rgba equivalents.
 */
function getSanitizedStyles() {
  let cssText = "";
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      const rules = sheet.cssRules || sheet.rules;
      if (rules) {
        Array.from(rules).forEach((rule) => {
          cssText += rule.cssText + "\n";
        });
      }
    } catch (e) {
      // Ignore cross-origin stylesheet errors
    }
  });

  // Convert oklch(...) and oklab(...) occurrences in the CSS string
  return cssText.replace(/(oklch|oklab)\([^)]+\)/g, (match) => {
    return colorToRgb(match);
  });
}

/**
 * Downloads the given DOM element as a PDF file, sanitizing oklch colors.
 *
 * @param {HTMLElement} element  The element to render
 * @param {object}      options
 * @param {string}      options.filename    e.g. "RFQ-1234.pdf"
 * @param {number[]}    options.margin      [top, right, bottom, left] in mm (standard format is top, left, bottom, right)
 * @param {string}      options.orientation "portrait" | "landscape"
 * @param {number}      options.scale       html2canvas scale factor (default 2)
 */
export async function downloadAsPDF(element, options = {}) {
  const {
    filename = "document.pdf",
    margin = [8, 8, 8, 8],
    orientation = "portrait",
    scale = 2,
  } = options;

  if (!element) {
    console.error("downloadAsPDF: element is null");
    return;
  }

  // Get sanitized styles BEFORE cloning
  const cleanCSS = getSanitizedStyles();

  // Find if there is a printable footer to repeat
  const footerEl = element.querySelector(".print-footer");
  let footerImgData = null;
  let pdfFooterHeight = 0;
  let pdfFooterWidth = 0;

  const isLandscape = orientation === "landscape";
  const pageWidth = isLandscape ? 297 : 210;
  const pageHeight = isLandscape ? 210 : 297;

  if (footerEl) {
    try {
      // Capture footer as an image
      const footerCanvas = await html2canvas(footerEl, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      if (footerCanvas.width > 0) {
        footerImgData = footerCanvas.toDataURL("image/png");
        pdfFooterWidth = pageWidth;
        pdfFooterHeight = pdfFooterWidth * (footerCanvas.height / footerCanvas.width);
      }
    } catch (error) {
      console.error("Failed to capture footer canvas:", error);
    }
  }

  // Normalize and adjust margin to accommodate footer on all pages if we have one
  let adjustedMargin = [8, 8, 8, 8];
  if (Array.isArray(margin)) {
    if (margin.length === 2) {
      adjustedMargin = [margin[0], margin[1], margin[0], margin[1]];
    } else if (margin.length === 4) {
      adjustedMargin = [...margin];
    }
  } else if (typeof margin === "number") {
    adjustedMargin = [margin, margin, margin, margin];
  }

  if (footerImgData) {
    // Space for footer: pdfFooterHeight plus 5mm safety gap
    const minBottomMargin = pdfFooterHeight + 5;
    if (adjustedMargin[2] < minBottomMargin) {
      adjustedMargin[2] = minBottomMargin;
    }
  }

  const worker = html2pdf()
    .set({
      margin: adjustedMargin,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          // 1. Remove all existing link stylesheets and style tags to prevent html2canvas parsing oklch
          const links = clonedDoc.querySelectorAll("link[rel='stylesheet']");
          links.forEach((link) => link.remove());

          const styles = clonedDoc.querySelectorAll("style");
          styles.forEach((style) => style.remove());

          // 2. Inject the sanitized CSS rules
          if (cleanCSS) {
            const style = clonedDoc.createElement("style");
            style.textContent = cleanCSS;
            clonedDoc.head.appendChild(style);
          }

          // 3. Convert any computed oklch colors on elements directly to inline RGB/RGBA
          const allElements = clonedDoc.querySelectorAll("*");
          const view = clonedDoc.defaultView || window;
          allElements.forEach((el) => {
            try {
              const style = view.getComputedStyle(el);
              const properties = [
                "color",
                "backgroundColor",
                "borderColor",
                "borderTopColor",
                "borderRightColor",
                "borderBottomColor",
                "borderLeftColor",
                "fill",
                "stroke",
              ];
              properties.forEach((prop) => {
                const val = style[prop];
                if (val && (val.includes("oklch") || val.includes("oklab"))) {
                  const rgbVal = colorToRgb(val);
                  el.style[prop] = rgbVal;
                }
              });
            } catch (e) {
              // Ignore errors on hidden or unstyled nodes
            }
          });

          // 4. Hide the inline footer from page content so it isn't rendered twice
          if (footerImgData) {
            const clonedFooter = clonedDoc.querySelector(".print-footer");
            if (clonedFooter) {
              clonedFooter.style.display = "none";
            }
          }
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    })
    .from(element);

  if (footerImgData) {
    await worker
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.addImage(
            footerImgData,
            "PNG",
            0,
            pageHeight - pdfFooterHeight,
            pdfFooterWidth,
            pdfFooterHeight,
            undefined,
            "FAST"
          );
        }
      })
      .save();
  } else {
    await worker.save();
  }
}
