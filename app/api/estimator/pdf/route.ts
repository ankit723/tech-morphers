import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const estimatorId = searchParams.get('id');

    if (!estimatorId) {
      return NextResponse.json({ error: 'Estimator ID is required' }, { status: 400 });
    }

    const estimator = await prisma.estimator.findUnique({
      where: { id: estimatorId },
      select: {
        id: true,
        fullName: true,
        email: true,
        pdfUrl: true,
        createdAt: true,
      },
    });

    if (!estimator) {
      return NextResponse.json({ error: 'Estimator not found' }, { status: 404 });
    }

    return NextResponse.json({
      estimatorId: estimator.id,
      fullName: estimator.fullName,
      email: estimator.email,
      pdfUrl: estimator.pdfUrl,
      createdAt: estimator.createdAt,
      hasPdf: !!estimator.pdfUrl,
    });

  } catch (error) {
    console.error('Error retrieving estimator PDF info:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve estimator PDF information',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { estimatorId, pdfUrl } = await request.json();

    if (!estimatorId || !pdfUrl) {
      return NextResponse.json({ error: 'Estimator ID and PDF URL are required' }, { status: 400 });
    }

    const updatedEstimator = await prisma.estimator.update({
      where: { id: estimatorId },
      data: { pdfUrl: pdfUrl },
      select: {
        id: true,
        fullName: true,
        email: true,
        pdfUrl: true,
        updatedAt: true,
      },
    });

    console.log(`PDF URL updated for estimator ${estimatorId}: ${pdfUrl}`);

    return NextResponse.json({
      message: 'PDF URL updated successfully',
      estimator: updatedEstimator,
    });

  } catch (error) {
    console.error('Error updating estimator PDF URL:', error);
    
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Estimator not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      error: 'Failed to update estimator PDF URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 