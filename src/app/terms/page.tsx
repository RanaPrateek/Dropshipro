import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata = { title: "Terms & Conditions — Nuvo" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms &amp; Conditions" updated="November 2025">
      <p>
        These Terms &amp; Conditions govern your use of the Nuvo website and your
        purchases from us. Please read them carefully before placing an order.
      </p>

      <LegalSection heading="Orders">
        <p>
          When you place an order you make an offer to buy the items in your
          basket. We confirm your order by email. We may decline or cancel an
          order if an item is out of stock or priced incorrectly, in which case
          you will not be charged, or will be refunded.
        </p>
      </LegalSection>

      <LegalSection heading="Pricing">
        <p>
          Prices are shown in your local currency and include any applicable
          taxes unless stated otherwise. Shipping fees, where they apply, are
          shown at checkout before you pay.
        </p>
      </LegalSection>

      <LegalSection heading="Shipping &amp; delivery">
        <p>
          Estimated delivery windows are shown on each product and at checkout.
          These are estimates, not guarantees; occasional delays outside our
          control can happen.
        </p>
      </LegalSection>

      <LegalSection heading="Returns &amp; refunds">
        <p>
          You may return most items within 30 days of delivery for a refund,
          provided they are unused and in their original condition. Some items
          (such as personalised goods) may not be eligible. Refunds are issued to
          your original payment method.
        </p>
      </LegalSection>

      <LegalSection heading="Your account">
        <p>
          You are responsible for keeping your account password secure and for
          activity that happens under your account.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          We may update these terms from time to time. The version shown here is
          the one that applies to your use of the site today.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
