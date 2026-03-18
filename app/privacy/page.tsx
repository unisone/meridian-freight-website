import { Breadcrumbs } from "@/components/breadcrumbs";
import { COMPANY, CONTACT, SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.domain}. How we collect, use, and protect your information.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
      </div>

      <article className="py-16 md:py-20">
        <div className="prose prose-slate mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: March 2026</p>

          <h2>Information We Collect</h2>
          <p>
            When you use our website or contact forms, we may collect the following information:
          </p>
          <ul>
            <li>Name, email address, phone number, and company name (when you submit a form)</li>
            <li>Equipment and shipping details you provide in quote requests</li>
            <li>Usage data collected through Google Analytics 4 and Vercel Analytics</li>
            <li>Cookies for analytics purposes (with your consent)</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To respond to your inquiries and provide quotes</li>
            <li>To send you relevant communications about your inquiry</li>
            <li>To improve our website and services through analytics</li>
            <li>To run targeted advertising campaigns (with consent)</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Google Analytics 4</strong> — website traffic analysis</li>
            <li><strong>Meta Pixel</strong> — advertising measurement (consent-gated)</li>
            <li><strong>Vercel Analytics</strong> — performance monitoring</li>
            <li><strong>Supabase</strong> — secure lead data storage</li>
            <li><strong>Resend</strong> — transactional email delivery</li>
          </ul>

          <h2>Data Retention</h2>
          <p>
            We retain your contact information for as long as necessary to
            fulfill the purpose for which it was collected, typically up to 3
            years after your last interaction.
          </p>

          <h2>Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data by contacting us at{" "}
            <a href={CONTACT.emailHref}>{CONTACT.email}</a>.
          </p>

          <h2>Contact</h2>
          <p>
            {COMPANY.name}<br />
            {CONTACT.address.full}<br />
            <a href={CONTACT.emailHref}>{CONTACT.email}</a>
          </p>
        </div>
      </article>
    </div>
  );
}
