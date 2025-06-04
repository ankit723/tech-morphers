import type { Metadata } from 'next'
import Navbar from '@/app/components/home/navbar'
import Footer from '@/app/components/home/footer'

export const metadata: Metadata = {
  title: 'Mobile App Development Services | Tech Morphers',
  description: 'Native and cross-platform mobile app development for iOS and Android. Build high-performance, user-friendly mobile apps with Tech Morphers.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Mobile App Development Services | Tech Morphers',
    description: 'Native and cross-platform mobile app development for iOS and Android. Build high-performance, user-friendly mobile apps with Tech Morphers.',
    images: '/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile App Development Services | Tech Morphers',
    description: 'Native and cross-platform mobile app development for iOS and Android. Build high-performance, user-friendly mobile apps with Tech Morphers.',
    images: '/logo.png',
  },
  alternates: {
    canonical: 'https://www.techmorphers.com/services/mobile',
  },
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D1F]">
      <Navbar />
      {children}
      <div className="relative mt-[50rem]">
        <Footer />
      </div>
    </div>
  )
} 