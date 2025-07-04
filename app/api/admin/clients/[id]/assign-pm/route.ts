import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentAdminUser } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const clientId = resolvedParams.id
    const { projectManagerId, notes } = await request.json()

    // Verify admin authentication
    const adminCheck = await getCurrentAdminUser()
    if (!adminCheck.success || adminCheck.user?.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    // Verify project manager exists and has correct role
    const projectManager = await prisma.user.findUnique({
      where: { 
        id: projectManagerId,
        role: UserRole.PROJECT_MANAGER,
        isActive: true
      }
    })

    if (!projectManager) {
      return NextResponse.json(
        { success: false, error: 'Project manager not found or invalid' },
        { status: 404 }
      )
    }

    // Check if client already has a PM assigned
    const existingAssignment = await prisma.clientAssignment.findUnique({
      where: { clientId: clientId }
    })

    if (existingAssignment) {
      // Update existing assignment
      const updatedAssignment = await prisma.clientAssignment.update({
        where: { clientId: clientId },
        data: {
          projectManagerId: projectManagerId,
          assignedBy: adminCheck.user.email,
          notes: notes || null,
          isActive: true
        },
        include: {
          projectManager: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        assignment: updatedAssignment,
        message: 'Project manager updated successfully'
      })
    } else {
      // Create new assignment
      const newAssignment = await prisma.clientAssignment.create({
        data: {
          clientId: clientId,
          projectManagerId: projectManagerId,
          assignedBy: adminCheck.user.email,
          notes: notes || null
        },
        include: {
          projectManager: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        assignment: newAssignment,
        message: 'Project manager assigned successfully'
      })
    }
  } catch (error) {
    console.error('Error assigning project manager:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const clientId = resolvedParams.id

    // Verify admin authentication
    const adminCheck = await getCurrentAdminUser()
    if (!adminCheck.success || adminCheck.user?.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Remove PM assignment
    await prisma.clientAssignment.deleteMany({
      where: { clientId: clientId }
    })

    return NextResponse.json({
      success: true,
      message: 'Project manager removed successfully'
    })
  } catch (error) {
    console.error('Error removing project manager:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 