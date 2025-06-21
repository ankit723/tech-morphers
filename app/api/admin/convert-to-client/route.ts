import { NextRequest, NextResponse } from 'next/server';
import { convertEstimatorToClient } from '@/lib/auth';
import { sendEmail } from '@/lib/emailer';

export async function POST(request: NextRequest) {
  try {
    const { estimatorId, adminEmail } = await request.json();

    if (!estimatorId || !adminEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await convertEstimatorToClient(estimatorId);

    if (result.success) {
      // Send welcome email to client with login credentials
      if (result.isNewClient) {
        try {
          await sendEmail({
            to: result.client.email,
            subject: 'Welcome to Tech Morphers Client Portal',
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #0A2540; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; font-size: 24px;">Welcome to Tech Morphers</h1>
                  <p style="margin: 8px 0 0 0; opacity: 0.9;">Your Client Portal is Ready</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 32px; border: 1px solid #dadce0; border-top: none;">
                  <h2 style="margin: 0 0 16px 0; color: #3c4043; font-size: 20px;">Hello ${result.client.fullName}!</h2>
                  
                  <p style="margin: 0 0 16px 0; color: #5f6368; font-size: 16px; line-height: 1.5;">
                    Great news! We've set up your personal client portal where you can access all your project documents, quotations, and agreements.
                  </p>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #dadce0; margin: 20px 0;">
                    <h3 style="margin: 0 0 12px 0; color: #1a73e8; font-size: 16px;">🔐 Your Login Credentials:</h3>
                    <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 14px;">
                      <strong>Email:</strong> ${result.client.email}
                    </p>
                    <p style="margin: 0 0 12px 0; color: #5f6368; font-size: 14px;">
                      <strong>Password:</strong> <code style="background: #f1f3f4; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${result.systemPassword}</code>
                    </p>
                    <p style="margin: 0; color: #ea4335; font-size: 12px; font-style: italic;">
                      ⚠️ Please change your password after first login for security
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin: 24px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/login" style="background: #1d76d3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                      🚀 Access Your Portal
                    </a>
                  </div>
                  
                  <div style="background: #e8f0fe; padding: 16px; border-radius: 8px; margin-top: 20px;">
                    <h3 style="margin: 0 0 8px 0; color: #1a73e8; font-size: 14px;">📋 What you can do in your portal:</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #5f6368; font-size: 14px;">
                      <li>View and download your project quotations</li>
                      <li>Access signed agreements and contracts</li>
                      <li>Download invoices and payment documents</li>
                      <li>Track your project progress</li>
                    </ul>
                  </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 16px; text-align: center; border: 1px solid #dadce0; border-top: none; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0; color: #5f6368; font-size: 12px;">
                    Need help? Contact us at hello@techmorphers.com<br>
                    <a href="https://www.techmorphers.com" style="color: #1d76d3;">techmorphers.com</a>
                  </p>
                </div>
              </div>
            `,
            text: `Welcome to Tech Morphers Client Portal!

Hello ${result.client.fullName},

Your personal client portal is now ready! You can access all your project documents, quotations, and agreements.

Login Credentials:
Email: ${result.client.email}
Password: ${result.systemPassword}

Please change your password after first login for security.

Access your portal: ${process.env.NEXT_PUBLIC_APP_URL}/client/login

What you can do:
- View and download project quotations
- Access signed agreements and contracts  
- Download invoices and payment documents
- Track project progress

Need help? Contact us at hello@techmorphers.com
Tech Morphers Team`
          });

          console.log('Welcome email sent to new client:', result.client.email);
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Don't fail the conversion if email fails
        }
      }

      return NextResponse.json({
        success: true,
        client: result.client,
        isNewClient: result.isNewClient,
        systemPassword: result.isNewClient ? result.systemPassword : undefined
      });
    }

    return NextResponse.json(
      { error: 'Failed to convert to client' },
      { status: 500 }
    );

  } catch (error: any) {
    console.error('Error converting to client:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 