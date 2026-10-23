"use client";

import { useState } from "react";
import {
  CLOTHING_SIZE_CHART,
  REGIONS,
  type Region,
} from "@/lib/sizeChart";

export default function SizeGuide({ sizes }: { sizes: string[] }) {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState<Region>("US");

  // Only show rows relevant to the product's offered sizes (if provided).
  const rows = sizes.length
    ? CLOTHING_SIZE_CHART.filter((r) =>
        sizes.map((s) => s.toUpperCase()).includes(r.size),
      )
    : CLOTHING_SIZE_CHART;
  const chart = rows.length ? rows : CLOTHING_SIZE_CHART;

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-medium text-brand-600 hover:underline"
      >
        {open ? "Hide size guide" : "📏 Size guide"}
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm text-slate-500">Region:</span>
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  region === r
                    ? "bg-brand-600 text-white"
                    : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-2 pr-4 font-medium">Size</th>
                  <th className="py-2 pr-4 font-medium">{region} size</th>
                  <th className="py-2 pr-4 font-medium">Chest (in)</th>
                  <th className="py-2 font-medium">Waist (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chart.map((r) => (
                  <tr key={r.size}>
                    <td className="py-2 pr-4 font-medium">{r.size}</td>
                    <td className="py-2 pr-4 text-slate-600">{r.labels[region]}</td>
                    <td className="py-2 pr-4 text-slate-600">{r.chestIn}</td>
                    <td className="py-2 text-slate-600">{r.waistIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Measurements are body measurements. If between sizes, we recommend
            sizing up.
          </p>
        </div>
      )}
    </div>
  );
}
