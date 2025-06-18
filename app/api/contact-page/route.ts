import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendContactPageNotification } from '@/lib/emailNotifications';

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

    return NextResponse.json({ 
      message: "Contact form submitted successfully",
      submissionId: contactPageSubmission.id 
    })
  } catch (error) {
    console.error('Error submitting contact page form:', error);
    return NextResponse.json({ error: 'Failed to submit contact form.' }, { status: 500 });
  }
}