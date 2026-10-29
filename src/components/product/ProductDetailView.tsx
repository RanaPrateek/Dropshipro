"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type StoreProduct,
  isApparel,
  isOnSale,
  stockBadge,
  garmentType,
} from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { deliveryWindow, discountPercent } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import Markdown from "@/components/Markdown";
import Price from "@/components/Price";
import Countdown from "@/components/Countdown";
import { TruckIcon } from "@/components/Icons";
import SizeGuide from "./SizeGuide";

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="text-amber-500" aria-label={`${value} out of 5`}>
      {"★".repeat(full)}
      <span className="text-slate-300 dark:text-slate-600">
        {"★".repeat(5 - full)}
      </span>
    </span>
  );
}

export default function ProductDetailView({
  product,
  reviewSummary,
}: {
  product: StoreProduct;
  reviewSummary?: { count: number; average: number };
}) {
  const router = useRouter();
  const { addItem } = useCart();

  // Prefer real review data; fall back to admin-entered rating/count.
  const ratingValue =
    reviewSummary && reviewSummary.count > 0
      ? reviewSummary.average
      : product.ratingAvg;
  const ratingCount =
    reviewSummary && reviewSummary.count > 0
      ? reviewSummary.count
      : product.reviewsCount;

  const gallery = useMemo<(string | null)[]>(
    () =>
      product.images.length
        ? product.images
        : product.image
          ? [product.image]
          : [null],
    [product.images, product.image],
  );

  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState<string | undefined>(product.colors[0]);
  const [size, setSize] = useState<string | undefined>(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const apparel = isApparel(product.category);
  const gType = garmentType(product.title, product.category);
  const onSale = isOnSale(product);
  const pct =
    onSale && product.compareAtCents
      ? discountPercent(product.priceCents, product.compareAtCents)
      : 0;
  const badge = stockBadge(product.stock);
  const soldOut = product.stock != null && product.stock <= 0;
  const needsColor = product.colors.length > 0;
  const needsSize = product.sizes.length > 0;

  // When a color with its own image is picked, switch the main image to it.
  function selectColor(c: string) {
    setColor(c);
    const img = product.colorImages[c];
    if (img) {
      const idx = gallery.indexOf(img);
      if (idx >= 0) setActiveImg(idx);
    }
  }

  function buildItem() {
    return {
      productId: product.id,
      slug: product.slug,
      title: product.title,
      priceCents: product.priceCents,
      compareAtCents: onSale ? product.compareAtCents : null,
      dealExpiresAt: onSale ? product.dealExpiresAt : null,
      currency: product.currency,
      image: gallery[activeImg] ?? product.image,
      category: product.category,
      color,
      size,
    };
  }

  function handleAdd() {
    if (soldOut || (needsColor && !color) || (needsSize && !size)) return;
    addItem(buildItem(), qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    if (soldOut || (needsColor && !color) || (needsSize && !size)) return;
    addItem(buildItem(), qty);
    router.push("/checkout");
  }

  const activeImage = gallery[activeImg] ?? null;

  function PriceBlock() {
    return (
      <div className="flex flex-wrap items-baseline gap-2">
        <Price cents={product.priceCents} className="text-3xl font-extrabold" />
        {onSale && product.compareAtCents && (
          <>
            <Price
              cents={product.compareAtCents}
              className="text-lg text-slate-400 line-through"
            />
            <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
              -{pct}%
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_300px]">
      {/* LEFT — gallery */}
      <div>
        <div className="aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
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
                    : "border-slate-200 hover:border-slate-400 dark:border-slate-700"
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
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-200">
          {product.category}
        </span>
        <h1 className="mt-1 text-2xl font-bold leading-snug">{product.title}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {ratingValue ? (
            <a href="#reviews" className="flex items-center gap-1 hover:underline">
              <Stars value={ratingValue} />
              <span className="text-slate-500 dark:text-slate-400">
                {ratingValue.toFixed(1)}
                {ratingCount > 0 && ` · ${ratingCount} reviews`}
              </span>
            </a>
          ) : (
            <span className="text-slate-400">No reviews yet</span>
          )}
          {product.soldCount > 0 && (
            <span className="text-slate-500 dark:text-slate-400">
              {product.soldCount.toLocaleString()} sold
            </span>
          )}
          {badge && (
            <span
              className={`font-semibold ${
                badge.tone === "out" ? "text-slate-500" : "text-amber-600"
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>

        <div className="mt-4">
          <PriceBlock />
        </div>

        {/* deal countdown */}
        {onSale && product.dealExpiresAt && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1.5 text-sm dark:bg-rose-950/40">
            <span className="text-slate-600 dark:text-slate-300">Deal ends in</span>
            <Countdown expiresAt={product.dealExpiresAt} />
          </div>
        )}

        {/* colors */}
        {needsColor && (
          <div className="mt-6">
            <div className="text-sm font-medium">
              Color: <span className="text-slate-500 dark:text-slate-400">{color}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c) => {
                const selected = c === color;
                return (
                  <button
                    key={c}
                    onClick={() => selectColor(c)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      selected
                        ? "border-brand-600 ring-2 ring-brand-200 dark:ring-brand-800"
                        : "border-slate-300 hover:border-slate-400 dark:border-slate-700"
                    }`}
                  >
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
            <div className="text-sm font-medium">
              Size: <span className="text-slate-500 dark:text-slate-400">{size}</span>
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
                        ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-white"
                        : "border-slate-300 hover:border-slate-400 dark:border-slate-700"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {apparel && gType !== "generic" && (
              <SizeGuide sizes={product.sizes} garment={gType} />
            )}
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
      <div className="h-fit rounded-2xl border border-slate-200 p-5 dark:border-slate-800 lg:sticky lg:top-28">
        <PriceBlock />

        {onSale && product.dealExpiresAt && (
          <div className="mt-2 text-sm">
            <Countdown expiresAt={product.dealExpiresAt} />
          </div>
        )}

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
          <TruckIcon className="h-5 w-5 shrink-0 text-slate-500" />
          <span className="text-slate-700 dark:text-slate-200">
            Estimated delivery
            <br />
            <strong>
              {deliveryWindow(product.shipDaysMin, product.shipDaysMax)}
            </strong>
          </span>
        </div>

        {badge && (
          <p
            className={`mt-3 text-sm font-semibold ${
              badge.tone === "out" ? "text-slate-500" : "text-amber-600"
            }`}
          >
            {badge.text}
          </p>
        )}

        {/* quantity */}
        <div className="mt-4">
          <div className="text-sm font-medium">Quantity</div>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-9 w-9 rounded-lg border border-slate-300 text-lg leading-none hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              −
            </button>
            <span className="w-10 text-center font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="h-9 w-9 rounded-lg border border-slate-300 text-lg leading-none hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <button
            onClick={handleBuyNow}
            disabled={soldOut}
            className="w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {soldOut ? "Sold out" : "Buy now"}
          </button>
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className="w-full rounded-xl border border-brand-600 px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-brand-200 dark:hover:bg-slate-800"
          >
            {added ? "✓ Added to cart" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
