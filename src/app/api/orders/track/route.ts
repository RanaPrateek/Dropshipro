import { NextResponse } from "next/server";
import { getOrderForTracking, STATUS_LABELS } from "@/lib/orders";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const orderNumber = String(body?.orderNumber ?? "").trim();
  const email = String(body?.email ?? "").trim();

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Enter your order number and email." },
      { status: 400 },
    );
  }

  const order = await getOrderForTracking(orderNumber, email);
  if (!order) {
    return NextResponse.json(
      { error: "No order found with that number and email." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    statusLabel: STATUS_LABELS[order.status] ?? order.status,
    trackingNumber: order.trackingNumber,
    carrier: order.carrier,
    shippedAt: order.shippedAt,
    deliveredAt: order.deliveredAt,
    totalCents: order.totalCents,
    createdAt: order.createdAt,
    items: order.items.map((i) => ({
      title: i.title,
      quantity: i.quantity,
      priceCents: i.priceCents,
      image: i.image,
      color: i.color,
      size: i.size,
    })),
  });
}
