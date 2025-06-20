import Navbar from '@/app/components/home/navbar'
import Footer from '@/app/components/home/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UI/UX Design Services | Tech Morphers - User-Centered Design & Digital Experiences',
  description: 'Professional UI/UX design services by Tech Morphers. User-centered design, digital product design, brand identity, user research, prototyping, and design systems. Create engaging, intuitive digital experiences that delight users and drive conversions.',
  keywords: [
    "UI UX design services",
    "user experience design",
    "user interface design",
    "digital product design",
    "user-centered design",
    "design thinking",
    "user research",
    "wireframing",
    "prototyping",
    "design systems",
    "brand identity design",
    "visual design",
    "interaction design",
    "usability testing",
    "responsive design",
    "mobile app design",
    "web design services",
    "design consultation"
  ],
  authors: [{ name: "Tech Morphers" }],
  creator: "Tech Morphers",
  publisher: "Tech Morphers",
  category: "UI/UX Design Services",
  classification: "Design Services",
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
    canonical: "https://techmorphers.com/services/design",
    languages: {
      "en-US": "https://techmorphers.com/services/design",
      "x-default": "https://techmorphers.com/services/design",
    },
  },
  openGraph: {
    title: 'UI/UX Design Services | Tech Morphers - Exceptional Digital Experiences',
    description: 'Expert UI/UX design services focused on user-centered design principles. Create beautiful, intuitive digital products that enhance user engagement and drive business success through thoughtful design.',
    url: "https://techmorphers.com/services/design",
    siteName: "Tech Morphers",
    images: [
      {
        url: "https://techmorphers.com/images/design-services-og.png",
        width: 1200,
        height: 630,
        alt: "Tech Morphers UI/UX Design Services - User-Centered Design & Digital Experiences",
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
    title: 'UI/UX Design Services | Tech Morphers',
    description: 'Professional UI/UX design services. User-centered design, digital product design & brand identity. Create intuitive experiences that users love.',
    images: [
      {
        url: "https://techmorphers.com/images/design-services-twitter.png",
        width: 1200,
        height: 630,
        alt: "Tech Morphers UI/UX Design Services",
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
    "apple-mobile-web-app-title": "Tech Morphers Design",
    "application-name": "Tech Morphers Design Services",
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

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D1F]">
      <Navbar />
      {children}
      <div className="relative mt-[50rem]">
        <Footer />
      </div>
    </div>
  );
} 