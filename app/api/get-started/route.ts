import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendGetStartedNotification } from '@/lib/emailNotifications';
import { sendFormLeadNotificationToAdmin } from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const { name, email, phone, service, budget, companyName, projectVision } = formData;

    // Basic validation
    if (!name || !email || !service || !projectVision) {
      return NextResponse.json({ error: 'Missing required fields: Name, Email, Service, and Project Vision are required.' }, { status: 400 });
    }

    // Optional: More specific validation for email, phone, etc.

    const getStartedSubmission = await prisma.getStarted.create({
      data: {
        name,
        email,
        phone: phone || null,
        service,
        budget: budget || null,
        companyName: companyName || null,
        projectVision,
      },
    });

    console.log('New Get Started submission saved:', getStartedSubmission);

    // Send email notification to user
    try {
      const emailResult = await sendGetStartedNotification({
        name,
        email,
        phone: phone || undefined,
        service,
        budget: budget || undefined,
        companyName: companyName || undefined,
        projectVision,
        submissionId: getStartedSubmission.id,
      });

      if (emailResult.error) {
        console.error('Failed to send email notification:', emailResult.error);
        // Don't fail the API call if email fails
      } else {
        console.log('Email notification sent successfully to:', email);
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the API call if email fails
    }

    // Send WhatsApp notification to admin
    try {
      const whatsappResult = await sendFormLeadNotificationToAdmin({
        name,
        email,
        phone: phone || undefined,
        companyName: companyName || undefined,
        message: `Service: ${service}\nBudget: ${budget || 'Not specified'}\nProject Vision: ${projectVision}`,
        formType: 'Get Started Form',
        submissionId: getStartedSubmission.id,
      });

      if (whatsappResult.success) {
        console.log('WhatsApp notification sent to admin for get-started submission');
      } else {
        console.error('Failed to send WhatsApp notification to admin:', whatsappResult.error);
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp notification to admin:', whatsappError);
      // Don't fail the API call if WhatsApp fails
    }

    return NextResponse.json({ 
      message: 'Get Started form submitted successfully!', 
      submissionId: getStartedSubmission.id 
    }, { status: 201 });

  } catch (error) {
    console.error('Error handling Get Started form submission:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
      // Example: if you add a unique constraint on email for GetStarted model
      // if ((error as any).meta?.target?.includes('email')) {
      //   return NextResponse.json({ error: 'An inquiry with this email already exists.' }, { status: 409 });
      // }
      return NextResponse.json({ error: 'A submission with these details might already exist.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 