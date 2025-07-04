import {  NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentAdminUser } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function GET() {
  try {
    // Verify authentication
    const userCheck = await getCurrentAdminUser()
    if (!userCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = userCheck.user
    
    // Check if user is PROJECT_MANAGER or ADMIN
    if (user?.role !== UserRole.PROJECT_MANAGER && user?.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    if (user.role === UserRole.PROJECT_MANAGER) {
      // Project Manager View - get their assigned clients and team members
      const [clientAssignments, teamAssignments] = await Promise.all([
        // Get assigned clients
        prisma.clientAssignment.findMany({
          where: { 
            projectManagerId: user.id,
            isActive: true 
          },
          include: {
            client: {
              include: {
                estimators: {
                  include: {
                    projectAssignments: {
                      where: { status: 'ACTIVE' },
                      include: {
                        user: {
                          select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                          }
                        }
                      }
                    },
                    documents: true
                  }
                },
                documents: true
              }
            }
          }
        }),
        
        // Get assigned team members
        prisma.teamAssignment.findMany({
          where: { 
            projectManagerId: user.id,
            isActive: true 
          },
          include: {
            teamMember: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true
              }
            }
          }
        })
      ])

      // Extract projects from assigned clients
      const projects = clientAssignments.flatMap(assignment => 
        assignment.client.estimators.map(estimator => ({
          ...estimator,
          client: {
            id: assignment.client.id,
            fullName: assignment.client.fullName,
            email: assignment.client.email,
            companyName: assignment.client.companyName
          }
        }))
      )

      return NextResponse.json({
        success: true,
        data: {
          clientAssignments: clientAssignments.map(assignment => ({
            id: assignment.id,
            client: assignment.client,
            assignedAt: assignment.assignedAt,
            notes: assignment.notes
          })),
          projects,
          teamMembers: teamAssignments.map(assignment => assignment.teamMember),
          role: user.role
        }
      })
    } else {
      // Admin View - get all project managers with their assignments
      const projectManagers = await prisma.user.findMany({
        where: { 
          role: UserRole.PROJECT_MANAGER,
          isActive: true 
        },
        include: {
          managedClients: {
            where: { isActive: true },
            include: {
              client: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  companyName: true,
                  createdAt: true
                }
              }
            }
          },
          managedTeamMembers: {
            where: { isActive: true },
            include: {
              teamMember: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  isActive: true
                }
              }
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          projectManagers,
          role: user.role
        }
      })
    }
  } catch (error) {
    console.error('Error fetching project manager dashboard:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 