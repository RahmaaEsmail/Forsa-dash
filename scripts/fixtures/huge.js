/**
 * Stress fixture: 42 line items with long bilingual descriptions plus a very
 * long, multi-section terms and conditions block. This is the case the old
 * fixed "12 items per page" pagination could not survive — the table, the
 * totals and the terms all have to flow across pages on their own.
 */
const VAT = 0.15;

const catalogue = [
  ["Steel Rebar B500B — 16mm x 12m, mill certified to BS 4449:2005", "حديد تسليح مضلع 16 مم بشهادة مصنع", "Ton", 2650],
  ["Steel Rebar B500B — 20mm x 12m, mill certified to BS 4449:2005", "حديد تسليح مضلع 20 مم بشهادة مصنع", "Ton", 2685],
  ["Portland Cement OPC 42.5N, 50kg bag, SASO certified", "أسمنت بورتلاندي مقاوم 42.5 كجم", "Bag", 18.5],
  ["Sulphate Resisting Cement SRC, 50kg bag", "أسمنت مقاوم للكبريتات", "Bag", 21.75],
  ["Ready-Mix Concrete C35/45, pumped, incl. transport within 25km", "خرسانة جاهزة مضخوخة", "m³", 285],
  ["Ready-Mix Concrete C25/30, standard slump", "خرسانة جاهزة عادية", "m³", 248],
  ["Washed Sand, Zone II, per truckload", "رمل مغسول", "m³", 42],
  ["Aggregate 3/4 inch crushed limestone", "بحص مكسر", "m³", 58],
  ["Scaffolding Frame 1.7m x 1.2m, hot-dip galvanised", "إطار سقالة مجلفن", "Pcs", 96.75],
  ["Scaffolding Cross Brace 1.9m, powder coated", "دعامة سقالة", "Pcs", 34.5],
  ["Adjustable Base Jack 600mm, forged nut", "جك قاعدة قابل للتعديل", "Pcs", 41],
  ["Plywood Formwork Panel 18mm, film faced, 1220 x 2440", "لوح خشب أبلكاش للقوالب", "Sheet", 132],
  ["Timber Batten 50 x 100mm x 3m, kiln dried", "خشب بطن", "Pcs", 28.4],
  ["Safety Helmet, ANSI Z89.1 Type I Class E, ratchet suspension", "خوذة أمان", "Pcs", 34],
  ["High-Visibility Vest, Class 2, reflective tape", "سترة عاكسة", "Pcs", 19.5],
  ["Safety Boots, steel toe cap S3, sizes 39-46", "حذاء أمان بمقدمة حديدية", "Pair", 148],
  ["Cut-Resistant Gloves Level 5, nitrile coated", "قفازات مقاومة للقطع", "Pair", 12.75],
  ["Full Body Harness, double lanyard, EN 361", "حزام أمان كامل", "Pcs", 265],
  ["Electrical Cable NYY 4 x 25mm², 100m drum", "كابل كهربائي", "Drum", 1875],
  ["Electrical Cable NYY 3 x 6mm², 100m drum", "كابل كهربائي", "Drum", 615],
  ["MCB Distribution Board, 24-way, IP54 enclosure", "لوحة توزيع كهربائية", "Pcs", 720],
  ["LED High Bay Luminaire 150W, 5000K, IP65", "كشاف ليد صناعي", "Pcs", 312],
  ["LED Flood Light 200W, 5700K, die-cast aluminium", "كشاف ليد خارجي", "Pcs", 268],
  ["PVC Conduit 25mm heavy duty, 3m length", "مواسير كهرباء بي في سي", "Pcs", 8.9],
  ["HDPE Pipe PN16 DN110, per 6m length", "ماسورة بولي إيثيلين", "Pcs", 214],
  ["Gate Valve DN100 PN16, ductile iron body", "محبس بوابة", "Pcs", 480],
  ["Butterfly Valve DN150 PN16, lever operated", "محبس فراشة", "Pcs", 655],
  ["Pressure Gauge 0-16 bar, 100mm dial, glycerine filled", "مقياس ضغط", "Pcs", 96],
  ["Submersible Pump 5.5kW, 3-phase, cast iron", "مضخة غاطسة", "Pcs", 4280],
  ["Water Tank GRP 5000L, sectional, food grade", "خزان مياه فايبر جلاس", "Pcs", 3150],
  ["Ceramic Floor Tile 60 x 60cm, rectified, PEI IV", "بلاط سيراميك أرضيات", "m²", 74],
  ["Porcelain Wall Tile 30 x 60cm, matte finish", "بلاط بورسلين حوائط", "m²", 62],
  ["Tile Adhesive C2TE, 25kg bag", "مادة لاصقة للبلاط", "Bag", 31.5],
  ["Waterproofing Membrane, SBS modified bitumen 4mm", "عازل مائي بيتوميني", "Roll", 148],
  ["Thermal Insulation Board XPS 50mm, 1200 x 600", "ألواح عزل حراري", "Pcs", 43.25],
  ["Gypsum Board 12.5mm moisture resistant, 1200 x 2400", "لوح جبس مقاوم للرطوبة", "Sheet", 46],
  ["Metal Stud 70mm, 0.6mm gauge, 3m", "قائم معدني", "Pcs", 22.8],
  ["Emulsion Paint, interior matte, 18L pail", "دهان بلاستيك داخلي", "Pail", 289],
  ["Epoxy Floor Coating, self-levelling, 20kg kit", "دهان إيبوكسي أرضيات", "Kit", 745],
  ["Fire Extinguisher Dry Powder 6kg, with bracket", "طفاية حريق بودرة", "Pcs", 118],
  ["Fire Alarm Addressable Smoke Detector, UL listed", "كاشف دخان معنون", "Pcs", 196],
  ["Emergency Exit Sign, LED, 3h battery backup", "لافتة مخرج طوارئ", "Pcs", 87],
];

const items = catalogue.map(([name, ar, unit, price], i) => {
  const qty = 5 + ((i * 37) % 480);
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
    notes: i % 9 === 3 ? "Lead time 3 weeks — subject to mill allocation." : null,
  };
});

const subtotal = items.reduce((a, i) => a + Number(i.line_total), 0);

const terms = `Validity of Offer:
This quotation is valid for fifteen (15) calendar days from the date of issue. After this period all prices, quantities and lead times are subject to revision without prior notice, and the offer must be re-confirmed in writing by an authorised representative of the seller before any order is placed.

Prices:
All prices are quoted in Saudi Riyal (SAR) and are exclusive of Value Added Tax unless expressly stated otherwise on the face of this document. Prices are based on the quantities and specifications listed above; any change to quantity, specification, delivery location or delivery schedule entitles the seller to re-quote. Prices do not include unloading, offloading equipment, craneage, storage at site, or any civil, mechanical or electrical installation work unless separately itemised.

Payment Terms:
Payment shall be made in accordance with the payment terms shown in the document details section. Where advance payment is required, production, allocation and delivery scheduling will commence only after the advance has been received in cleared funds in one of the bank accounts listed at the foot of this document. Invoices are payable without deduction, set-off or counterclaim. Overdue amounts carry a late-payment charge of 1.5% per month, calculated daily from the due date until payment is received in full.

Delivery:
Delivery periods quoted are estimates given in good faith and are calculated in working days from the date of receipt of a valid purchase order together with any required advance payment and complete technical approvals. The seller shall not be liable for any delay caused by circumstances beyond its reasonable control, including but not limited to shortage of raw materials, mill allocation, port congestion, customs clearance, adverse weather, industrial action or acts of government. Partial deliveries are permitted and each partial delivery may be invoiced separately.

Inspection and Acceptance:
The buyer shall inspect all goods immediately on delivery and note any shortage, damage or discrepancy on the delivery note at the time of receipt. Claims for shortage or visible damage must be submitted in writing within three (3) working days of delivery. Goods not rejected within that period are deemed accepted. Latent defects must be notified in writing within thirty (30) days of discovery.

Returns:
Goods supplied correctly against the buyer's order may not be returned without the seller's prior written authorisation. Where a return is authorised, goods must be unused, in their original packaging and returned at the buyer's cost; a restocking charge of up to 20% of the invoice value may apply. Made-to-order, cut-to-length and specially imported items are non-returnable in all circumstances.

Warranty:
The seller warrants that the goods will conform to the manufacturer's published specification at the time of delivery. The seller's liability under this warranty is limited, at its sole option, to repair, replacement or credit of the affected goods. All other warranties, express or implied, including any implied warranty of merchantability or fitness for a particular purpose, are excluded to the fullest extent permitted by law.

Limitation of Liability:
Under no circumstances shall the seller be liable for indirect, incidental, special or consequential loss or damage of any kind, including loss of profit, loss of production, loss of contract or loss of goodwill, howsoever arising. The seller's aggregate liability arising out of or in connection with any order shall in no event exceed the invoice value of the goods giving rise to the claim.

Title and Risk:
Risk in the goods passes to the buyer on delivery to the agreed delivery point. Title to the goods remains with the seller until payment has been received in full for all sums owing on any account. Until title passes the buyer shall store the goods separately, keep them identifiable as the seller's property and insure them against all normal risks.

Force Majeure:
Neither party shall be liable for failure or delay in performance to the extent that such failure or delay is caused by an event beyond its reasonable control. If a force majeure event continues for more than sixty (60) consecutive days, either party may terminate the affected order by written notice without liability, save for payment for goods already delivered.

Governing Law and Jurisdiction:
This quotation and any contract arising from it are governed by the laws of the Kingdom of Saudi Arabia. The parties submit to the exclusive jurisdiction of the competent courts of Riyadh. The Arabic text of any translated version shall prevail in the event of a conflict of interpretation.

Confidentiality:
The commercial terms set out in this quotation are confidential and are provided solely for the buyer's evaluation. They may not be disclosed to any third party without the seller's prior written consent.`;

export default {
  quotation: {
    id: 91,
    quotation_number: "QUO-2026-0091-01",
    quotation_date: "2026-08-11",
    valid_until: "2026-08-26",
    payment_days: 45,
    delivery_days: 21,
    payment_terms: "30% advance with purchase order, 70% net 45 days from invoice date",
    delivery_terms: "DDP — Al Khobar Commercial Complex, phased over 6 weeks",
    customer_po_number: "ABC/PO/2026/00412",
    notes:
      "Delivery is phased in six weekly consignments as agreed with the site team. Please route all dispatch notifications to the project engineer and copy the procurement mailbox. Site access is restricted to 06:00-14:00 on weekdays.",
    currency: { code: "SAR", name: "Saudi Riyal", symbol: "SR" },
    customer: {
      id: 7,
      name: "Ahmed Al-Sayed",
      company_name:
        "ABC Construction & General Contracting Co. | شركة ايه بي سي للمقاولات العامة",
      email: "procurement@abc-construction.sa",
      phone: "+966 13 887 2200",
      tax_number: "310987654300003",
      address: {
        line_1: "King Abdullah Road, Al Aqrabiyah District, Building 4412",
        city: "Al Khobar 34445",
        country: "Saudi Arabia",
      },
    },
    purchase_request: { id: 55, pr_number: "PR-2026-0055", status: "approved" },
    subtotal: subtotal.toFixed(2),
    tax_amount: (subtotal * VAT).toFixed(2),
    total_amount: (subtotal * (1 + VAT)).toFixed(2),
    status: "client_approval",
    items,
  },
  settings: {
    data: [
      { key: "vat_rate", value: "15" },
      { key: "terms_and_conditions", value: terms },
    ],
  },
};
