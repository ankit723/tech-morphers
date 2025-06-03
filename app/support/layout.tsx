import type { Metadata } from 'next'
import Navbar from '../components/home/navbar'
import Footer from '../components/home/footer'

export const metadata: Metadata = {
  title: 'Support | Tech Morphers',
  description: 'Support Center',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Support | Tech Morphers',
    description: 'Support Center',
    images: '/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support | Tech Morphers',
    description: 'Support Center',
    images: '/logo.png',
  },
  alternates: {
    canonical: 'https://www.techmorphers.com/support',
  },
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>
  <Navbar />
  <main className=''>
    {children}
  </main>
  <div className='mt-[50rem] relative'>
    <Footer />
  </div>
  </>
}