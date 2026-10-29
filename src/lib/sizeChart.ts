// Standard clothing size chart with regional labels and body measurements.
// Columns shown depend on the garment type (tops vs bottoms vs dresses).

export type Region = "US" | "UK" | "EU";

export const REGIONS: Region[] = ["US", "UK", "EU"];

export type SizeRow = {
  size: string; // generic label (S, M, L…)
  labels: Record<Region, string>;
  chestIn: string; // bust/chest
  waistIn: string;
  hipIn: string;
  inseamIn: string;
};

export const CLOTHING_SIZE_CHART: SizeRow[] = [
  { size: "XS", labels: { US: "0–2", UK: "4–6", EU: "32–34" }, chestIn: "31–33", waistIn: "24–26", hipIn: "34–36", inseamIn: "30" },
  { size: "S", labels: { US: "4–6", UK: "8–10", EU: "36–38" }, chestIn: "34–36", waistIn: "27–29", hipIn: "37–39", inseamIn: "30.5" },
  { size: "M", labels: { US: "8–10", UK: "12–14", EU: "40–42" }, chestIn: "37–39", waistIn: "30–32", hipIn: "40–42", inseamIn: "31" },
  { size: "L", labels: { US: "12–14", UK: "16–18", EU: "44–46" }, chestIn: "40–42", waistIn: "33–35", hipIn: "43–45", inseamIn: "31.5" },
  { size: "XL", labels: { US: "16–18", UK: "20–22", EU: "48–50" }, chestIn: "43–45", waistIn: "36–38", hipIn: "46–48", inseamIn: "32" },
  { size: "XXL", labels: { US: "20–22", UK: "24–26", EU: "52–54" }, chestIn: "46–48", waistIn: "39–41", hipIn: "49–51", inseamIn: "32.5" },
];

export type GarmentType = "top" | "bottom" | "dress" | "generic";

/** Which measurement columns to show for each garment type. */
export function columnsFor(
  garment: GarmentType,
): { key: keyof SizeRow; label: string }[] {
  switch (garment) {
    case "bottom":
      return [
        { key: "waistIn", label: "Waist (in)" },
        { key: "hipIn", label: "Hip (in)" },
        { key: "inseamIn", label: "Inseam (in)" },
      ];
    case "dress":
      return [
        { key: "chestIn", label: "Bust (in)" },
        { key: "waistIn", label: "Waist (in)" },
        { key: "hipIn", label: "Hip (in)" },
      ];
    case "top":
      return [
        { key: "chestIn", label: "Chest (in)" },
        { key: "waistIn", label: "Waist (in)" },
      ];
    default:
      return [
        { key: "chestIn", label: "Chest (in)" },
        { key: "waistIn", label: "Waist (in)" },
      ];
  }
}
