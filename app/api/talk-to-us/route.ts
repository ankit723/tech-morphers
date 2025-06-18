import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendTalkToUsNotification } from '@/lib/emailNotifications';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, companyName, message } = await request.json()
    
    const talkToUsSubmission = await prisma.talkToUs.create({
      data: { name, email, phone, companyName, message }
  })

    console.log('New Talk to Us submission saved:', talkToUsSubmission);

    // Send email notification to user
    try {
      const emailResult = await sendTalkToUsNotification({
        name,
        email,
        phone: phone || undefined,
        companyName: companyName || undefined,
        message,
        submissionId: talkToUsSubmission.id,
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
      message: "TalkToUs form submitted successfully",
      submissionId: talkToUsSubmission.id 
    })
  } catch (error) {
    console.error('Error submitting Talk to Us form:', error);
    return NextResponse.json({ error: 'Failed to submit Talk to Us form.' }, { status: 500 });
  }
}