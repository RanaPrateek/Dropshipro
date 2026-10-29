import { prisma } from "./prisma";
import { slugify } from "./format";

/** The product shape the storefront and cart use (safe to pass to the client). */
export type StoreProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  category: string;
  image: string | null;
  images: string[];
  colors: string[];
  colorImages: Record<string, string>;
  sizes: string[];
  stock: number | null;
  dealExpiresAt: string | null;
  ratingAvg: number | null;
  reviewsCount: number;
  soldCount: number;
  shipDaysMin: number;
  shipDaysMax: number;
};

/** The categories this store sells. */
export const CATEGORIES = ["Women", "Men", "Electronics"] as const;

/** Apparel categories use the clothing size guide. */
export function isApparel(category: string): boolean {
  const c = category.toLowerCase();
  return c === "women" || c === "men" || c.includes("cloth");
}

/**
 * A product is "on sale" when it has a higher compare-at price AND its deal
 * timer hasn't expired (deals auto-expire after their 24h countdown).
 */
export function isOnSale(p: {
  priceCents: number;
  compareAtCents: number | null;
  dealExpiresAt?: string | null;
}): boolean {
  if (p.compareAtCents == null || p.compareAtCents <= p.priceCents) return false;
  if (p.dealExpiresAt && new Date(p.dealExpiresAt).getTime() <= Date.now()) {
    return false;
  }
  return true;
}

/** Guess the garment type from the title/category to pick the right size guide. */
export function garmentType(
  title: string,
  category: string,
): "top" | "bottom" | "dress" | "generic" {
  const t = `${title} ${category}`.toLowerCase();
  if (/\b(dress|gown|jumpsuit|romper)\b/.test(t)) return "dress";
  if (
    /\b(pant|pants|jean|jeans|trouser|trousers|short|shorts|skirt|legging|leggings|jogger|joggers|chino|chinos|cargo)\b/.test(
      t,
    )
  )
    return "bottom";
  if (
    /\b(shirt|t-?shirt|tee|top|hoodie|sweater|jumper|jacket|coat|blouse|sweatshirt|cardigan|polo|tank)\b/.test(
      t,
    )
  )
    return "top";
  return "generic";
}

/** A short stock badge based on inventory count (null = not tracked). */
export function stockBadge(
  stock: number | null,
): { text: string; tone: "out" | "low" | "mid" } | null {
  if (stock == null) return null;
  if (stock <= 0) return { text: "Sold out", tone: "out" };
  if (stock === 1) return { text: "Only 1 left", tone: "low" };
  if (stock <= 5) return { text: `Almost sold out · ${stock} left`, tone: "low" };
  if (stock <= 15) return { text: `${stock} left`, tone: "mid" };
  return null;
}

/** Safely parse a JSON-array string column into a string[]. */
function parseList(value: unknown): string[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/** Safely parse a JSON-object string column into a Record<string,string>. */
function parseMap(value: unknown): Record<string, string> {
  if (typeof value !== "string" || !value) return {};
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) out[k] = String(v);
      return out;
    }
    return {};
  } catch {
    return {};
  }
}

type RawProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  category: string;
  image: string | null;
  images: string;
  colors: string;
  colorImages: string;
  sizes: string;
  stock: number | null;
  dealExpiresAt: Date | null;
  ratingAvg: number | null;
  reviewsCount: number;
  soldCount: number;
  shipDaysMin: number;
  shipDaysMax: number;
};

export function toStoreProduct(p: RawProduct): StoreProduct {
  const images = parseList(p.images);
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    currency: p.currency,
    category: p.category,
    image: p.image ?? images[0] ?? null,
    images: images.length > 0 ? images : p.image ? [p.image] : [],
    colors: parseList(p.colors),
    colorImages: parseMap(p.colorImages),
    sizes: parseList(p.sizes),
    stock: p.stock,
    dealExpiresAt: p.dealExpiresAt ? p.dealExpiresAt.toISOString() : null,
    ratingAvg: p.ratingAvg,
    reviewsCount: p.reviewsCount,
    soldCount: p.soldCount,
    shipDaysMin: p.shipDaysMin,
    shipDaysMax: p.shipDaysMax,
  };
}

/** Sort on-sale products first, then by newest. */
function dealsFirst(a: StoreProduct, b: StoreProduct): number {
  const sa = isOnSale(a) ? 1 : 0;
  const sb = isOnSale(b) ? 1 : 0;
  return sb - sa;
}

export async function getProducts(
  category?: string,
  q?: string,
): Promise<StoreProduct[]> {
  const term = q?.trim();
  const rows = await prisma.product.findMany({
    where: {
      active: true,
      ...(category ? { category } : {}),
      ...(term
        ? {
            OR: [
              { title: { contains: term } },
              { description: { contains: term } },
              { category: { contains: term } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  // Discounted products first, then newest.
  return rows.map(toStoreProduct).sort(dealsFirst);
}

/** Products currently on sale (compare-at price set and deal not expired). */
export async function getDeals(limit = 8): Promise<StoreProduct[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, compareAtCents: { not: null } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toStoreProduct).filter(isOnSale).slice(0, limit);
}

/** Non-deal products (for the "More products" section). */
export async function getNonDeals(limit = 8): Promise<StoreProduct[]> {
  const all = await getProducts();
  return all.filter((p) => !isOnSale(p)).slice(0, limit);
}

export async function getProductBySlug(
  slug: string,
): Promise<StoreProduct | null> {
  const row = await prisma.product.findFirst({ where: { slug, active: true } });
  return row ? toStoreProduct(row) : null;
}

export async function getProductsByIds(ids: string[]): Promise<StoreProduct[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.product.findMany({
    where: { id: { in: ids }, active: true },
  });
  return rows.map(toStoreProduct);
}

/** Generate a slug from a title that doesn't collide with existing products. */
export async function uniqueSlug(
  title: string,
  ignoreId?: string,
): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${base}-${n++}`;
  }
}
