import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and conditions governing bookings and stays at Supraja Hotels.",
  alternates: { canonical: "/terms-and-conditions" }
};

export default function TermsPage() {
  return (
    <main className="container-custom px-4 py-16 lg:py-20">
      <h1 className="text-4xl font-semibold">
        Terms and Conditions
      </h1>

      <div className="mt-8 space-y-6 text-slate-600 leading-8">
        <p>
          Guests are required to provide valid government-issued photo
          identification during check-in.
        </p>

        <p>
          Room availability and tariffs are subject to change without prior
          notice.
        </p>

        <p>
          Guests are responsible for maintaining decorum and complying with
          applicable hotel policies.
        </p>

        <p>
          Supraja Hotels reserves the right to refuse service in situations
          involving misconduct, policy violations or unlawful activities.
        </p>

        <p>
          Additional terms may apply to group bookings, promotional offers
          and special packages.
        </p>
      </div>
    </main>
  );
}
