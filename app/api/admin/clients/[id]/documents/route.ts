import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const clientId = params.id

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      )
    }

    // Get all documents for this client with project information
    const documents = await prisma.clientDocument.findMany({
      where: { clientId },
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
    })

    const formattedDocuments = documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      type: doc.type,
      uploadedAt: doc.uploadedAt,
      fileUrl: doc.fileUrl,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      uploadedBy: doc.uploadedBy,
      requiresSignature: doc.requiresSignature,
      isSigned: doc.isSigned,
      signedAt: doc.signedAt,
      invoiceNumber: doc.invoiceNumber,
      invoiceAmount: doc.invoiceAmount ? Number(doc.invoiceAmount) : null,
      currency: doc.currency,
      dueDate: doc.dueDate,
      paymentStatus: doc.paymentStatus,
      description: doc.description,
      project: doc.estimator
    }))

    return NextResponse.json({
      success: true,
      documents: formattedDocuments
    })

  } catch (error: any) {
    console.error('Error fetching client documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 