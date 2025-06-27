import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendNewsletterNotification } from '@/lib/emailNotifications';
import { sendFormLeadNotificationToAdmin } from '@/lib/whatsapp';

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

    // Send WhatsApp notification to admin
    try {
      const whatsappResult = await sendFormLeadNotificationToAdmin({
        name: 'Newsletter Subscriber',
        email,
        phone: undefined,
        companyName: undefined,
        message: 'New newsletter subscription',
        formType: 'Newsletter Subscription (Let\'s Talk)',
        submissionId: letsTalkSubmission.id,
      });

      if (whatsappResult.success) {
        console.log('WhatsApp notification sent to admin for newsletter subscription');
      } else {
        console.error('Failed to send WhatsApp notification to admin:', whatsappResult.error);
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp notification to admin:', whatsappError);
      // Don't fail the API call if WhatsApp fails
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