/**
 * Worst-case-empty fixture: no items, no settings row, no customer contact
 * details, no terms, no notes. Nothing here should crash the renderer or leave
 * a dangling label — every optional block must simply disappear.
 */
export default {
  quotation: {
    id: 1,
    quotation_number: "QUO-2026-0001-01",
    quotation_date: "2026-08-11",
    customer: { id: 1, company_name: null, name: null },
    items: [],
    subtotal: null,
    tax_amount: null,
    total_amount: null,
    status: "draft",
  },
  settings: null,
};
