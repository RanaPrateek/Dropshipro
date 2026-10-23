import Link from "next/link";
import { getProducts, CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop all products — Dropshipro",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selected = CATEGORIES.find(
    (c) => c.toLowerCase() === (searchParams.category ?? "").toLowerCase(),
  );
  const products = await getProducts(selected);

  const chip = (label: string, href: string, active: boolean) => (
    <Link
      key={label}
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-brand-600 text-white"
          : "border border-slate-300 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">
        {selected ? selected : "All products"}
      </h1>
      <p className="mt-2 text-slate-500">
        {products.length} {products.length === 1 ? "item" : "items"} ready to ship.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {chip("All", "/products", !selected)}
        {CATEGORIES.map((c) =>
          chip(
            c,
            `/products?category=${encodeURIComponent(c)}`,
            selected === c,
          ),
        )}
      </div>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          Nothing here yet. Add products from the{" "}
          <Link href="/admin" className="font-medium text-brand-600 hover:underline">
            Admin panel
          </Link>
          .
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
