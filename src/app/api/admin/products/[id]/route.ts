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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({
    where: { id: params.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const title = (body.title ?? existing.title).trim();
  const priceCentsRaw = Math.round(Number(body.priceCents));
  const priceCents = Number.isFinite(priceCentsRaw)
    ? priceCentsRaw
    : existing.priceCents;
  const images = toStringArray(body.images);

  const compareAtCents =
    body.compareAtCents != null && body.compareAtCents !== ""
      ? Math.round(Number(body.compareAtCents))
      : null;
  const isDeal = compareAtCents != null && compareAtCents > priceCents;

  // Keep the running timer if it was already an active deal; otherwise (new
  // deal, or a previously expired one being re-enabled) start a fresh 24h.
  const existingDealActive =
    existing.compareAtCents != null &&
    existing.compareAtCents > existing.priceCents &&
    existing.dealExpiresAt != null &&
    existing.dealExpiresAt.getTime() > Date.now();
  const dealExpiresAt = isDeal
    ? existingDealActive
      ? existing.dealExpiresAt
      : new Date(Date.now() + DEAL_MS)
    : null;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      title,
      description: (body.description ?? existing.description).trim(),
      category: (body.category ?? existing.category).trim(),
      priceCents,
      compareAtCents,
      dealExpiresAt,
      stock:
        body.stock != null && body.stock !== ""
          ? Math.max(0, Math.round(Number(body.stock)))
          : null,
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
      supplierUrl: body.supplierUrl ?? existing.supplierUrl,
      active: body.active ?? existing.active,
      slug:
        title !== existing.title
          ? await uniqueSlug(title, existing.id)
          : existing.slug,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    await prisma.product.update({
      where: { id: params.id },
      data: { active: false },
    });
    return NextResponse.json({ ok: true, archived: true });
  }
}
