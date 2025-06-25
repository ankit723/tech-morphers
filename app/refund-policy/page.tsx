import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - Tech Morphers",
  description: "Refund Policy for Tech Morphers - Learn how we handle refunds for our services.",
  keywords: ["refund policy", "Tech Morphers refund", "refund policy"],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b dark:from-[#0A0A1B] dark:to-[#1A1A35] from-white to-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Refund Policy</h1>
          <p className="mb-6 text-sm text-gray-500">Effective from: June 25, 2025</p>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              At Tech Morphers, we strive to deliver high-quality services tailored to your specific project needs. As a service-based company, our work begins shortly after project confirmation, which makes refunds generally non-applicable.
            </p>

            <h2 className="text-lg font-semibold mt-4">No Refunds Policy</h2>
            <p>
              We do not provide refunds once a project has been initiated or resources have been allocated. This policy is in place to protect the time, effort, and custom development invested by our team.
            </p>

            <h2 className="text-lg font-semibold mt-4">Exceptional Cases</h2>
            <p>
              Refunds may only be considered if:
            </p>
            <ul className="list-disc pl-5">
              <li>No work has commenced within 24 hours of payment AND</li>
              <li>You request cancellation within that timeframe AND</li>
              <li>No resources or time were allocated to the project</li>
            </ul>

            <h2 className="text-lg font-semibold mt-4">Questions?</h2>
            <p>
              For clarifications, please email us at <a href="mailto:support@techmorphers.com" className="text-blue-500 underline">support@techmorphers.com</a>
            </p>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
