import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/products";

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

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      title,
      description: (body.description ?? existing.description).trim(),
      category: (body.category ?? existing.category).trim(),
      priceCents: Number.isFinite(priceCents) ? priceCents : existing.priceCents,
      image: body.image ?? existing.image,
      supplierUrl: body.supplierUrl ?? existing.supplierUrl,
      active: body.active ?? existing.active,
      // Refresh the slug only if the title changed.
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
    // If the product is referenced by existing orders, archive it instead of
    // hard-deleting so order history stays intact.
    await prisma.product.update({
      where: { id: params.id },
      data: { active: false },
    });
    return NextResponse.json({ ok: true, archived: true });
  }
}
