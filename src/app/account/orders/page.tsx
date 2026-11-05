import { getCurrentCustomer } from "@/lib/customerAuth";
import { prisma } from "@/lib/prisma";
import OrdersView, { type OrderCard } from "@/components/account/OrdersView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders — Nuvo" };

export default async function OrdersPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null; // layout already guards this

  const orders = await prisma.order.findMany({
    where: { email: customer.email },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const cards: OrderCard[] = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    totalCents: o.totalCents,
    currency: o.currency,
    items: o.items.map((it) => ({
      id: it.id,
      title: it.title,
      image: it.image,
      color: it.color,
      size: it.size,
      quantity: it.quantity,
      priceCents: it.priceCents,
    })),
  }));

  return <OrdersView orders={cards} />;
}
