import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const documentId = params.id
    const { paymentStatus, verificationNotes, verifiedBy } = await request.json()

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    if (!paymentStatus) {
      return NextResponse.json(
        { error: 'Payment status is required' },
        { status: 400 }
      )
    }

    // Validate payment status
    const validStatuses = ['PENDING', 'SUBMITTED', 'VERIFIED', 'PAID']
    if (!validStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
        { status: 400 }
      )
    }

    // Check if document exists and is an invoice
    const document = await prisma.clientDocument.findUnique({
      where: { id: documentId },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        estimator: {
          select: {
            id: true,
            projectType: true,
            projectPurpose: true
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    if (document.type !== 'INVOICE') {
      return NextResponse.json(
        { error: 'Payment status can only be updated for invoices' },
        { status: 400 }
      )
    }

    // Update payment status
    const updateData: any = {
      paymentStatus,
      verifiedAt: new Date(),
      verifiedBy: verifiedBy || 'Admin'
    }

    // Add verification notes if provided
    if (verificationNotes) {
      updateData.description = verificationNotes
    }

    // Set paid date if status is PAID
    if (paymentStatus === 'PAID') {
      updateData.paidAt = new Date()
    }

    const updatedDocument = await prisma.clientDocument.update({
      where: { id: documentId },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        estimator: {
          select: {
            id: true,
            projectType: true,
            projectPurpose: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully',
      document: {
        id: updatedDocument.id,
        title: updatedDocument.title,
        type: updatedDocument.type,
        paymentStatus: updatedDocument.paymentStatus,
        verifiedAt: updatedDocument.verifiedAt,
        verifiedBy: updatedDocument.verifiedBy,
        paidAt: updatedDocument.paidAt,
        client: updatedDocument.client,
        project: updatedDocument.estimator
      }
    })

  } catch (error: any) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 