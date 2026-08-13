import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import {
  DocumentHeader,
  DocumentFooter,
  DocumentTitle,
  CardRow,
  Card,
  CardLead,
  CardLine,
  Field,
  FieldGrid,
  AutoText,
  translated,
  base,
} from "@/pdf/kit";
import {
  DataTable,
  Totals,
  TermsSection,
  NotesSection,
  SignatureRow,
} from "@/pdf/blocks";
import { buildQuotationModel } from "@/pdf/quotationModel";
import { color, size, footerReserve } from "@/pdf/theme";
import { money, quantity, amountToWords } from "@/pdf/format";

const s = StyleSheet.create({
  itemName: { fontSize: size.base, fontWeight: 600, color: color.ink },
  itemAlt: {
    fontSize: size.tiny,
    color: color.muted,
    marginTop: 0.5,
    textAlign: "left",
  },
  itemNote: {
    fontSize: size.micro,
    color: color.faint,
    marginTop: 1,
    textAlign: "left",
  },
  num: { fontSize: size.small, color: color.body, textAlign: "right" },
  numStrong: {
    fontSize: size.small,
    color: color.ink,
    fontWeight: 600,
    textAlign: "right",
  },
  centre: { fontSize: size.small, color: color.body, textAlign: "center" },
  index: { fontSize: size.tiny, color: color.faint, textAlign: "center" },
  closing: {
    fontSize: size.tiny,
    color: color.muted,
    marginTop: 16,
    textAlign: "center",
  },
});

const COLUMNS = [
  { key: "no", label: "#", width: "5%", align: "center" },
  { key: "desc", label: "Description", width: "42%" },
  { key: "qty", label: "Qty", width: "9%", align: "right" },
  { key: "unit", label: "Unit", width: "9%", align: "center" },
  { key: "price", label: "Unit Price", width: "16%", align: "right" },
  { key: "total", label: "Amount", width: "19%", align: "right" },
];

export function QuotationPDF({ quotation, isProforma, settings }) {
  const m = buildQuotationModel(quotation, settings, isProforma);

  // Document metadata must never be `null`: react-pdf only strips `undefined`
  // before handing the info dictionary to pdfkit, which then calls `.valueOf()`
  // on every entry and throws. An unset company_name would otherwise break
  // every PDF download.
  return (
    <Document
      title={`${m.title} ${m.number}`.trim()}
      author={m.company.name || undefined}
      subject={`${m.title} for ${m.customer.company}`}
      creator="Forsa"
      producer="Forsa"
    >
      {/*
        One flowing page. The header and footer are absolutely positioned and
        `fixed`, so they repeat; everything else — table, totals, terms — is
        laid out by react-pdf and breaks wherever it needs to. The previous
        version sliced items into fixed 12-row pages, which overflowed as soon
        as the terms or the meta cards grew.
      */}
      <Page
        size="A4"
        style={[base.page, { paddingBottom: footerReserve(m.banks.length) }]}
      >
        <DocumentHeader company={m.company} />

        <DocumentTitle
          title={m.title}
          refLabel={m.refLabel}
          refValue={m.number}
          refMeta={m.issuedOn ? `Issued ${m.issuedOn}` : null}
        />

        <CardRow>
          <Card title={isProforma ? "Invoice To" : "Quotation For"}>
            <CardLead>{m.customer.company}</CardLead>
            <CardLine label="Attn:">{m.customer.contact}</CardLine>
            <CardLine>{m.customer.address}</CardLine>
            <CardLine label="VAT:">{m.customer.vat}</CardLine>
            <CardLine label="CR:">{m.customer.cr}</CardLine>
            <CardLine>
              {[m.customer.phone, m.customer.email].filter(Boolean).join("  ·  ")}
            </CardLine>
          </Card>

          <Card title={isProforma ? "Invoice Details" : "Quotation Details"}>
            <FieldGrid>
              <Field label="Issue date" value={m.issuedOn} />
              <Field
                label="Valid until"
                value={
                  m.validUntil &&
                  `${m.validUntil}${m.validityDays !== null ? ` (${m.validityDays} days)` : ""}`
                }
              />
              <Field
                label="Currency"
                value={
                  m.currencyName ? `${m.currency} — ${m.currencyName}` : m.currency
                }
              />
              <Field label="Delivery" value={m.deliveryTerms} />
              <Field label="Your PO" value={m.poNumber} />
              <Field label="Reference" value={m.prNumber} />
              <Field label="Payment terms" value={m.paymentTerms} width="100%" last />
            </FieldGrid>
          </Card>
        </CardRow>

        <DataTable
          columns={COLUMNS}
          rows={m.items}
          emptyLabel="No items on this quotation."
          renderRow={(item, i) => {
            const altName = translated(item.item?.name);
            const showAlt = altName && altName !== item.item_name;
            return {
              no: <Text style={s.index}>{i + 1}</Text>,
              desc: (
                <View>
                  <AutoText style={s.itemName}>
                    {item.item_name || altName || "—"}
                  </AutoText>
                  {showAlt && <AutoText style={s.itemAlt}>{altName}</AutoText>}
                  {!!item.notes && (
                    <AutoText style={s.itemNote}>{item.notes}</AutoText>
                  )}
                </View>
              ),
              qty: <Text style={s.num}>{quantity(item.quantity)}</Text>,
              unit: (
                <AutoText style={s.centre}>
                  {translated(item.unit?.name) || "—"}
                </AutoText>
              ),
              price: <Text style={s.num}>{money(item.selling_price)}</Text>,
              total: <Text style={s.numStrong}>{money(item.line_total)}</Text>,
            };
          }}
        />

        <Totals
          currency={m.currency}
          rows={[
            { label: "Subtotal", value: money(m.subtotal) },
            { label: `VAT (${m.vatRate}%)`, value: money(m.tax) },
          ]}
          grandLabel={isProforma ? "Total Due" : "Grand Total"}
          grandValue={money(m.total)}
          amountInWords={amountToWords(m.total, m.currency)}
        />

        <NotesSection text={m.notes} />

        <View style={{ marginTop: 14 }}>
          <TermsSection blocks={m.terms} />
        </View>

        <SignatureRow
          left={{ label: "Received By", hint: "Name, signature & date" }}
          stamp="Forsa Approved"
          right={{ label: "Authorised Signature", hint: m.company.name }}
        />

        <Text style={s.closing}>
          Thank you for your business. Please quote {m.number} on all
          correspondence.
        </Text>

        <DocumentFooter company={m.company} banks={m.banks} />
      </Page>
    </Document>
  );
}

export default QuotationPDF;
