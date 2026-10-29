"use client";

import { useState } from "react";
import {
  CLOTHING_SIZE_CHART,
  REGIONS,
  columnsFor,
  type Region,
  type GarmentType,
} from "@/lib/sizeChart";

export default function SizeGuide({
  sizes,
  garment = "top",
}: {
  sizes: string[];
  garment?: GarmentType;
}) {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState<Region>("US");

  const rows = sizes.length
    ? CLOTHING_SIZE_CHART.filter((r) =>
        sizes.map((s) => s.toUpperCase()).includes(r.size),
      )
    : CLOTHING_SIZE_CHART;
  const chart = rows.length ? rows : CLOTHING_SIZE_CHART;
  const cols = columnsFor(garment);

  const label =
    garment === "bottom"
      ? "Bottoms size guide"
      : garment === "dress"
        ? "Dress size guide"
        : "Size guide";

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-200"
      >
        {open ? "Hide size guide" : label}
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Region:</span>
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  region === r
                    ? "bg-brand-600 text-white"
                    : "border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500 dark:text-slate-400">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2 pr-4 font-medium">Size</th>
                  <th className="py-2 pr-4 font-medium">{region} size</th>
                  {cols.map((c) => (
                    <th key={c.key} className="py-2 pr-4 font-medium">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {chart.map((r) => (
                  <tr key={r.size}>
                    <td className="py-2 pr-4 font-medium">{r.size}</td>
                    <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">
                      {r.labels[region]}
                    </td>
                    {cols.map((c) => (
                      <td
                        key={c.key}
                        className="py-2 pr-4 text-slate-600 dark:text-slate-300"
                      >
                        {r[c.key] as string}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Body measurements. If between sizes, we recommend sizing up.
          </p>
        </div>
      )}
    </div>
  );
}
