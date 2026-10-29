import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/products";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v).trim()).filter(Boolean);
}

function toStringMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (v) out[k] = String(v);
  }
  return out;
}

const DEAL_MS = 24 * 60 * 60 * 1000;

function parseCompareAt(raw: unknown): number | null {
  return raw != null && raw !== "" ? Math.round(Number(raw)) : null;
}

function parseStock(raw: unknown): number | null {
  return raw != null && raw !== "" ? Math.max(0, Math.round(Number(raw))) : null;
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();
  const category = (body.category ?? "").trim();
  const priceCents = Math.round(Number(body.priceCents));

  if (!title || !category || !Number.isFinite(priceCents) || priceCents < 0) {
    return NextResponse.json(
      { error: "Title, category, and a valid price are required." },
      { status: 400 },
    );
  }

  const images = toStringArray(body.images);
  const compareAtCents = parseCompareAt(body.compareAtCents);
  const isDeal = compareAtCents != null && compareAtCents > priceCents;

  const product = await prisma.product.create({
    data: {
      title,
      description,
      category,
      priceCents,
      compareAtCents,
      dealExpiresAt: isDeal ? new Date(Date.now() + DEAL_MS) : null,
      stock: parseStock(body.stock),
      currency: body.currency || "usd",
      image: images[0] ?? null,
      images: JSON.stringify(images),
      colors: JSON.stringify(toStringArray(body.colors)),
      colorImages: JSON.stringify(toStringMap(body.colorImages)),
      sizes: JSON.stringify(toStringArray(body.sizes)),
      ratingAvg:
        body.ratingAvg != null && body.ratingAvg !== ""
          ? Number(body.ratingAvg)
          : null,
      reviewsCount: Math.max(0, Math.round(Number(body.reviewsCount) || 0)),
      soldCount: Math.max(0, Math.round(Number(body.soldCount) || 0)),
      shipDaysMin: Math.max(0, Math.round(Number(body.shipDaysMin) || 7)),
      shipDaysMax: Math.max(0, Math.round(Number(body.shipDaysMax) || 14)),
      supplierUrl: body.supplierUrl || null,
      active: body.active ?? true,
      slug: await uniqueSlug(title),
    },
  });

  return NextResponse.json(product, { status: 201 });
}
