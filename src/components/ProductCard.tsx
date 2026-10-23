import Link from "next/link";
import type { StoreProduct } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="h-44 overflow-hidden">
        <ProductImage
          image={product.image}
          title={product.title}
          category={product.category}
          className="transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {product.category}
        </span>
        <h3 className="mt-1 line-clamp-2 flex-1 font-semibold leading-snug">
          {product.title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">
            {formatPrice(product.priceCents, product.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}
