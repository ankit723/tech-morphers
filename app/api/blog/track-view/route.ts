import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { blogId, blogSlug } = await request.json()

    if (!blogId || !blogSlug) {
      return NextResponse.json(
        { error: 'Blog ID and slug are required' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.findUnique({
      where: { 
        id: blogId,
        status: 'PUBLISHED'
      },
      select: { id: true, slug: true }
    })

    if (!post || post.slug !== blogSlug) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: blogId },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error tracking blog view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 