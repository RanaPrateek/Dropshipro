import Link from "next/link";
import { type StoreProduct, isOnSale, stockBadge } from "@/lib/products";
import { discountPercent } from "@/lib/format";
import ProductImage from "./ProductImage";
import Price from "./Price";
import Countdown from "./Countdown";

export default function ProductCard({ product }: { product: StoreProduct }) {
  const onSale = isOnSale(product);
  const pct =
    onSale && product.compareAtCents
      ? discountPercent(product.priceCents, product.compareAtCents)
      : 0;
  const badge = stockBadge(product.stock);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative h-44 overflow-hidden">
        <ProductImage
          image={product.image}
          title={product.title}
          category={product.category}
          className="transition duration-300 group-hover:scale-105"
        />
        {onSale && pct > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
            -{pct}%
          </span>
        )}
        {badge && (
          <span
            className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              badge.tone === "out"
                ? "bg-slate-700 text-white"
                : badge.tone === "low"
                  ? "bg-amber-500 text-white"
                  : "bg-slate-900/70 text-white"
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-200">
          {product.category}
        </span>
        <h3 className="mt-1 line-clamp-2 flex-1 text-sm font-semibold leading-snug">
          {product.title}
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <Price cents={product.priceCents} className="text-lg font-bold" />
          {onSale && product.compareAtCents && (
            <Price
              cents={product.compareAtCents}
              className="text-sm text-slate-400 line-through"
            />
          )}
        </div>
        {onSale && product.dealExpiresAt && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Ends in</span>
            <Countdown expiresAt={product.dealExpiresAt} compact />
          </div>
        )}
      </div>
    </Link>
  );
}
