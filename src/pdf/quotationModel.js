import {
  readCompany,
  readBanks,
  readVatRate,
  readTerms,
  DEFAULT_TERMS,
} from "./settings";
import { parseTerms } from "./blocks";
import { date, daysBetween } from "./format";

/**
 * Normalises the quotation API payload plus the settings collection into the
 * single shape both renderings of the document consume: the PDF
 * (`QuotationPDF`) and the on-screen A4 preview on the quotation details page.
 *
 * Keeping the derivation here is what stops the two from drifting — the preview
 * used to carry its own hardcoded customer address, validity and payment terms,
 * so the sheet on screen said something different from the file that
 * downloaded.
 */
export function buildQuotationModel(quotation, settings, isProforma) {
  const q = quotation ?? {};

  const baseNumber = q.quotation_number || "";
  const number = isProforma
    ? baseNumber.replace(/^(QUO|QUC)-?/, "PI-")
    : baseNumber;

  const currency = q.currency?.code || "SAR";
  const subtotal = Number(q.subtotal ?? 0);
  const tax = Number(q.tax_amount ?? 0);
  const total = Number(q.total_amount ?? subtotal + tax);

  // Prefer the rate the document was actually priced at over the global
  // setting: an old quotation must keep showing the VAT rate that produced its
  // numbers, even after the setting changes.
  const derivedRate = subtotal > 0 ? (tax / subtotal) * 100 : null;
  const vatRate =
    derivedRate !== null && derivedRate > 0
      ? Math.round(derivedRate * 100) / 100
      : readVatRate(settings);

  const address = q.customer?.address;

  return {
    company: readCompany(settings),
    banks: readBanks(settings),
    number,
    title: isProforma ? "Proforma Invoice" : "Quotation",
    refLabel: isProforma ? "Proforma Invoice No." : "Quotation No.",
    issuedOn: date(q.quotation_date),
    validUntil: date(q.valid_until),
    validityDays: daysBetween(q.quotation_date, q.valid_until),
    currency,
    currencyName: q.currency?.name,
    customer: {
      company: q.customer?.company_name || q.customer?.name || "—",
      contact: q.customer?.company_name ? q.customer?.name : null,
      address: address
        ? [
            address.line_1,
            address.line_2,
            address.city,
            address.state,
            address.country,
          ]
            .filter(Boolean)
            .join(", ")
        : null,
      email: q.customer?.email,
      phone: q.customer?.phone,
      vat: q.customer?.tax_number,
      cr: q.customer?.commercial_register,
    },
    paymentTerms:
      q.payment_terms ||
      (q.payment_days ? `Net ${q.payment_days} days` : null) ||
      "As agreed",
    deliveryTerms:
      q.delivery_terms ||
      (q.delivery_days ? `${q.delivery_days} working days` : null),
    poNumber: q.customer_po_number,
    prNumber: q.purchase_request?.pr_number,
    items: Array.isArray(q.items) ? q.items : [],
    subtotal,
    tax,
    total,
    vatRate,
    notes: q.notes,
    terms: parseTerms(
      readTerms(settings, "rfq_terms_and_conditions") || DEFAULT_TERMS,
    ),
  };
}
