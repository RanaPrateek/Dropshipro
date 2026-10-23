import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductDetailView from "@/components/product/ProductDetailView";

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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/products" className="text-sm text-slate-500 hover:text-brand-600">
        ← Back to shop
      </Link>
      <div className="mt-6">
        <ProductDetailView product={product} />
      </div>
    </div>
  );
}
