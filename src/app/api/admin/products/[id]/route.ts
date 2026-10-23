import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/products";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v).trim()).filter(Boolean);
}

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
  const priceCents = Math.round(Number(body.priceCents));
  const images = toStringArray(body.images);

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      title,
      description: (body.description ?? existing.description).trim(),
      category: (body.category ?? existing.category).trim(),
      priceCents: Number.isFinite(priceCents) ? priceCents : existing.priceCents,
      image: images[0] ?? null,
      images: JSON.stringify(images),
      colors: JSON.stringify(toStringArray(body.colors)),
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
