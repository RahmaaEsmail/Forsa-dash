# "Description / Specs" — Frontend Changes

Carrying the Purchase Request line's **Description / Specs** text through every
downstream document in the procurement cycle.

Date: 2026-09-03

---

## Background

On the PR create/edit page (`PurchaseProducts.jsx`) each product line has a
column labelled **"Description / Specs"**. It is registered as
`items.${index}.specifications` and prefilled from the product catalog's
`description` when a product is selected.

Previously that text was visible only on the PR and the RFQ. Every document
after that — Quotation, Delivery Note, GRN, Customer Invoice — rendered the
item name alone, so a spec typed by sales never reached the customer-facing
quotation or its PDF.

The backend now carries `specifications` forward as a snapshot field (alongside
`sku`, `item_name`, `variant_snapshot`) and returns it on every item resource.
These frontend changes render it.

```
PR line ──> RFQ ──> PO ──> Quotation ──> Delivery Note
                              │            Customer Invoice
                              └─ GRN (via RFQ)
```

---

## API contract change

`specifications` is now present on the item objects of these responses. It is a
**nullable plain string** — not a translatable `{en, ar}` object, so render it
directly without passing it through the `translated()` helper.

| Endpoint | Item field |
|---|---|
| `GET /quotations/{id}` | `items[].specifications` |
| `GET /delivery-notes/{id}` | `items[].specifications` |
| `GET /grns/{id}` | `items[].specifications` |
| `GET /customer-invoices/{id}` | `items[].specifications` |

It was already present on `GET /purchase-requests/{id}` and `GET /rfqs/{id}`.

Because the value can contain newlines (the backend concatenates specs with
`\n` when it merges duplicate PR lines), every render site uses
`whitespace-pre-line`.

---

## Rendering convention

The same pattern is used everywhere, so the field reads consistently across
documents:

- Placed **directly under the item name**, above the SKU when one is shown.
- Guarded with a truthiness check — nothing renders when the value is null or
  empty, so existing documents look unchanged.
- Styled one step lighter than the item name but **darker than the SKU / alt-name
  line** (`text-slate-500` against `text-slate-400`), because the spec is
  content the reader is meant to act on, not metadata.
- `whitespace-pre-line` on every instance to preserve multi-line specs.

Each detail page has **two** render sites — the on-screen table and the
print/PDF block — and both were updated. Missing one would mean the spec shows
on screen but vanishes when the document is printed.

---

## Files changed

### Quotation

**`src/components/pages/Quotations/QuotationItemsTable.jsx`** — line 33

Spec line added to the "Product" column cell, between the item name and the
`ID: {rfq_item_id}` debug line. This table is the quotation edit screen.

**`src/pages/Quotations/EditQuotation.jsx`** — line 168

```js
specifications: item.specifications || "",
```

Added to the `quotation.items?.map(...)` that builds the react-hook-form
defaults. Without this the field never reaches `QuotationItemsTable`, since
that component reads rows out of the form state rather than the raw query
result.

**`src/pages/Quotations/QuotationSheet.jsx`** — line 199

The on-screen quotation document (rendered by `QuotationDetails.jsx`). Spec
line added to the description cell, between the alt-name line and the notes
line.

**`src/pages/Quotations/QuotationPDF.jsx`** — lines 37 and 161

The `@react-pdf` document. Two changes:

1. New `itemSpec` style in the `StyleSheet.create({...})` block:
   ```js
   itemSpec: {
     fontSize: size.tiny,
     color: color.body,
     marginTop: 1,
     textAlign: "left",
   },
   ```
   Sized between `itemAlt` (`size.tiny` / `color.muted`) and `itemNote`
   (`size.micro` / `color.faint`) — tokens come from `src/pdf/theme.js`.

2. `<AutoText style={s.itemSpec}>` rendered inside the `desc` cell of
   `renderRow`. Uses `AutoText` (not `Text`) so Arabic specs get RTL handling
   like the surrounding item name.

### Delivery Note

**`src/pages/DeliveryNotes/DeliveryNoteDetails.jsx`** — lines 302 and 685

- Line 302: the "Description" column of the on-screen items table.
- Line 685: the printable block's item cell.

### GRN

**`src/pages/GRNs/GRNDetails.jsx`** — lines 119 and 607

- Line 119: the "Product" column of the on-screen items table, above the SKU.
- Line 607: the printable block's item cell, above the `SKU:` line.

### Customer Invoice

**`src/pages/CustomerInvoices/CustomerInvoiceDetails.jsx`** — lines 664 and 1228

- Line 664: the "Product / Description" column, after the Arabic alt-name and
  before the SKU.
- Line 1228: the printable block's item cell.

---

## Not changed, and why

**The field is display-only downstream.** It is not editable on the Quotation,
Delivery Note, GRN, or Customer Invoice — it is a snapshot of what sales wrote
on the PR, treated the same way `sku` and `item_name` already are. The GRN /
DN / invoice forms submit only ids and quantities, so nothing in the UI can
blank the text.

If sales should be able to reword the spec on the quotation before it reaches
the customer, that is a small follow-up: an `<Input>` in
`QuotationItemsTable.jsx`, the field added to `buildQuotationPayload()` in
`EditQuotation.jsx`, plus a validation rule and one line in
`syncQuotationItems()` on the backend.

**`QuotationDetails.jsx` was not edited directly.** It renders its items
through `QuotationSheet.jsx`, which was updated. (Note: roughly the first 700
lines of that file are commented-out dead code; the live component starts at
line 704.)

**Dead pages were skipped.** `PurchaseOrders` has no route in
`routesData.jsx` and its backend tables were dropped by the RFQ/PO unification
migration. Supplier Invoice has no page or route either.

---

## Verification

- `npm run build` — passes (built in ~43s, no new warnings).
- `npm run lint` — **could not run.** Pre-existing breakage unrelated to these
  changes: `eslint.config.js` uses the v9 flat-config import `eslint/config`,
  but `eslint@8.57.1` is installed, so it fails with
  `ERR_PACKAGE_PATH_NOT_EXPORTED`. Worth fixing separately.
- Not verified in a running browser — the backend migration had not been run at
  the time of writing (see below), so no document carried a non-null
  `specifications` value to render yet.

## Before this shows up in the UI

The backend migration must be run:

```bash
cd forsa && php artisan migrate
```

It adds the `specifications` column to `quotation_items`, `grn_items`,
`delivery_order_items`, and `customer_invoice_items`, and backfills existing
rows from their upstream document — so historical quotations and invoices get
the text too, not just newly created ones.

Until it runs, the API omits the field, every guard evaluates falsy, and all
these pages render exactly as they did before.
