import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <span className="inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-700">
            ✨ New drops every week
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Trending finds, delivered to your door
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Hand-picked gadgets, home upgrades, and lifestyle gear — curated so
            you don&apos;t have to scroll for hours.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-brand-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-700"
            >
              Shop all products
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: "🚚", title: "Fast shipping", text: "Tracked delivery on every order." },
            { icon: "🔒", title: "Secure checkout", text: "Payments protected by Stripe." },
            { icon: "↩️", title: "30-day returns", text: "Not happy? Send it back, hassle-free." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 p-6 text-center"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured products</h2>
          <Link href="/products" className="text-sm font-medium text-brand-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
