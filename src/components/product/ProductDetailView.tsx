"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StoreProduct } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatPrice, colorToCss, deliveryWindow } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import Markdown from "@/components/Markdown";
import SizeGuide from "./SizeGuide";

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="text-amber-500" aria-label={`${value} out of 5`}>
      {"★".repeat(full)}
      <span className="text-slate-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export default function ProductDetailView({
  product,
}: {
  product: StoreProduct;
}) {
  const router = useRouter();
  const { addItem } = useCart();

  const gallery = product.images.length ? product.images : [product.image];
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState<string | undefined>(product.colors[0]);
  const [size, setSize] = useState<string | undefined>(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const isClothing = product.category.toLowerCase().includes("cloth");
  const needsColor = product.colors.length > 0;
  const needsSize = product.sizes.length > 0;

  function buildItem() {
    return {
      productId: product.id,
      slug: product.slug,
      title: product.title,
      priceCents: product.priceCents,
      currency: product.currency,
      image: product.images[activeImg] ?? product.image,
      category: product.category,
      color,
      size,
    };
  }

  function handleAdd() {
    if ((needsColor && !color) || (needsSize && !size)) return;
    addItem(buildItem(), qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    if ((needsColor && !color) || (needsSize && !size)) return;
    addItem(buildItem(), qty);
    router.push("/checkout");
  }

  const activeImage = gallery[activeImg] ?? null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_300px]">
      {/* LEFT — gallery */}
      <div>
        <div className="aspect-square w-full overflow-hidden rounded-2xl border border-slate-200">
          <ProductImage
            image={activeImage}
            title={product.title}
            category={product.category}
          />
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                  i === activeImg
                    ? "border-brand-600"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <ProductImage
                  image={img}
                  title={product.title}
                  category={product.category}
                  compact
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MIDDLE — info */}
      <div>
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {product.category}
        </span>
        <h1 className="mt-1 text-2xl font-bold leading-snug">{product.title}</h1>

        {/* rating / reviews / sold */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {product.ratingAvg ? (
            <span className="flex items-center gap-1">
              <Stars value={product.ratingAvg} />
              <span className="text-slate-500">
                {product.ratingAvg.toFixed(1)}
                {product.reviewsCount > 0 && ` · ${product.reviewsCount} reviews`}
              </span>
            </span>
          ) : (
            <span className="text-slate-400">No reviews yet</span>
          )}
          {product.soldCount > 0 && (
            <span className="text-slate-500">
              {product.soldCount.toLocaleString()} sold
            </span>
          )}
        </div>

        <div className="mt-4 text-3xl font-extrabold">
          {formatPrice(product.priceCents, product.currency)}
        </div>

        {/* colors */}
        {needsColor && (
          <div className="mt-6">
            <div className="text-sm font-medium text-slate-700">
              Color: <span className="text-slate-500">{color}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c) => {
                const css = colorToCss(c);
                const selected = c === color;
                return (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    title={c}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                      selected
                        ? "border-brand-600 ring-2 ring-brand-200"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {css && (
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: css }}
                      />
                    )}
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* sizes */}
        {needsSize && (
          <div className="mt-6">
            <div className="text-sm font-medium text-slate-700">
              Size: <span className="text-slate-500">{size}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const selected = s === size;
                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      selected
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {isClothing && <SizeGuide sizes={product.sizes} />}
          </div>
        )}

        {/* overview */}
        <div className="mt-8">
          <h2 className="mb-2 font-semibold">Overview</h2>
          {product.description ? (
            <Markdown content={product.description} />
          ) : (
            <p className="text-slate-400">No description yet.</p>
          )}
        </div>
      </div>

      {/* RIGHT — purchase panel */}
      <div className="h-fit rounded-2xl border border-slate-200 p-5 lg:sticky lg:top-24">
        <div className="text-2xl font-extrabold">
          {formatPrice(product.priceCents, product.currency)}
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <span>🚚</span>
            <span>
              Estimated delivery
              <br />
              <strong>
                {deliveryWindow(product.shipDaysMin, product.shipDaysMax)}
              </strong>
            </span>
          </div>
        </div>

        {/* quantity */}
        <div className="mt-4">
          <div className="text-sm font-medium text-slate-700">Quantity</div>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-9 w-9 rounded-lg border border-slate-300 text-lg leading-none hover:bg-slate-50"
            >
              −
            </button>
            <span className="w-10 text-center font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="h-9 w-9 rounded-lg border border-slate-300 text-lg leading-none hover:bg-slate-50"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <button
            onClick={handleBuyNow}
            className="w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Buy now
          </button>
          <button
            onClick={handleAdd}
            className="w-full rounded-xl border border-brand-600 px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            {added ? "✓ Added to cart" : "Add to cart"}
          </button>
        </div>

        <ul className="mt-5 space-y-1.5 text-xs text-slate-500">
          <li>✓ Free tracked shipping</li>
          <li>✓ 30-day money-back guarantee</li>
          <li>✓ Secure checkout via Stripe</li>
        </ul>
      </div>
    </div>
  );
}
