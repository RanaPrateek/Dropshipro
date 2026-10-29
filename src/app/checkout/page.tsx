"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Price from "@/components/Price";
import { ShieldIcon } from "@/components/Icons";

export default function CheckoutPage() {
  const { items, totalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        setMessage(
          data.message ??
            "Checkout is not fully configured yet. Add your Stripe keys to enable live payments.",
        );
      }
    } catch {
      setMessage("Something went wrong starting checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-8 rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.lineId} className="flex justify-between text-sm">
              <span>
                {item.title}
                {(item.color || item.size) &&
                  ` (${[item.color, item.size].filter(Boolean).join(", ")})`}{" "}
                × {item.quantity}
              </span>
              <Price cents={item.priceCents * item.quantity} />
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold dark:border-slate-700">
          <span>Total</span>
          <Price cents={totalCents} />
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? "Starting secure checkout…" : "Pay with card"}
      </button>

      {message && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          {message}
        </div>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
        <ShieldIcon className="h-4 w-4" />
        Payments are processed securely by Stripe. Card details never touch our
        servers.
      </p>
    </div>
  );
}
