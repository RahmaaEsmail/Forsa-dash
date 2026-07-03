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
 * Walks all accessible stylesheets in the document, finds any property value
 * containing "oklch", converts it to rgb, and returns a CSS string with
 * !important overrides that can be injected into the cloned document.
 */
function buildOklchOverrides() {
  const overrides = {};

  function processRules(rules) {
    Array.from(rules || []).forEach((rule) => {
      if (rule.selectorText && rule.style) {
        let decls = "";
        Array.from(rule.style).forEach((prop) => {
          const val = rule.style.getPropertyValue(prop);
          if (val.includes("oklch")) {
            decls += `${prop}: ${colorToRgb(val)} !important; `;
          }
        });
        if (decls) {
          overrides[rule.selectorText] =
            (overrides[rule.selectorText] || "") + decls;
        }
      }
      // Recurse into @media, @supports, @layer, etc.
      if (rule.cssRules) {
        processRules(rule.cssRules);
      }
    });
  }

  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      processRules(sheet.cssRules);
    } catch {
      // cross-origin stylesheet — skip
    }
  });

  return Object.entries(overrides)
    .map(([sel, decls]) => `${sel} { ${decls} }`)
    .join("\n");
}

/**
 * Downloads the given DOM element as a PDF file, transparently working around
 * html2canvas's lack of support for oklch() CSS color values.
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

  const oklchOverrideCSS = buildOklchOverrides();

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
          if (oklchOverrideCSS) {
            const style = clonedDoc.createElement("style");
            style.textContent = oklchOverrideCSS;
            clonedDoc.head.appendChild(style);
          }
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    })
    .from(element)
    .save();
}
