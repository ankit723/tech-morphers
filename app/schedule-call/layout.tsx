import Navbar from "../components/home/navbar";
import Footer from "../components/home/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule Call | Tech Morphers - Free Project Consultation & Strategy Session",
  description: "Book a free consultation call with Tech Morphers' expert developers. Discuss your web development, mobile app, or digital transformation project. Get personalized solutions, timeline estimates, and strategic guidance from our experienced team.",
  keywords: [
    "schedule consultation call",
    "free project consultation",
    "tech morphers meeting",
    "web development consultation",
    "mobile app consultation",
    "digital transformation meeting",
    "software development consultation",
    "project strategy session",
    "expert developer consultation",
    "technology consultation",
    "custom software consultation",
    "startup tech consultation"
  ],
  authors: [{ name: "Tech Morphers" }],
  creator: "Tech Morphers",
  publisher: "Tech Morphers",
  category: "Technology Consultation",
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
    canonical: "https://techmorphers.com/schedule-call",
    languages: {
      "en-US": "https://techmorphers.com/schedule-call",
      "x-default": "https://techmorphers.com/schedule-call",
    },
  },
  openGraph: {
    title: "Schedule Free Consultation Call | Tech Morphers - Expert Development Team",
    description: "Ready to transform your ideas into reality? Book a free consultation call with Tech Morphers' expert development team. Get personalized project insights, timeline estimates, and strategic guidance for your web, mobile, or enterprise solutions.",
    url: "https://techmorphers.com/schedule-call",
    siteName: "Tech Morphers",
    images: [
      {
        url: "https://techmorphers.com/images/schedule-call-og.png",
        width: 1200,
        height: 630,
        alt: "Schedule Free Consultation Call with Tech Morphers Expert Development Team",
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
    title: "Schedule Free Consultation Call | Tech Morphers",
    description: "Book a free consultation with our expert developers. Get personalized project insights and strategic guidance for your next digital transformation.",
    images: [
      {
        url: "https://techmorphers.com/images/schedule-call-twitter.png",
        width: 1200,
        height: 630,
        alt: "Schedule Free Consultation Call with Tech Morphers",
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
    "apple-mobile-web-app-title": "Tech Morphers",
    "application-name": "Tech Morphers",
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
    "og:latitude": "40.7128",
    "og:longitude": "-74.0060",
    "og:street-address": "123 Tech Street",
    "og:locality": "New York",
    "og:region": "NY",
    "og:postal-code": "10001",
    "og:country-name": "USA",
    "business:contact_data:street_address": "123 Tech Street",
    "business:contact_data:locality": "New York",
    "business:contact_data:region": "NY",
    "business:contact_data:postal_code": "10001",
    "business:contact_data:country_name": "USA",
    "business:contact_data:email": "hello@techmorphers.com",
    "business:contact_data:phone_number": "+1-555-123-4567",
    "business:contact_data:website": "https://techmorphers.com",
  },
}

export default function ScheduleCallLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D1F]">
        <Navbar />
        {children}
        <div className="relative mt-[70rem]">
            <Footer />
        </div>
    </div>
  )
}