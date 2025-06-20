import Footer from '@/app/components/home/footer'
import Navbar from '@/app/components/home/navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expert Web Development Services | Tech Morphers - Custom Web Apps, E-commerce & API Solutions',
  description: 'Professional web development services by Tech Morphers. Custom web applications, e-commerce platforms, Progressive Web Apps (PWAs), API integration, and scalable web solutions. Transform your business with modern, responsive, and high-performance websites.',
  keywords: [
    "web development services",
    "custom web applications",
    "e-commerce development",
    "progressive web apps",
    "PWA development",
    "API integration",
    "responsive web design",
    "full-stack development",
    "React development",
    "Next.js development",
    "web app development",
    "scalable web solutions",
    "modern web development",
    "web development company",
    "custom website development",
    "enterprise web solutions"
  ],
  authors: [{ name: "Tech Morphers" }],
  creator: "Tech Morphers",
  publisher: "Tech Morphers",
  category: "Web Development Services",
  classification: "Technology Services",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://techmorphers.com/services/web",
    languages: {
      "en-US": "https://techmorphers.com/services/web",
      "x-default": "https://techmorphers.com/services/web",
    },
  },
  openGraph: {
    title: 'Expert Web Development Services | Tech Morphers - Custom Solutions & Modern Technologies',
    description: 'Professional web development services including custom web apps, e-commerce platforms, PWAs, and API integration. Build scalable, high-performance web solutions with modern technologies and best practices.',
    url: "https://techmorphers.com/services/web",
    siteName: "Tech Morphers",
    images: [
      {
        url: "https://techmorphers.com/images/web-development-og.png",
        width: 1200,
        height: 630,
        alt: "Tech Morphers Web Development Services - Custom Web Apps & E-commerce Solutions",
        type: "image/png",
      },
      {
        url: "https://techmorphers.com/images/logo.png",
        width: 400,
        height: 400,
        alt: "Tech Morphers Logo",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
    countryName: "United States",
    emails: ["hello@techmorphers.com"],
    phoneNumbers: ["+1-555-123-4567"],
  },
  twitter: {
    card: 'summary_large_image',
    site: "@techmorphers",
    creator: "@techmorphers",
    title: 'Expert Web Development Services | Tech Morphers',
    description: 'Professional web development: custom web apps, e-commerce, PWAs & API integration. Modern, scalable solutions with cutting-edge technologies.',
    images: [
      {
        url: "https://techmorphers.com/images/web-development-twitter.png",
        width: 1200,
        height: 630,
        alt: "Tech Morphers Web Development Services",
      }
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180" },
      { url: "/apple-icon-152.png", sizes: "152x152" },
      { url: "/apple-icon-120.png", sizes: "120x120" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#2a9df4",
      },
    ],
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://techmorphers.com"),
  formatDetection: {
    telephone: true,
    date: false,
    address: true,
    email: true,
    url: true,
  },
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
      "facebook-domain-verification": "your-facebook-verification-code",
    },
  },
  other: {
    "theme-color": "#2a9df4",
    "color-scheme": "light dark",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Tech Morphers Web Dev",
    "application-name": "Tech Morphers Web Development",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#2a9df4",
    "msapplication-TileImage": "/mstile-144x144.png",
    "msapplication-config": "/browserconfig.xml",
    "pinterest-rich-pin": "true",
    "format-detection": "telephone=yes",
    "HandheldFriendly": "true",
    "MobileOptimized": "width",
    "viewport": "width=device-width, initial-scale=1.0, shrink-to-fit=no",
    "google-adsense-account": "ca-pub-your-adsense-id",
    "google-analytics": "G-your-analytics-id",
    "fb:app_id": "your-facebook-app-id",
    "article:author": "Tech Morphers",
    "article:publisher": "https://www.facebook.com/techmorphers",
    "og:email": "hello@techmorphers.com",
    "og:phone_number": "+1-555-123-4567",
    "business:contact_data:email": "hello@techmorphers.com",
    "business:contact_data:phone_number": "+1-555-123-4567",
    "business:contact_data:website": "https://techmorphers.com",
  },
}

export default function WebLayout({ children }: { children: React.ReactNode }) {
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