// pages/cancellation-policy.tsx
import Head from 'next/head';

export default function CancellationPolicyPage() {
  return (
    <>
      <Head>
        <title>Cancellation Policy | Tech Morphers</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#fdfdfd] to-[#f3f4f6] dark:from-[#0f172a] dark:to-[#1e293b] text-gray-800 dark:text-gray-100 py-16 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Cancellation Policy</h1>
          <p className="mb-6 text-sm text-gray-500">Effective from: June 25, 2025</p>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              We understand plans change. Here’s how cancellation works at Tech Morphers.
            </p>

            <h2 className="text-lg font-semibold mt-4">How to Cancel</h2>
            <p>
              You can cancel your order by contacting us at <a href="mailto:support@techmorphers.com" className="text-blue-500 underline">support@techmorphers.com</a> within 72 hours of placing your order.
            </p>

            <h2 className="text-lg font-semibold mt-4">Cancellation Charges</h2>
            <p>
              If project work has already started, a deduction will be made based on effort invested.
            </p>

            <h2 className="text-lg font-semibold mt-4">Auto-Cancellation</h2>
            <p>
              Orders may be auto-cancelled if project inputs aren’t received within 7 days of confirmation.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
