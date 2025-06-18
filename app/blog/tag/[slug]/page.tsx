import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlogPosts, getBlogCategories, getBlogTags } from "@/lib/blog-actions"
import { BlogListClient } from "@/components/blog/blog-list-client"
import { Loader2, Tag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface TagPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const tags = await getBlogTags()
  const tag = tags.find(t => t.slug === resolvedParams.slug)
  
  if (!tag) {
    return {
      title: "Tag Not Found | Tech Morphers Blog",
      description: "The requested tag could not be found."
    }
  }

  return {
    title: `${tag.name} Articles | Tech Morphers Blog`,
    description: `Explore all articles tagged with "${tag.name}" on Tech Morphers blog. Discover insights, tutorials, and industry news related to ${tag.name}.`,
    keywords: [tag.name, "tech blog", "articles", "tutorials", "insights"],
    openGraph: {
      title: `${tag.name} Articles | Tech Morphers Blog`,
      description: `Explore all articles tagged with "${tag.name}" on Tech Morphers blog.`,
      type: "website",
      url: `https://www.techmorphers.com/blog/tag/${tag.slug}`,
      images: [
        {
          url: "/blog-og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${tag.name} Articles`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${tag.name} Articles | Tech Morphers Blog`,
      description: `Explore all articles tagged with "${tag.name}" on Tech Morphers blog.`,
      images: ["/blog-og-image.jpg"]
    },
    alternates: {
      canonical: `https://www.techmorphers.com/blog/tag/${tag.slug}`
    }
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || "1")
  
  try {
    const [tags, categories] = await Promise.all([
      getBlogTags(),
      getBlogCategories()
    ])

    const tag = tags.find(t => t.slug === resolvedParams.slug)
    
    if (!tag) {
      notFound()
    }

    const blogData = await getBlogPosts(page, 12, undefined, resolvedParams.slug)
    const { posts, totalPosts, totalPages, currentPage } = blogData

    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
          <div className="container mx-auto px-4 relative">
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            <div className="text-center max-w-4xl mx-auto">
              {/* Tag Icon and Name */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: tag.color ? `${tag.color}20` : '#3B82F620',
                    border: `2px solid ${tag.color || '#3B82F6'}`
                  }}
                >
                  <Tag 
                    className="w-6 h-6" 
                    style={{ color: tag.color || '#3B82F6' }}
                  />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                  #{tag.name}
                </h1>
              </div>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Explore all articles tagged with <span 
                  className="font-semibold"
                  style={{ color: tag.color || '#3B82F6' }}
                >
                  &ldquo;{tag.name}&rdquo;
                </span>. 
                Discover insights, tutorials, and industry news related to this topic.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: tag.color || '#3B82F6' }}
                  />
                  <span>{totalPosts} {totalPosts === 1 ? 'Article' : 'Articles'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span>Tag: {tag.name}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {totalPosts === 0 ? (
              <div className="text-center py-16">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ 
                    backgroundColor: tag.color ? `${tag.color}10` : '#3B82F610',
                  }}
                >
                  <Tag 
                    className="w-10 h-10" 
                    style={{ color: tag.color || '#3B82F6' }}
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No articles found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  There are no published articles with the tag &ldquo;{tag.name}&rdquo; yet.
                </p>
                <Link href="/blog">
                  <Button>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Browse All Articles
                  </Button>
                </Link>
              </div>
            ) : (
              <Suspense fallback={
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              }>
                <BlogListClient
                  initialPosts={posts}
                  categories={categories}
                  tags={tags}
                  totalPosts={totalPosts}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  initialFilters={{
                    tag: resolvedParams.slug
                  }}
                />
              </Suspense>
            )}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error("Error loading tag page:", error)
    notFound()
  }
} 