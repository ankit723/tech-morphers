import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentAdminUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { 
      clientId, 
      projectType, 
      projectPurpose, 
      budget, 
      timeline, 
      status,
      projectCost,
      currency,
      projectStatus
    } = await request.json();

    if (!clientId || !projectType || !projectPurpose) {
      return NextResponse.json(
        { error: 'Client ID, project type, and project purpose are required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Create the project (using estimator table for now)
    const project = await prisma.estimator.create({
      data: {
        fullName: client.fullName,
        email: client.email,
        phone: client.phone,
        companyName: client.companyName,
        projectType,
        projectPurpose,
        budgetRange: budget,
        deliveryTimeline: timeline,
        customRequests: status || '',
        clientId,
        projectCost: projectCost ? parseFloat(projectCost) : null,
        currency: currency || 'USD',
        projectStatus: projectStatus || 'JUST_STARTED'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project: {
        id: project.id,
        projectType: project.projectType,
        projectPurpose: project.projectPurpose,
        budgetRange: project.budgetRange,
        deliveryTimeline: project.deliveryTimeline,
        customRequests: project.customRequests,
        projectCost: project.projectCost ? Number(project.projectCost) : null,
        currency: project.currency,
        projectStatus: project.projectStatus,
        createdAt: project.createdAt
      }
    });

  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current user and check authorization
    const userCheck = await getCurrentAdminUser()
    if (!userCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = userCheck.user
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const whereClause: any = {
      clientId: {
        not: null
      }
    };

    if (clientId) {
      whereClause.clientId = clientId;
    }

    // If user is a project manager, only show projects from their assigned clients
    if (user?.role === UserRole.PROJECT_MANAGER) {
      const assignedClients = await prisma.clientAssignment.findMany({
        where: {
          projectManagerId: user.id,
          isActive: true
        },
        select: {
          clientId: true
        }
      });

      const assignedClientIds = assignedClients.map(assignment => assignment.clientId);
      
      if (assignedClientIds.length === 0) {
        // If PM has no assigned clients, return empty array
        return NextResponse.json({
          success: true,
          projects: []
        });
      }

      whereClause.clientId = {
        in: assignedClientIds
      };
    }

    // If user is a designer or developer, only show projects from clients assigned to their project manager
    if (user?.role === UserRole.DESIGNER || user?.role === UserRole.DEVELOPER || user?.role === UserRole.MARKETING) {
      // First, find which project manager this user is assigned to
      const teamAssignment = await prisma.teamAssignment.findFirst({
        where: {
          teamMemberId: user.id,
          isActive: true
        },
        select: {
          projectManagerId: true
        }
      });

      if (!teamAssignment) {
        // If user is not assigned to any project manager, return empty array
        return NextResponse.json({
          success: true,
          projects: []
        });
      }

      // Now find clients assigned to that project manager
      const assignedClients = await prisma.clientAssignment.findMany({
        where: {
          projectManagerId: teamAssignment.projectManagerId,
          isActive: true
        },
        select: {
          clientId: true
        }
      });

      const assignedClientIds = assignedClients.map(assignment => assignment.clientId);
      
      if (assignedClientIds.length === 0) {
        // If the PM has no assigned clients, return empty array
        return NextResponse.json({
          success: true,
          projects: []
        });
      }

      whereClause.clientId = {
        in: assignedClientIds
      };
    }

    const projects = await prisma.estimator.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        projectAssignments: {
          where: {
            status: 'ACTIVE'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          },
          orderBy: {
            assignedAt: 'asc'
          }
        },
        documents: {
          where: {
            type: 'INVOICE',
            paymentStatus: {
              in: ['VERIFIED', 'PAID']
            }
          },
          select: {
            invoiceAmount: true,
            currency: true,
            paymentStatus: true
          }
        }
      }
    });

    // Calculate payment totals for each project
    const projectsWithPayments = projects.map(project => {
      const totalPaid = project.documents.reduce((sum, doc) => {
        if (doc.invoiceAmount && (doc.paymentStatus === 'PAID' || doc.paymentStatus === 'VERIFIED')) {
          return sum + Number(doc.invoiceAmount);
        }
        return sum;
      }, 0);

      const totalVerified = project.documents.reduce((sum, doc) => {
        if (doc.invoiceAmount && (doc.paymentStatus === 'VERIFIED' || doc.paymentStatus === 'PAID')) {
          return sum + Number(doc.invoiceAmount);
        }
        return sum;
      }, 0);

      return {
        ...project,
        projectCost: project.projectCost ? Number(project.projectCost) : null,
        totalPaid,
        totalVerified,
        isFullyPaid: project.projectCost ? totalPaid >= Number(project.projectCost) : false,
        exceededAmount: project.projectCost && totalPaid > Number(project.projectCost) 
          ? totalPaid - Number(project.projectCost) 
          : 0
      };
    });

    return NextResponse.json({
      success: true,
      projects: projectsWithPayments
    });

  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 