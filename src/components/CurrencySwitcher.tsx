"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";

export default function CurrencySwitcher() {
  const { code, setCode } = useCurrency();
  const codes: CurrencyCode[] = ["USD", "GBP"];

  return (
    <div className="flex items-center overflow-hidden rounded-full border border-slate-300 text-xs dark:border-slate-700">
      {codes.map((c) => (
        <button
          key={c}
          onClick={() => setCode(c)}
          className={`px-2 py-0.5 font-medium transition ${
            code === c
              ? "bg-brand-600 text-white"
              : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          {CURRENCIES[c].symbol} {c}
        </button>
      ))}
    </div>
  );
}
