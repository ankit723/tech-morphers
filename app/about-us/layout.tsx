import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Tech Morphers',
  description: 'About Us',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'About Us | Tech Morphers',
    description: 'About Us',
    images: '/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Tech Morphers',
    description: 'About Us',
    images: '/logo.png',
  },
  alternates: {
    canonical: 'https://www.techmorphers.com/about-us',
  },
}

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <>
    {children}
  </>
}