import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { sendEmail } from '@/lib/emailer';

export async function POST(request: NextRequest) {
  try {
    const { clientId, documentId, clientName, documentTitle, documentType } = await request.json();

    if (!clientId || !documentId || !clientName || !documentTitle || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send WhatsApp notification to admin
    const adminWhatsApp = '+919795786303';
    const whatsappMessage = `✍️ *Document Signed!*

*Client Details:*
👤 *Name:* ${clientName}
📋 *Document:* ${documentTitle}
📄 *Type:* ${documentType}

✅ *Status:* Document has been digitally signed by the client

🎯 *Next Steps:*
• Review the signed document
• Proceed with project implementation
• Update client on next milestones

📄 *Reference ID:* ${documentId.substring(0, 8).toUpperCase()}

*Admin Dashboard:* https://techmorphers.com/admin/clients

*Tech Morphers CRM* 📊`;

    let whatsappSent = false;
    try {
      const whatsappResult = await sendWhatsAppMessage({
        to: adminWhatsApp,
        message: whatsappMessage
      });

      if (whatsappResult.success) {
        console.log('WhatsApp notification sent to admin for document signing');
        whatsappSent = true;
      } else {
        console.error('Failed to send WhatsApp notification to admin:', whatsappResult.error);
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp notification to admin:', whatsappError);
    }

    // Send email notification to admin
    const adminEmail = 'varanasiartist.omg@gmail.com'; // Updated admin email
    const emailSubject = `Document Signed: ${documentTitle} by ${clientName}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A2540; color: white; padding: 20px; text-align: center;">
          <h1>Tech Morphers Admin</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #1d3557;">✍️ Document Signed</h2>
          
          <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #155724;">Document Details</h3>
            <p style="margin-bottom: 5px;"><strong>Client:</strong> ${clientName}</p>
            <p style="margin-bottom: 5px;"><strong>Document:</strong> ${documentTitle}</p>
            <p style="margin-bottom: 5px;"><strong>Type:</strong> ${documentType}</p>
            <p style="margin-bottom: 0;"><strong>Signed:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://techmorphers.com/admin/clients" 
               style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View in Admin Dashboard
            </a>
          </div>
          
          <h3 style="color: #1d3557;">Next Steps:</h3>
          <ul>
            <li>Review the signed document in the admin dashboard</li>
            <li>Proceed with project implementation</li>
            <li>Update the client on next milestones</li>
          </ul>
          
          <p>The client has successfully signed the document. You can now proceed with the next steps in the project workflow.</p>
        </div>
        
        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          © ${new Date().getFullYear()} Tech Morphers. All rights reserved.
        </div>
      </div>
    `;

    const textContent = `Document Signed: ${documentTitle}

Client: ${clientName}
Document: ${documentTitle}
Type: ${documentType}
Signed: ${new Date().toLocaleString()}

The client has successfully signed the document. Please review it in the admin dashboard and proceed with the next steps.

Admin Dashboard: https://techmorphers.com/admin/clients

Tech Morphers Admin Team`;

    let emailSent = false;
    try {
      const emailResult = await sendEmail({
        to: adminEmail,
        subject: emailSubject,
        html: htmlContent,
        text: textContent
      });

      if (!emailResult.error) {
        console.log('Email notification sent to admin for document signing');
        emailSent = true;
      } else {
        console.error('Failed to send email notification to admin:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending email notification to admin:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Admin notifications sent successfully',
      notifications: {
        emailSent,
        whatsappSent
      }
    });

  } catch (error: any) {
    console.error('Error sending admin notifications for document signing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 