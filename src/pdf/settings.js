const API_ORIGIN = "https://api.forsa.cloud";

/**
 * Reads the flat `[{ key, value }]` settings collection the API returns.
 * The backend stores unset values as the *string* "null", which is why every
 * lookup has to normalise before falling back.
 */
export function settingsReader(settings) {
  const rows = settings?.data ?? settings ?? [];
  return (...keys) => {
    for (const key of keys) {
      const raw = Array.isArray(rows)
        ? rows.find((s) => s.key === key)?.value
        : undefined;
      if (raw && raw !== "null") return raw;
    }
    return null;
  };
}

/** Turns a stored relative upload path into an absolute URL. */
export function fileUrl(value) {
  if (!value || typeof value !== "string") return null;
  if (/^https?:\/\//.test(value)) return value;
  return `${API_ORIGIN}/${value.replace(/^\//, "")}`;
}

/**
 * URL for a file-type setting's image, served through the API rather than
 * straight off /storage.
 *
 * The stored value points at `…/storage/settings/<file>`, which nginx serves
 * from disk with no `Access-Control-Allow-Origin` header. An `<img>` renders
 * that fine, but react-pdf pulls images with XHR while building the document,
 * and a blocked fetch is swallowed with a console warning — the logo shows on
 * the page and then goes missing from the downloaded PDF. `api/*` goes through
 * PHP, where HandleCors adds the header.
 *
 * The filename is appended as a cache-buster: uploads get a fresh random name,
 * so replacing a logo changes this URL and no stale copy survives.
 */
export function settingImageUrl(key, storedValue) {
  if (!storedValue || typeof storedValue !== "string") return null;
  const version = storedValue.split("/").pop();
  return `${API_ORIGIN}/api/v1/settings/image/${key}?v=${encodeURIComponent(version)}`;
}

/**
 * Booleans round-trip through the settings table as text, and the Settings
 * screen writes whatever `String(checked)` produces. Anything unrecognised
 * (including a missing row) falls back to `whenUnset`.
 */
export function readBool(settings, key, whenUnset = false) {
  const raw = settingsReader(settings)(key);
  if (raw === null) return whenUnset;
  const v = String(raw).trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(v)) return true;
  if (["false", "0", "no", "off"].includes(v)) return false;
  return whenUnset;
}

/**
 * The issuing company block shown in the header and footer of every document.
 *
 * Every value comes from the settings table — the canonical keys are the ones
 * SettingSeeder creates (`company_name`, `company_tax_number`,
 * `company_commercial_register`, ...). There are deliberately no hardcoded
 * fallbacks for the legal identifiers: printing an invented VAT or commercial
 * registration number on a customer-facing quotation is worse than printing
 * none, and a blank field is the signal to go and fill Settings in.
 *
 * The extra aliases are tolerated because older code read a mix of key names;
 * the seeded key is always listed first.
 */
export function readCompany(settings) {
  const get = settingsReader(settings);
  return {
    name: get("company_name", "name"),
    address: get("company_address", "address"),
    vat: get("company_tax_number", "vat", "vat_number"),
    crn: get(
      "company_commercial_register",
      "commercial_register",
      "company_crn",
      "crn",
      "company_registration_number",
    ),
    phone: get("company_phone", "phone"),
    email: get("company_email", "email"),
    website: get("company_website", "website"),
  };
}

/**
 * The bank accounts printed in the document footer.
 *
 * Each slot has a `bank_<n>_enabled` switch in Settings, so a business with one
 * bank — or none — can turn the other slot off instead of leaving half-filled
 * fields behind. A slot is also dropped when it carries neither a name nor an
 * IBAN, so an enabled-but-blank slot never prints an empty chip.
 *
 * Everything here comes from Settings, images included. There is deliberately
 * no bundled logo fallback: a slot is just "bank number two", not "Alrajhi", so
 * defaulting its mark would stamp one bank's logo onto whichever account the
 * admin happens to configure there. A slot with no uploaded image renders as a
 * text-only chip, which is correct rather than merely tidy.
 *
 * Upload logos under Settings > Bank Accounts (`bank_one_image` /
 * `bank_two_image`).
 */
export function readBanks(settings) {
  const get = settingsReader(settings);

  const slot = (n) => ({
    enabled: readBool(settings, `bank_${n}_enabled`, true),
    name: get(`bank_${n}_name`),
    holder: get(`bank_${n}_account_holder`),
    iban: get(`bank_${n}_iban`),
    image: settingImageUrl(`bank_${n}_image`, get(`bank_${n}_image`)),
  });

  return [slot("one"), slot("two")].filter(
    (bank) => bank.enabled && (bank.name || bank.iban),
  );
}

/**
 * VAT percentage as a number, e.g. 15. `vat_rate` is the key the backend prices
 * against (RfqService, CustomerInvoiceService); `default_tax_rate` is the older
 * seeded key and is accepted as a fallback.
 */
export function readVatRate(settings) {
  const raw = settingsReader(settings)("vat_rate", "default_tax_rate");
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 15;
}

export function readTerms(settings, ...extraKeys) {
  return settingsReader(settings)(
    ...extraKeys,
    "quotation_terms_and_conditions",
    "terms_and_conditions",
  );
}

export const DEFAULT_TERMS = `Prices are valid until the expiry date shown above and are subject to re-confirmation thereafter.
Prices are quoted exclusive of VAT unless stated otherwise on this document.
Delivery lead times run from receipt of a valid purchase order and, where applicable, the agreed advance payment.
Goods correctly supplied against your order may not be returned without prior written authorisation.
Title to the goods passes only once payment has been received in full.
This offer is governed by the laws of the Kingdom of Saudi Arabia; the courts of Riyadh have exclusive jurisdiction.`;
