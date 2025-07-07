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
        contentType: doc.contentType,
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
    const contentType = request.headers.get('content-type');
    
    // Handle JSON requests (for links)
    if (contentType?.includes('application/json')) {
      const { clientId, projectId, title, description, type, requiresSignature, uploadedBy, contentType: itemContentType, url } = await request.json();

      if (!clientId || !projectId || !title || !type || !url) {
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required fields (clientId, projectId, title, type, url)' 
        }, { status: 400 });
      }

      // Validate URL
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid URL provided' 
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

      // Save link record to database
      const document = await prisma.clientDocument.create({
        data: {
          clientId,
          estimatorId: projectId,
          title,
          description: description || null,
          type: type as any,
          contentType: itemContentType || 'LINK',
          fileName: `link_${Date.now()}`, // Placeholder filename for links
          fileUrl: url, // Store the URL directly
          fileSize: 0, // Links don't have file size
          uploadedBy: uploadedBy || 'varanasiartist.omg@gmail.com',
          requiresSignature: requiresSignature || false,
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

      // Send notifications for links
      try {
        await sendEmail({
          to: document.client.email,
          subject: `New Link: ${document.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">New Link Shared</h2>
              <p>Dear ${document.client.fullName},</p>
              <p>A new link has been shared with you for your project.</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0;">Link Details:</h3>
                <p><strong>Title:</strong> ${document.title}</p>
                <p><strong>Type:</strong> ${document.type}</p>
                <p><strong>Project:</strong> ${document.estimator?.projectType || 'General Project'}</p>
                <p><strong>Link:</strong> <a href="${url}" target="_blank">${url}</a></p>
                ${description ? `<p><strong>Description:</strong> ${description}</p>` : ''}
              </div>
              <p>Best regards,<br>Tech Morphers Team</p>
            </div>
          `
        });
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }

      return NextResponse.json({
        success: true,
        document: {
          id: document.id,
          title: document.title,
          type: document.type,
          contentType: document.contentType,
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
    }

    // Handle FormData requests (for file uploads)
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('clientId') as string;
    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const requiresSignature = formData.get('requiresSignature') === 'true';
    const uploadedBy = formData.get('uploadedBy') as string;
    const itemContentType = formData.get('contentType') as string;

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

    // Validate file size based on content type
    const maxSize = itemContentType === 'VIDEO' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for videos, 10MB for documents
    const sizeLabel = itemContentType === 'VIDEO' ? '100MB' : '10MB';
    
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: `File size exceeds ${sizeLabel} limit` 
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
        contentType: (itemContentType || 'FILE') as any,
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
      const contentLabel = itemContentType === 'VIDEO' ? 'video' : 'document';
      const subjectText = itemContentType === 'VIDEO' ? 'New Video' : 'New Document';
      
      await sendEmail({
        to: document.client.email,
        subject: `${subjectText}: ${document.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New ${contentLabel.charAt(0).toUpperCase() + contentLabel.slice(1)} Available</h2>
            <p>Dear ${document.client.fullName},</p>
            <p>A new ${contentLabel} has been uploaded for your project.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0;">${contentLabel.charAt(0).toUpperCase() + contentLabel.slice(1)} Details:</h3>
              <p><strong>Title:</strong> ${document.title}</p>
              <p><strong>Type:</strong> ${document.type}</p>
              <p><strong>Project:</strong> ${document.estimator?.projectType || 'General Project'}</p>
              ${document.requiresSignature ? '<p><strong>Action Required:</strong> This document requires your signature</p>' : ''}
              ${description ? `<p><strong>Description:</strong> ${description}</p>` : ''}
            </div>
            <p>Please log in to your client portal to view and download the ${contentLabel}.</p>
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
          const contentEmoji = itemContentType === 'VIDEO' ? '🎥' : '📄';
          const contentText = itemContentType === 'VIDEO' ? 'video' : 'document';
          
          const whatsappMessage = `${contentEmoji} New ${contentText.charAt(0).toUpperCase() + contentText.slice(1)} from Tech Morphers

Dear ${document.client.fullName},

You have received a new ${contentText}:
📋 ${contentText.charAt(0).toUpperCase() + contentText.slice(1)}: ${document.title}
📂 Type: ${document.type}
${document.requiresSignature ? `\n⚠️ Action Required: This ${contentText} requires your signature` : ''}

Please log in to your client portal to view and download the ${contentText}.

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
        subject: `${contentLabel.charAt(0).toUpperCase() + contentLabel.slice(1)} Uploaded: ${document.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">${contentLabel.charAt(0).toUpperCase() + contentLabel.slice(1)} Uploaded</h2>
            <p>A new ${contentLabel} has been uploaded for a client.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0;">${contentLabel.charAt(0).toUpperCase() + contentLabel.slice(1)} Details:</h3>
              <p><strong>Client:</strong> ${document.client.fullName}</p>
              <p><strong>${contentLabel.charAt(0).toUpperCase() + contentLabel.slice(1)}:</strong> ${document.title}</p>
              <p><strong>Type:</strong> ${document.type}</p>
              <p><strong>Project:</strong> ${document.estimator?.projectType || 'General Project'}</p>
              <p><strong>Uploaded At:</strong> ${new Date().toLocaleString()}</p>
              ${itemContentType === 'VIDEO' ? `<p><strong>File Size:</strong> ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>` : ''}
            </div>
            <p>Please review the ${contentLabel} in the admin dashboard.</p>
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
        contentType: document.contentType,
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