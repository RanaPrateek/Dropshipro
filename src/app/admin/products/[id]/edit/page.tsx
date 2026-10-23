import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toStoreProduct } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit product — Dropshipro" };

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const row = await prisma.product.findUnique({ where: { id: params.id } });
  if (!row) notFound();

  const p = toStoreProduct(row);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-brand-600">
        ← Back to products
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Edit product</h1>
      <div className="mt-8">
        <ProductForm
          initial={{
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            priceDollars: (p.priceCents / 100).toFixed(2),
            images: p.images,
            colorsText: p.colors.join(", "),
            sizesText: p.sizes.join(", "),
            ratingAvg: p.ratingAvg != null ? String(p.ratingAvg) : "",
            reviewsCount: p.reviewsCount ? String(p.reviewsCount) : "",
            soldCount: p.soldCount ? String(p.soldCount) : "",
            shipDaysMin: String(p.shipDaysMin),
            shipDaysMax: String(p.shipDaysMax),
            supplierUrl: row.supplierUrl ?? "",
            active: row.active,
          }}
        />
      </div>
    </div>
  );
}
