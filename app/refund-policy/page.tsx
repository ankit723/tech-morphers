// pages/refund-policy.tsx
import Head from 'next/head';

export default function RefundPolicyPage() {
  return (
    <>
      <Head>
        <title>Refund Policy | Tech Morphers</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] dark:from-[#1e293b] dark:to-[#0f172a] text-gray-800 dark:text-gray-100 py-16 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Refund Policy</h1>
          <p className="mb-6 text-sm text-gray-500">Effective from: June 25, 2025</p>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              At Tech Morphers, customer satisfaction is our top priority. We provide a transparent refund policy as outlined below.
            </p>

            <h2 className="text-lg font-semibold mt-4">Eligibility for Refund</h2>
            <ul className="list-disc pl-5">
              <li>If the service was not delivered as promised.</li>
              <li>If cancellation is requested within 3 days of payment and no work has begun.</li>
              <li>If technical issues prevent us from fulfilling your order.</li>
            </ul>

            <h2 className="text-lg font-semibold mt-4">Non-Refundable Cases</h2>
            <ul className="list-disc pl-5">
              <li>If the service has already been initiated or partially delivered.</li>
              <li>Change of mind after project initiation.</li>
              <li>Failure to provide necessary inputs within deadlines.</li>
            </ul>

            <h2 className="text-lg font-semibold mt-4">Refund Process</h2>
            <p>
              Approved refunds will be processed within 7–10 business days back to your original method of payment.
            </p>

            <h2 className="text-lg font-semibold mt-4">Need Help?</h2>
            <p>
              For refund-related questions, contact us at <a href="mailto:support@techmorphers.com" className="text-blue-500 underline">support@techmorphers.com</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
