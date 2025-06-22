import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const projectId = params.id
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = [
      'JUST_STARTED',
      'TEN_PERCENT', 
      'THIRTY_PERCENT',
      'FIFTY_PERCENT',
      'SEVENTY_PERCENT',
      'ALMOST_COMPLETED',
      'COMPLETED'
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Check if project exists
    const project = await prisma.estimator.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Update project status
    const updatedProject = await prisma.estimator.update({
      where: { id: projectId },
      data: {
        projectStatus: status,
        updatedAt: new Date()
      },
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

    return NextResponse.json({
      success: true,
      message: 'Project status updated successfully',
      project: {
        id: updatedProject.id,
        projectStatus: updatedProject.projectStatus,
        projectType: updatedProject.projectType,
        projectPurpose: updatedProject.projectPurpose,
        client: updatedProject.client
      }
    })

  } catch (error: any) {
    console.error('Error updating project status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 