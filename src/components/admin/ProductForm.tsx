"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, isApparel } from "@/lib/products";
import ProductImage from "@/components/ProductImage";
import Markdown from "@/components/Markdown";

export type ProductFormValues = {
  id?: string;
  title: string;
  description: string;
  category: string;
  priceDollars: string;
  compareAtDollars: string;
  stock: string;
  images: string[];
  colorsText: string;
  colorImages: Record<string, string>;
  sizesText: string;
  ratingAvg: string;
  reviewsCount: string;
  soldCount: string;
  shipDaysMin: string;
  shipDaysMax: string;
  supplierUrl: string;
  active: boolean;
};

const label = "block text-sm font-medium text-slate-700";
const input =
  "mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500";

export default function ProductForm({
  initial,
}: {
  initial?: Partial<ProductFormValues>;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const [v, setV] = useState<ProductFormValues>({
    id: initial?.id,
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? CATEGORIES[0],
    priceDollars: initial?.priceDollars ?? "",
    compareAtDollars: initial?.compareAtDollars ?? "",
    stock: initial?.stock ?? "",
    images: initial?.images ?? [],
    colorsText: initial?.colorsText ?? "",
    colorImages: initial?.colorImages ?? {},
    sizesText: initial?.sizesText ?? "",
    ratingAvg: initial?.ratingAvg ?? "",
    reviewsCount: initial?.reviewsCount ?? "",
    soldCount: initial?.soldCount ?? "",
    shipDaysMin: initial?.shipDaysMin ?? "7",
    shipDaysMax: initial?.shipDaysMax ?? "14",
    supplierUrl: initial?.supplierUrl ?? "",
    active: initial?.active ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  function set<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  const apparel = isApparel(v.category);

  async function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (res.ok) uploaded.push(data.path);
        else setError(data.error ?? "Upload failed");
      }
      set("images", [...v.images, ...uploaded]);
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(idx: number) {
    set(
      "images",
      v.images.filter((_, i) => i !== idx),
    );
  }

  function makePrimary(idx: number) {
    const next = [...v.images];
    const [picked] = next.splice(idx, 1);
    set("images", [picked, ...next]);
  }

  // --- description formatting helpers ---
  function wrap(before: string, after: string) {
    const el = descRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = v.description;
    const selected = text.slice(start, end) || "text";
    const next = text.slice(0, start) + before + selected + after + text.slice(end);
    set("description", next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  }

  function addBullet() {
    const el = descRef.current;
    const text = v.description;
    const start = el?.selectionStart ?? text.length;
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const next = text.slice(0, lineStart) + "- " + text.slice(lineStart);
    set("description", next);
    requestAnimationFrame(() => el?.focus());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const priceCents = Math.round(parseFloat(v.priceDollars) * 100);
    if (!v.title.trim() || !Number.isFinite(priceCents) || priceCents < 0) {
      setError("Please enter a title and a valid price.");
      setSaving(false);
      return;
    }

    const splitList = (s: string) =>
      s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    const compareRaw = parseFloat(v.compareAtDollars);
    const compareAtCents = Number.isFinite(compareRaw)
      ? Math.round(compareRaw * 100)
      : null;

    const payload = {
      title: v.title,
      description: v.description,
      category: v.category,
      priceCents,
      compareAtCents,
      stock: v.stock,
      images: v.images,
      colors: splitList(v.colorsText),
      colorImages: v.colorImages,
      sizes: splitList(v.sizesText),
      ratingAvg: v.ratingAvg,
      reviewsCount: v.reviewsCount,
      soldCount: v.soldCount,
      shipDaysMin: v.shipDaysMin,
      shipDaysMax: v.shipDaysMax,
      supplierUrl: v.supplierUrl,
      active: v.active,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${v.id}` : "/api/admin/products",
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

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-[1fr_300px]">
      {/* main column */}
      <div className="space-y-5">
        <div>
          <label className={label}>Product title</label>
          <input
            className={input}
            value={v.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Oversized Cotton Hoodie"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Category</label>
            <select
              className={input}
              value={v.category}
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
              value={v.priceDollars}
              onChange={(e) => set("priceDollars", e.target.value)}
              placeholder="29.99"
            />
          </div>
        </div>

        <div>
          <label className={label}>Compare-at price (optional)</label>
          <input
            className={input}
            type="number"
            min="0"
            step="0.01"
            value={v.compareAtDollars}
            onChange={(e) => set("compareAtDollars", e.target.value)}
            placeholder="39.99"
          />
          <p className="mt-1 text-xs text-slate-400">
            The original price. If higher than the price, the product shows as a
            deal (appears in Today&apos;s Deals with a discount badge).
          </p>
        </div>

        {/* description with toolbar + preview */}
        <div>
          <div className="flex items-center justify-between">
            <label className={label}>Description</label>
            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              {showPreview ? "Edit" : "Preview"}
            </button>
          </div>

          {!showPreview ? (
            <>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => wrap("**", "**")}
                  className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-bold hover:bg-slate-50"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={addBullet}
                  className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
                  title="Bullet point"
                >
                  • List
                </button>
              </div>
              <textarea
                ref={descRef}
                className={`${input} min-h-[160px] font-mono text-sm`}
                value={v.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder={"Describe the product…\n\nUse **bold** for emphasis and\n- bullet points\n- like this"}
              />
              <p className="mt-1 text-xs text-slate-400">
                Tip: <code>**bold**</code> makes text bold; lines starting with{" "}
                <code>- </code> become bullet points.
              </p>
            </>
          ) : (
            <div className="mt-1 min-h-[160px] rounded-xl border border-slate-200 p-4">
              {v.description ? (
                <Markdown content={v.description} />
              ) : (
                <p className="text-slate-400">Nothing to preview yet.</p>
              )}
            </div>
          )}
        </div>

        {/* colors & sizes */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Colors (comma-separated)</label>
            <input
              className={input}
              value={v.colorsText}
              onChange={(e) => set("colorsText", e.target.value)}
              placeholder="Black, White, Navy"
            />
          </div>
          <div>
            <label className={label}>
              Sizes (comma-separated){apparel ? "" : " — optional"}
            </label>
            <input
              className={input}
              value={v.sizesText}
              onChange={(e) => set("sizesText", e.target.value)}
              placeholder={apparel ? "S, M, L, XL" : "e.g. 64GB, 128GB"}
            />
            {apparel && (
              <p className="mt-1 text-xs text-slate-400">
                Use standard labels (XS, S, M, L, XL, XXL) to match the size
                guide.
              </p>
            )}
          </div>
        </div>

        {/* per-color image mapping */}
        {(() => {
          const colorList = v.colorsText
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
          if (colorList.length === 0 || v.images.length === 0) return null;
          return (
            <div>
              <label className={label}>Color images (optional)</label>
              <p className="mb-2 text-xs text-slate-400">
                Pick which image shows when a customer selects each color.
              </p>
              <div className="space-y-2">
                {colorList.map((c) => (
                  <div key={c} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-sm font-medium">{c}</span>
                    <div className="flex flex-wrap gap-2">
                      {v.images.map((img) => {
                        const picked = v.colorImages[c] === img;
                        return (
                          <button
                            key={img}
                            type="button"
                            onClick={() =>
                              set("colorImages", { ...v.colorImages, [c]: img })
                            }
                            className={`h-12 w-12 overflow-hidden rounded-lg border-2 ${
                              picked ? "border-brand-600" : "border-slate-200"
                            }`}
                          >
                            <ProductImage
                              image={img}
                              title={c}
                              category={v.category}
                              compact
                            />
                          </button>
                        );
                      })}
                      {v.colorImages[c] && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = { ...v.colorImages };
                            delete next[c];
                            set("colorImages", next);
                          }}
                          className="self-center text-xs text-slate-400 hover:underline"
                        >
                          clear
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* social proof + shipping */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Rating (0–5)</label>
            <input
              className={input}
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={v.ratingAvg}
              onChange={(e) => set("ratingAvg", e.target.value)}
              placeholder="4.6"
            />
          </div>
          <div>
            <label className={label}># Reviews</label>
            <input
              className={input}
              type="number"
              min="0"
              value={v.reviewsCount}
              onChange={(e) => set("reviewsCount", e.target.value)}
              placeholder="128"
            />
          </div>
          <div>
            <label className={label}># Sold</label>
            <input
              className={input}
              type="number"
              min="0"
              value={v.soldCount}
              onChange={(e) => set("soldCount", e.target.value)}
              placeholder="540"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Shipping: min days</label>
            <input
              className={input}
              type="number"
              min="0"
              value={v.shipDaysMin}
              onChange={(e) => set("shipDaysMin", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Shipping: max days</label>
            <input
              className={input}
              type="number"
              min="0"
              value={v.shipDaysMax}
              onChange={(e) => set("shipDaysMax", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={label}>Stock quantity (optional)</label>
          <input
            className={input}
            type="number"
            min="0"
            value={v.stock}
            onChange={(e) => set("stock", e.target.value)}
            placeholder="e.g. 8"
          />
          <p className="mt-1 text-xs text-slate-400">
            Shows a badge automatically: “Only 1 left” (1), “Almost sold out”
            (≤5), or “Sold out” (0). Leave blank to not track stock.
          </p>
        </div>

        <div>
          <label className={label}>Supplier link (optional, private)</label>
          <input
            className={input}
            value={v.supplierUrl}
            onChange={(e) => set("supplierUrl", e.target.value)}
            placeholder="https://www.aliexpress.com/item/..."
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={v.active}
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

      {/* images column */}
      <div>
        <label className={label}>Product images</label>
        <div className="mt-1 aspect-square w-full overflow-hidden rounded-xl border border-slate-200">
          <ProductImage
            image={v.images[0] ?? null}
            title={v.title || "Preview"}
            category={v.category}
          />
        </div>

        {v.images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {v.images.map((img, i) => (
              <div key={img} className="group relative">
                <div
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    i === 0 ? "border-brand-600" : "border-slate-200"
                  }`}
                >
                  <ProductImage
                    image={img}
                    title={v.title}
                    category={v.category}
                    compact
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-xs text-white"
                  title="Remove"
                >
                  ×
                </button>
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(i)}
                    className="mt-1 w-full text-[10px] text-brand-600 hover:underline"
                  >
                    Make main
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
          className="mt-3 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
        />
        {uploading && <p className="mt-2 text-xs text-slate-400">Uploading…</p>}
        <p className="mt-2 text-xs text-slate-400">
          Upload several images — the first one is the main image. JPG, PNG,
          WebP or GIF · up to 5 MB each.
        </p>
      </div>
    </form>
  );
}
