import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/products";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v).trim()).filter(Boolean);
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

  const product = await prisma.product.create({
    data: {
      title,
      description,
      category,
      priceCents,
      currency: body.currency || "usd",
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
      supplierUrl: body.supplierUrl || null,
      active: body.active ?? true,
      slug: await uniqueSlug(title),
    },
  });

  return NextResponse.json(product, { status: 201 });
}
