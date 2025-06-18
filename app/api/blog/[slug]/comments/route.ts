import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import { z } from "zod"
import { CommentStatus } from "@prisma/client"
import { sendCommentNotificationsToAllEmails } from "@/lib/blog-email-notifications"

// Schema for comment creation
const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(5000, "Comment too long"),
  parentId: z.string().uuid().optional(),
})

// Schema for comment query params
const commentsQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default("1"),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default("20"),
  sort: z.enum(["newest", "oldest", "top", "controversial"]).optional().default("top"),
  parentId: z.string().uuid().optional(),
})

// Get comments for a blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    
    const query = commentsQuerySchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      sort: searchParams.get("sort") || "top",
      parentId: searchParams.get("parentId") || undefined,
    })

    // Find the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug: resolvedParams.slug },
      select: { id: true, commentsEnabled: true }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (!post.commentsEnabled) {
      return NextResponse.json({ error: "Comments are disabled for this post" }, { status: 403 })
    }

    const page = query.page
    const limit = query.limit
    const skip = (page - 1) * limit

    // Build sorting criteria
    let orderBy: any = {}
    switch (query.sort) {
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      case "top":
        orderBy = { score: "desc" }
        break
      case "controversial":
        orderBy = [{ score: "asc" }, { createdAt: "desc" }]
        break
    }

    // Get comments with nested structure
    const whereClause = {
      postId: post.id,
      status: CommentStatus.APPROVED,
      parentId: query.parentId || null, // Get top-level comments or replies to specific comment
    }

    const [comments, totalCount] = await Promise.all([
      prisma.blogComment.findMany({
        where: whereClause,
        include: {
          replies: {
            where: { status: CommentStatus.APPROVED },
            include: {
              replies: {
                where: { status: CommentStatus.APPROVED },
                include: {
                  replies: {
                    where: { status: CommentStatus.APPROVED },
                    orderBy: { createdAt: "asc" },
                    take: 5, // Limit deep nesting
                  }
                },
                orderBy: { createdAt: "asc" },
                take: 10
              }
            },
            orderBy: { createdAt: "asc" },
            take: 20
          },
          votes: {
            select: {
              type: true,
              voterEmail: true,
              voterIp: true,
            }
          }
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.blogComment.count({
        where: whereClause,
      }),
    ])

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      sort: query.sort,
    })

  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

// Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const headersList = await headers()
    
    // Get user IP for spam protection
    const userIp = headersList.get("x-forwarded-for") || 
                   headersList.get("x-real-ip") || 
                   "unknown"
    
    const userAgent = headersList.get("user-agent") || "unknown"

    // Validate input
    const validatedData = createCommentSchema.parse(body)

    // Find the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug: resolvedParams.slug },
      select: { id: true, commentsEnabled: true }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (!post.commentsEnabled) {
      return NextResponse.json({ error: "Comments are disabled for this post" }, { status: 403 })
    }

    // If this is a reply, verify parent comment exists
    let depth = 0
    if (validatedData.parentId) {
      const parentComment = await prisma.blogComment.findUnique({
        where: { 
          id: validatedData.parentId,
          postId: post.id,
          status: CommentStatus.APPROVED
        },
        select: { depth: true }
      })

      if (!parentComment) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 })
      }

      depth = Math.min(parentComment.depth + 1, 5) // Limit nesting to 5 levels
    }

    // Check for spam (basic implementation)
    const isSpam = await checkForSpam(validatedData.content, "", userIp)

    // Create the comment
    const comment = await prisma.blogComment.create({
      data: {
        content: validatedData.content,
        authorName: "",
        authorEmail: "",
        authorUrl: null,
        authorIp: userIp,
        userAgent,
        parentId: validatedData.parentId || null,
        depth,
        postId: post.id,
        status: isSpam ? CommentStatus.SPAM : CommentStatus.APPROVED, // Auto-approve for now, can add moderation queue
        isSpam,
      },
      include: {
        replies: {
          where: { status: CommentStatus.APPROVED },
          orderBy: { createdAt: "asc" },
          take: 5
        }
      }
    })

    // Update comment count on post
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        commentsCount: {
          increment: 1
        }
      }
    })

    // Send email notifications in the background (don't await)
    sendCommentNotificationsToAllEmails(post.id, comment.id).catch(error => {
      console.error("Background comment notification failed:", error)
    })

    return NextResponse.json(comment, { status: 201 })

  } catch (error) {
    console.error("Error creating comment:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}

// Basic spam detection (can be enhanced with external services)
async function checkForSpam(content: string, email: string, ip: string): Promise<boolean> {
  // Check for common spam patterns
  const spamPatterns = [
    /viagra|cialis|casino|lottery|winner/i,
    /click here|visit now|amazing offer/i,
    /\$\$\$|\$\d+/,
    /https?:\/\/.+\.(tk|ml|ga|cf)/i, // Suspicious domains
  ]

  if (spamPatterns.some(pattern => pattern.test(content))) {
    return true
  }

  // Check for excessive links
  const linkCount = (content.match(/https?:\/\//g) || []).length
  if (linkCount > 3) {
    return true
  }

  // Check if user has posted too many comments recently
  const recentComments = await prisma.blogComment.count({
    where: {
      authorEmail: email,
      authorIp: ip,
      createdAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
      }
    }
  })

  if (recentComments > 5) {
    return true
  }

  return false
} 