import { Font } from "@react-pdf/renderer";

import regular from "../assets/fonts/IBMPlexSansArabic-Regular.ttf?url";
import semibold from "../assets/fonts/IBMPlexSansArabic-SemiBold.ttf?url";
import bold from "../assets/fonts/IBMPlexSansArabic-Bold.ttf?url";

/**
 * The single font family used by every generated document.
 *
 * Helvetica (react-pdf's default) ships no Arabic and no emoji glyphs, which is
 * why company names, item names and the phone/mail icons came out as blank
 * boxes. IBM Plex Sans Arabic covers Latin + Arabic in one family and is
 * bundled with the app, so rendering never depends on a network font.
 */
export const FONT_FAMILY = "PlexArabic";

let registered = false;

export function registerPdfFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: FONT_FAMILY,
    fonts: [
      { src: regular, fontWeight: 400 },
      { src: semibold, fontWeight: 600 },
      { src: bold, fontWeight: 700 },
    ],
  });

  // react-pdf hyphenates by default, which chops part numbers and SKUs in half
  // ("HDG-BOLT-M12" -> "HDG-BO-LT..."). Keep words intact and only hard-split
  // tokens that are too long to ever fit a table cell.
  Font.registerHyphenationCallback((word) => {
    if (word.length <= 16) return [word];
    const parts = [];
    for (let i = 0; i < word.length; i += 16) parts.push(word.slice(i, i + 16));
    return parts;
  });
}

registerPdfFonts();
