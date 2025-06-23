import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const projectId = params.id;

    const assignments = await prisma.projectAssignment.findMany({
      where: { 
        projectId,
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
    });

    return NextResponse.json({
      success: true,
      assignments
    });
  } catch (error: any) {
    console.error('Error fetching project assignments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const projectId = params.id;
    const { userId, workDescription, role, priority, hoursEstimated, assignedBy } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.estimator.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.projectAssignment.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'User is already assigned to this project' },
        { status: 400 }
      );
    }

    // Create new assignment
    const assignment = await prisma.projectAssignment.create({
      data: {
        projectId,
        userId,
        workDescription: workDescription || null,
        role: role || null,
        priority: priority || 'MEDIUM',
        hoursEstimated: hoursEstimated || null,
        assignedBy: assignedBy || null,
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
      }
    });

    return NextResponse.json({
      success: true,
      message: 'User assigned to project successfully',
      assignment
    });
  } catch (error: any) {
    console.error('Error creating project assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const projectId = params.id;
    const { userId, workDescription, role, priority, hoursEstimated, hoursWorked, progressNotes, status } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existingAssignment = await prisma.projectAssignment.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Update assignment
    const updateData: any = {
      lastUpdated: new Date(),
      updatedAt: new Date()
    };

    if (workDescription !== undefined) updateData.workDescription = workDescription;
    if (role !== undefined) updateData.role = role;
    if (priority !== undefined) updateData.priority = priority;
    if (hoursEstimated !== undefined) updateData.hoursEstimated = hoursEstimated;
    if (hoursWorked !== undefined) updateData.hoursWorked = hoursWorked;
    if (progressNotes !== undefined) updateData.progressNotes = progressNotes;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
      }
    }

    const updatedAssignment = await prisma.projectAssignment.update({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      },
      data: updateData,
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
    });

    return NextResponse.json({
      success: true,
      message: 'Assignment updated successfully',
      assignment: updatedAssignment
    });
  } catch (error: any) {
    console.error('Error updating project assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const projectId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existingAssignment = await prisma.projectAssignment.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Delete assignment
    await prisma.projectAssignment.delete({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'User unassigned from project successfully'
    });
  } catch (error: any) {
    console.error('Error deleting project assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 