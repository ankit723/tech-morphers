import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadFileToGCS } from '@/lib/googleCloudStorage';
import { sendEmail } from '@/lib/emailer';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project ID is required' 
      }, { status: 400 });
    }

    // Fetch documents related to this specific project (estimator)
    const documents = await prisma.clientDocument.findMany({
      where: {
        estimatorId: projectId
      },
      orderBy: {
        uploadedAt: 'desc'
      },
      include: {
        client: {
          select: {
            fullName: true,
            email: true
          }
        },
        estimator: {
          select: {
            projectType: true,
            projectPurpose: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      documents: documents.map(doc => ({
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
        client: doc.client,
        project: doc.estimator
      }))
    });
  } catch (error) {
    console.error('Error fetching project documents:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch documents' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('clientId') as string;
    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const requiresSignature = formData.get('requiresSignature') === 'true';
    const uploadedBy = formData.get('uploadedBy') as string;

    if (!file || !clientId || !projectId || !title || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields (file, clientId, projectId, title, type)' 
      }, { status: 400 });
    }

    // Verify that the project belongs to the client
    const project = await prisma.estimator.findFirst({
      where: {
        id: projectId,
        clientId: clientId
      }
    });

    if (!project) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found or does not belong to this client' 
      }, { status: 404 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: 'File size exceeds 10MB limit' 
      }, { status: 400 });
    }

    // Convert file to buffer for Google Cloud Storage
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
      `project-documents/${clientId}/${projectId}/`
    );

    if (!uploadResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: uploadResult.error || 'Failed to upload file' 
      }, { status: 500 });
    }

    // Save document record to database with proper project relationship
    const document = await prisma.clientDocument.create({
      data: {
        clientId,
        estimatorId: projectId, // Link to specific project
        title,
        description: description || null,
        type: type as any,
        fileName: uploadResult.fileName!,
        fileUrl: uploadResult.url!,
        fileSize: file.size,
        uploadedBy: uploadedBy || 'varanasiartist.omg@gmail.com',
        requiresSignature,
        isSigned: false
      },
      include: {
        client: {
          select: {
            fullName: true,
            email: true,
            phone: true
          }
        },
        estimator: {
          select: {
            projectType: true,
            projectPurpose: true
          }
        }
      }
    });

    // Send notification to client and admin
    try {
      // Send email notification to client
      await sendEmail({
        to: document.client.email,
        subject: `New Document: ${document.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Document Available</h2>
            <p>Dear ${document.client.fullName},</p>
            <p>A new document has been uploaded for your project.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0;">Document Details:</h3>
              <p><strong>Title:</strong> ${document.title}</p>
              <p><strong>Type:</strong> ${document.type}</p>
              <p><strong>Project:</strong> ${document.estimator?.projectType || 'General Project'}</p>
              ${document.requiresSignature ? '<p><strong>Action Required:</strong> This document requires your signature</p>' : ''}
            </div>
            <p>Please log in to your client portal to view and download the document.</p>
            <p>Best regards,<br>Tech Morphers Team</p>
          </div>
        `
      });

      // Send WhatsApp notification to client if phone exists
      const clientWithPhone = await prisma.client.findUnique({
        where: { id: clientId },
        select: { phone: true }
      });

      if (clientWithPhone?.phone) {
        try {
          const whatsappMessage = `📄 New Document from Tech Morphers

Dear ${document.client.fullName},

You have received a new document:
📋 Document: ${document.title}
📂 Type: ${document.type}
${document.requiresSignature ? '\n⚠️ Action Required: This document requires your signature' : ''}

Please log in to your client portal to view and download the document.

Thank you! 🙏`;

          await sendWhatsAppMessage({
            to: clientWithPhone.phone,
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
              <p><strong>Client:</strong> ${document.client.fullName}</p>
              <p><strong>Document:</strong> ${document.title}</p>
              <p><strong>Type:</strong> ${document.type}</p>
              <p><strong>Project:</strong> ${document.estimator?.projectType || 'General Project'}</p>
              <p><strong>Uploaded At:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>Please review the document in the admin dashboard.</p>
            <p>Best regards,<br>Tech Morphers System</p>
          </div>
        `
      });
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError)
      // Don't fail the upload if notification fails
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        type: document.type,
        uploadedAt: document.uploadedAt,
        fileUrl: document.fileUrl,
        fileName: document.fileName,
        fileSize: document.fileSize,
        uploadedBy: document.uploadedBy,
        requiresSignature: document.requiresSignature,
        isSigned: document.isSigned,
        description: document.description,
        client: document.client,
        project: document.estimator
      }
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload document' 
    }, { status: 500 });
  }
} 