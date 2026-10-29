import Link from "next/link";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/orders";
import { SignedOutPrompt, SignOutButton } from "@/components/account/AccountControls";

export const dynamic = "force-dynamic";
export const metadata = { title: "My account — Nuvo" };

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return <SignedOutPrompt />;

  const orders = await prisma.order.findMany({
    where: { email: customer.email },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My account</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {customer.name ? `${customer.name} · ` : ""}
            {customer.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/favorites" className="text-sm font-medium text-brand-600 hover:underline">
            Favorites
          </Link>
          <SignOutButton />
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">Order history</h2>
      {orders.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/products" className="font-medium text-brand-600 hover:underline">
            Start shopping
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {orders.map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
            >
              <div>
                <span className="font-mono font-semibold">{o.orderNumber}</span>
                <div className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {o.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{" "}
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
