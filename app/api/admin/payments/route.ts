import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Fetch all payment records for admin review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (clientId) {
      whereClause.clientId = clientId;
    }

    const payments = await prisma.paymentRecord.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
            companyName: true
          }
        },
        document: {
          select: {
            id: true,
            title: true,
            invoiceNumber: true,
            invoiceAmount: true,
            currency: true,
            dueDate: true,
            fileUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      payments: payments.map(payment => ({
        id: payment.id,
        amount: Number(payment.amount),
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        status: payment.status,
        proofImageUrl: payment.proofImageUrl,
        proofFileName: payment.proofFileName,
        verifiedBy: payment.verifiedBy,
        verifiedAt: payment.verifiedAt,
        createdAt: payment.createdAt,
        client: payment.client,
        document: {
          ...payment.document,
          invoiceAmount: payment.document.invoiceAmount ? Number(payment.document.invoiceAmount) : undefined
        }
      }))
    });

  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update payment status (verify/reject)
export async function PUT(request: NextRequest) {
  try {
    const { paymentId, status, verificationNotes, verifiedBy } = await request.json();

    if (!paymentId || !status || !verifiedBy) {
      return NextResponse.json(
        { error: 'Payment ID, status, and verifier are required' },
        { status: 400 }
      );
    }

    // Valid status transitions
    const validStatuses = ['VERIFIED', 'PAID', 'FAILED', 'DISPUTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
        { status: 400 }
      );
    }

    // Update payment record
    const updatedPayment = await prisma.paymentRecord.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedBy,
        verifiedAt: new Date(),
        accountingNotes: verificationNotes || null
      },
      include: {
        document: true
      }
    });

    // Update the corresponding document's payment status
    await prisma.clientDocument.update({
      where: { id: updatedPayment.documentId },
      data: {
        paymentStatus: status,
        paymentVerified: status === 'VERIFIED' || status === 'PAID',
        verifiedBy,
        verifiedAt: new Date(),
        verificationNotes: verificationNotes || null
      }
    });

    return NextResponse.json({
      success: true,
      message: `Payment ${status.toLowerCase()} successfully`,
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        verifiedBy: updatedPayment.verifiedBy,
        verifiedAt: updatedPayment.verifiedAt
      }
    });

  } catch (error: any) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 