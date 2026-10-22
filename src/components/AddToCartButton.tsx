"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      slug: product.slug,
      title: product.title,
      priceCents: product.priceCents,
      currency: product.currency,
      emoji: product.emoji,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98]"
    >
      {added ? "✓ Added to cart" : "Add to cart"}
    </button>
  );
}
