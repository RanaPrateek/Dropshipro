import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { parseAddress } from "@/lib/address";

// Update an existing address (also handles "set as default").
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const current = await getCurrentCustomer();
  if (!current) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const owned = await prisma.address.findFirst({
    where: { id: params.id, customerId: current.id },
  });
  if (!owned) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  const { data, error } = parseAddress(await req.json().catch(() => null));
  if (error || !data) {
    return NextResponse.json({ error: error ?? "Invalid address." }, { status: 400 });
  }

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { customerId: current.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.update({
    where: { id: params.id },
    data: {
      label: data.label,
      fullName: data.fullName,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      // Keep default unless explicitly set; never silently un-default here.
      isDefault: data.isDefault || owned.isDefault,
    },
  });

  return NextResponse.json({ ok: true, address });
}

// Delete an address. If it was the default, promote the newest remaining one.
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const current = await getCurrentCustomer();
  if (!current) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const owned = await prisma.address.findFirst({
    where: { id: params.id, customerId: current.id },
  });
  if (!owned) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  await prisma.address.delete({ where: { id: params.id } });

  if (owned.isDefault) {
    const next = await prisma.address.findFirst({
      where: { customerId: current.id },
      orderBy: { createdAt: "desc" },
    });
    if (next) {
      await prisma.address.update({
        where: { id: next.id },
        data: { isDefault: true },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
