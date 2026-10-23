// Standard clothing size chart with regional labels and body measurements.
// Used by the size guide on clothing product pages.

export type Region = "US" | "UK" | "EU";

export const REGIONS: Region[] = ["US", "UK", "EU"];

export type SizeRow = {
  size: string; // generic label (S, M, L…)
  labels: Record<Region, string>; // regional numeric label
  chestIn: string; // body measurements
  waistIn: string;
};

export const CLOTHING_SIZE_CHART: SizeRow[] = [
  { size: "XS", labels: { US: "0–2", UK: "4–6", EU: "32–34" }, chestIn: "31–33", waistIn: "24–26" },
  { size: "S", labels: { US: "4–6", UK: "8–10", EU: "36–38" }, chestIn: "34–36", waistIn: "27–29" },
  { size: "M", labels: { US: "8–10", UK: "12–14", EU: "40–42" }, chestIn: "37–39", waistIn: "30–32" },
  { size: "L", labels: { US: "12–14", UK: "16–18", EU: "44–46" }, chestIn: "40–42", waistIn: "33–35" },
  { size: "XL", labels: { US: "16–18", UK: "20–22", EU: "48–50" }, chestIn: "43–45", waistIn: "36–38" },
  { size: "XXL", labels: { US: "20–22", UK: "24–26", EU: "52–54" }, chestIn: "46–48", waistIn: "39–41" },
];
