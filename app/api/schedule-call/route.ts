import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { generateGoogleMeetLink, generateCalendarAttachment } from '@/lib/calendar';
import { sendScheduleCallConfirmationToUser, sendScheduleCallNotificationToAdmin } from '@/lib/whatsapp';
import { sendEmail } from '@/lib/emailer';

const scheduleCallSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  companyName: z.string().optional(),
  projectBrief: z.string().min(10, 'Project brief must be at least 10 characters'),
  scheduledDate: z.string().datetime('Invalid date format'),
  scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  timezone: z.string().default('UTC'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = scheduleCallSchema.parse(body);

    // Check if the time slot is available
    const existingCall = await prisma.scheduledCall.findFirst({
      where: {
        scheduledDate: new Date(validatedData.scheduledDate),
        scheduledTime: validatedData.scheduledTime,
        status: {
          in: ['SCHEDULED', 'CONFIRMED']
        }
      }
    });

    if (existingCall) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please choose another time.' },
        { status: 409 }
      );
    }

    // Generate Google Meet link
    const meetingLink = generateGoogleMeetLink();

    // Create the scheduled call
    const scheduledCall = await prisma.scheduledCall.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        companyName: validatedData.companyName,
        projectBrief: validatedData.projectBrief,
        scheduledDate: new Date(validatedData.scheduledDate),
        scheduledTime: validatedData.scheduledTime,
        timezone: validatedData.timezone,
        status: 'SCHEDULED',
        meetingLink: meetingLink,
      }
    });

    console.log('New scheduled call created:', scheduledCall.id);

    // Generate calendar attachment
    const calendarAttachment = generateCalendarAttachment(
      scheduledCall.name,
      scheduledCall.email,
      scheduledCall.scheduledDate,
      scheduledCall.scheduledTime,
      scheduledCall.duration,
      scheduledCall.projectBrief,
      meetingLink
    );

    // Send only the Google Meet-styled calendar invite email (removed duplicate confirmation email)
    try {
      // Send Google Meet-styled calendar invite email with attachment
      await sendEmail({
        to: scheduledCall.email,
        subject: `📅 Calendar Invite: Tech Morphers Consultation Call - ${scheduledCall.name}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Video Call Header -->
            <div style="background: #1d76d3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 400;">🎥 Video Call</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Tech Morphers Consultation Call</p>
            </div>
            
            <!-- Meeting Details -->
            <div style="background: #f8f9fa; padding: 24px; border: 1px solid #dadce0; border-top: none;">
              <h2 style="margin: 0 0 16px 0; color: #3c4043; font-size: 20px;">Meeting Details</h2>
              
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #dadce0; margin-bottom: 16px;">
                <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 14px;">📅 <strong>Date:</strong> ${new Date(scheduledCall.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 14px;">⏰ <strong>Time:</strong> ${scheduledCall.scheduledTime}</p>
                <p style="margin: 0; color: #5f6368; font-size: 14px;">⏱️ <strong>Duration:</strong> ${scheduledCall.duration} minutes</p>
              </div>
              
              <!-- Join Button -->
              <div style="text-align: center; margin: 24px 0;">
                <a href="${meetingLink}" style="background: #1d76d3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                  🎥 Join Video Call
                </a>
              </div>
              
              <!-- Meeting Link -->
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #dadce0; text-align: center;">
                <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 12px;">Or join by clicking this link:</p>
                <a href="${meetingLink}" style="color: #1d76d3; font-size: 14px; word-break: break-all; font-family: monospace;">${meetingLink}</a>
              </div>
              
              <!-- Project Brief -->
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #dadce0; margin-top: 16px;">
                <h3 style="margin: 0 0 8px 0; color: #3c4043; font-size: 16px;">📋 Your Project Brief:</h3>
                <p style="margin: 0; color: #5f6368; font-size: 14px; font-style: italic;">"${scheduledCall.projectBrief}"</p>
              </div>
              
              <!-- Preparation Guidelines -->
              <div style="background: #e8f0fe; padding: 16px; border-radius: 8px; margin-top: 16px;">
                <h3 style="margin: 0 0 12px 0; color: #1a73e8; font-size: 16px;">📝 Before Our Call:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #5f6368; font-size: 14px;">
                  <li>Prepare any relevant documents or ideas</li>
                  <li>Test your camera and microphone beforehand</li>
                  <li>Have your project requirements ready to discuss</li>
                  <li>Join the meeting 2-3 minutes early</li>
                </ul>
              </div>
              
              <!-- Video Call Info -->
              <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin-top: 16px; text-align: center;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  💡 <strong>No app download required</strong> - Join directly from your browser
                </p>
              </div>
              
              <!-- Calendar Attachment Note -->
              <div style="background: #e8f0fe; padding: 16px; border-radius: 8px; margin-top: 16px; text-align: center;">
                <p style="margin: 0; color: #1a73e8; font-size: 14px;">
                  📎 <strong>Calendar invite attached</strong> - Click to add this meeting to your calendar
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 16px; text-align: center; border: 1px solid #dadce0; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #5f6368; font-size: 12px;">
                This meeting was scheduled through Tech Morphers<br>
                <a href="https://www.techmorphers.com" style="color: #1d76d3;">techmorphers.com</a>
              </p>
            </div>
          </div>
        `,
        text: `📅 Tech Morphers Consultation Call

Join Video Call: ${meetingLink}

Date: ${new Date(scheduledCall.scheduledDate).toLocaleDateString()}
Time: ${scheduledCall.scheduledTime}
Duration: ${scheduledCall.duration} minutes

Your Project Brief: "${scheduledCall.projectBrief}"

Before Our Call:
• Prepare any relevant documents or ideas
• Test your camera and microphone beforehand  
• Have your project requirements ready to discuss
• Join the meeting 2-3 minutes early

No app download required - join directly from your browser.

Please find the calendar invite attached to add this meeting to your calendar.

Tech Morphers Team
https://www.techmorphers.com`,
        attachments: [calendarAttachment]
      });

      console.log('Google Meet-styled calendar invite sent successfully to:', scheduledCall.email);
    } catch (emailError) {
      console.error('Error sending calendar invite email:', emailError);
    }

    // Send WhatsApp message to user
    let whatsappUserResult = null;
    try {
      whatsappUserResult = await sendScheduleCallConfirmationToUser({
        name: scheduledCall.name,
        phone: scheduledCall.phone,
        scheduledDate: scheduledCall.scheduledDate,
        scheduledTime: scheduledCall.scheduledTime,
        duration: scheduledCall.duration,
        meetingLink: meetingLink,
        submissionId: scheduledCall.id,
        projectBrief: scheduledCall.projectBrief,
      });

      if (whatsappUserResult.success) {
        console.log(`WhatsApp confirmation sent to user: ${scheduledCall.phone}`);
      } else {
        console.error('Failed to send WhatsApp message to user:', whatsappUserResult.error);
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp message to user:', whatsappError);
    }

    // Send WhatsApp notification to admin
    let whatsappAdminResult = null;
    try {
      whatsappAdminResult = await sendScheduleCallNotificationToAdmin({
        name: scheduledCall.name,
        email: scheduledCall.email,
        phone: scheduledCall.phone,
        companyName: scheduledCall.companyName || undefined,
        scheduledDate: scheduledCall.scheduledDate,
        scheduledTime: scheduledCall.scheduledTime,
        duration: scheduledCall.duration,
        meetingLink: meetingLink,
        submissionId: scheduledCall.id,
        projectBrief: scheduledCall.projectBrief,
      });

      if (whatsappAdminResult.success) {
        console.log('WhatsApp notification sent to admin for scheduled call');
      } else {
        console.error('Failed to send WhatsApp notification to admin:', whatsappAdminResult.error);
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp notification to admin:', whatsappError);
    }

    return NextResponse.json({
      success: true,
      message: 'Call scheduled successfully!',
      callId: scheduledCall.id,
      scheduledDate: scheduledCall.scheduledDate,
      scheduledTime: scheduledCall.scheduledTime,
      meetingLink: meetingLink,
      whatsapp: {
        userNotificationSent: whatsappUserResult?.success || false,
        adminNotificationSent: whatsappAdminResult?.success || false,
      },
    });

  } catch (error: any) {
    console.error('Error scheduling call:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to schedule call. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Get booked time slots for the specified date
    const bookedSlots = await prisma.scheduledCall.findMany({
      where: {
        scheduledDate: new Date(date),
        status: {
          in: ['SCHEDULED', 'CONFIRMED']
        }
      },
      select: {
        scheduledTime: true,
        duration: true,
      }
    });

    return NextResponse.json({
      success: true,
      bookedSlots: bookedSlots.map(slot => ({
        time: slot.scheduledTime,
        duration: slot.duration,
      }))
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
} 