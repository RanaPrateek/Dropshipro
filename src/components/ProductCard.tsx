import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={`flex h-44 items-center justify-center bg-gradient-to-br ${product.color} text-6xl`}
      >
        <span className="transition group-hover:scale-110">{product.emoji}</span>
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
          <span className="text-sm text-amber-500">★ {product.rating}</span>
        </div>
      </div>
    </Link>
  );
}
