import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const authorName = String(body.authorName ?? "").trim().slice(0, 60);
  const bodyText = String(body.body ?? "").trim().slice(0, 2000);
  const title = body.title ? String(body.title).trim().slice(0, 120) : null;
  const rating = Math.round(Number(body.rating));

  if (!authorName || !bodyText) {
    return NextResponse.json(
      { error: "Please add your name and a review." },
      { status: 400 },
    );
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Please choose a rating from 1 to 5 stars." },
      { status: 400 },
    );
  }

  // Mark as a verified buyer if the review links to a delivered order that
  // actually contains this product (link comes from the "leave a review" email).
  let verified = false;
  const orderNumber = body.orderNumber ? String(body.orderNumber).trim() : "";
  if (orderNumber) {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber.toUpperCase(),
        status: "DELIVERED",
        items: { some: { productId: params.id } },
      },
      select: { id: true },
    });
    if (order) verified = true;
  }

  const images = Array.isArray(body.images)
    ? body.images
        .filter((x: unknown) => typeof x === "string" && x.startsWith("/uploads/"))
        .slice(0, 5)
    : [];

  const review = await prisma.review.create({
    data: {
      productId: params.id,
      authorName,
      body: bodyText,
      title,
      rating,
      verified,
      images: JSON.stringify(images),
    },
  });

  return NextResponse.json({ ok: true, id: review.id }, { status: 201 });
}
