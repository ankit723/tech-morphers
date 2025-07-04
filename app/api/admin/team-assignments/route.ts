import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentAdminUser } from '@/lib/auth'
import { UserRole } from '@prisma/client'

// GET - List all team assignments
export async function GET() {
  try {
    // Verify authentication (admin or project manager)
    const userCheck = await getCurrentAdminUser()
    if (!userCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = userCheck.user

    // Allow both admin and project manager access
    if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.PROJECT_MANAGER) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    const whereClause: any = { isActive: true }

    // If project manager, only return their assigned team members
    if (user.role === UserRole.PROJECT_MANAGER) {
      whereClause.projectManagerId = user.id
    }

    const assignments = await prisma.teamAssignment.findMany({
      where: whereClause,
      include: {
        teamMember: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true
          }
        },
        projectManager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      assignments
    })
  } catch (error) {
    console.error('Error fetching team assignments:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Assign team member to project manager
export async function POST(request: NextRequest) {
  try {
    const { teamMemberId, projectManagerId, notes } = await request.json()

    // Verify admin authentication
    const adminCheck = await getCurrentAdminUser()
    if (!adminCheck.success || adminCheck.user?.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify team member exists and is not a PROJECT_MANAGER or ADMIN
    const teamMember = await prisma.user.findUnique({
      where: { 
        id: teamMemberId,
        isActive: true
      }
    })

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      )
    }

    if (teamMember.role === UserRole.ADMIN || teamMember.role === UserRole.PROJECT_MANAGER) {
      return NextResponse.json(
        { success: false, error: 'Cannot assign admin or project manager as team member' },
        { status: 400 }
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

    // Check if team member already has an assignment
    const existingAssignment = await prisma.teamAssignment.findUnique({
      where: { teamMemberId: teamMemberId }
    })

    if (existingAssignment) {
      // Update existing assignment
      const updatedAssignment = await prisma.teamAssignment.update({
        where: { teamMemberId: teamMemberId },
        data: {
          projectManagerId: projectManagerId,
          assignedBy: adminCheck.user.email,
          notes: notes || null,
          isActive: true
        },
        include: {
          teamMember: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
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
        message: 'Team member reassigned successfully'
      })
    } else {
      // Create new assignment
      const newAssignment = await prisma.teamAssignment.create({
        data: {
          teamMemberId: teamMemberId,
          projectManagerId: projectManagerId,
          assignedBy: adminCheck.user.email,
          notes: notes || null
        },
        include: {
          teamMember: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
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
        message: 'Team member assigned successfully'
      })
    }
  } catch (error) {
    console.error('Error assigning team member:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove team member assignment
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const teamMemberId = url.searchParams.get('teamMemberId')

    if (!teamMemberId) {
      return NextResponse.json(
        { success: false, error: 'Team member ID required' },
        { status: 400 }
      )
    }

    // Verify admin authentication
    const adminCheck = await getCurrentAdminUser()
    if (!adminCheck.success || adminCheck.user?.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Remove team assignment
    await prisma.teamAssignment.deleteMany({
      where: { teamMemberId: teamMemberId }
    })

    return NextResponse.json({
      success: true,
      message: 'Team member assignment removed successfully'
    })
  } catch (error) {
    console.error('Error removing team assignment:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 