export function formatPrice(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

/** Turn a product title into a URL-safe slug. */
export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "product"
  );
}

/** Tailwind gradient used as an image placeholder, chosen by category. */
export function categoryGradient(category: string): string {
  const key = category.toLowerCase();
  if (key === "women" || key.includes("cloth")) return "from-rose-400 to-pink-600";
  if (key === "men") return "from-blue-400 to-indigo-600";
  if (key === "electronics" || key.includes("electro"))
    return "from-sky-500 to-indigo-600";
  return "from-slate-400 to-slate-600";
}

/** Map a common color name to a CSS color for a swatch. Returns null if unknown. */
export function colorToCss(name: string): string | null {
  const map: Record<string, string> = {
    black: "#111827",
    white: "#ffffff",
    gray: "#9ca3af",
    grey: "#9ca3af",
    silver: "#c0c0c0",
    red: "#ef4444",
    maroon: "#7f1d1d",
    orange: "#f97316",
    yellow: "#facc15",
    gold: "#d4af37",
    green: "#22c55e",
    olive: "#4d7c0f",
    teal: "#14b8a6",
    blue: "#3b82f6",
    navy: "#1e3a8a",
    purple: "#a855f7",
    pink: "#ec4899",
    brown: "#92400e",
    beige: "#e3dac9",
    cream: "#fffdd0",
    khaki: "#c3b091",
  };
  return map[name.trim().toLowerCase()] ?? null;
}

/** Percentage off, given a sale price and original (compare-at) price. */
export function discountPercent(priceCents: number, compareAtCents: number): number {
  if (compareAtCents <= priceCents) return 0;
  return Math.round(((compareAtCents - priceCents) / compareAtCents) * 100);
}

/** Format an estimated delivery window from today + a day range. */
export function deliveryWindow(minDays: number, maxDays: number): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const start = new Date();
  start.setDate(start.getDate() + minDays);
  const end = new Date();
  end.setDate(end.getDate() + maxDays);
  return `${fmt(start)} – ${fmt(end)}`;
}
