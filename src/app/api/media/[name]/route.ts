import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

// Serves uploaded files from public/uploads. Using a route handler (instead of
// relying on static serving) means files uploaded at runtime are served
// immediately, in both `next dev` and `next start`.
export async function GET(
  _req: Request,
  { params }: { params: { name: string } },
) {
  const name = params.name;
  if (!/^[A-Za-z0-9._-]+$/.test(name) || name.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const type = TYPES[ext];
  if (!type) return new NextResponse("Not found", { status: 404 });

  try {
    const file = await readFile(
      path.join(process.cwd(), "public", "uploads", name),
    );
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
