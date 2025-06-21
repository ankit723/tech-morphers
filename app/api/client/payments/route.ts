import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { uploadFileToGCS } from '@/lib/googleCloudStorage';
import { sendEmail } from '@/lib/emailer';
import { sendPaymentNotificationToClient, sendPaymentNotificationToAdmin } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    // Get client session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('client-session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const clientId = session.id;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const documentId = formData.get('documentId') as string;
    const transactionId = formData.get('transactionId') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const paymentNotes = formData.get('paymentNotes') as string;
    const proofFile = formData.get('proofFile') as File;

    if (!documentId || !transactionId || !paymentMethod || !proofFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the document belongs to the client and is an invoice
    const document = await prisma.clientDocument.findFirst({
      where: {
        id: documentId,
        clientId: clientId,
        type: 'INVOICE'
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Invoice not found or access denied' },
        { status: 404 }
      );
    }

    // Check if payment already submitted
    if (document.paymentStatus !== 'PENDING') {
      return NextResponse.json(
        { error: 'Payment already submitted for this invoice' },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(proofFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (proofFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await proofFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate filename
    const timestamp = Date.now();
    const fileExtension = proofFile.name.split('.').pop();
    const fileName = `payment_proof_${document.invoiceNumber}_${timestamp}.${fileExtension}`;

    // Upload to Google Cloud Storage
    const uploadResult = await uploadFileToGCS(
      buffer,
      fileName,
      `payment-proofs/${clientId}/`
    );

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Failed to upload payment proof' },
        { status: 500 }
      );
    }

    // Update document with payment information
    const updatedDocument = await prisma.clientDocument.update({
      where: { id: documentId },
      data: {
        paymentStatus: 'SUBMITTED',
        paymentProof: uploadResult.url!,
        transactionId,
        paymentMethod,
        paymentNotes: paymentNotes || null,
        paidAt: new Date()
      }
    });

    // Create payment record
    await prisma.paymentRecord.create({
      data: {
        documentId,
        clientId,
        amount: Number(document.invoiceAmount!),
        currency: document.currency!,
        paymentMethod,
        transactionId,
        proofImageUrl: uploadResult.url!,
        proofFileName: uploadResult.fileName!,
        status: 'SUBMITTED'
      }
    });

    // Get client details for notifications
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        fullName: true,
        email: true,
        phone: true
      }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Send email notification to client
    try {
      const emailSubject = `Payment Submitted - Invoice ${document.invoiceNumber}`;
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0A2540; color: white; padding: 20px; text-align: center;">
            <h1>Tech Morphers</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #1d3557;">💳 Payment Submitted Successfully</h2>
            <p>Dear ${client.fullName},</p>
            
            <p>Your payment has been successfully submitted and is now under review.</p>
            
            <div style="background-color: #e9f5fe; border-left: 4px solid #2a9df4; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1d3557;">Payment Details</h3>
              <p style="margin-bottom: 5px;"><strong>Invoice:</strong> ${document.invoiceNumber}</p>
              <p style="margin-bottom: 5px;"><strong>Amount:</strong> ${document.currency} ${Number(document.invoiceAmount).toFixed(2)}</p>
              <p style="margin-bottom: 5px;"><strong>Payment Method:</strong> ${paymentMethod}</p>
              <p style="margin-bottom: 0;"><strong>Transaction ID:</strong> ${transactionId}</p>
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #856404;">What's Next?</h3>
              <ul style="margin-bottom: 0;">
                <li>Our team will verify your payment within 24-48 hours</li>
                <li>You'll receive a confirmation once approved</li>
                <li>Invoice status will be updated in your client portal</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard" 
                 style="background-color: #2a9df4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Track Payment Status
              </a>
            </div>
            
            <p>Thank you for your payment!</p>
            
            <p>Best regards,<br>Tech Morphers Team</p>
          </div>
          
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} Tech Morphers. All rights reserved.
          </div>
        </div>
      `;

      const textContent = `Payment Submitted Successfully

Dear ${client.fullName},

Your payment has been successfully submitted and is now under review.

Payment Details:
- Invoice: ${document.invoiceNumber}
- Amount: ${document.currency} ${Number(document.invoiceAmount).toFixed(2)}
- Payment Method: ${paymentMethod}
- Transaction ID: ${transactionId}

What's Next:
- Our team will verify your payment within 24-48 hours
- You'll receive a confirmation once approved
- Invoice status will be updated in your client portal

Track your payment status: ${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard

Thank you for your payment!

Best regards,
Tech Morphers Team`;

      await sendEmail({
        to: client.email,
        subject: emailSubject,
        html: htmlContent,
        text: textContent
      });

      console.log('Payment confirmation email sent to client');
    } catch (emailError) {
      console.error('Failed to send payment email to client:', emailError);
    }

    // Send WhatsApp notification to client
    if (client.phone) {
      try {
        await sendPaymentNotificationToClient({
          clientName: client.fullName,
          clientPhone: client.phone,
          invoiceNumber: document.invoiceNumber!,
          amount: Number(document.invoiceAmount!),
          currency: document.currency!,
          paymentMethod,
          transactionId,
          submissionId: updatedDocument.id
        });

        console.log('Payment WhatsApp notification sent to client');
      } catch (whatsappError) {
        console.error('Failed to send payment WhatsApp to client:', whatsappError);
      }
    }

    // Send notifications to admin
    try {
      await sendPaymentNotificationToAdmin({
        clientName: client.fullName,
        clientEmail: client.email,
        clientPhone: client.phone || undefined,
        invoiceNumber: document.invoiceNumber!,
        amount: Number(document.invoiceAmount!),
        currency: document.currency!,
        paymentMethod,
        transactionId,
        paymentProofUrl: uploadResult.url!,
        submissionId: updatedDocument.id
      });

      console.log('Payment WhatsApp notification sent to admin');
    } catch (whatsappError) {
      console.error('Failed to send payment WhatsApp to admin:', whatsappError);
    }

    // Send email notification to admin
    try {
      const adminEmail = 'varanasiartist.omg@gmail.com'; // Updated admin email
      const adminSubject = `New Payment Submitted - ${document.invoiceNumber} by ${client.fullName}`;
      
      const adminHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0A2540; color: white; padding: 20px; text-align: center;">
            <h1>Tech Morphers Admin</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #1d3557;">💰 New Payment Submitted</h2>
            
            <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #155724;">Client Details</h3>
              <p style="margin-bottom: 5px;"><strong>Name:</strong> ${client.fullName}</p>
              <p style="margin-bottom: 5px;"><strong>Email:</strong> ${client.email}</p>
              ${client.phone ? `<p style="margin-bottom: 0;"><strong>Phone:</strong> ${client.phone}</p>` : ''}
            </div>
            
            <div style="background-color: #cce5ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #004085;">Payment Details</h3>
              <p style="margin-bottom: 5px;"><strong>Invoice:</strong> ${document.invoiceNumber}</p>
              <p style="margin-bottom: 5px;"><strong>Amount:</strong> ${document.currency} ${Number(document.invoiceAmount).toFixed(2)}</p>
              <p style="margin-bottom: 5px;"><strong>Method:</strong> ${paymentMethod}</p>
              <p style="margin-bottom: 5px;"><strong>Transaction ID:</strong> ${transactionId}</p>
              <p style="margin-bottom: 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${uploadResult.url}" 
                 style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">
                View Payment Proof
              </a>
              <a href="https://techmorphers.com/admin/clients" 
                 style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Admin Dashboard
              </a>
            </div>
            
            <h3 style="color: #1d3557;">Action Required:</h3>
            <ul>
              <li>Verify the payment proof</li>
              <li>Approve or reject the payment</li>
              <li>Update client on payment status</li>
            </ul>
          </div>
          
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} Tech Morphers. All rights reserved.
          </div>
        </div>
      `;

      const adminTextContent = `New Payment Submitted

Client: ${client.fullName}
Email: ${client.email}
${client.phone ? `Phone: ${client.phone}` : ''}

Payment Details:
- Invoice: ${document.invoiceNumber}
- Amount: ${document.currency} ${Number(document.invoiceAmount).toFixed(2)}
- Method: ${paymentMethod}
- Transaction ID: ${transactionId}
- Submitted: ${new Date().toLocaleString()}

Payment Proof: ${uploadResult.url}

Action Required:
- Verify the payment proof
- Approve or reject the payment
- Update client on payment status

Admin Dashboard: https://techmorphers.com/admin/clients

Tech Morphers Admin Team`;

      await sendEmail({
        to: adminEmail,
        subject: adminSubject,
        html: adminHtmlContent,
        text: adminTextContent
      });

      console.log('Payment notification email sent to admin');
    } catch (emailError) {
      console.error('Failed to send payment email to admin:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment proof submitted successfully. It will be reviewed by our team.',
      payment: {
        id: updatedDocument.id,
        status: 'SUBMITTED',
        transactionId,
        paymentMethod,
        submittedAt: new Date()
      }
    });

  } catch (error: any) {
    console.error('Error submitting payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get client session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('client-session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const clientId = session.id;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get all payment records for the client
    const payments = await prisma.paymentRecord.findMany({
      where: { clientId },
      include: {
        document: {
          select: {
            id: true,
            title: true,
            invoiceNumber: true,
            invoiceAmount: true,
            currency: true,
            dueDate: true
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
        submittedAt: payment.createdAt,
        verifiedAt: payment.verifiedAt,
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