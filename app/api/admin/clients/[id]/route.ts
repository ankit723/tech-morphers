import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Get client with all related data
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        documents: {
          orderBy: { uploadedAt: 'desc' },
          include: {
            estimator: {
              select: {
                id: true,
                projectType: true,
                projectPurpose: true
              }
            }
          }
        },
        estimators: {
          orderBy: { createdAt: 'desc' },
          include: {
            documents: {
              orderBy: { uploadedAt: 'desc' },
              select: {
                id: true,
                title: true,
                type: true,
                uploadedAt: true,
                requiresSignature: true,
                isSigned: true
              }
            }
          }
        },
        projectManagerAssignment: {
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
        }
      }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Format the response with proper data types
    const formattedClient = {
      ...client,
      documents: client.documents.map(doc => ({
        ...doc,
        invoiceAmount: doc.invoiceAmount ? Number(doc.invoiceAmount) : null,
        project: doc.estimator
      })),
      estimators: client.estimators.map(estimator => ({
        ...estimator,
        documentsCount: estimator.documents.length,
        documents: estimator.documents
      }))
    };

    return NextResponse.json({
      success: true,
      client: formattedClient
    });

  } catch (error: any) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 