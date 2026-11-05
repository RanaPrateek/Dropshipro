import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata = { title: "Cookie Policy — Nuvo" };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="November 2025">
      <p>
        This Cookie Policy explains how Nuvo uses cookies and similar
        technologies when you visit our site.
      </p>

      <LegalSection heading="What cookies are">
        <p>
          Cookies are small text files stored on your device. They let a website
          remember your actions and preferences over time.
        </p>
      </LegalSection>

      <LegalSection heading="How we use cookies">
        <ul className="list-disc pl-5">
          <li>
            <strong>Essential cookies</strong> keep you signed in and remember the
            items in your basket. The site cannot work properly without these.
          </li>
          <li>
            <strong>Preference cookies</strong> remember choices such as your
            currency and light or dark theme.
          </li>
          <li>
            <strong>Analytics cookies</strong> help us understand how the site is
            used so we can improve it. These are optional.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Managing cookies">
        <p>
          You can control or delete cookies through your browser settings.
          Blocking essential cookies may stop parts of the site, such as signing
          in or checking out, from working.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about our use of cookies? Email{" "}
          <a href="mailto:privacy@nuvo.store" className="text-brand-600 hover:underline">
            privacy@nuvo.store
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
