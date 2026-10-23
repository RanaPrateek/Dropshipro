import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit product — Dropshipro" };

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-brand-600">
        ← Back to products
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Edit product</h1>
      <div className="mt-8">
        <ProductForm
          initial={{
            id: product.id,
            title: product.title,
            description: product.description,
            category: product.category,
            priceDollars: (product.priceCents / 100).toFixed(2),
            image: product.image,
            supplierUrl: product.supplierUrl ?? "",
            active: product.active,
          }}
        />
      </div>
    </div>
  );
}
