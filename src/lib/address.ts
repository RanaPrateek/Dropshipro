// Shared helpers for customer addresses (used by the address-book API).

export type AddressInput = {
  label?: string | null;
  fullName: string;
  phone?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  zip: string;
  country: string;
  isDefault?: boolean;
};

/**
 * Validate and normalize raw address input from the client.
 * Returns the cleaned data, or an error message for the first missing field.
 */
export function parseAddress(
  body: unknown,
): { data?: AddressInput; error?: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => String(v ?? "").trim();

  const fullName = str(b.fullName);
  const line1 = str(b.line1);
  const city = str(b.city);
  const zip = str(b.zip);
  const country = str(b.country);

  if (!fullName) return { error: "Full name is required." };
  if (!line1) return { error: "Street address is required." };
  if (!city) return { error: "City is required." };
  if (!zip) return { error: "Postcode / ZIP is required." };
  if (!country) return { error: "Country is required." };

  return {
    data: {
      label: str(b.label) || null,
      fullName,
      phone: str(b.phone) || null,
      line1,
      line2: str(b.line2) || null,
      city,
      state: str(b.state) || null,
      zip,
      country,
      isDefault: Boolean(b.isDefault),
    },
  };
}
