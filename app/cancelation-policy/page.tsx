import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy - Tech Morphers",
  description: "Cancellation Policy for Tech Morphers - Learn how we handle cancellations for our services.",
  keywords: ["cancellation policy", "Tech Morphers cancellation", "cancellation policy"],
  robots: {
    index: true,
    follow: true,
  },
};

export default function CancellationPolicyPage() {
  return (
    <>
        <div className="min-h-screen bg-gradient-to-b dark:from-[#0A0A1B] dark:to-[#1A1A35] from-white to-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Cancellation Policy</h1>
          <p className="mb-6 text-sm text-gray-500">Effective from: June 25, 2025</p>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              We understand that project requirements can change unexpectedly. However, to maintain operational efficiency, we follow the cancellation policy outlined below.
            </p>

            <h2 className="text-lg font-semibold mt-4">Cancellation Window</h2>
            <p>
              Cancellations are only accepted within 24 hours of the project confirmation and payment.
            </p>

            <h2 className="text-lg font-semibold mt-4">Cancellation Charges</h2>
            <p>
              If cancellation is approved, only 25% of the project fee will be refunded. This amount accounts for consultation, administrative, and resource blocking costs already incurred.
            </p>

            <h2 className="text-lg font-semibold mt-4">How to Cancel</h2>
            <p>
              To request a cancellation, please contact us at <a href="mailto:support@techmorphers.com" className="text-blue-500 underline">support@techmorphers.com</a> within 24 hours of payment.
            </p>

            <h2 className="text-lg font-semibold mt-4">After 24 Hours</h2>
            <p>
              Cancellations will not be accepted after 24 hours under any circumstances, as work and planning would have already begun.
            </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
