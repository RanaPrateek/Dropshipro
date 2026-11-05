import { NextResponse } from "next/server";
import { NOMINATIM, GEO_USER_AGENT, toGeoResult } from "@/lib/geo";

export const dynamic = "force-dynamic";

// Address autocomplete: GET /api/geo/search?q=...
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) return NextResponse.json({ results: [] });

  const url =
    `${NOMINATIM}/search?format=jsonv2&addressdetails=1&limit=6&` +
    `q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": GEO_USER_AGENT, "Accept-Language": "en" },
      // Cache identical lookups briefly to be kind to the free service.
      next: { revalidate: 86400 },
    });
    if (!res.ok) return NextResponse.json({ results: [] });
    const data = (await res.json()) as unknown[];
    const results = Array.isArray(data) ? data.map((d) => toGeoResult(d as never)) : [];
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
