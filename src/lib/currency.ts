// All product prices are stored in USD cents (the base currency).
// For non-US / European visitors we display GBP, converted at a fixed rate.

export type CurrencyCode = "USD" | "GBP";

export const CURRENCIES: Record<
  CurrencyCode,
  { code: CurrencyCode; symbol: string; rate: number; locale: string }
> = {
  USD: { code: "USD", symbol: "$", rate: 1, locale: "en-US" },
  // ~0.79 GBP per 1 USD. Adjust here (or swap for live rates later).
  GBP: { code: "GBP", symbol: "£", rate: 0.79, locale: "en-GB" },
};

/** Format USD cents into the given display currency. */
export function formatMoney(usdCents: number, code: CurrencyCode): string {
  const c = CURRENCIES[code];
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: c.code,
  }).format((usdCents * c.rate) / 100);
}

/** European countries that should default to GBP display. */
export const GBP_COUNTRIES = new Set([
  "GB", "IE", "FR", "DE", "ES", "IT", "NL", "BE", "PT", "AT", "SE", "DK",
  "FI", "NO", "PL", "CZ", "GR", "HU", "RO", "CH", "LU",
]);
