import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CUSTOMER_COOKIE,
  createSessionToken,
  hashPassword,
} from "@/lib/customerAuth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const name = String(body?.name ?? "").trim();
  const password = String(body?.password ?? "");
  const agreedToTerms = body?.agreedToTerms === true;

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }
  if (!agreedToTerms) {
    return NextResponse.json(
      { error: "Please accept the Terms & Conditions to create an account." },
      { status: 400 },
    );
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing?.passwordHash) {
    return NextResponse.json(
      { error: "An account with this email already exists. Please sign in." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const now = new Date();
  const customer = existing
    ? await prisma.customer.update({
        where: { id: existing.id },
        data: { passwordHash, name: name || existing.name, termsAcceptedAt: now },
      })
    : await prisma.customer.create({
        data: { email, name: name || null, passwordHash, termsAcceptedAt: now },
      });

  const res = NextResponse.json({
    ok: true,
    customer: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      username: customer.username,
      image: customer.image,
      phone: customer.phone,
    },
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
