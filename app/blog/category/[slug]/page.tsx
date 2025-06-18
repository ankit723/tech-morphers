import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlogPosts, getBlogCategories, getBlogTags } from "@/lib/blog-actions"
import { BlogListClient } from "@/components/blog/blog-list-client"
import { Loader2, Folder, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const categories = await getBlogCategories()
  const category = categories.find(c => c.slug === resolvedParams.slug)
  
  if (!category) {
    return {
      title: "Category Not Found | Tech Morphers Blog",
      description: "The requested category could not be found."
    }
  }

  return {
    title: `${category.name} | Tech Morphers Blog`,
    description: category.description || `Explore all articles in the ${category.name} category on Tech Morphers blog. Discover insights, tutorials, and industry news related to ${category.name}.`,
    keywords: [category.name, "tech blog", "articles", "tutorials", "insights"],
    openGraph: {
      title: `${category.name} | Tech Morphers Blog`,
      description: category.description || `Explore all articles in the ${category.name} category on Tech Morphers blog.`,
      type: "website",
      url: `https://www.techmorphers.com/blog/category/${category.slug}`,
      images: [
        {
          url: "/blog-og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${category.name} Articles`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Tech Morphers Blog`,
      description: category.description || `Explore all articles in the ${category.name} category on Tech Morphers blog.`,
      images: ["/blog-og-image.jpg"]
    },
    alternates: {
      canonical: `https://www.techmorphers.com/blog/category/${category.slug}`
    }
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || "1")
  
  try {
    const [categories, tags] = await Promise.all([
      getBlogCategories(),
      getBlogTags()
    ])

    const category = categories.find(c => c.slug === resolvedParams.slug)
    
    if (!category) {
      notFound()
    }

    const blogData = await getBlogPosts(page, 12, resolvedParams.slug)
    const { posts, totalPosts, totalPages, currentPage } = blogData

    // Get category icon - if it's an emoji, use it directly, otherwise use Folder icon
    const isEmoji = category.icon && /\p{Emoji}/u.test(category.icon)

    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
          <div className="container mx-auto px-4 relative">
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            <div className="text-center max-w-4xl mx-auto">
              {/* Category Icon and Name */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: category.color ? `${category.color}20` : '#10B98120',
                    border: `2px solid ${category.color || '#10B981'}`
                  }}
                >
                  {isEmoji ? (
                    <span className="text-2xl">{category.icon}</span>
                  ) : (
                    <Folder 
                      className="w-8 h-8" 
                      style={{ color: category.color || '#10B981' }}
                    />
                  )}
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {category.name}
              </h1>

              {category.description && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {category.description}
                </p>
              )}

              {!category.description && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Explore all articles in the <span 
                    className="font-semibold"
                    style={{ color: category.color || '#10B981' }}
                  >
                    {category.name}
                  </span> category. 
                  Discover insights, tutorials, and industry news related to this topic.
                </p>
              )}
              
              {/* Stats */}
              <div className="flex justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: category.color || '#10B981' }}
                  />
                  <span>{totalPosts} {totalPosts === 1 ? 'Article' : 'Articles'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span>Category: {category.name}</span>
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
                  className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6"
                  style={{ 
                    backgroundColor: category.color ? `${category.color}10` : '#10B98110',
                  }}
                >
                  {isEmoji ? (
                    <span className="text-3xl">{category.icon}</span>
                  ) : (
                    <Folder 
                      className="w-10 h-10" 
                      style={{ color: category.color || '#10B981' }}
                    />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No articles found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  There are no published articles in the &ldquo;{category.name}&rdquo; category yet.
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
                    category: resolvedParams.slug
                  }}
                />
              </Suspense>
            )}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error("Error loading category page:", error)
    notFound()
  }
} 