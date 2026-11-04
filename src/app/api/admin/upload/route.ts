import { NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/upload";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const result = await saveUploadedImage(form?.get("file"));
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ path: result.path });
}
