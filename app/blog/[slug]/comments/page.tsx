import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlogPost } from "@/lib/blog-actions"
import { CommentsSection } from "@/components/blog/comments/comments-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare, 
  ArrowLeft, 
  Clock, 
  Eye, 
  User
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Client component for share functionality
import { ShareButton } from "@/components/blog/share-button"

interface CommentsPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CommentsPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)
  
  if (!post) {
    return {
      title: "Comments - Post Not Found",
    }
  }

  return {
    title: `Comments: ${post.title} | Tech Morphers`,
    description: `Join the discussion about "${post.title}". Share your thoughts and read what others have to say.`,
    openGraph: {
      title: `Comments: ${post.title}`,
      description: `Join the discussion about "${post.title}".`,
      type: "website",
      url: `https://www.techmorphers.com/blog/${post.slug}/comments`,
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `Comments: ${post.title}`,
      description: `Join the discussion about "${post.title}".`,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

function PostHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6" />
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

function CommentsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function PostHeader({ slug }: { slug: string }) {
  const post = await getBlogPost(slug)
  
  if (!post) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(date))
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/blog/${post.slug}`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Article
            </Button>
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-4 h-4" />
            <span>Comments Discussion</span>
          </div>
        </div>

        {/* Post Preview */}
        <div className="border-l-4 border-blue-500 pl-6">
          <div className="flex items-start gap-4">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="flex-shrink-0">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={120}
                  height={80}
                  className="rounded-lg object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="inline-block"
                  >
                    <Badge 
                      variant="secondary"
                      style={{
                        backgroundColor: category.color ? `${category.color}20` : undefined,
                        color: category.color || undefined
                      }}
                    >
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={post.authorImage || ""} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{post.author}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(post.publishedAt!)}</span>
                  </div>

                  {/* Read Time */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.readTime} min read</span>
                  </div>

                  {/* Views */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{post.views}</span>
                  </div>
                </div>

                {/* Share Button */}
                <ShareButton title={post.title} excerpt={post.excerpt} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function CommentsPage({ params }: CommentsPageProps) {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <Suspense fallback={<PostHeaderSkeleton />}>
            <PostHeader slug={resolvedParams.slug} />
          </Suspense>

          {/* Comments Section */}
          <Suspense fallback={<CommentsSkeleton />}>
            <CommentsSection
              blogSlug={resolvedParams.slug}
              commentsEnabled={post.commentsEnabled}
              initialCommentsCount={post.commentsCount}
            />
          </Suspense>

          {/* Back to Article CTA */}
          <div className="mt-12 text-center">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Continue Reading
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Want to read the full article? Go back to the main post.
                </p>
                <Link href={`/blog/${post.slug}`}>
                  <Button className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Read Full Article
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 