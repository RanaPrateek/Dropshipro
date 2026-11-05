"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { ORDER_TABS, STATUS_LABELS, orderTab, type OrderTabKey } from "@/lib/orders";

export type OrderCard = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  totalCents: number;
  currency: string;
  items: {
    id: string;
    title: string;
    image: string | null;
    color: string | null;
    size: string | null;
    quantity: number;
    priceCents: number;
  }[];
};

export default function OrdersView({ orders }: { orders: OrderCard[] }) {
  const counts = ORDER_TABS.reduce<Record<string, number>>((acc, t) => {
    acc[t.key] = orders.filter((o) => orderTab(o.status) === t.key).length;
    return acc;
  }, {});

  // Open on the first tab that has orders (fall back to the first tab).
  const [tab, setTab] = useState<OrderTabKey>(
    () => ORDER_TABS.find((t) => counts[t.key] > 0)?.key ?? "to-pay",
  );

  const visible = orders.filter((o) => orderTab(o.status) === tab);

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Track and review everything you&apos;ve ordered.
      </p>

      {/* tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {ORDER_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.key
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  tab === t.key
                    ? "bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-300"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                }`}
              >
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Nothing here yet.{" "}
          <Link href="/products" className="font-medium text-brand-600 hover:underline">
            Start shopping
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {visible.map((o) => (
            <li key={o.id} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              {/* header row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <span className="font-mono font-semibold">{o.orderNumber}</span>
                  <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(o.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {STATUS_LABELS[o.status] ?? o.status}
                </span>
              </div>

              {/* items */}
              <ul className="mt-3 space-y-3">
                {o.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      {it.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image} alt={it.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{it.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {[it.color, it.size].filter(Boolean).join(" · ")}
                        {(it.color || it.size) ? " · " : ""}Qty {it.quantity}
                      </div>
                    </div>
                    <div className="shrink-0 text-sm">
                      {formatPrice(it.priceCents * it.quantity, o.currency)}
                    </div>
                  </li>
                ))}
              </ul>

              {/* footer row */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Total </span>
                  <span className="font-semibold">{formatPrice(o.totalCents, o.currency)}</span>
                </span>
                <Link
                  href={`/track?order=${o.orderNumber}`}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Track order
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
