import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Development Services | Tech Morphers - Web, Mobile, Design & Game Development",
  description: "Comprehensive technology services from Tech Morphers. Expert web development, mobile apps, UI/UX design, and game development solutions. Transform your business with cutting-edge technology and innovative digital solutions tailored to your needs.",
  keywords: [
    "tech services",
    "web development services",
    "mobile app development",
    "UI UX design services",
    "game development",
    "software development company",
    "digital transformation",
    "custom software solutions",
    "technology consulting",
    "full-stack development",
    "enterprise solutions",
    "startup development services"
  ],
  authors: [{ name: "Tech Morphers" }],
  creator: "Tech Morphers",
  publisher: "Tech Morphers",
  category: "Technology Services",
  classification: "Business Services",
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
    canonical: "https://techmorphers.com/services",
    languages: {
      "en-US": "https://techmorphers.com/services",
      "x-default": "https://techmorphers.com/services",
    },
  },
  openGraph: {
    title: "Professional Development Services | Tech Morphers - Complete Digital Solutions",
    description: "From web development to mobile apps, UI/UX design to game development - Tech Morphers provides comprehensive technology services to transform your business ideas into reality.",
    url: "https://techmorphers.com/services",
    siteName: "Tech Morphers",
    images: [
      {
        url: "https://techmorphers.com/images/services-og.png",
        width: 1200,
        height: 630,
        alt: "Tech Morphers Professional Development Services - Web, Mobile, Design & Games",
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
    card: "summary_large_image",
    site: "@techmorphers",
    creator: "@techmorphers",
    title: "Professional Development Services | Tech Morphers",
    description: "Comprehensive technology services: web development, mobile apps, UI/UX design & game development. Transform your business with innovative digital solutions.",
    images: [
      {
        url: "https://techmorphers.com/images/services-twitter.png",
        width: 1200,
        height: 630,
        alt: "Tech Morphers Professional Development Services",
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
    "apple-mobile-web-app-title": "Tech Morphers Services",
    "application-name": "Tech Morphers Services",
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

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  )
}