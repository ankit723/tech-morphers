import type { Metadata } from 'next'
import Navbar from '@/app/components/home/navbar'
import Footer from '@/app/components/home/footer'

export const metadata: Metadata = {
  title: 'Game Development Services | Tech Morphers',
  description: 'Immersive game development services for PC, mobile, and console. Bring your game ideas to life with Tech Morphers.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Game Development Services | Tech Morphers',
    description: 'Immersive game development services for PC, mobile, and console. Bring your game ideas to life with Tech Morphers.',
    images: '/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Game Development Services | Tech Morphers',
    description: 'Immersive game development services for PC, mobile, and console. Bring your game ideas to life with Tech Morphers.',
    images: '/logo.png',
  },
  alternates: {
    canonical: 'https://www.techmorphers.com/services/game-development',
  },
}

export default function GameDevLayout({ children }: { children: React.ReactNode }) {
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