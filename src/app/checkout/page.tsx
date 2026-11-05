"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import Price from "@/components/Price";
import { ShieldIcon } from "@/components/Icons";
import { DELIVERY_OPTIONS, deliveryFee, type DeliveryId } from "@/lib/delivery";
import type { GeoResult } from "@/lib/geo";
import type { Address } from "@/components/account/AddressBook";
import AddressAutocomplete from "@/components/checkout/AddressAutocomplete";
import PickupPicker, { type Pickup } from "@/components/checkout/PickupPicker";

const COUNTRIES = [
  "United Kingdom", "Ireland", "United States", "Canada", "Australia",
  "Germany", "France", "Spain", "Italy", "Netherlands", "India", "Other",
];

type Form = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const EMPTY: Form = {
  name: "", line1: "", line2: "", city: "", state: "", zip: "", country: "United Kingdom",
};

const PAYMENTS = [
  { id: "card", label: "Credit / debit card" },
  { id: "paypal", label: "PayPal" },
  { id: "applepay", label: "Apple Pay" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, clear } = useCart();
  const { customer } = useCustomer();

  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState<DeliveryId>("standard");
  const [saved, setSaved] = useState<Address[]>([]);
  const [addressMode, setAddressMode] = useState<"saved" | "new">("new");
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [pickup, setPickup] = useState<Pickup | null>(null);
  const [payment, setPayment] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill email + load saved addresses when signed in.
  useEffect(() => {
    if (!customer) return;
    setEmail(customer.email);
    fetch("/api/account/addresses")
      .then((r) => r.json())
      .then((d) => {
        const list: Address[] = d.addresses ?? [];
        setSaved(list);
        if (list.length > 0) {
          setAddressMode("saved");
          setSelectedSavedId((list.find((a) => a.isDefault) ?? list[0]).id);
        }
      })
      .catch(() => {});
  }, [customer]);

  function set(k: keyof Form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function fillFromGeo(r: GeoResult) {
    setForm((f) => ({
      ...f,
      line1: r.line1 || f.line1,
      city: r.city || f.city,
      state: r.state || f.state,
      zip: r.zip || f.zip,
      country: COUNTRIES.includes(r.country) ? r.country : f.country,
    }));
  }

  // Resolve the shipping address from the chosen mode.
  function resolveShipping(): Form | null {
    if (delivery === "pickup") {
      if (!pickup) return null;
      return {
        name: form.name || customer?.name || "",
        line1: pickup.line1,
        line2: pickup.name,
        city: pickup.city,
        state: pickup.state,
        zip: pickup.zip,
        country: pickup.country,
      };
    }
    if (addressMode === "saved" && selectedSavedId) {
      const a = saved.find((x) => x.id === selectedSavedId);
      if (!a) return null;
      return {
        name: a.fullName,
        line1: a.line1,
        line2: a.line2 ?? "",
        city: a.city,
        state: a.state ?? "",
        zip: a.zip,
        country: a.country,
      };
    }
    return form;
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    const ship = resolveShipping();
    if (!ship) {
      setError(delivery === "pickup" ? "Please choose a pickup point." : "Please enter a delivery address.");
      return;
    }
    if (delivery !== "pickup" && (!ship.name || !ship.line1 || !ship.city || !ship.zip)) {
      setError("Please fill in your name, address, city and postcode.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          deliveryMethod: delivery,
          ...ship,
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

  const field =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900";
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";
  const shippingCents = deliveryFee(delivery);
  // When a Stripe publishable key is present, real (test or live) payment is on.
  const stripeEnabled = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* contact */}
          <section>
            <h2 className="mb-3 font-semibold">Contact</h2>
            <label className={labelCls}>Email</label>
            <input
              className={field}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Your order confirmation and delivery updates go here.
            </p>
          </section>

          {/* delivery method */}
          <section>
            <h2 className="mb-3 font-semibold">Delivery method</h2>
            <div className="space-y-2">
              {DELIVERY_OPTIONS.map((o) => (
                <label
                  key={o.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 transition ${
                    delivery === o.id
                      ? "border-brand-500 bg-brand-50 dark:bg-slate-800"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery === o.id}
                      onChange={() => setDelivery(o.id)}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                    />
                    <span>
                      <span className="text-sm font-medium">{o.label}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">{o.desc}</span>
                    </span>
                  </span>
                  <span className="text-sm font-semibold">
                    {o.cents === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      <Price cents={o.cents} />
                    )}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* address or pickup */}
          {delivery === "pickup" ? (
            <section>
              <h2 className="mb-3 font-semibold">Pickup point</h2>
              <PickupPicker selected={pickup} onSelect={setPickup} />
              {pickup && (
                <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
                  Collecting from <span className="font-medium">{pickup.name}</span>
                </p>
              )}
            </section>
          ) : (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">Delivery address</h2>
                {saved.length > 0 && (
                  <div className="flex rounded-lg border border-slate-200 p-0.5 text-xs dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setAddressMode("saved")}
                      className={`rounded-md px-2.5 py-1 font-medium ${addressMode === "saved" ? "bg-brand-600 text-white" : "text-slate-500"}`}
                    >
                      Saved
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressMode("new")}
                      className={`rounded-md px-2.5 py-1 font-medium ${addressMode === "new" ? "bg-brand-600 text-white" : "text-slate-500"}`}
                    >
                      New address
                    </button>
                  </div>
                )}
              </div>

              {addressMode === "saved" && saved.length > 0 ? (
                <ul className="space-y-2">
                  {saved.map((a) => (
                    <li key={a.id}>
                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition ${
                          selectedSavedId === a.id
                            ? "border-brand-500 bg-brand-50 dark:bg-slate-800"
                            : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="saved"
                          checked={selectedSavedId === a.id}
                          onChange={() => setSelectedSavedId(a.id)}
                          className="mt-0.5 h-4 w-4 text-brand-600 focus:ring-brand-500"
                        />
                        <span>
                          <span className="font-medium">
                            {a.label ? `${a.label} · ` : ""}{a.fullName}
                          </span>
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            {[a.line1, a.line2, a.city, a.zip, a.country].filter(Boolean).join(", ")}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Find your address</label>
                    <AddressAutocomplete onSelect={fillFromGeo} />
                    <p className="mt-1.5 text-xs text-slate-400">
                      Search to fill the fields automatically, or type them in below.
                    </p>
                  </div>

                  <div>
                    <label className={labelCls}>Full name</label>
                    <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelCls}>Street address</label>
                    <input className={field} value={form.line1} onChange={(e) => set("line1", e.target.value)} placeholder="123 High Street" required />
                    <input className={`${field} mt-2`} value={form.line2} onChange={(e) => set("line2", e.target.value)} placeholder="Apartment, suite (optional)" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>City / Town</label>
                      <input className={field} value={form.city} onChange={(e) => set("city", e.target.value)} required />
                    </div>
                    <div>
                      <label className={labelCls}>County / State</label>
                      <input className={field} value={form.state} onChange={(e) => set("state", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Postcode / ZIP</label>
                      <input className={field} value={form.zip} onChange={(e) => set("zip", e.target.value)} required />
                    </div>
                    <div>
                      <label className={labelCls}>Country</label>
                      <select className={field} value={form.country} onChange={(e) => set("country", e.target.value)}>
                        {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* payment method */}
          <section>
            <h2 className="mb-3 font-semibold">Payment</h2>
            {stripeEnabled ? (
              <div className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldIcon className="h-4 w-4 text-brand-600" />
                  Secure payment
                </div>
                <p className="mt-1.5 text-slate-500 dark:text-slate-400">
                  Continue to our secure payment page to enter your card details.
                  You can pay by card, and on supported devices Apple Pay or Google
                  Pay.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {PAYMENTS.map((p) => (
                    <label
                      key={p.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                        payment === p.id
                          ? "border-brand-500 bg-brand-50 dark:bg-slate-800"
                          : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === p.id}
                        onChange={() => setPayment(p.id)}
                        className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm font-medium">{p.label}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                  Demo mode: your order is recorded but no payment is taken.
                  Connect a payment provider to charge cards for real.
                </p>
              </>
            )}
          </section>
        </div>

        {/* order summary */}
        <aside className="h-fit rounded-2xl border border-slate-200 p-6 dark:border-slate-800 lg:sticky lg:top-24">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.lineId} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  )}
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-slate-700 px-1 text-[10px] font-bold text-white dark:bg-slate-600">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{item.title}</div>
                  {(item.color || item.size) && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {[item.color, item.size].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
                <Price cents={item.priceCents * item.quantity} className="shrink-0 text-sm" />
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <Price cents={totalCents} />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              {shippingCents === 0 ? (
                <span className="text-emerald-600">Free</span>
              ) : (
                <Price cents={shippingCents} />
              )}
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-lg font-bold dark:border-slate-700">
            <span>Total</span>
            <Price cents={totalCents + shippingCents} />
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading
              ? "Placing order…"
              : stripeEnabled
                ? "Continue to payment"
                : "Place order"}
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
