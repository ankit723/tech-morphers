import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Morphers",
  description: "Tech Morphers is a software development company that builds custom software solutions for businesses.",
  keywords: ["software development", "custom software", "software solutions", "business software", "software company", "Technology Solutions", "Software Development Company", "Custom Software Development", "Software Solutions for Businesses", "Technology Company"],
  authors: [{ name: "Tech Morphers", url: "https://techmorphers.com" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Tech Morphers",
    description: "Tech Morphers is a software development company that builds custom software solutions for businesses.",
    url: "https://techmorphers.com",
    siteName: "Tech Morphers",
    images: [{ url: "https://techmorphers.com/og-image.png", width: 1200, height: 630, alt: "Tech Morphers" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Morphers",
    description: "Tech Morphers is a software development company that builds custom software solutions for businesses.",
    images: [{ url: "https://techmorphers.com/og-image.png" }],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://techmorphers.com",
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
