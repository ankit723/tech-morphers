import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendContactPageNotification } from '@/lib/emailNotifications';
import { sendFormLeadNotificationToAdmin } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
  const { name, email, phone, message } = await request.json()
    
    const contactPageSubmission = await prisma.contactPage.create({
    data: { name, email, phone, message }
  })

    console.log('New contact page submission saved:', contactPageSubmission);

    // Send email notification to user
    try {
      const emailResult = await sendContactPageNotification({
        name,
        email,
        phone,
        message,
        submissionId: contactPageSubmission.id,
      });

      if (emailResult.error) {
        console.error('Failed to send email notification:', emailResult.error);
        // Don't fail the API call if email fails, just log it
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
        phone,
        companyName: undefined,
        message,
        formType: 'Contact Page Form',
        submissionId: contactPageSubmission.id,
      });

      if (whatsappResult.success) {
        console.log('WhatsApp notification sent to admin for contact page submission');
      } else {
        console.error('Failed to send WhatsApp notification to admin:', whatsappResult.error);
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp notification to admin:', whatsappError);
      // Don't fail the API call if WhatsApp fails
    }

    return NextResponse.json({ 
      message: "Contact form submitted successfully",
      submissionId: contactPageSubmission.id 
    })
  } catch (error) {
    console.error('Error submitting contact page form:', error);
    return NextResponse.json({ error: 'Failed to submit contact form.' }, { status: 500 });
  }
}