import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/providers/themeProvider";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import Image from "next/image";
import { WhatsappButton } from "@/components/ui/whatsapp";

const gothamBook = localFont({
  src: "../public/Gotham-font-family/Gotham/Gotham-Book.otf",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.techmorphers.com'),
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://www.techmorphers.com" />
        <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body
        className={`antialiased bg-gradient-to-b dark:from-[#0A0A1B] dark:to-[#1A1A35] from-white to-white ${gothamBook.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="white"
          enableSystem
          storageKey="techmorphers-theme"
        >
          {children}
          <WhatsappButton />
        </ThemeProvider>
        <Analytics />
        
        {/* Hotjar Tracking Code */}
        <Script
          id="hotjar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6434945,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />

        {/* LinkedIn Insight Tag */}
        <Script
          id="linkedin-insight-tag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "8499449";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            `,
          }}
        />
        
        <Script
          id="linkedin-insight-tag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(l) {
                if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[]}
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);
              })(window.lintrk);
            `,
          }}
        />

        {/* LinkedIn noscript fallback */}
        <noscript>
          <Image
            height="1" 
            width="1" 
            style={{ display: 'none' }} 
            alt="" 
            src="https://px.ads.linkedin.com/collect/?pid=8499449&fmt=gif" 
          />
        </noscript>
        
      </body>
    </html>
  );
}
