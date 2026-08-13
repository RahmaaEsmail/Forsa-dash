/**
 * Exercises the bank-slot switches in Settings > Bank Accounts.
 *
 * Set BANKS=two|one|none (default "one") when running preview-pdf.mjs to pick a
 * scenario, e.g.  BANKS=none node scripts/preview-pdf.mjs --fixture=banks
 */
import base from "./default.js";

const scenario = process.env.BANKS || "one";

const bankOne = [
  { key: "bank_one_name", value: "Saudi National Bank | البنك الأهلي السعودي" },
  {
    key: "bank_one_account_holder",
    value: "Company B.R.K.Z. Alalamiyyah for Information Technology",
  },
  { key: "bank_one_iban", value: "SA6610000020000000249108" },
];

const bankTwo = [
  { key: "bank_two_name", value: "Alrajhi Bank | مصرف الراجحي" },
  { key: "bank_two_account_holder", value: "BRKZ IT CO" },
  { key: "bank_two_iban", value: "SA8380000611608010256585" },
];

const switches = {
  two: [
    { key: "bank_one_enabled", value: "true" },
    { key: "bank_two_enabled", value: "true" },
  ],
  one: [
    { key: "bank_one_enabled", value: "true" },
    { key: "bank_two_enabled", value: "false" },
  ],
  none: [
    { key: "bank_one_enabled", value: "false" },
    { key: "bank_two_enabled", value: "false" },
  ],
};

export default {
  quotation: base.quotation,
  settings: {
    data: [
      { key: "vat_rate", value: "15" },
      { key: "company_name", value: "Forsa B2B" },
      { key: "company_address", value: "King Fahd Road, Riyadh 12211" },
      { key: "company_phone", value: "+966 55 598 0730" },
      { key: "company_email", value: "sales@forsa.com" },
      { key: "company_tax_number", value: "300123456700003" },
      { key: "company_commercial_register", value: "1010999888" },
      ...bankOne,
      ...bankTwo,
      ...switches[scenario],
    ],
  },
};
