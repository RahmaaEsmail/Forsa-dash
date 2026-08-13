import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";

import "./fonts";
import { FONT_FAMILY } from "./fonts";
import { color, size, page, radius } from "./theme";
import { LOGO_FORSA } from "./assets";
import { isRtlText } from "./text";

/* ============================================================== text helpers */

export { isRtlText, translated } from "./text";

const hasTextAlign = (style) =>
  (Array.isArray(style) ? style : [style]).some(
    (x) => x && typeof x === "object" && "textAlign" in x,
  );

/**
 * Text that flips to RTL when its content is Arabic. Everything user-supplied
 * (item names, company name, bank names, terms) should go through this.
 *
 * Direction is always applied — that is what makes the shaping and the digit /
 * punctuation order correct. Alignment only defaults to `right`; an explicit
 * `textAlign` in the passed style wins, so an Arabic subtitle can still sit
 * flush under the English line above it.
 */
export function AutoText({ children, style, ...rest }) {
  const flat = Array.isArray(children) ? children.join("") : children;
  const rtl = isRtlText(flat);
  const dir = rtl && {
    direction: "rtl",
    ...(hasTextAlign(style) ? null : { textAlign: "right" }),
  };
  return (
    <Text style={[style, dir].filter(Boolean)} {...rest}>
      {children}
    </Text>
  );
}

/* ==================================================================== icons */

/**
 * Line icons drawn as vectors. The previous layout used 📞/✉️/📍 emoji, which
 * no embedded font can render — they came out as blank boxes in every PDF.
 */
const icon = (paths) =>
  function PdfIcon({ s = 7, stroke = color.muted }) {
    return (
      <Svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        style={{ marginRight: 2.5 }}
      >
        {paths.map((d, i) =>
          typeof d === "string" ? (
            <Path
              key={i}
              d={d}
              stroke={stroke}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <Circle
              key={i}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              stroke={stroke}
              strokeWidth={2}
              fill="none"
            />
          ),
        )}
      </Svg>
    );
  };

export const Icons = {
  Phone: icon([
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  ]),
  Mail: icon([
    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
    "M22 6l-10 7L2 6",
  ]),
  Pin: icon([
    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
    { cx: 12, cy: 10, r: 3 },
  ]),
};

/* =================================================================== styles */

export const base = StyleSheet.create({
  page: {
    fontFamily: FONT_FAMILY,
    fontSize: size.body,
    color: color.body,
    backgroundColor: color.white,
    paddingTop: page.paddingTop,
    paddingBottom: page.paddingBottom,
    paddingHorizontal: page.marginX,
    // NB: do not set `lineHeight` here. react-pdf re-lays out dynamic nodes
    // (anything with a `render` prop, i.e. the page counter) after pagination,
    // and an inherited page-level lineHeight makes that pass drop the line
    // entirely — the counter renders as nothing at all. Set lineHeight on the
    // individual text styles that need it instead.
  },
});

const s = StyleSheet.create({
  /* ---- header ---- */
  header: {
    position: "absolute",
    top: 26,
    left: page.marginX,
    right: page.marginX,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.5,
    borderBottomColor: color.brand,
    paddingBottom: 8,
  },
  logo: { height: 32, width: 32 * (300 / 168), objectFit: "contain" },
  headerRight: { maxWidth: "62%", alignItems: "flex-end" },
  companyName: {
    fontSize: size.base,
    fontWeight: 700,
    color: color.ink,
    textAlign: "right",
    marginBottom: 1.5,
  },
  companyLine: { fontSize: size.tiny, color: color.muted, textAlign: "right" },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2.5,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  contactItem: { flexDirection: "row", alignItems: "center", marginLeft: 9 },
  contactText: { fontSize: size.tiny, color: color.body },

  /* ---- footer ---- */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.brand,
    paddingTop: 8,
    paddingBottom: 7,
    paddingHorizontal: page.marginX,
  },
  footerTitle: {
    fontSize: size.micro,
    fontWeight: 700,
    color: color.white,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 5,
    opacity: 0.95,
  },
  footerBanks: { flexDirection: "row", gap: 8 },
  footerBanksSingle: { width: "56%", alignSelf: "center" },
  bankChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.onBrandFill,
    borderWidth: 0.5,
    borderColor: color.onBrandLine,
    borderRadius: radius.md,
    padding: 4,
    gap: 5,
  },
  bankLogoBox: {
    width: 40,
    height: 26,
    backgroundColor: color.white,
    borderRadius: radius.sm,
    padding: 1.5,
    justifyContent: "center",
  },
  bankLogo: { width: "100%", height: "100%", objectFit: "contain" },
  bankBody: { flex: 1 },
  bankName: {
    fontSize: size.micro,
    fontWeight: 700,
    color: color.white,
    marginBottom: 0.5,
    textAlign: "left",
  },
  bankLine: { fontSize: 6.2, color: color.onBrandText, textAlign: "left" },
  bankIban: { fontSize: size.micro, fontWeight: 700, color: color.white },
  footerRule: {
    borderTopWidth: 0.5,
    borderTopColor: color.onBrandLine,
    marginTop: 6,
    marginBottom: 5,
  },
  footerBottom: { flexDirection: "row", alignItems: "center" },
  footerLegal: { flex: 1, paddingRight: 40 },
  footerCompany: {
    fontSize: size.micro,
    fontWeight: 700,
    color: color.white,
  },
  footerMeta: { fontSize: 6.2, color: color.onBrandText, marginTop: 0.5 },
  // Rendered as a sibling of the footer band rather than a child of it:
  // a dynamic node nested inside an absolutely positioned View makes
  // react-pdf's relayout pass blow the View's height out to several pages.
  footerPage: {
    position: "absolute",
    left: 0,
    right: page.marginX,
    textAlign: "right",
    fontSize: size.micro,
    fontWeight: 600,
    color: color.onBrandText,
  },

  /* ---- title ---- */
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  title: {
    fontSize: size.h1,
    fontWeight: 700,
    color: color.brand,
    letterSpacing: -0.3,
  },
  titleRule: {
    width: 34,
    height: 2.5,
    backgroundColor: color.brand,
    marginTop: 4,
    borderRadius: 2,
  },
  refBox: {
    backgroundColor: color.brandTint,
    borderWidth: 0.5,
    borderColor: "#F0D9D9",
    borderRadius: radius.lg,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "flex-end",
    minWidth: 130,
  },
  refLabel: {
    fontSize: size.micro,
    color: color.brandDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  refValue: {
    fontSize: size.h3,
    fontWeight: 700,
    color: color.brand,
    marginTop: 1,
  },
  refMeta: { fontSize: size.micro, color: color.muted, marginTop: 1.5 },

  /* ---- cards ---- */
  cardRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  card: {
    flex: 1,
    backgroundColor: color.surface,
    borderWidth: 0.5,
    borderColor: color.line,
    borderRadius: radius.lg,
    padding: 9,
  },
  cardTitle: {
    fontSize: size.micro,
    fontWeight: 700,
    color: color.brand,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 5,
  },
  fieldGrid: { flexDirection: "row", flexWrap: "wrap" },
  fieldLabel: { fontSize: size.micro, color: color.faint },
  fieldValue: { fontSize: size.base, fontWeight: 600, color: color.ink },
  cardLead: {
    fontSize: size.lead,
    fontWeight: 700,
    color: color.ink,
    marginBottom: 3,
  },
  cardLine: { fontSize: size.small, color: color.body, marginBottom: 1 },

  /* ---- section ---- */
  sectionTitle: {
    fontSize: size.small,
    fontWeight: 700,
    color: color.ink,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 5,
  },
  sectionRule: {
    borderTopWidth: 0.5,
    borderTopColor: color.line,
    marginBottom: 8,
  },
});

/* ================================================================ components */

export function DocumentHeader({ company }) {
  return (
    <View style={s.header} fixed>
      <Image src={LOGO_FORSA} style={s.logo} />
      <View style={s.headerRight}>
        <AutoText style={s.companyName}>{company.name}</AutoText>
        {!!company.address && (
          <AutoText style={s.companyLine}>{company.address}</AutoText>
        )}
        <View style={s.contactRow}>
          {!!company.phone && (
            <View style={s.contactItem}>
              <Icons.Phone />
              <Text style={s.contactText}>{company.phone}</Text>
            </View>
          )}
          {!!company.email && (
            <View style={s.contactItem}>
              <Icons.Mail />
              <Text style={s.contactText}>{company.email}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function BankChip({ bank }) {
  if (!bank?.name && !bank?.iban) return null;
  return (
    <View style={s.bankChip}>
      {!!bank.image && (
        <View style={s.bankLogoBox}>
          <Image src={bank.image} style={s.bankLogo} />
        </View>
      )}
      <View style={s.bankBody}>
        <AutoText style={s.bankName}>{bank.name}</AutoText>
        {!!bank.holder && (
          <AutoText style={s.bankLine}>{bank.holder}</AutoText>
        )}
        {!!bank.iban && <Text style={s.bankIban}>IBAN {bank.iban}</Text>}
      </View>
    </View>
  );
}

export function DocumentFooter({ company, banks = [], pageNumberBottom = 9 }) {
  const visible = banks.filter((b) => b?.name || b?.iban);
  const single = visible.length === 1;
  return (
    <>
      <View style={s.footer} fixed>
        {visible.length > 0 && (
          <>
            <Text style={s.footerTitle}>
              {single
                ? "For bank transfers please use the following account"
                : "For bank transfers please use one of the following accounts"}
            </Text>
            {/* A lone account is centred at half width rather than stretched
                across the page, which reads as a missing second account. */}
            <View style={[s.footerBanks, single && s.footerBanksSingle]}>
              {visible.map((bank, i) => (
                <BankChip key={i} bank={bank} />
              ))}
            </View>
            <View style={s.footerRule} />
          </>
        )}
        <View style={s.footerBottom}>
          <View style={s.footerLegal}>
            <AutoText style={s.footerCompany}>{company.name}</AutoText>
            <Text style={s.footerMeta}>
              {[
                company.vat && `VAT ${company.vat}`,
                company.crn && `CRN ${company.crn}`,
                company.website,
              ]
                .filter(Boolean)
                .join("   •   ")}
            </Text>
          </View>
        </View>
      </View>
      <Text
        fixed
        style={[s.footerPage, { bottom: pageNumberBottom }]}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </>
  );
}

export function DocumentTitle({ title, refLabel, refValue, refMeta }) {
  return (
    <View style={s.titleRow}>
      <View>
        <Text style={s.title}>{title}</Text>
        <View style={s.titleRule} />
      </View>
      <View style={s.refBox}>
        <Text style={s.refLabel}>{refLabel}</Text>
        <Text style={s.refValue}>{refValue}</Text>
        {!!refMeta && <Text style={s.refMeta}>{refMeta}</Text>}
      </View>
    </View>
  );
}

export function CardRow({ children }) {
  return <View style={s.cardRow}>{children}</View>;
}

export function Card({ title, children, style }) {
  return (
    <View style={[s.card, style].filter(Boolean)}>
      <Text style={s.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function CardLead({ children }) {
  return <AutoText style={s.cardLead}>{children}</AutoText>;
}

export function CardLine({ label, children }) {
  if (!children) return null;
  return (
    <AutoText style={s.cardLine}>
      {label ? <Text style={s.fieldLabel}>{label} </Text> : null}
      {children}
    </AutoText>
  );
}

/** A label/value pair sized to `width` (e.g. "50%") inside a card. */
export function Field({ label, value, width = "50%", last }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <View style={{ width, marginBottom: last ? 0 : 5, paddingRight: 4 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <AutoText style={s.fieldValue}>{value}</AutoText>
    </View>
  );
}

export function FieldGrid({ children }) {
  return <View style={s.fieldGrid}>{children}</View>;
}

export function SectionTitle({ children, ...rest }) {
  return (
    <View {...rest}>
      <Text style={s.sectionTitle}>{children}</Text>
      <View style={s.sectionRule} />
    </View>
  );
}

export const styles = s;
