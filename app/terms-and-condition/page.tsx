// pages/terms.tsx (or app/terms/page.tsx for App Router)
import Head from 'next/head';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms & Conditions | Tech Morphers</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#e5e7eb] dark:from-[#0f172a] dark:to-[#1e293b] text-gray-800 dark:text-gray-100 py-16 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Terms & Conditions</h1>
          <p className="mb-6 text-sm text-gray-500">Last updated: June 25, 2025</p>

          <div className="space-y-6 text-sm sm:text-base leading-relaxed">
            <p>
              Welcome to Tech Morphers. By accessing or using our services, you agree to be bound by these Terms and Conditions.
            </p>

            <h2 className="text-lg font-semibold mt-4">1. Use of Services</h2>
            <p>
              You agree to use our platform only for lawful purposes. Any misuse or unauthorized access is prohibited.
            </p>

            <h2 className="text-lg font-semibold mt-4">2. Intellectual Property</h2>
            <p>
              All content, branding, and design on this site belong to Tech Morphers and may not be reused without written permission.
            </p>

            <h2 className="text-lg font-semibold mt-4">3. Payments & Subscriptions</h2>
            <p>
              All pricing and subscriptions are subject to change. You will be notified before any major changes are applied.
            </p>

            <h2 className="text-lg font-semibold mt-4">4. Termination</h2>
            <p>
              We reserve the right to terminate access to our services for any violation of these terms.
            </p>

            <h2 className="text-lg font-semibold mt-4">5. Changes to Terms</h2>
            <p>
              We may update these terms periodically. Continued use of the platform signifies your acceptance of those changes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
