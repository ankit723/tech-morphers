import { Suspense } from "react"
import { Metadata } from "next"
import { getBlogPosts, getBlogCategories, getBlogTags, getFeaturedPosts } from "@/lib/blog-actions"
import { BlogListClient } from "@/components/blog/blog-list-client"
import { BlogCard } from "@/components/blog/blog-card"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Loader2, 
  Search, 
  TrendingUp, 
  Clock, 
  Eye, 
  BookOpen, 
  Users, 
  Star,
  ArrowRight,
  Calendar,
  Tag,
  Filter
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Blog | Tech Morphers - Insights, Tutorials & Industry News",
  description: "Discover the latest insights, tutorials, and industry news from Tech Morphers. Stay updated with cutting-edge technology trends, development tips, and expert analysis.",
  keywords: [
    "tech blog",
    "technology insights", 
    "web development",
    "software engineering",
    "programming tutorials",
    "industry news",
    "tech trends",
    "development tips"
  ],
  openGraph: {
    title: "Blog | Tech Morphers",
    description: "Discover the latest insights, tutorials, and industry news from Tech Morphers.",
    type: "website",
    url: "https://www.techmorphers.com/blog",
    images: [
      {
        url: "/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tech Morphers Blog"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Tech Morphers",
    description: "Discover the latest insights, tutorials, and industry news from Tech Morphers.",
    images: ["/blog-og-image.jpg"]
  },
  alternates: {
    canonical: "https://www.techmorphers.com/blog"
  }
}

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    tag?: string
    search?: string
  }
}

// Skeleton Components
function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || "1")
  const categorySlug = resolvedSearchParams.category
  const tagSlug = resolvedSearchParams.tag
  const searchQuery = resolvedSearchParams.search

  try {
    const [blogData, categories, tags, featuredPosts] = await Promise.all([
      getBlogPosts(page, 12, categorySlug, tagSlug, searchQuery),
      getBlogCategories(),
      getBlogTags(),
      getFeaturedPosts(3)
    ])

    const { posts, totalPosts, totalPages, currentPage } = blogData

    // Use only real data - get recent posts from actual posts
    const recentPosts = posts.slice(0, 5)
    const popularTags = tags.slice(0, 10)

    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Enhanced Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <div className="mb-8">
                <TextGenerateEffect
                  words="Insights, Tutorials & Industry News"
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                />
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                  Stay ahead of the curve with our expert insights, comprehensive tutorials, 
                  and the latest industry trends in technology and software development.
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search articles, tutorials, and insights..."
                    className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 shadow-lg"
                    defaultValue={searchQuery}
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Stats - Using only real data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalPosts}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Articles</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Filter className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Tag className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{tags.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tags</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && !categorySlug && !tagSlug && !searchQuery && page === 1 && (
          <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Featured Articles
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hand-picked stories from our editorial team
                  </p>
                </div>
                <div className="hidden md:flex items-center">
                  <Star className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Editor's Choice</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <div key={post.id}>
                    <BlogCard
                      post={post}
                      variant={index === 0 ? "featured" : "default"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content with Sidebar Layout */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <Suspense fallback={
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {[...Array(6)].map((_, i) => (
                        <BlogCardSkeleton key={i} />
                      ))}
                    </div>
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
                      category: categorySlug,
                      tag: tagSlug,
                      search: searchQuery
                    }}
                  />
                </Suspense>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Popular Tags */}
                {popularTags.length > 0 && (
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-purple-600" />
                        Popular Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/blog?tag=${tag.slug}`}
                            className="inline-block"
                          >
                            <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                              {tag.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Categories */}
                {categories.length > 0 && (
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-blue-600" />
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/blog?category=${category.slug}`}
                            className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <div className="flex items-center">
                              {category.icon && <span className="mr-2">{category.icon}</span>}
                              <span className="font-medium group-hover:text-blue-600">{category.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Posts */}
                {recentPosts.length > 0 && (
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                        Recent Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentPosts.map((post) => (
                          <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="block group"
                          >
                            <div className="flex space-x-3">
                              {post.featuredImage && (
                                <div className="flex-shrink-0">
                                  <Image
                                    src={post.featuredImage}
                                    alt={post.title}
                                    width={60}
                                    height={60}
                                    className="rounded-lg object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {post.title}
                                </h4>
                                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {post.readTime} min read
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Newsletter CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Never Miss an Update
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Get the latest insights, tutorials, and industry news delivered straight to your inbox. 
                Join our community of developers and tech enthusiasts.
              </p>
              
              <div className="max-w-md mx-auto">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                      />
                      <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold whitespace-nowrap">
                        Subscribe Now
                      </Button>
                    </div>
                    <p className="text-xs text-blue-100 mt-3 text-center">
                      No spam, unsubscribe at any time.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error("Error loading blog page:", error)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Blog
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sorry, we couldn&apos;t load the blog posts. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
} 