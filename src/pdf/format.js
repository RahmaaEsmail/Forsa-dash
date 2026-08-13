import { format as formatDate, differenceInCalendarDays } from "date-fns";

/** 1234.5 -> "1,234.50". Null-safe: anything unparseable renders as a dash. */
export function money(value, { dash = "—" } = {}) {
  const n = Number(value);
  if (value === null || value === undefined || value === "" || Number.isNaN(n))
    return dash;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Quantities keep up to 3 decimals but drop trailing zeros: 12.500 -> "12.5". */
export function quantity(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return String(value ?? "");
  return n.toLocaleString("en-US", { maximumFractionDigits: 3 });
}

export function date(value, pattern = "dd MMM yyyy") {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : formatDate(d, pattern);
}

/** Days between two dates, or null if either is missing/invalid. */
export function daysBetween(from, to) {
  if (!from || !to) return null;
  const a = new Date(from);
  const b = new Date(to);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
  const days = differenceInCalendarDays(b, a);
  return days >= 0 ? days : null;
}

const ONES = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty",
  "Ninety",
];
const SCALES = [
  [1e9, "Billion"],
  [1e6, "Million"],
  [1e3, "Thousand"],
];

function chunkToWords(n) {
  if (n < 20) return ONES[n];
  if (n < 100) {
    const rest = n % 10;
    return TENS[Math.floor(n / 10)] + (rest ? `-${ONES[rest]}` : "");
  }
  const rest = n % 100;
  return `${ONES[Math.floor(n / 100)]} Hundred${rest ? ` ${chunkToWords(rest)}` : ""}`;
}

function integerToWords(n) {
  if (n === 0) return ONES[0];
  const parts = [];
  let left = n;
  for (const [value, name] of SCALES) {
    if (left >= value) {
      parts.push(`${integerToWords(Math.floor(left / value))} ${name}`);
      left %= value;
    }
  }
  if (left > 0) parts.push(chunkToWords(left));
  return parts.join(" ");
}

/**
 * "SAR One Thousand Two Hundred and 50/100 Only" — Gulf invoices are routinely
 * expected to spell the payable amount out, and it is a cheap guard against a
 * tampered figure.
 */
export function amountToWords(value, currencyCode = "") {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const whole = Math.floor(Math.abs(n));
  const cents = Math.round((Math.abs(n) - whole) * 100);
  const sign = n < 0 ? "Minus " : "";
  const head = [currencyCode, integerToWords(whole)].filter(Boolean).join(" ");
  const tail = cents > 0 ? ` and ${String(cents).padStart(2, "0")}/100` : "";
  return `${sign}${head}${tail} Only`;
}
