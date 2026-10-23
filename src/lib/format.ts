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
  if (key.includes("cloth")) return "from-rose-400 to-pink-600";
  if (key.includes("electro")) return "from-sky-500 to-indigo-600";
  return "from-slate-400 to-slate-600";
}
