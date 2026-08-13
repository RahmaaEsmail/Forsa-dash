/**
 * Text helpers shared by both renderings of a document — the react-pdf one and
 * the HTML preview. Kept free of react-pdf imports so the HTML side does not
 * have to pull in the PDF renderer (and its fonts) to format a string.
 */

// Hebrew, Arabic, Arabic Supplement/Extended and the presentation-form blocks.
const RTL_CHARS = /[֐-ࣿיִ-﷿ﹰ-ﻼ]/g;
const LTR_CHARS = /[A-Za-z]/g;

/**
 * True when a string is predominantly Arabic/Hebrew. react-pdf reorders bidi
 * runs correctly, but only if the paragraph's base direction is right — an
 * Arabic item name laid out left-to-right ends up with its punctuation and
 * digits on the wrong side.
 */
export function isRtlText(value) {
  if (typeof value !== "string") return false;
  const rtl = value.match(RTL_CHARS)?.length ?? 0;
  if (!rtl) return false;
  const ltr = value.match(LTR_CHARS)?.length ?? 0;
  return rtl >= ltr;
}

/** Resolves a spatie-translatable value that may arrive as `{ en, ar }`. */
export function translated(value, locale = "en") {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object")
    return value[locale] || value.en || value.ar || "";
  return String(value);
}
