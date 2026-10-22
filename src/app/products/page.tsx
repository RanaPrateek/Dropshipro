import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Shop all products — Dropshipro",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">All products</h1>
      <p className="mt-2 text-slate-500">
        {products.length} curated items ready to ship.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
