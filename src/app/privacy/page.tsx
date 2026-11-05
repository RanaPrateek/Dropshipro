import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy — Nuvo" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 2025">
      <p>
        This Privacy Policy explains how Nuvo (&quot;we&quot;, &quot;us&quot;)
        collects, uses, and protects your personal information when you shop with
        us. By using the site you agree to the practices described here.
      </p>

      <LegalSection heading="Information we collect">
        <p>
          We collect the details you give us when you create an account or place
          an order: your name, email address, phone number, shipping address, and
          order history. We also collect basic technical data such as your device
          type and the pages you visit, to keep the site working and secure.
        </p>
      </LegalSection>

      <LegalSection heading="How we use your information">
        <p>We use your information to:</p>
        <ul className="list-disc pl-5">
          <li>process and deliver your orders;</li>
          <li>send order confirmations and delivery updates;</li>
          <li>respond to your questions and support requests;</li>
          <li>improve our products and your shopping experience.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Payments">
        <p>
          Card payments are handled by our payment processor. We never see or
          store your full card details on our own servers.
        </p>
      </LegalSection>

      <LegalSection heading="Sharing your information">
        <p>
          We share only what is needed to fulfil your order — for example, your
          shipping address with the carrier that delivers your parcel. We do not
          sell your personal information to anyone.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          You can view and update your details at any time from your account. You
          may also ask us to delete your account and associated data by
          contacting us.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about your privacy? Email us at{" "}
          <a href="mailto:privacy@nuvo.store" className="text-brand-600 hover:underline">
            privacy@nuvo.store
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
