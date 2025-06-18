import { BlogPostWithRelations } from "@/lib/blog-actions"

interface BlogStructuredDataProps {
  post: BlogPostWithRelations
}

export function BlogStructuredData({ post }: BlogStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage ? [post.featuredImage] : [],
    author: {
      "@type": "Person",
      name: post.author,
      image: post.authorImage,
      description: post.authorBio
    },
    publisher: {
      "@type": "Organization",
      name: "Tech Morphers",
      url: "https://www.techmorphers.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.techmorphers.com/logo.png"
      }
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.techmorphers.com/blog/${post.slug}`
    },
    url: `https://www.techmorphers.com/blog/${post.slug}`,
    wordCount: calculateWordCount(post.content),
    timeRequired: `PT${post.readTime}M`,
    keywords: post.metaKeywords,
    articleSection: post.categories.map(cat => cat.name),
    about: post.categories.map(cat => ({
      "@type": "Thing",
      name: cat.name
    })),
    mentions: post.tags.map(tag => ({
      "@type": "Thing",
      name: tag.name
    })),
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ReadAction",
        userInteractionCount: post.views
      },
      {
        "@type": "InteractionCounter", 
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: post.likes
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

function calculateWordCount(content: any): number {
  let wordCount = 0
  
  if (typeof content === 'string') {
    wordCount = content.split(/\s+/).length
  } else if (Array.isArray(content)) {
    content.forEach((block: any) => {
      if (block.type === 'paragraph' || block.type === 'heading') {
        wordCount += block.children?.reduce((acc: number, child: any) => {
          return acc + (child.text?.split(/\s+/).length || 0)
        }, 0) || 0
      } else if (block.type === 'code') {
        wordCount += Math.ceil((block.code?.split(/\s+/).length || 0) / 3)
      }
    })
  }

  return wordCount
} 