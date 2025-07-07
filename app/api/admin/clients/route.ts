import { NextRequest, NextResponse } from 'next/server';
import { getClients } from '@/lib/actions';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/emailer';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function GET() {
  try {
    const clients = await getClients();
    
    return NextResponse.json({
      success: true,
      clients: clients.map(client => ({
        id: client.id,
        fullName: client.fullName,
        email: client.email,
        companyName: client.companyName,
        phone: client.phone,
        hasChangedPassword: client.hasChangedPassword,
        systemPassword: client.systemPassword,
        lastLoginAt: client.lastLoginAt,
        createdAt: client.createdAt,
        estimators: client.estimators,
        documents: client.documents
      }))
    });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, companyName, password } = await request.json();

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    // Check if client already exists
    const existingClient = await prisma.client.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingClient) {
      return NextResponse.json(
        { error: 'Client with this email already exists' },
        { status: 409 }
      );
    }

    // Generate system password if not provided
    const systemPassword = password || Math.random().toString(36).slice(-8);
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(systemPassword, 10);

    // Create new client
    const newClient = await prisma.client.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        companyName: companyName?.trim() || null,
        password: hashedPassword,
        systemPassword: systemPassword,
        hasChangedPassword: false
      },
      include: {
        documents: true,
        estimators: true
      }
    });

    // Send welcome email to the new client
    try {
      await sendEmail({
        to: newClient.email,
        subject: 'Welcome to Tech Morphers Client Portal',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0A2540; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Welcome to Tech Morphers</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Your Client Portal is Ready</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 32px; border: 1px solid #dadce0; border-top: none;">
              <h2 style="margin: 0 0 16px 0; color: #3c4043; font-size: 20px;">Hello ${newClient.fullName},</h2>
              <p style="margin: 0 0 16px 0; color: #5f6368; line-height: 1.6;">
                Welcome to Tech Morphers! Your personal client portal has been set up and is ready for you to access.
              </p>
              
              <div style="background: #fff; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #dadce0;">
                <h3 style="margin: 0 0 16px 0; color: #3c4043; font-size: 18px;">Your Login Credentials</h3>
                <div style="background: #f8f9fa; padding: 16px; border-radius: 4px; margin: 16px 0;">
                  <p style="margin: 0 0 8px 0; color: #5f6368;"><strong>Email:</strong> ${newClient.email}</p>
                  <p style="margin: 0; color: #5f6368;"><strong>Password:</strong> ${systemPassword}</p>
                </div>
                <p style="margin: 16px 0 0 0; color: #ea4335; font-size: 14px;">
                  <strong>Important:</strong> Please change your password after your first login for security.
                </p>
              </div>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/login?email=${newClient.email}&password=${systemPassword}" 
                   style="background: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: 500;">
                  Access Your Portal
                </a>
              </div>
              
              <div style="background: #e8f0fe; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: #1a73e8; font-size: 16px;">What you can do in your portal:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #5f6368;">
                  <li style="margin: 8px 0;">View and download project quotations</li>
                  <li style="margin: 8px 0;">Access signed agreements and contracts</li>
                  <li style="margin: 8px 0;">Download invoices and payment documents</li>
                  <li style="margin: 8px 0;">Track project progress and updates</li>
                  <li style="margin: 8px 0;">Communicate with your project team</li>
                </ul>
              </div>
              
              <div style="border-top: 1px solid #dadce0; padding-top: 20px; margin-top: 32px;">
                <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 14px;">
                  Need help getting started? Our team is here to assist you.
                </p>
                <p style="margin: 0; color: #5f6368; font-size: 14px;">
                  Contact us: <a href="mailto:hello@techmorphers.com" style="color: #1a73e8;">hello@techmorphers.com</a>
                </p>
              </div>
            </div>
            
            <div style="background: #f8f9fa; color: #5f6368; text-align: center; padding: 16px; border-radius: 0 0 8px 8px; font-size: 14px;">
              <p style="margin: 0;">© 2024 Tech Morphers. All rights reserved.</p>
            </div>
          </div>
        `,
        text: `Welcome to Tech Morphers Client Portal!

Hello ${newClient.fullName},

Your personal client portal is now ready! You can access all your project documents, quotations, and agreements.

Login Credentials:
Email: ${newClient.email}
Password: ${systemPassword}

Please change your password after first login for security.

Access your portal: ${process.env.NEXT_PUBLIC_APP_URL}/client/login?email=${newClient.email}&password=${systemPassword}

What you can do:
- View and download project quotations
- Access signed agreements and contracts  
- Download invoices and payment documents
- Track project progress

Need help? Contact us at hello@techmorphers.com
Tech Morphers Team`
      });

      console.log('Welcome email sent to new client:', newClient.email);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the client creation if email fails
    }

    // Send WhatsApp notification to admin
    try {
      const adminWhatsApp = '+919795786303';
      const message = `👥 *New Client Created!*

*Client Details:*
👤 *Name:* ${newClient.fullName}
📧 *Email:* ${newClient.email}
${newClient.phone ? `📱 *Phone:* ${newClient.phone}` : ''}
${newClient.companyName ? `🏢 *Company:* ${newClient.companyName}` : ''}

*Account Information:*
🔑 *System Password:* ${systemPassword}
🔐 *Password Changed:* ${newClient.hasChangedPassword ? 'Yes' : 'No'}

📄 *Client ID:* ${newClient.id.substring(0, 8).toUpperCase()}

✅ *Status:*
• Client account created successfully
• Welcome email sent to client
• Ready for project assignment

🎯 *Admin Actions:*
• Assign project manager if needed
• Upload initial project documents
• Schedule onboarding call

*Admin Dashboard:* https://techmorphers.com/admin/clients/${newClient.id}

*Tech Morphers CRM* 📊`;

      const whatsappResult = await sendWhatsAppMessage({
        to: adminWhatsApp,
        message,
      });

      if (whatsappResult.success) {
        console.log('WhatsApp notification sent to admin for new client:', newClient.email);
      } else {
        console.error('Failed to send WhatsApp notification to admin:', whatsappResult.error);
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp notification to admin:', whatsappError);
      // Don't fail the client creation if WhatsApp fails
    }

    return NextResponse.json({
      success: true,
      client: {
        id: newClient.id,
        fullName: newClient.fullName,
        email: newClient.email,
        companyName: newClient.companyName,
        phone: newClient.phone,
        systemPassword: newClient.systemPassword,
        hasChangedPassword: newClient.hasChangedPassword,
        lastLoginAt: newClient.lastLoginAt,
        createdAt: newClient.createdAt,
        estimators: newClient.estimators,
        documents: newClient.documents
      },
      message: 'Client created successfully - welcome email sent and admin notified'
    });
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('id');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        documents: true,
        estimators: true,
        paymentRecords: true
      }
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Delete the client (cascade deletes will handle related records)
    await prisma.client.delete({
      where: { id: clientId }
    });

    // Send WhatsApp notification to admin about client deletion
    try {
      const adminWhatsApp = '+919795786303';
      const message = `🗑️ *Client Deleted!*

*Deleted Client Details:*
👤 *Name:* ${existingClient.fullName}
📧 *Email:* ${existingClient.email}
${existingClient.phone ? `📱 *Phone:* ${existingClient.phone}` : ''}
${existingClient.companyName ? `🏢 *Company:* ${existingClient.companyName}` : ''}

*Deletion Summary:*
📄 *Documents Deleted:* ${existingClient.documents.length}
📊 *Estimators Affected:* ${existingClient.estimators.length}
💳 *Payment Records:* ${existingClient.paymentRecords.length}

📄 *Client ID:* ${clientId.substring(0, 8).toUpperCase()}
🕐 *Deleted At:* ${new Date().toISOString()}

⚠️ *Data Permanently Removed:*
• Client account and credentials
• All associated documents
• Payment history and records
• Project assignments

*Admin Dashboard:* https://techmorphers.com/admin/clients

*Tech Morphers CRM* 📊`;

      await sendWhatsAppMessage({
        to: adminWhatsApp,
        message,
      });

      console.log('WhatsApp notification sent to admin for client deletion:', existingClient.email);
    } catch (whatsappError) {
      console.error('Error sending WhatsApp notification for client deletion:', whatsappError);
      // Don't fail the deletion if WhatsApp fails
    }

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
      deletedClient: {
        id: existingClient.id,
        fullName: existingClient.fullName,
        email: existingClient.email,
        documentsDeleted: existingClient.documents.length,
        estimatorsAffected: existingClient.estimators.length
      }
    });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 