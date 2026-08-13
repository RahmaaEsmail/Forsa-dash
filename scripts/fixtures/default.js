/** A typical quotation: a handful of items, standard terms. */
const VAT = 0.15;

const rawItems = [
  ["Steel Rebar B500B — 16mm x 12m", "حديد تسليح 16 مم", 240, "Ton", 2650],
  ["Portland Cement OPC 42.5N, 50kg bag", "أسمنت بورتلاندي", 1800, "Bag", 18.5],
  ["Ready-Mix Concrete C35/45", "خرسانة جاهزة", 320, "m³", 285],
  ["Scaffolding Frame 1.7m Galvanised", "سقالات مجلفنة", 150, "Pcs", 96.75],
  ["Safety Helmet, ANSI Z89.1 Type I", "خوذة أمان", 200, "Pcs", 34],
];

const items = rawItems.map(([name, ar, qty, unit, price], i) => {
  const subtotal = qty * price;
  return {
    id: i + 1,
    item_name: name,
    item: { id: i + 1, name: ar },
    quantity: String(qty),
    unit: { id: i + 1, name: unit },
    selling_price: price.toFixed(2),
    tax_rate: "15.00",
    tax_amount: (subtotal * VAT).toFixed(2),
    line_total: subtotal.toFixed(2),
    notes: null,
  };
});

const subtotal = items.reduce((a, i) => a + Number(i.line_total), 0);

export default {
  quotation: {
    id: 46,
    quotation_number: "QUO-2026-0046-03",
    quotation_date: "2026-08-11",
    valid_until: "2026-08-26",
    payment_days: 30,
    delivery_days: 5,
    payment_terms: "50% advance on order, 50% against delivery",
    delivery_terms: "DDP — site delivery, Al Khobar",
    customer_po_number: "PO-88213",
    notes: "Kindly confirm the delivery window before dispatch.",
    currency: { code: "SAR", name: "Saudi Riyal", symbol: "SR" },
    customer: {
      id: 7,
      name: "Ahmed Al-Sayed",
      company_name: "ABC Construction Co.",
      email: "procurement@abc-construction.sa",
      phone: "+966 13 887 2200",
      tax_number: "310987654300003",
      address: {
        line_1: "King Abdullah Road, Al Aqrabiyah",
        city: "Al Khobar",
        country: "Saudi Arabia",
      },
    },
    purchase_request: { id: 12, pr_number: "PR-2026-0012", status: "approved" },
    subtotal: subtotal.toFixed(2),
    tax_amount: (subtotal * VAT).toFixed(2),
    total_amount: (subtotal * (1 + VAT)).toFixed(2),
    status: "client_approval",
    items,
  },
  settings: { data: [{ key: "vat_rate", value: "15" }] },
};
