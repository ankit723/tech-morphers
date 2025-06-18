import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import { z } from "zod"

const voteSchema = z.object({
  type: z.enum(["UPVOTE", "DOWNVOTE"]),
  voterEmail: z.string().email().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const headersList = await headers()
    
    // Get user IP for identification
    const userIp = headersList.get("x-forwarded-for") || 
                   headersList.get("x-real-ip") || 
                   "unknown"

    const validatedData = voteSchema.parse(body)

    // Find the comment
    const comment = await prisma.blogComment.findUnique({
      where: { 
        id: resolvedParams.commentId,
        status: "APPROVED"
      },
      select: { id: true, upvotes: true, downvotes: true, score: true }
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user has already voted
    const existingVote = await prisma.commentVote.findUnique({
      where: {
        commentId_voterEmail_voterIp: {
          commentId: resolvedParams.commentId,
          voterEmail: validatedData.voterEmail || "",
          voterIp: userIp,
        }
      }
    })

    let scoreChange = 0
    let upvoteChange = 0
    let downvoteChange = 0

    if (existingVote) {
      // If same vote type, remove the vote (toggle)
      if (existingVote.type === validatedData.type) {
        await prisma.commentVote.delete({
          where: { id: existingVote.id }
        })

        if (validatedData.type === "UPVOTE") {
          scoreChange = -1
          upvoteChange = -1
        } else {
          scoreChange = 1
          downvoteChange = -1
        }
      } else {
        // Change vote type
        await prisma.commentVote.update({
          where: { id: existingVote.id },
          data: { type: validatedData.type }
        })

        if (validatedData.type === "UPVOTE") {
          scoreChange = 2 // From -1 to +1
          upvoteChange = 1
          downvoteChange = -1
        } else {
          scoreChange = -2 // From +1 to -1
          upvoteChange = -1
          downvoteChange = 1
        }
      }
    } else {
      // Create new vote
      await prisma.commentVote.create({
        data: {
          type: validatedData.type,
          voterEmail: validatedData.voterEmail || "",
          voterIp: userIp,
          commentId: resolvedParams.commentId,
        }
      })

      if (validatedData.type === "UPVOTE") {
        scoreChange = 1
        upvoteChange = 1
      } else {
        scoreChange = -1
        downvoteChange = 1
      }
    }

    // Update comment scores
    const updatedComment = await prisma.blogComment.update({
      where: { id: resolvedParams.commentId },
      data: {
        score: { increment: scoreChange },
        upvotes: { increment: upvoteChange },
        downvotes: { increment: downvoteChange },
      },
      select: {
        id: true,
        score: true,
        upvotes: true,
        downvotes: true,
      }
    })

    // Get user's current vote status
    const userVote = await prisma.commentVote.findUnique({
      where: {
        commentId_voterEmail_voterIp: {
          commentId: resolvedParams.commentId,
          voterEmail: validatedData.voterEmail || "",
          voterIp: userIp,
        }
      },
      select: { type: true }
    })

    return NextResponse.json({
      ...updatedComment,
      userVote: userVote?.type || null,
    })

  } catch (error) {
    console.error("Error voting on comment:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to vote on comment" },
      { status: 500 }
    )
  }
}

// Get vote status for a comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    const voterEmail = searchParams.get("email") || ""
    const headersList = await headers()
    
    const userIp = headersList.get("x-forwarded-for") || 
                   headersList.get("x-real-ip") || 
                   "unknown"

    // Get comment with vote counts
    const comment = await prisma.blogComment.findUnique({
      where: { 
        id: resolvedParams.commentId,
        status: "APPROVED"
      },
      select: {
        id: true,
        score: true,
        upvotes: true,
        downvotes: true,
      }
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Get user's vote if any
    const userVote = await prisma.commentVote.findUnique({
      where: {
        commentId_voterEmail_voterIp: {
          commentId: resolvedParams.commentId,
          voterEmail,
          voterIp: userIp,
        }
      },
      select: { type: true }
    })

    return NextResponse.json({
      ...comment,
      userVote: userVote?.type || null,
    })

  } catch (error) {
    console.error("Error getting vote status:", error)
    return NextResponse.json(
      { error: "Failed to get vote status" },
      { status: 500 }
    )
  }
} 