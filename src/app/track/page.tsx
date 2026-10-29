"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type TrackResult = {
  orderNumber: string;
  status: string;
  statusLabel: string;
  trackingNumber: string | null;
  carrier: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  totalCents: number;
  createdAt: string;
  items: { title: string; quantity: number }[];
};

const STEPS = [
  { key: "PAID", label: "Order confirmed" },
  { key: "ORDERED_WITH_SUPPLIER", label: "Preparing your order" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];
const FLOW = ["PENDING", "PAID", "ORDERED_WITH_SUPPLIER", "SHIPPED", "DELIVERED"];

function TrackInner() {
  const params = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get("order") ?? "");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error ?? "Could not find order.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900";

  const currentIdx = result ? FLOW.indexOf(result.status) : -1;
  const cancelled =
    result && (result.status === "CANCELLED" || result.status === "REFUNDED");

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold">Track my order</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Enter your order number and email to see its status.
      </p>

      <form onSubmit={lookup} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Order number</label>
          <input
            className={input}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="NUVO-XXXXXXXX"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            className={input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Looking up…" : "Track order"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-8 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-mono font-semibold">{result.orderNumber}</span>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 dark:bg-slate-800 dark:text-brand-200">
              {result.statusLabel}
            </span>
          </div>

          {cancelled ? (
            <p className="mt-4 text-sm text-slate-500">
              This order was {result.status.toLowerCase()}.
            </p>
          ) : (
            <ol className="mt-6 space-y-4">
              {STEPS.map((step) => {
                const stepIdx = FLOW.indexOf(step.key);
                const done = currentIdx >= stepIdx && currentIdx >= 1;
                return (
                  <li key={step.key} className="flex items-center gap-3">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-xs ${
                        done
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-300 text-slate-400 dark:border-slate-600"
                      }`}
                    >
                      {done ? "✓" : ""}
                    </span>
                    <span className={done ? "font-medium" : "text-slate-400"}>
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          {result.trackingNumber && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
              <div className="text-slate-500 dark:text-slate-400">
                Tracking number{result.carrier ? ` (${result.carrier})` : ""}
              </div>
              <div className="mt-0.5 font-mono font-semibold">
                {result.trackingNumber}
              </div>
            </div>
          )}

          <ul className="mt-6 space-y-1 text-sm text-slate-500 dark:text-slate-400">
            {result.items.map((i, n) => (
              <li key={n}>
                {i.title} × {i.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackInner />
    </Suspense>
  );
}
