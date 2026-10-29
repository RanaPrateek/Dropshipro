import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import OrderStatusForm from "@/components/admin/OrderStatusForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order — Nuvo" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) notFound();

  const address = [
    order.shippingName,
    order.shippingLine1,
    order.shippingLine2,
    [order.shippingCity, order.shippingState, order.shippingZip].filter(Boolean).join(", "),
    order.shippingCountry,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/admin/orders" className="text-sm text-slate-500 hover:text-brand-600">
        ← Back to orders
      </Link>
      <h1 className="mt-4 font-mono text-2xl font-bold">{order.orderNumber}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Placed {order.createdAt.toLocaleString()}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <h2 className="font-semibold">Items</h2>
            <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between py-2 text-sm">
                  <span>
                    {i.title}
                    {(i.color || i.size) && (
                      <span className="text-slate-400">
                        {" "}
                        ({[i.color, i.size].filter(Boolean).join(", ")})
                      </span>
                    )}{" "}
                    × {i.quantity}
                  </span>
                  <span>{formatPrice(i.priceCents * i.quantity, order.currency)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold dark:border-slate-700">
              <span>Total</span>
              <span>{formatPrice(order.totalCents, order.currency)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <h2 className="font-semibold">Customer &amp; shipping</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{order.email}</p>
            <address className="mt-2 not-italic text-sm text-slate-600 dark:text-slate-300">
              {address.length > 0 ? address.map((l, n) => <div key={n}>{l}</div>) : <span className="text-slate-400">No address provided</span>}
            </address>
          </div>
        </div>

        <OrderStatusForm
          orderId={order.id}
          initialStatus={order.status}
          initialTracking={order.trackingNumber ?? ""}
          initialCarrier={order.carrier ?? ""}
        />
      </div>
    </div>
  );
}
