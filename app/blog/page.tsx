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
  Clock, 
  BookOpen, 
  Star,
  Calendar,
  Tag,
  Filter,
  TrendingUp,
  Users,
  Eye,
  Heart,
  ArrowRight,
  Bookmark,
  Share2,
  MessageCircle,
  Award,
  Zap,
  Globe,
  PenTool,
  Code,
  Lightbulb,
  Target,
  Rss,
  Bell,
  ChevronRight,
  Shield
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
  searchParams: Promise<{
    page?: string
    category?: string
    tag?: string
    search?: string
  }>
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

    const blogStats = [
      { number: totalPosts.toString(), label: "Published Articles", icon: <BookOpen className="w-6 h-6" />, color: "text-indigo-600" },
      { number: categories.length.toString(), label: "Categories", icon: <Filter className="w-6 h-6" />, color: "text-violet-600" },
      { number: tags.length.toString(), label: "Topics Covered", icon: <Tag className="w-6 h-6" />, color: "text-purple-600" },
      { number: "50K+", label: "Monthly Readers", icon: <Users className="w-6 h-6" />, color: "text-blue-600" }
    ]

    const contentTypes = [
      {
        title: "Tutorials & Guides",
        description: "Step-by-step tutorials and comprehensive guides",
        icon: <PenTool className="w-8 h-8 text-indigo-600" />,
        count: "45+",
        color: "indigo"
      },
      {
        title: "Industry Insights",
        description: "Latest trends and analysis in tech industry",
        icon: <TrendingUp className="w-8 h-8 text-violet-600" />,
        count: "30+",
        color: "violet"
      },
      {
        title: "Code Examples",
        description: "Practical code snippets and best practices",
        icon: <Code className="w-8 h-8 text-purple-600" />,
        count: "60+",
        color: "purple"
      },
      {
        title: "Case Studies",
        description: "Real-world project breakdowns and lessons",
        icon: <Target className="w-8 h-8 text-blue-600" />,
        count: "20+",
        color: "blue"
      }
    ]

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-[#0F0A1B] dark:via-[#1A0F2A] dark:to-[#0F0A1B]">
        {/* Enhanced Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 via-violet-100/50 to-purple-100/50 dark:from-indigo-900/20 dark:via-violet-900/20 dark:to-purple-900/20"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-300/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-violet-300/30 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center animate-fade-in-up">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium mb-8 shadow-lg animate-scale-in">
                <Globe className="w-4 h-4 mr-2" />
                Knowledge Hub for Developers & Tech Enthusiasts
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                Tech Insights &
                <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Developer Stories
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                Dive deep into the world of technology with expert insights, practical tutorials, 
                and real-world case studies from our development team and industry experts.
              </p>

              {/* Enhanced Search Bar */}
              <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-300">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search articles, tutorials, technologies, or topics..."
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-lg"
                    defaultValue={searchQuery}
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Blog Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {blogStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/50 dark:border-indigo-800/50 hover:shadow-lg transition-shadow duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${400 + index * 100}ms` }}
                  >
                    <div className={`flex justify-center mb-3 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Types Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                What You'll Find Here
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Comprehensive content designed to help developers and tech enthusiasts grow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contentTypes.map((type, index) => (
                <div
                  key={type.title}
                  className="text-center bg-white dark:bg-gray-800 rounded-3xl p-8 border border-indigo-200 dark:border-indigo-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6 p-4 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {type.description}
                  </p>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {type.count}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Articles
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && !categorySlug && !tagSlug && !searchQuery && page === 1 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-16 animate-fade-in-up">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Featured Articles
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Hand-picked stories from our editorial team
                  </p>
                </div>
                <div className="hidden md:flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
                  <Award className="w-6 h-6 mr-2" />
                  <span className="font-semibold">Editor's Choice</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
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

        {/* Categories Showcase */}
        {categories.length > 0 && !categorySlug && !tagSlug && !searchQuery && page === 1 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 animate-fade-in-up">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Explore by Category
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Discover content tailored to your interests and expertise level
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.slice(0, 6).map((category, index) => (
                  <div
                    key={category.id}
                    className="animate-fade-in-up hover:scale-105 transition-transform"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link
                      href={`/blog?category=${category.slug}`}
                      className="block bg-white dark:bg-gray-800 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {category.icon && (
                            <span className="text-2xl mr-3">{category.icon}</span>
                          )}
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {category.name}
                          </h3>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      {category.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span>{category._count?.posts || 0} articles</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {categories.length > 6 && (
                <div className="text-center mt-12">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/blog/categories">
                      View All Categories
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Main Content with Enhanced Sidebar Layout */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {searchQuery ? `Search Results for "${searchQuery}"` :
                     categorySlug ? `Category: ${categories.find(c => c.slug === categorySlug)?.name || categorySlug}` :
                     tagSlug ? `Tag: ${tags.find(t => t.slug === tagSlug)?.name || tagSlug}` :
                     'Latest Articles'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {totalPosts} {totalPosts === 1 ? 'article' : 'articles'} found
                  </p>
                </div>

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

              {/* Enhanced Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Newsletter Signup */}
                <Card className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
                      <p className="text-indigo-100 text-sm mb-4">
                        Get the latest articles delivered to your inbox
                      </p>
                      <div className="space-y-3">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                        />
                        <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-semibold">
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                {popularTags.length > 0 && (
                  <Card className="overflow-hidden border-indigo-200 dark:border-indigo-800">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-indigo-600" />
                        Trending Topics
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
                            <span className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm font-medium px-3 py-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
                              #{tag.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Categories */}
                {categories.length > 0 && (
                  <Card className="overflow-hidden border-indigo-200 dark:border-indigo-800">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-violet-600" />
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categories.slice(0, 8).map((category) => (
                          <Link
                            key={category.id}
                            href={`/blog?category=${category.slug}`}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
                          >
                            <div className="flex items-center">
                              {category.icon && <span className="mr-2 text-lg">{category.icon}</span>}
                              <span className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {category.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {category._count?.posts || 0}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Posts */}
                {recentPosts.length > 0 && (
                  <Card className="overflow-hidden border-indigo-200 dark:border-indigo-800">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-purple-600" />
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
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                                  {post.title}
                                </h4>
                                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Intl.DateTimeFormat("en-US", {
                                    month: "short",
                                    day: "numeric"
                                  }).format(new Date(post.publishedAt!))}
                                  <span className="mx-2">•</span>
                                  <Clock className="w-3 h-3 mr-1" />
                                  {post.readTime} min
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* RSS Feed */}
                <Card className="overflow-hidden border-indigo-200 dark:border-indigo-800">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Rss className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      RSS Feed
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Subscribe to our RSS feed for updates
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      <Link href="/blog/rss.xml">
                        Subscribe to RSS
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Newsletter CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="animate-fade-in-up">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Never Miss an Insight
              </h2>
              <p className="text-xl text-indigo-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join 10,000+ developers and tech enthusiasts who get our latest articles, 
                tutorials, and industry insights delivered straight to their inbox every week.
              </p>
              
              <div className="max-w-md mx-auto">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                      />
                      <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold whitespace-nowrap px-8">
                        Subscribe Now
                      </Button>
                    </div>
                    <div className="flex items-center justify-center mt-4 text-xs text-indigo-100">
                      <Shield className="w-4 h-4 mr-1" />
                      <span>No spam, unsubscribe anytime. 100% free.</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <div className="flex items-center text-white/80 hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 mr-2" />
                  <span>10,000+ subscribers</span>
                </div>
                <div className="flex items-center text-white/80 hover:scale-105 transition-transform">
                  <Star className="w-5 h-5 mr-2" />
                  <span>Weekly insights</span>
                </div>
                <div className="flex items-center text-white/80 hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5 mr-2" />
                  <span>Exclusive content</span>
                </div>
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