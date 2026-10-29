import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const CUSTOMER_COOKIE = "nuvo_customer";

function secret(): string {
  return process.env.AUTH_SECRET || "dev-auth-secret-change-me";
}

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

/** Create a signed session token for a customer id. */
export function createSessionToken(customerId: string): string {
  const sig = createHmac("sha256", secret()).update(customerId).digest("hex");
  return `${customerId}.${sig}`;
}

export function verifySessionToken(token: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const id = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = createHmac("sha256", secret()).update(id).digest("hex");
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return id;
}

export type SessionCustomer = {
  id: string;
  email: string;
  name: string | null;
};

/** Read the logged-in customer from the session cookie (server-side). */
export async function getCurrentCustomer(): Promise<SessionCustomer | null> {
  const token = cookies().get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  const id = verifySessionToken(token);
  if (!id) return null;
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: { id: true, email: true, name: true },
  });
  return customer;
}
