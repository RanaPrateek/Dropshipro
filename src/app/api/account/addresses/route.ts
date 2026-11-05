import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { parseAddress } from "@/lib/address";

// List the signed-in customer's saved addresses.
export async function GET() {
  const current = await getCurrentCustomer();
  if (!current) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const addresses = await prisma.address.findMany({
    where: { customerId: current.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ addresses });
}

// Add a new address. First address (or isDefault) becomes the default.
export async function POST(req: Request) {
  const current = await getCurrentCustomer();
  if (!current) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data, error } = parseAddress(await req.json().catch(() => null));
  if (error || !data) {
    return NextResponse.json({ error: error ?? "Invalid address." }, { status: 400 });
  }

  const existingCount = await prisma.address.count({
    where: { customerId: current.id },
  });
  const makeDefault = data.isDefault || existingCount === 0;

  if (makeDefault) {
    await prisma.address.updateMany({
      where: { customerId: current.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      customerId: current.id,
      label: data.label,
      fullName: data.fullName,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      isDefault: makeDefault,
    },
  });

  return NextResponse.json({ ok: true, address });
}
