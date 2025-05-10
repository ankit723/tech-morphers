import { Metadata } from 'next'
import Script from 'next/script'
import Home from './components/home/Home'
import CTABanner from './components/home/CTABanner'
import NavBar from './components/home/NavBar'
import DesignProcess from './components/home/design-process'
import ServicesAndPortfolio from './components/home/ServicesAndPortfolio'
import FAQAndNewsletter from './components/home/faq-and-newsletter'
import Footer from './components/home/Footer'


export const metadata: Metadata = {
  title: "Tech Morphers",
  description: "Tech Morphers is a software development company that builds custom software solutions for businesses.",
  keywords: ["software development", "custom software", "software solutions", "business software", "software company", "Technology Solutions", "Software Development Company", "Custom Software Development", "Software Solutions for Businesses", "Technology Company"],
  authors: [{ name: "Tech Morphers", url: "https://www.techmorphers.com" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Tech Morphers",
    description: "Tech Morphers is a software development company that builds custom software solutions for businesses.",
    url: "https://www.techmorphers.com",
    siteName: "Tech Morphers",
    images: [{ url: "https://www.techmorphers.com/og-image.png", width: 1200, height: 630, alt: "Tech Morphers" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Morphers",
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

const page = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tech Morphers",
    url: "https://www.techmorphers.com",
    logo: "https://www.techmorphers.com/og-image.png",
    sameAs: [
      "https://x.com/techmorphers",
      "https://www.linkedin.com/company/techmorphers",
      "https://www.facebook.com/techmorphers",
      "https://www.instagram.com/techmorphers",
    ],
  }
  return (
    <>
      <Script id="home-json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="">
        <NavBar/>
        <Home/>
        <CTABanner/>
        <DesignProcess/>
        <ServicesAndPortfolio/>
        <FAQAndNewsletter />
        <Footer/>
      </div>
    </>
  )
}

export default page