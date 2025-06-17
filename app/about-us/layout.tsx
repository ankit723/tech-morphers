import type { Metadata } from 'next'
import Navbar from '../components/home/navbar'
import Footer from '../components/home/footer'

export const metadata: Metadata = {
  title: "Tech Morphers | About",
  description: "Tech Morphers is a software development company that builds custom software solutions for businesses.",
  keywords: ["software development", "custom software", "software solutions", "business software", "software company", "Technology Solutions", "Software Development Company", "Custom Software Development", "Software Solutions for Businesses", "Technology Company"],
  authors: [{ name: "Tech Morphers", url: "https://www.techmorphers.com" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Tech Morphers | About",
    description: "Tech Morphers is a software development company that builds custom software solutions for businesses.",
    url: "https://www.techmorphers.com",
    siteName: "Tech Morphers",
    images: [{ url: "https://www.techmorphers.com/og-image.png", width: 1200, height: 630, alt: "Tech Morphers" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Morphers | About",
    description: "Tech Morphers is a software development company that builds custom software solutions for businesses.",
    images: [{ url: "https://www.techmorphers.com/og-image.png", width: 1200, height: 630, alt: "Tech Morphers" }],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.techmorphers.com",
  },
  category: "technology",
  creator: "Tech Morphers",
  publisher: "Tech Morphers",
  
}

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <>
    <Navbar />
    <div className="container mx-auto relative my-20 bg-background">
      {children}
    </div>
    <div className="relative mt-[60rem]">
      <Footer />
    </div>
  </>
}