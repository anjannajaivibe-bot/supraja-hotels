import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Supraja Hotels regarding guest information and website usage.",
  alternates: { canonical: "/privacy-policy" }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container-custom px-4 py-16 lg:py-20">
      <h1 className="text-4xl font-semibold">
        Privacy Policy
      </h1>

      <div className="mt-8 space-y-6 text-slate-600 leading-8">
        <p>
          Supraja Hotels respects the privacy of all guests and website
          visitors.
        </p>

        <p>
          Information submitted through booking enquiries, contact forms,
          telephone calls and WhatsApp messages may be used solely for
          reservation management, guest communication and service improvement.
        </p>

        <p>
          We use analytics and first-party website activity tracking to
          understand page visits, traffic sources, device categories and
          interactions such as call or WhatsApp button clicks. A random browser
          identifier may be stored locally to distinguish visits and sessions.
          Our website activity dashboard does not store raw IP addresses.
        </p>

        <p>
          Personal information will not be sold, rented or shared with
          third parties except where required by law.
        </p>

        <p>
          We implement reasonable measures to protect guest information from
          unauthorized access and misuse.
        </p>

        <p>
          By using this website, you agree to the terms outlined in this
          Privacy Policy.
        </p>
      </div>
    </main>
  );
}
