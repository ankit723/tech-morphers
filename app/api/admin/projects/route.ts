import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
        projectCost: project.projectCost,
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
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const whereClause: any = {};

    if (clientId) {
      whereClause.clientId = clientId;
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