import Link from "next/link";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/orders";

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

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Track and review everything you&apos;ve ordered.
      </p>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/products" className="font-medium text-brand-600 hover:underline">
            Start shopping
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
            >
              <div>
                <span className="font-mono font-semibold">{o.orderNumber}</span>
                <div className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {o.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  · {o.items.length} item(s) · {formatPrice(o.totalCents, o.currency)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {STATUS_LABELS[o.status] ?? o.status}
                </span>
                <Link
                  href={`/track?order=${o.orderNumber}`}
                  className="text-sm font-medium text-brand-600 hover:underline"
                >
                  Track
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
