import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/emailer';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

// Function to send email notification for document upload using Resend
async function sendDocumentEmailNotification(clientEmail: string, clientName: string, documentTitle: string, documentType: string) {
  const subject = `📄 New ${documentType} Document Available - ${documentTitle}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Document Available - Tech Morphers</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        .document-info { background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀 Tech Morphers</div>
          <h1 style="margin: 0; font-size: 24px;">New Document Available</h1>
        </div>
        
        <div class="content">
          <h2 style="color: #667eea; margin-top: 0;">Hello ${clientName},</h2>
          
          <p>We're pleased to inform you that a new document has been uploaded to your Tech Morphers account and is now ready for your review.</p>
          
          <div class="document-info">
            <h3 style="margin-top: 0; color: #333;">📋 Document Details:</h3>
            <p><strong>Document Title:</strong> ${documentTitle}</p>
            <p><strong>Document Type:</strong> ${documentType}</p>
            <p><strong>Upload Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin-bottom: 0;"><strong>Status:</strong> Ready for Review</p>
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Log into your Tech Morphers client portal to view the document</li>
            <li>Review the document contents carefully</li>
            <li>If this is a contract or agreement, you may need to digitally sign it</li>
            <li>Contact us if you have any questions or concerns</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard" class="button" style="color: white;">
              🔗 Access Your Dashboard
            </a>
          </div>
          
          <p style="margin-bottom: 0;"><strong>Need Help?</strong> Our support team is here to assist you. Simply reply to this email or contact us through your client portal.</p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;"><strong>Tech Morphers</strong> - Transforming Ideas into Digital Reality</p>
          <p style="margin: 5px 0;">📧 support@techmorphers.com | 🌐 www.techmorphers.com</p>
          <p style="margin: 5px 0; font-size: 11px;">This is an automated notification. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `New Document Available - Tech Morphers

Dear ${clientName},

We're pleased to inform you that a new document has been uploaded to your Tech Morphers account and is now ready for your review.

Document Details:
- Document Title: ${documentTitle}
- Document Type: ${documentType}
- Upload Date: ${new Date().toLocaleDateString()}
- Status: Ready for Review

What's Next?
- Log into your Tech Morphers client portal to view the document
- Review the document contents carefully
- If this is a contract or agreement, you may need to digitally sign it
- Contact us if you have any questions or concerns

Access Your Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard

Need Help? Our support team is here to assist you. Simply reply to this email or contact us through your client portal.

Best regards,
Tech Morphers Team
📧 support@techmorphers.com | 🌐 www.techmorphers.com

This is an automated notification.`;

  try {
    const result = await sendEmail({
      to: clientEmail,
      subject: subject,
      html: htmlContent,
      text: textContent
    });

    if (result.error) {
      console.error('Error sending document upload email to client:', result.error);
      throw new Error(`Email sending failed: ${result.error.message}`);
    }

    console.log('Document upload email sent successfully to client:', result.data?.id);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending document upload email to client:', error);
    throw error;
  }
}

// Function to send WhatsApp notification for document upload
async function sendDocumentWhatsAppNotification(clientPhone: string, clientName: string, documentTitle: string, documentType: string) {
  const message = `📄 *New ${documentType} Document Available!*

Hi ${clientName}! 

A new *${documentType}* document has been uploaded to your Tech Morphers account:

📋 *Document:* ${documentTitle}
${documentType !== 'INVOICE' ? '✍️ *Action Required:* Please review and sign if required' : '💰 *Action Required:* Please review payment details'}

🔗 *Access your portal:* ${process.env.NEXT_PUBLIC_APP_URL}/client/login

📞 Questions? Reply to this message or contact our support team.

Best regards,
*Tech Morphers Team* 🚀`;

  try {
    const result = await sendWhatsAppMessage({
      to: clientPhone,
      message
    });

    if (result.success) {
      console.log(`📱 Document WhatsApp notification sent to ${clientPhone}`);
      return true;
    } else {
      console.error('Failed to send document WhatsApp notification:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Error sending document WhatsApp notification:', error);
    return false;
  }
}

// Function to send admin notification using Resend
async function sendAdminNotification(clientName: string, documentTitle: string, documentType: string, clientEmail: string) {
  const adminEmail = 'varanasiartist.omg@gmail.com';
  const subject = `🔔 New Document Uploaded: ${documentTitle} by ${clientName}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Document Upload Notification - Tech Morphers Admin</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
        .info-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .client-info { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔧 Tech Morphers Admin</div>
          <h1 style="margin: 0; font-size: 24px;">New Document Upload Alert</h1>
        </div>
        
        <div class="content">
          <h2 style="color: #f5576c; margin-top: 0;">📋 Document Upload Notification</h2>
          
          <p>A new document has been uploaded by a client and requires your attention.</p>
          
          <div class="client-info">
            <h3 style="margin-top: 0; color: #1976d2;">👤 Client Information:</h3>
            <p><strong>Client Name:</strong> ${clientName}</p>
            <p><strong>Client Email:</strong> ${clientEmail}</p>
            <p style="margin-bottom: 0;"><strong>Upload Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #856404;">📄 Document Details:</h3>
            <p><strong>Document Title:</strong> ${documentTitle}</p>
            <p><strong>Document Type:</strong> ${documentType}</p>
            <p style="margin-bottom: 0;"><strong>Status:</strong> Awaiting Admin Review</p>
          </div>
          
          <p><strong>⚡ Action Required:</strong></p>
          <ul>
            <li>Review the uploaded document in the admin dashboard</li>
            <li>Verify document compliance and quality</li>
            <li>Process any required approvals or signatures</li>
            <li>Follow up with client if needed</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/clients" 
               style="display: inline-block; padding: 12px 24px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px;">
              🚀 Open Admin Dashboard
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;"><strong>Tech Morphers Admin Portal</strong></p>
          <p style="margin: 5px 0;">This is an automated admin notification from the Tech Morphers system.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `New Document Upload Alert - Tech Morphers Admin

Document Upload Notification

A new document has been uploaded by a client and requires your attention.

Client Information:
- Client Name: ${clientName}
- Client Email: ${clientEmail}
- Upload Time: ${new Date().toLocaleString()}

Document Details:
- Document Title: ${documentTitle}
- Document Type: ${documentType}
- Status: Awaiting Admin Review

Action Required:
- Review the uploaded document in the admin dashboard
- Verify document compliance and quality
- Process any required approvals or signatures
- Follow up with client if needed

Open Admin Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/admin/clients

Tech Morphers Admin Portal
This is an automated admin notification from the Tech Morphers system.`;

  try {
    const result = await sendEmail({
      to: adminEmail,
      subject: subject,
      html: htmlContent,
      text: textContent
    });

    if (result.error) {
      console.error('Error sending admin notification email:', result.error);
      throw new Error(`Admin email sending failed: ${result.error.message}`);
    }

    console.log('Admin notification email sent successfully:', result.data?.id);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { clientId, documentId, notificationType } = await request.json();

    if (!clientId || !documentId) {
      return NextResponse.json(
        { error: 'Client ID and Document ID are required' },
        { status: 400 }
      );
    }

    // Get client and document details
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        fullName: true,
        email: true,
        phone: true
      }
    });

    const document = await prisma.clientDocument.findUnique({
      where: { id: documentId },
      select: {
        title: true,
        type: true
      }
    });

    if (!client || !document) {
      return NextResponse.json(
        { error: 'Client or document not found' },
        { status: 404 }
      );
    }

    const notifications = [];
    let emailSent = false;
    let whatsappSent = false;
    let adminNotified = false;

    // Send email notification to client
    if (!notificationType || notificationType === 'email' || notificationType === 'both') {
      try {
        await sendDocumentEmailNotification(
          client.email,
          client.fullName,
          document.title,
          document.type
        );
        emailSent = true;
        notifications.push('email');
      } catch (error) {
        console.error('Failed to send email notification:', error);
        emailSent = false;
      }
    }

    // Send WhatsApp notification to client if phone number is available
    if (client.phone && (!notificationType || notificationType === 'whatsapp' || notificationType === 'both')) {
      whatsappSent = await sendDocumentWhatsAppNotification(
        client.phone,
        client.fullName,
        document.title,
        document.type
      );
      if (whatsappSent) notifications.push('whatsapp');
    }

    // Send admin notification
    try {
      await sendAdminNotification(
        client.fullName,
        document.title,
        document.type,
        client.email
      );
      adminNotified = true;
      notifications.push('admin');
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      adminNotified = false;
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications sent successfully',
      notifications: notifications,
      details: {
        emailSent,
        whatsappSent: client.phone ? whatsappSent : false,
        clientHasPhone: !!client.phone,
        adminNotified
      }
    });

  } catch (error: any) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 