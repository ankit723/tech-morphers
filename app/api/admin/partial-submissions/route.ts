import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get partial submissions (where customRequests contains "PARTIAL SUBMISSION")
    const partialSubmissions = await prisma.estimator.findMany({
      where: {
        customRequests: {
          contains: 'PARTIAL SUBMISSION'
        }
      },
      select: {
        id: true,
        projectType: true,
        projectPurpose: true,
        features: true,
        fullName: true,
        email: true,
        phone: true,
        companyName: true,
        customRequests: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      submissions: partialSubmissions,
      count: partialSubmissions.length
    })
  } catch (error) {
    console.error('Error fetching partial submissions:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch partial submissions'
    }, { status: 500 })
  }
} 