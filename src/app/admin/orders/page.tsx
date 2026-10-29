import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/orders";
import { LogoutButton } from "@/components/admin/AdminActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders — Nuvo" };

function statusTone(status: string): string {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "SHIPPED":
      return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
    case "PENDING":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400">
            Products
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            No orders yet. They&apos;ll appear here when customers check out.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono font-medium text-brand-600 hover:underline">
                      {o.orderNumber}
                    </Link>
                    <div className="text-xs text-slate-400">{o.items.length} item(s)</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {o.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{o.email}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {formatPrice(o.totalCents, o.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone(o.status)}`}>
                      {STATUS_LABELS[o.status] ?? o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
