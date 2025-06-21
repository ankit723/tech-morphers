import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const projectId = params.id;
    const { projectType, projectPurpose, budget, timeline, status } = await request.json();

    if (!projectType || !projectPurpose) {
      return NextResponse.json(
        { error: 'Project type and project purpose are required' },
        { status: 400 }
      );
    }

    // Check if project exists
    const existingProject = await prisma.estimator.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update the project
    const updatedProject = await prisma.estimator.update({
      where: { id: projectId },
      data: {
        projectType,
        projectPurpose,
        budgetRange: budget,
        deliveryTimeline: timeline,
        customRequests: status
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project: {
        id: updatedProject.id,
        projectType: updatedProject.projectType,
        projectPurpose: updatedProject.projectPurpose,
        budgetRange: updatedProject.budgetRange,
        deliveryTimeline: updatedProject.deliveryTimeline,
        customRequests: updatedProject.customRequests,
        createdAt: updatedProject.createdAt
      }
    });

  } catch (error: any) {
    console.error('Error updating project:', error);
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

    // Check if project exists
    const existingProject = await prisma.estimator.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete the project
    await prisma.estimator.delete({
      where: { id: projectId }
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 