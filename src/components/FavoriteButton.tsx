"use client";

import { useFavorites, type FavoriteItem } from "@/context/FavoritesContext";

export default function FavoriteButton({
  item,
  variant = "overlay",
}: {
  item: FavoriteItem;
  variant?: "overlay" | "inline";
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(item.id);

  function handle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(item);
  }

  if (variant === "inline") {
    return (
      <button
        onClick={handle}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${
          active
            ? "border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40"
            : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
        aria-pressed={active}
      >
        <Heart filled={active} />
        {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      onClick={handle}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-rose-500 shadow-sm transition hover:bg-white dark:bg-slate-900/80"
    >
      <Heart filled={active} />
    </button>
  );
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-7.5-4.6-10-9.3A5.2 5.2 0 0112 6a5.2 5.2 0 0110 5.7C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}
