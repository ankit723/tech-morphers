import type { Metadata } from 'next'
import Navbar from '../components/home/navbar'
import Footer from '../components/home/footer'

export const metadata: Metadata = {
  title: 'Contact | Tech Morphers',
  description: 'Contact us',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Contact | Tech Morphers',
    description: 'Contact us',
    images: '/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Tech Morphers',
    description: 'Contact us',
    images: '/logo.png',
  },
  alternates: {
    canonical: 'https://www.techmorphers.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>
  <Navbar />
  <main className='mt-20'>
    {children}
  </main>
  <div className='mt-[50rem] relative'>
    <Footer />
  </div>
  </>
}