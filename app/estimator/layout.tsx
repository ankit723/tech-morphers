import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Cost Estimator | Tech Morphers',
  description: 'Get an instant estimate for your tech project. Our AI-powered estimator helps you understand the costs involved in building your digital solution.',
  openGraph: {
    title: 'Project Cost Estimator | Tech Morphers',
    description: 'Get an instant estimate for your tech project. Our AI-powered estimator helps you understand the costs involved in building your digital solution.',
    url: 'https://www.techmorphers.com/estimator',
    siteName: 'Tech Morphers',
    images: [
      {
        url: 'https://www.techmorphers.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Cost Estimator | Tech Morphers',
    description: 'Get an instant estimate for your tech project. Our AI-powered estimator helps you understand the costs involved in building your digital solution.',
    images: ['https://www.techmorphers.com/og-image.jpg'],
  },
};

export default function EstimatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
