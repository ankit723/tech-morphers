'use client'
import Script from 'next/script'

const Blog2 = () => {
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
      <Script id="blog-2-json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Blog 2</h1>
        <p>Blog 2 is a blog post about the latest trends in software development.</p>
      </div>
    </>
  )
}

export default Blog2