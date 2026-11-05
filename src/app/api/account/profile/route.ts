import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customerAuth";

// Update the signed-in customer's profile (name, username, phone).
export async function PATCH(req: Request) {
  const current = await getCurrentCustomer();
  if (!current) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const data: { name?: string | null; username?: string | null; phone?: string | null } = {};

  if (body?.name !== undefined) {
    const name = String(body.name).trim();
    data.name = name || null;
  }

  if (body?.phone !== undefined) {
    const phone = String(body.phone).trim();
    data.phone = phone || null;
  }

  if (body?.username !== undefined) {
    const raw = String(body.username).trim().toLowerCase();
    if (raw) {
      if (!/^[a-z0-9_]{3,20}$/.test(raw)) {
        return NextResponse.json(
          { error: "Username must be 3–20 characters: letters, numbers or underscores." },
          { status: 400 },
        );
      }
      const taken = await prisma.customer.findUnique({ where: { username: raw } });
      if (taken && taken.id !== current.id) {
        return NextResponse.json(
          { error: "That username is already taken." },
          { status: 409 },
        );
      }
      data.username = raw;
    } else {
      data.username = null;
    }
  }

  const customer = await prisma.customer.update({
    where: { id: current.id },
    data,
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
