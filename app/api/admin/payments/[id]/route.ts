import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/emailer';
import { sendPaymentStatusUpdateToClient } from '@/lib/whatsapp';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const documentId = params.id;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Payment status is required' },
        { status: 400 }
      );
    }

    // Check if document exists
    const document = await prisma.clientDocument.findUnique({
      where: { id: documentId },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Update payment status in ClientDocument
    const updatedDocument = await prisma.clientDocument.update({
      where: { id: documentId },
      data: {
        paymentStatus: status,
        verifiedBy: status === 'VERIFIED' ? 'varanasiartist.omg@gmail.com' : null,
        verifiedAt: status === 'VERIFIED' ? new Date() : null,
        paidAt: status === 'PAID' ? new Date() : null
      }
    });

    // Update corresponding PaymentRecord if it exists
    const paymentRecord = await prisma.paymentRecord.findFirst({
      where: { documentId: documentId }
    });

    if (paymentRecord) {
      await prisma.paymentRecord.update({
        where: { id: paymentRecord.id },
        data: {
          status: status as any, // Convert to PaymentStatus enum
          verifiedBy: status === 'VERIFIED' ? 'varanasiartist.omg@gmail.com' : null,
          verifiedAt: status === 'VERIFIED' ? new Date() : null
        }
      });
    }

    // Send notifications to client about status change
    if (document.client && (status === 'VERIFIED' || status === 'PAID' || status === 'PENDING')) {
      // Send email notification
      try {
        let statusMessage = '';
        let statusColor = '';
        let nextSteps = '';

        switch (status) {
          case 'VERIFIED':
            statusMessage = 'Payment Verified';
            statusColor = '#28a745';
            nextSteps = 'Your payment has been confirmed and invoice will be marked as paid.';
            break;
          case 'PAID':
            statusMessage = 'Payment Completed';
            statusColor = '#007bff';
            nextSteps = 'Payment successfully processed. Invoice is now fully paid.';
            break;
          case 'PENDING':
            statusMessage = 'Payment Under Review';
            statusColor = '#ffc107';
            nextSteps = 'Please check your payment details and contact support if needed.';
            break;
        }

        const emailSubject = `Payment Status Update - Invoice ${document.invoiceNumber}`;
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #0A2540; color: white; padding: 20px; text-align: center;">
              <h1>Tech Morphers</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #1d3557;">Payment Status Updated</h2>
              <p>Dear ${document.client.fullName},</p>
              
              <p>Your payment status has been updated.</p>
              
              <div style="background-color: #e9f5fe; border-left: 4px solid ${statusColor}; padding: 15px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1d3557;">Payment Details</h3>
                <p style="margin-bottom: 5px;"><strong>Invoice:</strong> ${document.invoiceNumber}</p>
                <p style="margin-bottom: 5px;"><strong>Amount:</strong> ${document.currency} ${Number(document.invoiceAmount).toFixed(2)}</p>
                <p style="margin-bottom: 0;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusMessage}</span></p>
              </div>
              
              <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #155724;">What This Means</h3>
                <p style="margin-bottom: 0;">${nextSteps}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard" 
                   style="background-color: #2a9df4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View in Client Portal
                </a>
              </div>
              
              <p>${status === 'PENDING' ? 'If you have any questions, please contact our support team.' : 'Thank you for choosing Tech Morphers!'}</p>
              
              <p>Best regards,<br>Tech Morphers Team</p>
            </div>
            
            <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              © ${new Date().getFullYear()} Tech Morphers. All rights reserved.
            </div>
          </div>
        `;

        const textContent = `Payment Status Update

Dear ${document.client.fullName},

Your payment status has been updated.

Payment Details:
- Invoice: ${document.invoiceNumber}
- Amount: ${document.currency} ${Number(document.invoiceAmount).toFixed(2)}
- Status: ${statusMessage}

What This Means:
${nextSteps}

View in Client Portal: ${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard

${status === 'PENDING' ? 'If you have any questions, please contact our support team.' : 'Thank you for choosing Tech Morphers!'}

Best regards,
Tech Morphers Team`;

        await sendEmail({
          to: document.client.email,
          subject: emailSubject,
          html: htmlContent,
          text: textContent
        });

        console.log('Payment status update email sent to client');
      } catch (emailError) {
        console.error('Failed to send payment status email to client:', emailError);
      }

      // Send WhatsApp notification
      if (document.client.phone) {
        try {
          await sendPaymentStatusUpdateToClient({
            clientName: document.client.fullName,
            clientPhone: document.client.phone,
            invoiceNumber: document.invoiceNumber!,
            amount: Number(document.invoiceAmount!),
            currency: document.currency!,
            status: status,
            submissionId: document.id
          });

          console.log('Payment status update WhatsApp sent to client');
        } catch (whatsappError) {
          console.error('Failed to send payment status WhatsApp to client:', whatsappError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully',
      document: updatedDocument,
      paymentRecordUpdated: !!paymentRecord
    });

  } catch (error: any) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 