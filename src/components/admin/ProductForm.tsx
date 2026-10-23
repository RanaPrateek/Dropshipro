"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

export type ProductFormValues = {
  id?: string;
  title: string;
  description: string;
  category: string;
  priceDollars: string;
  image: string | null;
  supplierUrl: string;
  active: boolean;
};

export default function ProductForm({
  initial,
}: {
  initial?: Partial<ProductFormValues>;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [values, setValues] = useState<ProductFormValues>({
    id: initial?.id,
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? CATEGORIES[0],
    priceDollars: initial?.priceDollars ?? "",
    image: initial?.image ?? null,
    supplierUrl: initial?.supplierUrl ?? "",
    active: initial?.active ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) set("image", data.path);
      else setError(data.error ?? "Upload failed");
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const priceCents = Math.round(parseFloat(values.priceDollars) * 100);
    if (!values.title.trim() || !Number.isFinite(priceCents) || priceCents < 0) {
      setError("Please enter a title and a valid price.");
      setSaving(false);
      return;
    }

    const payload = {
      title: values.title,
      description: values.description,
      category: values.category,
      priceCents,
      image: values.image,
      supplierUrl: values.supplierUrl,
      active: values.active,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${values.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Save failed");
      }
    } catch {
      setError("Something went wrong saving the product.");
    } finally {
      setSaving(false);
    }
  }

  const label = "block text-sm font-medium text-slate-700";
  const input =
    "mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500";

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <div>
          <label className={label}>Product title</label>
          <input
            className={input}
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Oversized Cotton Hoodie"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Category</label>
            <select
              className={input}
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Price (USD)</label>
            <input
              className={input}
              type="number"
              min="0"
              step="0.01"
              value={values.priceDollars}
              onChange={(e) => set("priceDollars", e.target.value)}
              placeholder="29.99"
            />
          </div>
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea
            className={`${input} min-h-[120px]`}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the product…"
          />
        </div>

        <div>
          <label className={label}>Supplier link (optional, private)</label>
          <input
            className={input}
            value={values.supplierUrl}
            onChange={(e) => set("supplierUrl", e.target.value)}
            placeholder="https://www.aliexpress.com/item/..."
          />
          <p className="mt-1 text-xs text-slate-400">
            Where you order this from. Only visible to you.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.active}
            onChange={(e) => set("active", e.target.checked)}
          />
          Visible in store
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Image panel */}
      <div>
        <label className={label}>Product image</label>
        <div className="mt-1 h-48 w-full overflow-hidden rounded-xl border border-slate-200">
          <ProductImage
            image={values.image}
            title={values.title || "Preview"}
            category={values.category}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="mt-3 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
        />
        {uploading && <p className="mt-2 text-xs text-slate-400">Uploading…</p>}
        {values.image && (
          <button
            type="button"
            onClick={() => set("image", null)}
            className="mt-2 text-xs text-red-500 hover:underline"
          >
            Remove image
          </button>
        )}
        <p className="mt-2 text-xs text-slate-400">
          JPG, PNG, WebP or GIF · up to 5 MB. Upload your own image.
        </p>
      </div>
    </form>
  );
}
