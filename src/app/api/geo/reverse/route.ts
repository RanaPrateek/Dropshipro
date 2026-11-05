import { NextResponse } from "next/server";
import { NOMINATIM, GEO_USER_AGENT, toGeoResult } from "@/lib/geo";

export const dynamic = "force-dynamic";

// Reverse geocode (used by "Use my location"): GET /api/geo/reverse?lat=&lon=
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const lat = params.get("lat");
  const lon = params.get("lon");
  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing coordinates." }, { status: 400 });
  }

  const url =
    `${NOMINATIM}/reverse?format=jsonv2&addressdetails=1&` +
    `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": GEO_USER_AGENT, "Accept-Language": "en" },
    });
    if (!res.ok) return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
    const data = await res.json();
    return NextResponse.json({ result: toGeoResult(data) });
  } catch {
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}
