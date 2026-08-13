import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

import { color, size, radius } from "./theme";
import { AutoText, SectionTitle } from "./kit";

const s = StyleSheet.create({
  /* ---- table ---- */
  head: {
    flexDirection: "row",
    backgroundColor: color.surface,
    borderTopWidth: 0.5,
    borderTopColor: color.line,
    borderBottomWidth: 1,
    borderBottomColor: color.brand,
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  headCell: {
    fontSize: size.micro,
    fontWeight: 700,
    color: color.ink,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    paddingHorizontal: 3,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: color.lineSoft,
    paddingVertical: 5,
    paddingHorizontal: 2,
    alignItems: "flex-start",
  },
  rowAlt: { backgroundColor: "#FCFCFD" },
  cell: { fontSize: size.small, color: color.body, paddingHorizontal: 3 },
  empty: {
    paddingVertical: 18,
    textAlign: "center",
    fontSize: size.small,
    color: color.faint,
  },
  continued: {
    fontSize: size.micro,
    color: color.faint,
    textAlign: "right",
    marginTop: 3,
    fontStyle: "italic",
  },

  /* ---- totals ---- */
  totalsWrap: { flexDirection: "row", marginTop: 10, gap: 12 },
  wordsBox: { flex: 1, justifyContent: "flex-end", paddingBottom: 2 },
  wordsLabel: {
    fontSize: size.micro,
    color: color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  wordsValue: {
    fontSize: size.small,
    color: color.ink,
    fontWeight: 600,
    marginTop: 1.5,
  },
  totalsBox: { width: 230 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  totalLabel: { fontSize: size.base, color: color.body },
  totalValue: { fontSize: size.base, color: color.ink, fontWeight: 600 },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: color.brand,
    borderRadius: radius.lg,
    paddingVertical: 7,
    paddingHorizontal: 9,
    marginTop: 4,
  },
  grandLabel: {
    fontSize: size.body,
    fontWeight: 700,
    color: color.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grandValue: { fontSize: size.h2, fontWeight: 700, color: color.white },
  currency: { fontSize: size.micro, fontWeight: 400 },

  /* ---- terms ---- */
  termsHeading: {
    fontSize: size.small,
    fontWeight: 700,
    color: color.ink,
    marginTop: 5,
    marginBottom: 1.5,
  },
  termItem: { flexDirection: "row", marginBottom: 2.5, paddingRight: 6 },
  bullet: { width: 8, fontSize: size.tiny, color: color.brand },
  termText: { flex: 1, fontSize: size.tiny, color: color.body, lineHeight: 1.5 },
  para: {
    fontSize: size.tiny,
    color: color.body,
    lineHeight: 1.5,
    marginBottom: 3,
  },

  /* ---- notes ---- */
  noteBox: {
    backgroundColor: color.surface,
    borderLeftWidth: 2,
    borderLeftColor: color.brand,
    borderRadius: radius.sm,
    padding: 7,
  },
  noteText: { fontSize: size.tiny, color: color.body, lineHeight: 1.5 },

  /* ---- signatures ---- */
  signRow: { flexDirection: "row", gap: 16, marginTop: 18 },
  signBox: { flex: 1, alignItems: "center" },
  signLine: {
    width: "80%",
    borderTopWidth: 0.5,
    borderTopColor: color.faint,
    marginBottom: 4,
  },
  signLabel: { fontSize: size.tiny, fontWeight: 600, color: color.body },
  signHint: { fontSize: size.micro, color: color.faint, marginTop: 1 },
  stamp: {
    borderWidth: 0.8,
    borderColor: color.brand,
    borderRadius: radius.lg,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: color.brandTint,
  },
  stampText: {
    fontSize: size.small,
    fontWeight: 700,
    color: color.brand,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});

/* ==================================================================== table */

const alignOf = (a) =>
  a === "right" ? "right" : a === "center" ? "center" : "left";

/**
 * A column-driven table. The header and every body row read their widths from
 * the same spec, so the two can never drift apart, and rows never split down
 * the middle of a page.
 *
 * `columns`:   [{ key, label, width, align }]
 * `renderRow`: (row, index) => ({ [key]: node | string })
 */
export function DataTable({ columns, rows, renderRow, emptyLabel, zebra = true }) {
  return (
    <View>
      {/* `fixed` repeats the header on every page the table spills onto. */}
      <View style={s.head} fixed>
        {columns.map((c) => (
          <Text
            key={c.key}
            style={[s.headCell, { width: c.width, textAlign: alignOf(c.align) }]}
          >
            {c.label}
          </Text>
        ))}
      </View>

      {rows.length === 0 && (
        <View style={[s.row, { borderBottomWidth: 0 }]}>
          <Text style={[s.empty, { width: "100%" }]}>{emptyLabel}</Text>
        </View>
      )}

      {rows.map((row, i) => {
        const cells = renderRow(row, i);
        return (
          <View
            key={row.id ?? i}
            style={[s.row, zebra && i % 2 === 1 && s.rowAlt].filter(Boolean)}
            wrap={false}
          >
            {columns.map((c) => {
              const content = cells[c.key];
              return (
                <View
                  key={c.key}
                  style={{ width: c.width, paddingHorizontal: 3 }}
                >
                  {typeof content === "string" || typeof content === "number" ? (
                    <Text
                      style={[
                        s.cell,
                        { paddingHorizontal: 0, textAlign: alignOf(c.align) },
                      ]}
                    >
                      {content}
                    </Text>
                  ) : (
                    content ?? null
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

/* =================================================================== totals */

export function Totals({ rows, grandLabel, grandValue, currency, amountInWords }) {
  return (
    <View style={s.totalsWrap} wrap={false}>
      <View style={s.wordsBox}>
        {!!amountInWords && (
          <>
            <Text style={s.wordsLabel}>Amount in words</Text>
            <Text style={s.wordsValue}>{amountInWords}</Text>
          </>
        )}
      </View>
      <View style={s.totalsBox}>
        {rows.map((r) => (
          <View key={r.label} style={s.totalRow}>
            <Text style={s.totalLabel}>{r.label}</Text>
            <Text style={s.totalValue}>
              {r.value} <Text style={s.currency}>{currency}</Text>
            </Text>
          </View>
        ))}
        <View style={s.grandRow}>
          <Text style={s.grandLabel}>{grandLabel}</Text>
          <Text style={s.grandValue}>
            {grandValue} <Text style={s.currency}>{currency}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ==================================================================== terms */

const BULLET_PREFIX = /^\s*(?:[-•*·–]|\(?\d{1,2}[.)])\s+/;

/**
 * Splits free-text terms into renderable blocks. A line that ends in a colon
 * (and carries no sentence punctuation) reads as a sub-heading; a line that
 * already starts with a dash or a number keeps its bullet; everything else is
 * a paragraph. This lets a settings-managed T&C of any length lay out sensibly
 * instead of being dumped as one unbreakable slab of text.
 */
export function parseTerms(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      if (/:$/.test(line) && line.length < 80)
        return { kind: "heading", text: line.replace(/:$/, "") };
      if (BULLET_PREFIX.test(line))
        return { kind: "bullet", text: line.replace(BULLET_PREFIX, "") };
      return { kind: "para", text: line };
    });
}

export function TermsSection({ title = "Terms & Conditions", blocks }) {
  if (!blocks?.length) return null;
  return (
    <View>
      <SectionTitle minPresenceAhead={60}>{title}</SectionTitle>
      {blocks.map((b, i) => {
        // `minPresenceAhead` keeps a heading from being stranded at the foot of
        // a page with its clause overleaf, and stops a clause starting on the
        // last line of a page.
        if (b.kind === "heading")
          return (
            <AutoText key={i} style={s.termsHeading} minPresenceAhead={58}>
              {b.text}
            </AutoText>
          );
        if (b.kind === "bullet")
          return (
            <View key={i} style={s.termItem} minPresenceAhead={20}>
              <Text style={s.bullet}>•</Text>
              <AutoText style={s.termText}>{b.text}</AutoText>
            </View>
          );
        return (
          <AutoText key={i} style={s.para} minPresenceAhead={20}>
            {b.text}
          </AutoText>
        );
      })}
    </View>
  );
}

export function NotesSection({ title = "Notes", text }) {
  if (!text) return null;
  return (
    <View style={{ marginTop: 12 }} wrap={false}>
      <SectionTitle>{title}</SectionTitle>
      <View style={s.noteBox}>
        <AutoText style={s.noteText}>{text}</AutoText>
      </View>
    </View>
  );
}

/* =============================================================== signatures */

export function SignatureRow({ left, stamp, right }) {
  return (
    <View style={s.signRow} wrap={false} minPresenceAhead={60}>
      <View style={s.signBox}>
        <View style={{ height: 26 }} />
        <View style={s.signLine} />
        <Text style={s.signLabel}>{left.label}</Text>
        {!!left.hint && <Text style={s.signHint}>{left.hint}</Text>}
      </View>
      <View style={[s.signBox, { justifyContent: "center" }]}>
        <View style={{ height: 18 }} />
        <View style={s.stamp}>
          <Text style={s.stampText}>{stamp}</Text>
        </View>
      </View>
      <View style={s.signBox}>
        <View style={{ height: 26 }} />
        <View style={s.signLine} />
        <Text style={s.signLabel}>{right.label}</Text>
        {!!right.hint && <Text style={s.signHint}>{right.hint}</Text>}
      </View>
    </View>
  );
}

export const blockStyles = s;
