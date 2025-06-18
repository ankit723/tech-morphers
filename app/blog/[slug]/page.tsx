import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlogPost, getRelatedPosts } from "@/lib/blog-actions"
import { BlogPostContent } from "@/components/blog/blog-post-content"
import { BlogPostHeader } from "@/components/blog/blog-post-header"
import { BlogPostSidebar } from "@/components/blog/blog-post-sidebar"
import { RelatedPosts } from "@/components/blog/related-posts"
import { BlogStructuredData } from "@/components/blog/blog-structured-data"
import { CommentPreview } from "@/components/blog/comments/comment-preview"
import { Loader2, MessageSquare, ArrowRight, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/db"
import { CommentStatus } from "@prisma/client"

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

// Function to fetch recent comments for preview
async function getRecentComments(postId: string, limit: number = 5) {
  try {
    const comments = await prisma.blogComment.findMany({
      where: {
        postId,
        status: CommentStatus.APPROVED,
        parentId: null, // Only top-level comments for preview
      },
      orderBy: [
        { isPinned: "desc" }, // Pinned comments first
        { createdAt: "desc" }  // Then newest first
      ],
      take: limit,
      include: {
        replies: {
          where: { status: CommentStatus.APPROVED },
          orderBy: { createdAt: "asc" },
          take: 3, // Show up to 3 replies per comment
        },
        votes: {
          select: {
            type: true,
            voterEmail: true,
            voterIp: true,
          }
        }
      }
    })

    return comments
  } catch (error) {
    console.error("Error fetching recent comments:", error)
    return []
  }
}

function CommentsPreview({ post, comments }: { post: any; comments: any[] }) {
  return (
    <Card className="mt-12">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span>
              Recent Comments
              {post.commentsCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {post.commentsCount}
                </Badge>
              )}
            </span>
          </CardTitle>
          
          <Link href={`/blog/${post.slug}/comments`}>
            <Button variant="outline" className="flex items-center gap-2">
              View All Comments
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        {post.commentsEnabled ? (
          <div className="space-y-6">
            {comments.length > 0 ? (
              <>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
                      <CommentPreview
                        comment={comment}
                        blogSlug={post.slug}
                      />
                    </div>
                  ))}
                </div>
                
                {post.commentsCount > comments.length && (
                  <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Showing {comments.length} of {post.commentsCount} comments
                    </p>
                    <Link href={`/blog/${post.slug}/comments`}>
                      <Button className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        View All {post.commentsCount} Comments
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No comments yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Be the first to share your thoughts about this article.
                </p>
                <Link href={`/blog/${post.slug}/comments`}>
                  <Button className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Start the Discussion
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Comments Disabled
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comments are currently disabled for this post.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  const [relatedPosts, recentComments] = await Promise.all([
    getRelatedPosts(post.id, post.categories.map(cat => cat.id), 3),
    getRecentComments(post.id, 4) // Fetch 4 recent comments
  ])

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

                {/* Comments Preview */}
                <CommentsPreview post={post} comments={recentComments} />
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