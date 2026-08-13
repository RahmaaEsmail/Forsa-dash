import React from "react";
import { Phone, Mail } from "lucide-react";

import { money, quantity, amountToWords } from "@/pdf/format";
import { translated } from "@/pdf/text";

/** Label above value, as used in the document-details card. */
function SheetField({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <span className="block text-slate-400 mb-0.5">{label}</span>
      <span className="block text-slate-900 font-bold">{value}</span>
    </div>
  );
}

/**
 * The A4 sheet shown on the quotation details page and the thing `window.print()`
 * targets. It is a second rendering of the same document that QuotationPDF
 * produces, so it takes the identical `doc` model from `buildQuotationModel` —
 * every value on this page must come from `doc`, never from a literal, or the
 * preview and the downloaded file will disagree again.
 */
export default function QuotationSheet({ doc, isProforma, sheetRef }) {
  return (
    <div id="printable-quotation-area-wrapper" className="bg-white py-6">
      <div
        className="max-w-[850px] mx-auto bg-white shadow-md p-12 border border-slate-200 rounded-sm"
        id="printable-quotation-area"
        ref={sheetRef}
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-6 border-b-2 border-primary pb-5 mb-7">
          <img
            src="/images/logo-pdf.png"
            className="h-14 w-auto object-contain shrink-0"
            alt={doc.company.name}
          />
          <div className="text-right text-[11px] text-slate-500 space-y-0.5 max-w-[60%]">
            <h2 className="font-extrabold text-[11px] text-slate-900 tracking-wide">
              {doc.company.name}
            </h2>
            {doc.company.address && <p>{doc.company.address}</p>}
            <div className="flex items-center justify-end gap-4 pt-0.5">
              {doc.company.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {doc.company.phone}
                </span>
              )}
              {doc.company.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {doc.company.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Title + reference */}
        <div className="flex justify-between items-start gap-6 mb-7">
          <div>
            <h3 className="text-3xl font-bold text-primary tracking-tight">
              {doc.title}
            </h3>
            <div className="h-[3px] w-9 bg-primary rounded mt-1.5" />
          </div>
          <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-2 text-right min-w-[190px]">
            <span className="block text-[9px] uppercase tracking-wider text-primary/70">
              {doc.refLabel}
            </span>
            <span className="block text-base font-bold text-primary">
              {doc.number}
            </span>
            {doc.issuedOn && (
              <span className="block text-[10px] text-slate-400 mt-0.5">
                Issued {doc.issuedOn}
              </span>
            )}
          </div>
        </div>

        {/* Meta cards */}
        <div className="grid grid-cols-2 gap-5 mb-7 items-stretch">
          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-xs text-slate-600">
            <h4 className="text-primary font-bold text-[10px] uppercase tracking-wider mb-2.5">
              {isProforma ? "Invoice To" : "Quotation For"}
            </h4>
            <p className="text-slate-900 font-extrabold text-base mb-1">
              {doc.customer.company}
            </p>
            {doc.customer.contact && (
              <p>
                <span className="text-slate-400">Attn:</span>{" "}
                {doc.customer.contact}
              </p>
            )}
            {doc.customer.address && <p>{doc.customer.address}</p>}
            {doc.customer.vat && (
              <p>
                <span className="text-slate-400">VAT:</span>{" "}
                {doc.customer.vat}
              </p>
            )}
            {doc.customer.cr && (
              <p>
                <span className="text-slate-400">CR:</span> {doc.customer.cr}
              </p>
            )}
            {(doc.customer.phone || doc.customer.email) && (
              <p className="pt-0.5">
                {[doc.customer.phone, doc.customer.email]
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>
            )}
          </div>

          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-xs text-slate-600">
            <h4 className="text-primary font-bold text-[10px] uppercase tracking-wider mb-2.5">
              {isProforma ? "Invoice Details" : "Quotation Details"}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              <SheetField label="Issue date" value={doc.issuedOn} />
              <SheetField
                label="Valid until"
                value={
                  doc.validUntil &&
                  `${doc.validUntil}${
                    doc.validityDays !== null
                      ? ` (${doc.validityDays} days)`
                      : ""
                  }`
                }
              />
              <SheetField
                label="Currency"
                value={
                  doc.currencyName
                    ? `${doc.currency} — ${doc.currencyName}`
                    : doc.currency
                }
              />
              <SheetField label="Delivery" value={doc.deliveryTerms} />
              <SheetField label="Your PO" value={doc.poNumber} />
              <SheetField label="Reference" value={doc.prNumber} />
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <SheetField
                label="Payment terms"
                value={doc.paymentTerms}
              />
            </div>
          </div>
        </div>

        {/* Line items */}
        <table className="w-full text-left border-collapse mb-4">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-primary text-[10px] font-bold text-slate-900 uppercase tracking-wider">
              <th className="py-2.5 px-2 w-10 text-center">#</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3 text-right w-16">Qty</th>
              <th className="py-2.5 px-3 text-center w-20">Unit</th>
              <th className="py-2.5 px-3 text-right w-28">Unit Price</th>
              <th className="py-2.5 px-3 text-right w-32">Amount</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-700">
            {doc.items.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  No items on this quotation.
                </td>
              </tr>
            )}
            {doc.items.map((item, index) => {
              const altName = translated(item.item?.name);
              const showAlt = altName && altName !== item.item_name;
              return (
                <tr
                  key={item.id || index}
                  className="align-top border-b border-slate-100 odd:bg-white even:bg-slate-50/40"
                >
                  <td className="py-3 px-2 text-center text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 block">
                      {item.item_name || altName || "—"}
                    </span>
                    {showAlt && (
                      <span className="text-slate-400 text-[11px] block">
                        {altName}
                      </span>
                    )}
                    {item.notes && (
                      <span className="text-slate-400 text-[10px] block mt-0.5">
                        {item.notes}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {quantity(item.quantity)}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-500">
                    {translated(item.unit?.name) || "—"}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {money(item.selling_price)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">
                    {money(item.line_total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex gap-6 items-end mb-8">
          <div className="flex-1 pb-1">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400">
              Amount in words
            </span>
            <span className="block text-xs font-semibold text-slate-900">
              {amountToWords(doc.total, doc.currency)}
            </span>
          </div>
          <div className="w-80 text-xs">
            <div className="flex justify-between px-2 py-1 text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">
                {money(doc.subtotal)}{" "}
                <span className="text-[10px] text-slate-400 font-normal">
                  {doc.currency}
                </span>
              </span>
            </div>
            <div className="flex justify-between px-2 py-1 text-slate-500">
              <span>VAT ({doc.vatRate}%)</span>
              <span className="font-semibold text-slate-900">
                {money(doc.tax)}{" "}
                <span className="text-[10px] text-slate-400 font-normal">
                  {doc.currency}
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center bg-primary text-white rounded-xl px-3 py-2.5 mt-1.5">
              <span className="font-bold text-xs uppercase tracking-wider">
                {isProforma ? "Total Due" : "Grand Total"}
              </span>
              <span className="font-bold text-base">
                {money(doc.total)}{" "}
                <span className="text-[10px] font-normal">
                  {doc.currency}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {doc.notes && (
          <div className="mb-6">
            <h5 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-1.5">
              Notes
            </h5>
            <div className="border-t border-slate-100 pt-2.5">
              <div className="bg-slate-50 border-l-2 border-primary rounded p-3 text-[11px] leading-relaxed text-slate-600">
                {doc.notes}
              </div>
            </div>
          </div>
        )}

        {/* Terms & conditions */}
        {doc.terms.length > 0 && (
          <div className="mb-6">
            <h5 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-1.5">
              Terms &amp; Conditions
            </h5>
            <div className="border-t border-slate-100 pt-2.5 text-[11px] leading-relaxed text-slate-600">
              {doc.terms.map((block, i) => {
                if (block.kind === "heading")
                  return (
                    <p
                      key={i}
                      className="font-bold text-slate-900 mt-2.5 mb-0.5"
                    >
                      {block.text}
                    </p>
                  );
                if (block.kind === "bullet")
                  return (
                    <p key={i} className="flex gap-1.5 mb-1">
                      <span className="text-primary">•</span>
                      <span>{block.text}</span>
                    </p>
                  );
                return (
                  <p key={i} className="mb-1.5">
                    {block.text}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-6 text-center pt-8">
          <div>
            <div className="h-px bg-slate-300 mx-6 mb-1.5" />
            <p className="text-[11px] font-semibold text-slate-700">
              Received By
            </p>
            <p className="text-[9px] text-slate-400">
              Name, signature &amp; date
            </p>
          </div>
          <div className="flex items-end justify-center">
            <div className="border border-primary bg-primary/5 text-primary rounded-xl py-1.5 px-4 uppercase tracking-wider text-[11px] font-bold">
              Forsa Approved
            </div>
          </div>
          <div>
            <div className="h-px bg-slate-300 mx-6 mb-1.5" />
            <p className="text-[11px] font-semibold text-slate-700">
              Authorised Signature
            </p>
            <p className="text-[9px] text-slate-400">{doc.company.name}</p>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-6">
          Thank you for your business. Please quote {doc.number} on all
          correspondence.
        </p>

        {/* Full-bleed brand footer, repeated on every printed page */}
        <div className="print-footer bg-primary text-white mx-[-48px] mb-[-48px] mt-8 px-8 py-3">
          {doc.banks.length > 0 && (
            <>
              <p className="text-[10px] font-bold uppercase text-center tracking-wider text-white/95 mb-2">
                {doc.banks.length === 1
                  ? "For bank transfers please use the following account"
                  : "For bank transfers please use one of the following accounts"}
              </p>
              <div
                className={
                  doc.banks.length === 1
                    ? "grid grid-cols-1 max-w-[56%] mx-auto"
                    : "grid grid-cols-2 gap-3"
                }
              >
                {doc.banks.map((bank, i) => (
                  <div
                    key={i}
                    className="bg-white/10 border border-white/20 rounded-lg p-2 flex items-center gap-2.5"
                  >
                    {bank.image && (
                      <img
                        src={bank.image}
                        alt=""
                        className="w-12 h-8 object-contain bg-white p-0.5 rounded shrink-0"
                      />
                    )}
                    <div className="min-w-0 leading-snug">
                      <p className="font-bold text-[10px] truncate">
                        {bank.name}
                      </p>
                      {bank.holder && (
                        <p className="text-[9px] text-white/80 truncate">
                          {bank.holder}
                        </p>
                      )}
                      {bank.iban && (
                        <p className="text-[10px] font-bold truncate">
                          IBAN {bank.iban}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div
            className={
              doc.banks.length > 0 ? "border-t border-white/20 mt-2.5 pt-2" : ""
            }
          >
            <p className="text-[10px] font-bold">{doc.company.name}</p>
            <p className="text-[9px] text-white/80">
              {[
                doc.company.vat && `VAT ${doc.company.vat}`,
                doc.company.crn && `CRN ${doc.company.crn}`,
                doc.company.website,
              ]
                .filter(Boolean)
                .join("   •   ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
