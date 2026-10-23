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
};

const selectFields = {
  id: true,
  slug: true,
  title: true,
  description: true,
  priceCents: true,
  currency: true,
  category: true,
  image: true,
} as const;

/** The categories this store sells. */
export const CATEGORIES = ["Clothing", "Electronics"] as const;

export async function getProducts(category?: string): Promise<StoreProduct[]> {
  return prisma.product.findMany({
    where: {
      active: true,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: selectFields,
  });
}

export async function getProductBySlug(
  slug: string,
): Promise<StoreProduct | null> {
  return prisma.product.findFirst({
    where: { slug, active: true },
    select: selectFields,
  });
}

export async function getProductsByIds(ids: string[]): Promise<StoreProduct[]> {
  if (ids.length === 0) return [];
  return prisma.product.findMany({
    where: { id: { in: ids }, active: true },
    select: selectFields,
  });
}

/** Generate a slug from a title that doesn't collide with existing products. */
export async function uniqueSlug(
  title: string,
  ignoreId?: string,
): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let n = 2;
  // Loop until we find a slug not used by another product.
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
