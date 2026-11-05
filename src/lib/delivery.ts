// Delivery options. Fees are in USD minor units (the base currency), so they
// convert for display the same way product prices do.

export const DELIVERY_OPTIONS = [
  {
    id: "standard",
    label: "Standard delivery",
    desc: "7–14 business days",
    cents: 0,
  },
  {
    id: "express",
    label: "Express delivery",
    desc: "2–4 business days",
    cents: 999,
  },
  {
    id: "pickup",
    label: "Collect from a pickup point",
    desc: "Ready to collect in 5–9 days",
    cents: 0,
  },
] as const;

export type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];

/** Authoritative shipping fee for a delivery method (defaults to standard/0). */
export function deliveryFee(id: string | undefined | null): number {
  const opt = DELIVERY_OPTIONS.find((o) => o.id === id);
  return opt ? opt.cents : 0;
}

export function isDeliveryId(id: string | undefined | null): id is DeliveryId {
  return DELIVERY_OPTIONS.some((o) => o.id === id);
}
