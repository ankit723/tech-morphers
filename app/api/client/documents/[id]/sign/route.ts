import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/emailer';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params;
    const documentId = params.id;

    // Verify the document belongs to the client and is not an invoice
    const document = await prisma.clientDocument.findFirst({
      where: {
        id: documentId,
        clientId: clientId,
        type: {
          not: 'INVOICE' // Can't sign invoices
        }
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or cannot be signed' },
        { status: 404 }
      );
    }

    // Check if document is already signed
    if (document.isSigned) {
      return NextResponse.json(
        { error: 'Document is already signed' },
        { status: 400 }
      );
    }

    // Check if document requires signature
    if (!document.requiresSignature) {
      return NextResponse.json(
        { error: 'Document does not require signature' },
        { status: 400 }
      );
    }

    // Update document as signed
    const updatedDocument = await prisma.clientDocument.update({
      where: { id: documentId },
      data: {
        isSigned: true,
        signedAt: new Date()
      }
    });

    // Get client details for notification
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        fullName: true,
        email: true
      }
    });

    // Send notification to admin about document signing
    try {
      await sendEmail({
        to: 'varanasiartist.omg@gmail.com',
        subject: `Document Signed: ${document.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Document Signed</h2>
            <p>A document has been signed by a client.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0;">Document Details:</h3>
              <p><strong>Client:</strong> ${client?.fullName}</p>
              <p><strong>Document:</strong> ${document.title}</p>
              <p><strong>Type:</strong> ${document.type}</p>
              <p><strong>Signed At:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>Please review the signed document in the admin dashboard.</p>
            <p>Best regards,<br>Tech Morphers System</p>
          </div>
        `
      });
    } catch (notificationError) {
      console.error('Failed to send admin notification:', notificationError);
      // Don't fail the signing if notification fails
    }

    return NextResponse.json({
      success: true,
      message: 'Document signed successfully',
      document: {
        id: updatedDocument.id,
        title: updatedDocument.title,
        type: updatedDocument.type,
        isSigned: updatedDocument.isSigned,
        signedAt: updatedDocument.signedAt
      }
    });

  } catch (error: any) {
    console.error('Error signing document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 