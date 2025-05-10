import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/providers/themeProvider";



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
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Morphers",
    description: "Tech Morphers is a software development company that builds custom software solutions for businesses.",
    images: [{ url: "https://www.techmorphers.com/og-image.png" }],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.techmorphers.com" />
        <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body
        className={`antialiased bg-gradient-to-b dark:from-[#0A0A1B] dark:to-[#1A1A35] from-white to-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="white"
          enableSystem
          storageKey="techmorphers-theme"
        >
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
