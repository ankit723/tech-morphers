import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const projectId = params.id

    // Get project details (Estimator table represents projects)
    const project = await prisma.estimator.findUnique({
      where: { id: projectId },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        projectType: project.projectType,
        projectPurpose: project.projectPurpose,
        projectStatus: project.projectStatus,
        projectCost: project.projectCost,
        currency: project.currency,
        budgetRange: project.budgetRange,
        deliveryTimeline: project.deliveryTimeline,
        customRequests: project.customRequests,
        createdAt: project.createdAt,
        client: project.client
      }
    })

  } catch (error: any) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 