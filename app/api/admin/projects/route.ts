import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { clientId, projectType, projectPurpose, budget, timeline, status } = await request.json();

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
        customRequests: status || 'ACTIVE',
        clientId
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
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const whereClause: any = {};

    if (clientId) {
      whereClause.clientId = clientId;
    }

    const projects = await prisma.estimator.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      projects
    });

  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 