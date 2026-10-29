// Email sending with a safe fallback: if RESEND_API_KEY isn't set, emails are
// logged to the server console instead of sent, so the app works in dev.
// Add a free key from https://resend.com to send real emails.

type SendArgs = { to: string; subject: string; html: string };

export async function sendEmail({ to, subject, html }: SendArgs): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Nuvo <onboarding@resend.dev>";

  if (!key) {
    console.log(
      `[email:fallback] Would send to ${to}\nSubject: ${subject}\n(Set RESEND_API_KEY to send real emails.)`,
    );
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error("[email] Resend error", res.status, await res.text());
    }
  } catch (e) {
    console.error("[email] send failed", e);
  }
}

const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function layout(inner: string): string {
  return `<div style="font-family:system-ui,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
    <div style="font-size:22px;font-weight:800;color:#4f46e5;padding:16px 0">nuvo</div>
    ${inner}
    <p style="color:#94a3b8;font-size:12px;margin-top:24px">Nuvo · Curated clothing &amp; electronics</p>
  </div>`;
}

export function orderConfirmationEmail(order: {
  orderNumber: string;
  email: string;
}): { subject: string; html: string } {
  return {
    subject: `Your Nuvo order ${order.orderNumber} is confirmed`,
    html: layout(`
      <h1 style="font-size:20px">Thanks for your order! 🎉</h1>
      <p>We've received your order <strong>${order.orderNumber}</strong> and are getting it ready.</p>
      <p>You can track it anytime:</p>
      <p><a href="${siteUrl()}/track?order=${order.orderNumber}" style="background:#4f46e5;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;display:inline-block">Track my order</a></p>
      <p style="color:#64748b">You'll get another email with tracking details once it ships.</p>
    `),
  };
}

export function deliveredReviewEmail(order: {
  orderNumber: string;
  items: { title: string; slug: string | null }[];
}): { subject: string; html: string } {
  const first = order.items[0];
  const reviewUrl =
    first?.slug
      ? `${siteUrl()}/products/${first.slug}?review=${order.orderNumber}#reviews`
      : `${siteUrl()}/track?order=${order.orderNumber}`;
  return {
    subject: `Your Nuvo order was delivered — how did we do?`,
    html: layout(`
      <h1 style="font-size:20px">Your order was delivered 📦</h1>
      <p>We hope you love it! Your order <strong>${order.orderNumber}</strong> has been marked as delivered.</p>
      <p>Mind leaving a quick review? It really helps.</p>
      <p><a href="${reviewUrl}" style="background:#4f46e5;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;display:inline-block">Leave a review</a></p>
    `),
  };
}
