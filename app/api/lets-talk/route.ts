import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendNewsletterNotification } from '@/lib/emailNotifications';

export async function POST(request: NextRequest) {
  try {
  const { email } = await request.json()
    
    const letsTalkSubmission = await prisma.letsTalk.create({
    data: { email }
  })

    console.log('New newsletter subscription saved:', letsTalkSubmission);

    // Send email notification to user
    try {
      const emailResult = await sendNewsletterNotification({
        email,
        subscriptionId: letsTalkSubmission.id,
      });

      if (emailResult.error) {
        console.error('Failed to send email notification:', emailResult.error);
        // Don't fail the API call if email fails, just log it
      } else {
        console.log('Newsletter welcome email sent successfully to:', email);
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the API call if email fails
    }

    return NextResponse.json({ 
      message: "Newsletter subscription successful",
      subscriptionId: letsTalkSubmission.id 
    })
  } catch (error) {
    console.error('Error submitting newsletter subscription:', error);
    return NextResponse.json({ error: 'Failed to subscribe to newsletter.' }, { status: 500 });
  }
}