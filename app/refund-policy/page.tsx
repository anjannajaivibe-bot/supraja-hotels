import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Refund and cancellation policy for direct bookings at Supraja Hotels.",
};

export default function RefundPolicyPage() {
  return (
    <main className="container-custom px-4 py-16">
      <h1 className="text-4xl font-semibold">
        Refund Policy
      </h1>

      <div className="mt-8 space-y-6 text-slate-600 leading-8">
        <p>
          Cancellation and refund eligibility depend on the booking channel,
          tariff conditions and timing of cancellation.
        </p>

        <p>
          For direct bookings, eligible refunds will be processed after
          verification and approval.
        </p>

        <p>
          Refund timelines may vary depending on payment method and banking
          procedures.
        </p>

        <p>
          Non-refundable promotional bookings may not qualify for refunds.
        </p>

        <p>
          Guests are encouraged to contact the hotel directly regarding any
          refund or cancellation enquiries.
        </p>
      </div>
    </main>
  );
}
