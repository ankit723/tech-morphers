import type { Metadata } from 'next'
import Navbar from '@/app/components/home/navbar'
import Footer from '@/app/components/home/footer'

export const metadata: Metadata = {
  title: 'Mobile App Development Services | Tech Morphers - iOS, Android & Cross-Platform Apps',
  description: 'Professional mobile app development services by Tech Morphers. Native iOS and Android apps, cross-platform solutions, React Native, Flutter development. Build high-performance, user-friendly mobile applications that engage users and drive business growth.',
  keywords: [
    "mobile app development",
    "iOS app development",
    "Android app development",
    "cross-platform mobile apps",
    "React Native development",
    "Flutter development",
    "native mobile apps",
    "mobile app design",
    "app store optimization",
    "mobile app consulting",
    "custom mobile apps",
    "enterprise mobile solutions",
    "mobile app development company",
    "smartphone app development",
    "mobile application services",
    "app development services"
  ],
  authors: [{ name: "Tech Morphers" }],
  creator: "Tech Morphers",
  publisher: "Tech Morphers",
  category: "Mobile App Development",
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
    canonical: "https://techmorphers.com/services/mobile",
    languages: {
      "en-US": "https://techmorphers.com/services/mobile",
      "x-default": "https://techmorphers.com/services/mobile",
    },
  },
  openGraph: {
    title: 'Mobile App Development Services | Tech Morphers - Native & Cross-Platform Solutions',
    description: 'Expert mobile app development for iOS and Android. Native apps, cross-platform solutions with React Native & Flutter. Build engaging, high-performance mobile applications that users love.',
    url: "https://techmorphers.com/services/mobile",
    siteName: "Tech Morphers",
    images: [
      {
        url: "https://techmorphers.com/images/mobile-development-og.png",
        width: 1200,
        height: 630,
        alt: "Tech Morphers Mobile App Development Services - iOS, Android & Cross-Platform",
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
    title: 'Mobile App Development Services | Tech Morphers',
    description: 'Professional mobile app development for iOS & Android. Native and cross-platform solutions with React Native & Flutter. High-performance apps that engage users.',
    images: [
      {
        url: "https://techmorphers.com/images/mobile-development-twitter.png",
        width: 1200,
        height: 630,
        alt: "Tech Morphers Mobile App Development Services",
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
    "apple-mobile-web-app-title": "Tech Morphers Mobile",
    "application-name": "Tech Morphers Mobile Development",
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