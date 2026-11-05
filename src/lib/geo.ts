// Helpers for address lookup via OpenStreetMap's Nominatim service (free, no
// API key). We proxy requests server-side so we can send a proper User-Agent
// (Nominatim requires one) and keep the shape simple for the client.

export const NOMINATIM = "https://nominatim.openstreetmap.org";
// Nominatim asks every app to identify itself. Generic app name, no PII.
export const GEO_USER_AGENT = "NuvoStore/1.0 (checkout address lookup)";

export type GeoResult = {
  label: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat: string;
  lon: string;
};

type NominatimAddress = {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
};

type NominatimItem = {
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: NominatimAddress;
};

/** Map a raw Nominatim result into our simplified GeoResult. */
export function toGeoResult(item: NominatimItem): GeoResult {
  const a = item.address ?? {};
  const line1 = [a.house_number, a.road || a.pedestrian || a.neighbourhood]
    .filter(Boolean)
    .join(" ");
  const city =
    a.city || a.town || a.village || a.municipality || a.suburb || a.county || "";
  return {
    label: item.display_name ?? "",
    line1,
    city,
    state: a.state ?? "",
    zip: a.postcode ?? "",
    country: a.country ?? "",
    lat: item.lat ?? "",
    lon: item.lon ?? "",
  };
}
