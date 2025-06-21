import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadFileToGCS } from '@/lib/googleCloudStorage';
import { DocumentType } from '@prisma/client';
import { sendEmail } from '@/lib/emailer';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('clientId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const uploadedBy = formData.get('uploadedBy') as string;

    if (!file || !clientId || !title || !type || !uploadedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type (allow PDF and common document types)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
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

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate filename
    const timestamp = Date.now();
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
    const fileExtension = file.name.split('.').pop();
    const fileName = `${sanitizedTitle}_${timestamp}.${fileExtension}`;

    // Upload to Google Cloud Storage
    const uploadResult = await uploadFileToGCS(
      buffer,
      fileName,
      `client-documents/${clientId}/`
    );

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Save document record to database
    const document = await prisma.clientDocument.create({
      data: {
        clientId,
        title,
        description: description || null,
        type: type as DocumentType, // DocumentType enum
        fileUrl: uploadResult.url!,
        fileName: uploadResult.fileName!,
        fileSize: file.size,
        uploadedBy,
        requiresSignature: type !== 'INVOICE', // All documents except invoices require signature
        isSigned: false // Default to not signed
      }
    });

    // Send notifications to the client
    try {
      // Send email notification to client
      await sendEmail({
        to: client.email,
        subject: `New Document: ${document.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Document Available</h2>
            <p>Dear ${client.fullName},</p>
            <p>A new document has been uploaded for you.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0;">Document Details:</h3>
              <p><strong>Title:</strong> ${document.title}</p>
              <p><strong>Type:</strong> ${document.type}</p>
              ${document.description ? `<p><strong>Description:</strong> ${document.description}</p>` : ''}
              ${document.requiresSignature ? '<p><strong>Action Required:</strong> This document requires your signature</p>' : ''}
            </div>
            <p>Please log in to your client portal to view and download the document.</p>
            <p>Best regards,<br>Tech Morphers Team</p>
          </div>
        `
      });

      // Send WhatsApp notification if phone number exists
      if (client.phone) {
        try {
          const whatsappMessage = `📄 New Document from Tech Morphers

Dear ${client.fullName},

You have received a new document:
📋 Document: ${document.title}
📂 Type: ${document.type}
${document.requiresSignature ? '\n⚠️ Action Required: This document requires your signature' : ''}

Please log in to your client portal to view and download the document.

Thank you! 🙏`;

          await sendWhatsAppMessage({
            to: client.phone,
            message: whatsappMessage
          });
        } catch (whatsappError) {
          console.error('Failed to send WhatsApp notification:', whatsappError);
        }
      }

      // Send admin notification
      await sendEmail({
        to: 'varanasiartist.omg@gmail.com',
        subject: `Document Uploaded: ${document.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Document Uploaded</h2>
            <p>A new document has been uploaded for a client.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0;">Document Details:</h3>
              <p><strong>Client:</strong> ${client.fullName}</p>
              <p><strong>Document:</strong> ${document.title}</p>
              <p><strong>Type:</strong> ${document.type}</p>
              <p><strong>Uploaded By:</strong> ${uploadedBy}</p>
              <p><strong>Uploaded At:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>Document has been sent to the client for review.</p>
            <p>Best regards,<br>Tech Morphers System</p>
          </div>
        `
      });
    } catch (notificationError) {
      console.error('Failed to send notifications:', notificationError);
      // Don't fail the upload if notifications fail
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        description: document.description,
        type: document.type,
        fileUrl: document.fileUrl,
        fileName: document.fileName,
        fileSize: document.fileSize,
        uploadedAt: document.uploadedAt
      }
    });

  } catch (error: any) {
    console.error('Error uploading client document:', error);
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

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const documents = await prisma.clientDocument.findMany({
      where: { clientId },
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        fileUrl: true,
        fileName: true,
        fileSize: true,
        uploadedBy: true,
        uploadedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      documents
    });

  } catch (error: any) {
    console.error('Error fetching client documents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 