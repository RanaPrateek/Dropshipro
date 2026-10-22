import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  return {
    title: product ? `${product.title} — Dropshipro` : "Product — Dropshipro",
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/products" className="text-sm text-slate-500 hover:text-brand-600">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div
          className={`flex h-80 items-center justify-center rounded-3xl bg-gradient-to-br ${product.color} text-8xl`}
        >
          {product.emoji}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </span>
          <h1 className="mt-1 text-3xl font-bold">{product.title}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-amber-500">★ {product.rating}</span>
            <span className="text-sm text-slate-400">In stock · Ships in 2–4 days</span>
          </div>

          <p className="mt-6 leading-relaxed text-slate-600">
            {product.description}
          </p>

          <div className="mt-8 text-3xl font-extrabold">
            {formatPrice(product.priceCents, product.currency)}
          </div>

          <div className="mt-6 max-w-xs">
            <AddToCartButton product={product} />
          </div>

          <ul className="mt-8 space-y-2 text-sm text-slate-500">
            <li>✓ Free tracked shipping</li>
            <li>✓ 30-day money-back guarantee</li>
            <li>✓ Secure checkout via Stripe</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
