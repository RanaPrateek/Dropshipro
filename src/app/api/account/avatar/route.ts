import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { saveUploadedImage } from "@/lib/upload";

// Upload (or replace) the signed-in customer's profile picture.
export async function POST(req: Request) {
  const current = await getCurrentCustomer();
  if (!current) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const result = await saveUploadedImage(form?.get("file"), "avatar-");
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const customer = await prisma.customer.update({
    where: { id: current.id },
    data: { image: result.path },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      image: true,
      phone: true,
    },
  });

  return NextResponse.json({ ok: true, customer });
}
