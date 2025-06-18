import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"
import { z } from "zod"

const reportSchema = z.object({
  reason: z.enum([
    "SPAM",
    "HARASSMENT", 
    "HATE_SPEECH",
    "INAPPROPRIATE_CONTENT",
    "OFF_TOPIC",
    "COPYRIGHT",
    "OTHER"
  ]),
  details: z.string().max(1000).optional(),
  reporterEmail: z.string().email().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const headersList = await headers()
    
    // Get user IP
    const userIp = headersList.get("x-forwarded-for") || 
                   headersList.get("x-real-ip") || 
                   "unknown"

    const validatedData = reportSchema.parse(body)

    // Find the comment
    const comment = await prisma.blogComment.findUnique({
      where: { 
        id: resolvedParams.commentId,
        status: "APPROVED"
      },
      select: { id: true }
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user has already reported this comment
    const existingReport = await prisma.commentReport.findFirst({
      where: {
        commentId: resolvedParams.commentId,
        reporterEmail: validatedData.reporterEmail || "",
        reporterIp: userIp,
      }
    })

    if (existingReport) {
      return NextResponse.json({ error: "You have already reported this comment" }, { status: 409 })
    }

    // Create the report
    const report = await prisma.commentReport.create({
      data: {
        reason: validatedData.reason,
        details: validatedData.details,
        reporterEmail: validatedData.reporterEmail || "",
        reporterIp: userIp,
        commentId: resolvedParams.commentId,
      }
    })

    // Check if comment should be automatically hidden based on report count
    const reportCount = await prisma.commentReport.count({
      where: {
        commentId: resolvedParams.commentId,
        status: "PENDING"
      }
    })

    // Auto-hide if 5 or more reports
    if (reportCount >= 5) {
      await prisma.blogComment.update({
        where: { id: resolvedParams.commentId },
        data: { status: "REJECTED" }
      })
    }

    return NextResponse.json({ 
      message: "Report submitted successfully",
      reportId: report.id 
    }, { status: 201 })

  } catch (error) {
    console.error("Error reporting comment:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to report comment" },
      { status: 500 }
    )
  }
} 