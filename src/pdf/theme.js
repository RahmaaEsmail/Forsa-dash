/**
 * Shared design tokens for every PDF document (quotation, proforma, delivery
 * note, GRN, invoice...). Keeping them in one place is what makes the documents
 * look like one family instead of five separate one-off layouts.
 */
export const color = {
  brand: "#C94544",
  brandDark: "#A63736",
  brandTint: "#FBF1F1",
  /**
   * Opaque tints of the brand red, for use *on top of* a brand-red surface.
   * react-pdf mis-parses `rgba()` in border properties (it paints them green),
   * so anything that needs a translucent look on the footer band has to be
   * pre-mixed here instead.
   */
  onBrandFill: "#CF5B5A",
  onBrandLine: "#D67473",
  onBrandText: "#F3D3D3",
  ink: "#111827",
  body: "#374151",
  muted: "#6B7280",
  faint: "#9CA3AF",
  line: "#E5E7EB",
  lineSoft: "#F1F3F5",
  surface: "#F8F9FA",
  white: "#FFFFFF",
};

export const size = {
  micro: 6.5,
  tiny: 7,
  small: 8,
  base: 8.5,
  body: 9,
  lead: 10,
  h3: 11,
  h2: 13,
  h1: 20,
};

/** A4 geometry in PostScript points. */
export const page = {
  width: 595.28,
  height: 841.89,
  marginX: 34,
  /**
   * Reserved for the repeating header band (which is absolutely positioned and
   * therefore outside the flow). Header occupies roughly 26..68pt, leaving a
   * ~16pt gap before body content starts.
   */
  paddingTop: 84,
  /**
   * Reserved for the repeating footer band, which is ~99pt tall with bank
   * accounts and sits flush with the bottom edge. Leaves a ~14pt gap above it.
   */
  paddingBottom: 114,
  /** Same, for a footer with no bank accounts — the band shrinks to ~35pt. */
  paddingBottomNoBanks: 50,
};

export const radius = { sm: 3, md: 5, lg: 6 };

/**
 * How much bottom padding a page must reserve for the fixed footer band. With
 * every bank slot switched off the band is little more than the company line,
 * so holding back the full reserve would waste ~65pt on every page.
 */
export const footerReserve = (bankCount) =>
  bankCount > 0 ? page.paddingBottom : page.paddingBottomNoBanks;
