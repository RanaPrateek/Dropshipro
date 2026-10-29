import Link from "next/link";
import { getNonDeals, getDeals, CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import {
  SparkleIcon,
  TruckIcon,
  ShieldIcon,
  ReturnIcon,
  ChatIcon,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [deals, more] = await Promise.all([getDeals(4), getNonDeals(8)]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-700 dark:bg-slate-800 dark:text-brand-200">
            <SparkleIcon className="h-4 w-4" />
            New drops every week
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Trending finds, delivered to your door
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            Curated clothing and electronics — quality picks without the endless
            scrolling.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/products?category=${encodeURIComponent(c)}`}
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700"
              >
                {c}
              </Link>
            ))}
            <Link
              href="/products"
              className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
            >
              Shop all
            </Link>
          </div>
        </div>
      </section>

      {/* Today's deals */}
      {deals.length > 0 && (
        <section id="deals" className="mx-auto max-w-7xl px-4 pt-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Today&apos;s Deals</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Limited-time prices on selected items.
              </p>
            </div>
            <Link href="/products" className="text-sm font-medium text-brand-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {deals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* More products */}
      <section className="mx-auto max-w-7xl px-4 pt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">More products</h2>
          <Link href="/products" className="text-sm font-medium text-brand-600 hover:underline">
            View all →
          </Link>
        </div>

        {more.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No products yet. Add your first from the{" "}
            <Link href="/admin" className="font-medium text-brand-600 hover:underline">
              Admin panel
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {more.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Why Nuvo */}
      <section className="mt-16 border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold">
            Why Nuvo is your best choice for online shopping
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: TruckIcon, title: "Fast, tracked shipping", text: "Every order ships with tracking so you always know where it is." },
              { Icon: ShieldIcon, title: "Secure checkout", text: "Payments are protected end-to-end by Stripe. Your details stay safe." },
              { Icon: ReturnIcon, title: "30-day easy returns", text: "Changed your mind? Send it back within 30 days, hassle-free." },
              { Icon: ChatIcon, title: "Friendly support", text: "Real help when you need it — we're here before and after you buy." },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-950"
              >
                <f.Icon className="mx-auto h-8 w-8 text-brand-600 dark:text-brand-200" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
