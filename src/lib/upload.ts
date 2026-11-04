import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Save an uploaded image and return the URL to reference it by.
 * - In production (BLOB_READ_WRITE_TOKEN set), uploads to Vercel Blob storage.
 * - Locally, writes to public/uploads and returns a /uploads/... path.
 */
export async function saveUploadedImage(
  value: unknown,
  prefix = "",
): Promise<{ path?: string; error?: string }> {
  if (!(value instanceof File)) return { error: "No file uploaded" };
  const ext = ALLOWED[value.type];
  if (!ext) {
    return { error: "Only JPG, PNG, WebP, or GIF images are allowed." };
  }
  if (value.size > MAX_BYTES) {
    return { error: "Image must be 5 MB or smaller." };
  }

  const filename = `${prefix}${randomUUID()}.${ext}`;

  // Cloud storage (Vercel Blob) when configured.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { url } = await put(`uploads/${filename}`, value, {
      access: "public",
      contentType: value.type,
    });
    return { path: url };
  }

  // Local filesystem fallback (development).
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await value.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);
  return { path: `/uploads/${filename}` };
}
