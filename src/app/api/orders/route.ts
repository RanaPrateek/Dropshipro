import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { createOrder } from "@/lib/orders";
import { sendEmail, orderConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  let order;
  try {
    order = await createOrder({
      email,
      name: body.name,
      line1: body.line1,
      line2: body.line2,
      city: body.city,
      state: body.state,
      zip: body.zip,
      country: body.country,
      items,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not create the order. Please try again." },
      { status: 400 },
    );
  }

  // Send the confirmation email (logged to console if no email provider set).
  const mail = orderConfirmationEmail(order);
  await sendEmail({ to: order.email, subject: mail.subject, html: mail.html });

  // If Stripe is configured, create a payment session and return its URL.
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const stripeConfigured =
    !!secretKey && secretKey.startsWith("sk_") && !secretKey.includes("...");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (stripeConfigured) {
    try {
      const stripe = new Stripe(secretKey as string);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: order.items.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency: order.currency,
            unit_amount: i.priceCents,
            product_data: { name: i.title },
          },
        })),
        customer_email: order.email,
        success_url: `${siteUrl}/checkout/success?order=${order.orderNumber}`,
        cancel_url: `${siteUrl}/cart`,
        metadata: { orderNumber: order.orderNumber },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
      });
      return NextResponse.json({
        ok: true,
        orderNumber: order.orderNumber,
        email: order.email,
        stripeUrl: session.url,
      });
    } catch {
      // fall through to no-payment confirmation
    }
  }

  return NextResponse.json({
    ok: true,
    orderNumber: order.orderNumber,
    email: order.email,
  });
}
