import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImage from "@/components/ProductImage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  return {
    title: product ? `${product.title} — Dropshipro` : "Product — Dropshipro",
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/products" className="text-sm text-slate-500 hover:text-brand-600">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="h-80 overflow-hidden rounded-3xl">
          <ProductImage
            image={product.image}
            title={product.title}
            category={product.category}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </span>
          <h1 className="mt-1 text-3xl font-bold">{product.title}</h1>
          <div className="mt-2 text-sm text-slate-400">
            In stock · Ships in 2–4 days
          </div>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-slate-600">
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
