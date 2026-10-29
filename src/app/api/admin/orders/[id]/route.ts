import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES } from "@/lib/orders";
import { sendEmail, deliveredReviewEmail } from "@/lib/email";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const status =
    typeof body.status === "string" && ORDER_STATUSES.includes(body.status)
      ? body.status
      : existing.status;

  const data: Record<string, unknown> = {
    status,
    trackingNumber:
      body.trackingNumber !== undefined
        ? String(body.trackingNumber).trim() || null
        : existing.trackingNumber,
    carrier:
      body.carrier !== undefined
        ? String(body.carrier).trim() || null
        : existing.carrier,
  };

  // Stamp timestamps on transitions.
  if (status === "SHIPPED" && !existing.shippedAt) data.shippedAt = new Date();
  if (status === "DELIVERED" && !existing.deliveredAt)
    data.deliveredAt = new Date();

  // When newly delivered, send the "leave a review" email once.
  const newlyDelivered =
    status === "DELIVERED" &&
    existing.status !== "DELIVERED" &&
    !existing.reviewRequestSent;
  if (newlyDelivered) data.reviewRequestSent = true;

  const order = await prisma.order.update({
    where: { id: params.id },
    data,
    include: { items: true },
  });

  if (newlyDelivered) {
    const mail = deliveredReviewEmail({
      orderNumber: order.orderNumber,
      items: order.items.map((i) => ({ title: i.title, slug: i.slug })),
    });
    await sendEmail({ to: order.email, subject: mail.subject, html: mail.html });
  }

  return NextResponse.json({ ok: true, status: order.status });
}
