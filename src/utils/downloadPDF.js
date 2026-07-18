import html2pdf from "html2pdf.js";

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

  // Convert oklch(...) occurrences in the CSS string
  return cssText.replace(/oklch\([^)]+\)/g, (match) => {
    return colorToRgb(match);
  });
}

/**
 * Downloads the given DOM element as a PDF file, sanitizing oklch colors.
 *
 * @param {HTMLElement} element  The element to render
 * @param {object}      options
 * @param {string}      options.filename    e.g. "RFQ-1234.pdf"
 * @param {number[]}    options.margin      [top, right, bottom, left] in mm
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

  await html2pdf()
    .set({
      margin,
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
                if (val && val.includes("oklch")) {
                  const rgbVal = colorToRgb(val);
                  el.style[prop] = rgbVal;
                }
              });
            } catch (e) {
              // Ignore errors on hidden or unstyled nodes
            }
          });
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    })
    .from(element)
    .save();
}
