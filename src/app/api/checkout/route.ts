import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductsByIds } from "@/lib/products";

type IncomingItem = { id: string; quantity: number };

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Graceful fallback when Stripe isn't configured yet (dev / MVP).
  if (!secretKey) {
    return NextResponse.json({
      message:
        "Stripe isn't configured yet. Add STRIPE_SECRET_KEY to your .env to enable live payments. (The storefront and cart are fully working.)",
    });
  }

  let body: { items?: IncomingItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const incoming = body.items ?? [];
  if (incoming.length === 0) {
    return NextResponse.json({ message: "Cart is empty." }, { status: 400 });
  }

  // IMPORTANT: look up prices server-side from the database — never trust
  // prices sent by the client.
  const dbProducts = await getProductsByIds(incoming.map((i) => i.id));
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const item of incoming) {
    const product = dbProducts.find((p) => p.id === item.id);
    const qty = Math.max(1, Math.floor(item.quantity));
    if (!product) continue;
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: product.currency,
        unit_amount: product.priceCents,
        product_data: { name: product.title },
      },
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { message: "No valid items in cart." },
      { status: 400 },
    );
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/cart`,
  });

  return NextResponse.json({ url: session.url });
}
