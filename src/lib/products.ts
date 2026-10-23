import { prisma } from "./prisma";
import { slugify } from "./format";

/** The product shape the storefront and cart use (safe to pass to the client). */
export type StoreProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  category: string;
  image: string | null;
  images: string[];
  colors: string[];
  sizes: string[];
  ratingAvg: number | null;
  reviewsCount: number;
  soldCount: number;
  shipDaysMin: number;
  shipDaysMax: number;
};

/** The categories this store sells. */
export const CATEGORIES = ["Clothing", "Electronics"] as const;

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

type RawProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  category: string;
  image: string | null;
  images: string;
  colors: string;
  sizes: string;
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
    currency: p.currency,
    category: p.category,
    image: p.image ?? images[0] ?? null,
    images: images.length > 0 ? images : p.image ? [p.image] : [],
    colors: parseList(p.colors),
    sizes: parseList(p.sizes),
    ratingAvg: p.ratingAvg,
    reviewsCount: p.reviewsCount,
    soldCount: p.soldCount,
    shipDaysMin: p.shipDaysMin,
    shipDaysMax: p.shipDaysMax,
  };
}

export async function getProducts(category?: string): Promise<StoreProduct[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, ...(category ? { category } : {}) },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toStoreProduct);
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
