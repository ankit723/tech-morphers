import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlogPost, getRelatedPosts } from "@/lib/blog-actions"
import { BlogPostContent } from "@/components/blog/blog-post-content"
import { BlogPostHeader } from "@/components/blog/blog-post-header"
import { BlogPostSidebar } from "@/components/blog/blog-post-sidebar"
import { RelatedPosts } from "@/components/blog/related-posts"
import { BlogStructuredData } from "@/components/blog/blog-structured-data"
import { Loader2 } from "lucide-react"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)
  
  if (!post) {
    return {
      title: "Blog Post Not Found | Tech Morphers",
      description: "The requested blog post could not be found."
    }
  }

  const publishedTime = post.publishedAt?.toISOString()
  const modifiedTime = post.updatedAt.toISOString()

  return {
    title: post.metaTitle || `${post.title} | Tech Morphers Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.ogDescription || post.metaDescription || post.excerpt,
      type: "article",
      url: `https://www.techmorphers.com/blog/${post.slug}`,
      images: [
        {
          url: post.ogImage || post.featuredImage || "/blog-default-og.jpg",
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      publishedTime,
      modifiedTime,
      authors: [post.author],
      tags: post.tags.map(tag => tag.name)
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.ogDescription || post.metaDescription || post.excerpt,
      images: [post.ogImage || post.featuredImage || "/blog-default-og.jpg"],
      creator: `@${post.author.toLowerCase().replace(/\s+/g, '')}`
    },
    alternates: {
      canonical: post.canonicalUrl || `https://www.techmorphers.com/blog/${post.slug}`
    },
    other: {
      "article:published_time": publishedTime || "",
      "article:modified_time": modifiedTime,
      "article:author": post.author,
      "article:section": post.categories[0]?.name || "Technology",
      "article:tag": post.tags.map(tag => tag.name).join(", ")
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(
    post.id, 
    post.categories.map(cat => cat.id), 
    3
  )

  return (
    <>
      <BlogStructuredData post={post} />
      
      <article className="min-h-screen bg-white dark:bg-gray-900">
        {/* Header */}
        <BlogPostHeader post={post} />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              {/* Sidebar */}
              <aside className="lg:col-span-4 mt-12 lg:mt-0">
                <div className="sticky top-24 space-y-8">
                  <BlogPostSidebar post={post} />
                </div>
              </aside>

              {/* Article Content */}
              <div className="lg:col-span-8">
                <Suspense fallback={
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                }>
                  <BlogPostContent post={post} />
                </Suspense>
              </div>

            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
            <div className="container mx-auto px-4">
              <RelatedPosts posts={relatedPosts} />
            </div>
          </section>
        )}

      </article>
    </>
  )
} 