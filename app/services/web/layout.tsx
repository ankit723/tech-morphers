import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Development Services | Tech Morphers',
  description: 'Expert web development services including custom web apps, e-commerce, PWAs, and API integration. Elevate your business with modern, scalable web solutions from Tech Morphers.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Web Development Services | Tech Morphers',
    description: 'Expert web development services including custom web apps, e-commerce, PWAs, and API integration. Elevate your business with modern, scalable web solutions from Tech Morphers.',
    images: '/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Development Services | Tech Morphers',
    description: 'Expert web development services including custom web apps, e-commerce, PWAs, and API integration. Elevate your business with modern, scalable web solutions from Tech Morphers.',
    images: '/logo.png',
  },
  alternates: {
    canonical: 'https://www.techmorphers.com/services/web',
  },
}

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white dark:bg-[#0D0D1F]">{children}</div>
} 