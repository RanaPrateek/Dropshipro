import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CUSTOMER_COOKIE,
  createSessionToken,
  verifyPassword,
} from "@/lib/customerAuth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !customer.passwordHash) {
    return NextResponse.json(
      { error: "No account found with that email. Try registering." },
      { status: 401 },
    );
  }
  const ok = await verifyPassword(password, customer.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({
    ok: true,
    customer: { id: customer.id, email: customer.email, name: customer.name },
  });
  res.cookies.set(CUSTOMER_COOKIE, createSessionToken(customer.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
