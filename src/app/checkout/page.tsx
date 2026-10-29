"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Price from "@/components/Price";
import { ShieldIcon } from "@/components/Icons";

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Ireland", "Germany", "France", "Other"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, clear } = useCart();
  const [form, setForm] = useState({
    email: "",
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            color: i.color,
            size: i.size,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not place order.");
        return;
      }
      if (data.stripeUrl) {
        window.location.href = data.stripeUrl;
        return;
      }
      clear();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch {
      setError("Something went wrong. Please try again.");
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

  const input =
    "mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900";
  const label = "text-sm font-medium";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* shipping details */}
        <div className="space-y-5">
          <h2 className="font-semibold">Contact &amp; shipping</h2>
          <div>
            <label className={label}>Email</label>
            <input
              className={input}
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
              required
            />
          </div>
          <div>
            <label className={label}>Full name</label>
            <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div>
            <label className={label}>Address</label>
            <input className={input} value={form.line1} onChange={(e) => set("line1", e.target.value)} placeholder="Street address" required />
            <input className={`${input} mt-2`} value={form.line2} onChange={(e) => set("line2", e.target.value)} placeholder="Apt, suite (optional)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>City</label>
              <input className={input} value={form.city} onChange={(e) => set("city", e.target.value)} required />
            </div>
            <div>
              <label className={label}>State / Region</label>
              <input className={input} value={form.state} onChange={(e) => set("state", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>ZIP / Postcode</label>
              <input className={input} value={form.zip} onChange={(e) => set("zip", e.target.value)} required />
            </div>
            <div>
              <label className={label}>Country</label>
              <select className={input} value={form.country} onChange={(e) => set("country", e.target.value)}>
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* summary */}
        <aside className="h-fit rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.lineId} className="flex justify-between gap-2 text-sm">
                <span className="text-slate-600 dark:text-slate-300">
                  {item.title}
                  {(item.color || item.size) &&
                    ` (${[item.color, item.size].filter(Boolean).join(", ")})`}{" "}
                  × {item.quantity}
                </span>
                <Price cents={item.priceCents * item.quantity} />
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
            <span className="text-slate-500">Shipping</span>
            <span className="text-emerald-600">Free</span>
          </div>
          <div className="mt-2 flex justify-between text-lg font-bold">
            <span>Total</span>
            <Price cents={totalCents} />
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Placing order…" : "Place order"}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
            <ShieldIcon className="h-4 w-4" />
            Secure checkout. You&apos;ll get an order confirmation by email.
          </p>
        </aside>
      </form>
    </div>
  );
}
