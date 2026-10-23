import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Add product — Dropshipro" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-brand-600">
        ← Back to products
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Add product</h1>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
