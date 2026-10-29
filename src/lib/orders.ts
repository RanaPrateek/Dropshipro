import { prisma } from "./prisma";
import { getProductsByIds } from "./products";

export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "ORDERED_WITH_SUPPLIER",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending payment",
  PAID: "Paid",
  ORDERED_WITH_SUPPLIER: "Ordered with supplier",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

/** The customer-facing tracking timeline steps, in order. */
export const TRACKING_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PAID", label: "Order confirmed" },
  { status: "ORDERED_WITH_SUPPLIER", label: "Preparing your order" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];

function randomOrderNumber(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `NUVO-${s}`;
}

async function uniqueOrderNumber(): Promise<string> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const n = randomOrderNumber();
    const existing = await prisma.order.findUnique({
      where: { orderNumber: n },
      select: { id: true },
    });
    if (!existing) return n;
  }
}

export type CreateOrderInput = {
  email: string;
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  items: { productId: string; quantity: number; color?: string; size?: string }[];
};

export async function createOrder(input: CreateOrderInput) {
  const email = input.email.trim().toLowerCase();
  const products = await getProductsByIds(input.items.map((i) => i.productId));

  const lineItems = input.items
    .map((i) => {
      const p = products.find((x) => x.id === i.productId);
      if (!p) return null;
      const quantity = Math.max(1, Math.floor(i.quantity));
      return {
        productId: p.id,
        title: p.title,
        slug: p.slug,
        image: p.image,
        color: i.color ?? null,
        size: i.size ?? null,
        quantity,
        priceCents: p.priceCents,
      };
    })
    .filter(Boolean) as {
    productId: string;
    title: string;
    slug: string;
    image: string | null;
    color: string | null;
    size: string | null;
    quantity: number;
    priceCents: number;
  }[];

  if (lineItems.length === 0) throw new Error("No valid items in order");

  const totalCents = lineItems.reduce(
    (sum, i) => sum + i.priceCents * i.quantity,
    0,
  );

  // Link to a customer record (upsert by email).
  const customer = await prisma.customer.upsert({
    where: { email },
    update: input.name ? { name: input.name } : {},
    create: { email, name: input.name ?? null },
  });

  return prisma.order.create({
    data: {
      orderNumber: await uniqueOrderNumber(),
      email,
      customerId: customer.id,
      status: "PENDING",
      totalCents,
      shippingName: input.name ?? null,
      shippingLine1: input.line1 ?? null,
      shippingLine2: input.line2 ?? null,
      shippingCity: input.city ?? null,
      shippingState: input.state ?? null,
      shippingZip: input.zip ?? null,
      shippingCountry: input.country ?? null,
      items: { create: lineItems },
    },
    include: { items: true },
  });
}

export async function getOrderForTracking(orderNumber: string, email: string) {
  return prisma.order.findFirst({
    where: {
      orderNumber: orderNumber.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
    },
    include: { items: true },
  });
}
