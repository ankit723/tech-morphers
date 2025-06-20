import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { generateCalendarAttachment, generateGoogleMeetLink } from '@/lib/calendar';
import { sendScheduleCallConfirmationToUser, sendScheduleCallNotificationToAdmin } from '@/lib/whatsapp';
import { sendScheduleCallNotification } from '@/lib/emailNotifications';
import { sendEmail } from '@/lib/emailer';

const updateCallSchema = z.object({
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED']).optional(),
  adminNotes: z.string().optional(),
  meetingLink: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateCallSchema.parse(body);

    // Get the current call data to check for status changes
    const currentCall = await prisma.scheduledCall.findUnique({
      where: { id: id }
    });

    if (!currentCall) {
      return NextResponse.json(
        { error: 'Scheduled call not found' },
        { status: 404 }
      );
    }

    const updatedCall = await prisma.scheduledCall.update({
      where: {
        id: id,
      },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    // If status is being updated to CONFIRMED and we have meeting details, send notifications
    if (validatedData.status === 'CONFIRMED' && 
        currentCall.status !== 'CONFIRMED' && 
        updatedCall.meetingLink) {
      
      console.log('Call confirmed, sending notifications...');

      // Generate calendar attachment
      const calendarAttachment = generateCalendarAttachment(
        updatedCall.name,
        updatedCall.email,
        updatedCall.scheduledDate,
        updatedCall.scheduledTime,
        updatedCall.duration,
        updatedCall.projectBrief,
        updatedCall.meetingLink
      );

      // Send email notification with calendar invite
      try {
        const emailResult = await sendScheduleCallNotification({
          name: updatedCall.name,
          email: updatedCall.email,
          phone: updatedCall.phone,
          companyName: updatedCall.companyName || undefined,
          projectBrief: updatedCall.projectBrief,
          scheduledDate: updatedCall.scheduledDate.toISOString(),
          scheduledTime: updatedCall.scheduledTime,
          duration: updatedCall.duration,
          meetingLink: updatedCall.meetingLink,
          submissionId: updatedCall.id,
        });

        // Also send calendar invite as attachment
        await sendEmail({
          to: updatedCall.email,
          subject: `📅 Calendar Invite: Tech Morphers Consultation Call - ${updatedCall.name}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
              <!-- Video Call Header -->
              <div style="background: #1d76d3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 400;">🎥 Video Call</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">Tech Morphers Consultation Call</p>
              </div>
              
              <!-- Meeting Details -->
              <div style="background: #f8f9fa; padding: 24px; border: 1px solid #dadce0; border-top: none;">
                <h2 style="margin: 0 0 16px 0; color: #3c4043; font-size: 20px;">Meeting Confirmed!</h2>
                
                <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #dadce0; margin-bottom: 16px;">
                  <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 14px;">📅 <strong>Date:</strong> ${updatedCall.scheduledDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 14px;">⏰ <strong>Time:</strong> ${updatedCall.scheduledTime}</p>
                  <p style="margin: 0; color: #5f6368; font-size: 14px;">⏱️ <strong>Duration:</strong> ${updatedCall.duration} minutes</p>
                </div>
                
                <!-- Join Button -->
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${updatedCall.meetingLink}" style="background: #1d76d3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    🎥 Join Video Call
                  </a>
                </div>
                
                <!-- Meeting Link -->
                <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #dadce0; text-align: center;">
                  <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 12px;">Or join by clicking this link:</p>
                  <a href="${updatedCall.meetingLink}" style="color: #1d76d3; font-size: 14px; word-break: break-all; font-family: monospace;">${updatedCall.meetingLink}</a>
                </div>
                
                <!-- Project Brief -->
                <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #dadce0; margin-top: 16px;">
                  <h3 style="margin: 0 0 8px 0; color: #3c4043; font-size: 16px;">📋 Your Project Brief:</h3>
                  <p style="margin: 0; color: #5f6368; font-size: 14px; font-style: italic;">"${updatedCall.projectBrief}"</p>
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
                  Your consultation call has been confirmed by our team<br>
                  <a href="https://www.techmorphers.com" style="color: #1d76d3;">techmorphers.com</a>
                </p>
              </div>
            </div>
          `,
          text: `📅 Tech Morphers Consultation Call - CONFIRMED

Join with Video Call: ${updatedCall.meetingLink}

Date: ${updatedCall.scheduledDate.toLocaleDateString()}
Time: ${updatedCall.scheduledTime}
Duration: ${updatedCall.duration} minutes

Your Project Brief: "${updatedCall.projectBrief}"

Before Our Call:
• Prepare any relevant documents or ideas
• Test your camera and microphone beforehand
• Have your project requirements ready to discuss
• Join the meeting 2-3 minutes early

Your consultation call has been confirmed. Please find the calendar invite attached.

Tech Morphers Team
https://www.techmorphers.com`,
          attachments: [calendarAttachment]
        });

        if (emailResult.error) {
          console.error('Failed to send email notification:', emailResult.error);
        } else {
          console.log('Email notification sent successfully to:', updatedCall.email);
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }

      // Send WhatsApp message to user
      try {
        const whatsappUserResult = await sendScheduleCallConfirmationToUser({
          name: updatedCall.name,
          phone: updatedCall.phone,
          scheduledDate: updatedCall.scheduledDate,
          scheduledTime: updatedCall.scheduledTime,
          duration: updatedCall.duration,
          meetingLink: updatedCall.meetingLink,
          submissionId: updatedCall.id,
          projectBrief: updatedCall.projectBrief,
        });

        if (whatsappUserResult.success) {
          console.log(`WhatsApp confirmation sent to user: ${updatedCall.phone}`);
        } else {
          console.error('Failed to send WhatsApp message to user:', whatsappUserResult.error);
        }
      } catch (whatsappError) {
        console.error('Error sending WhatsApp message to user:', whatsappError);
      }

      // Send WhatsApp notification to admin
      try {
        const whatsappAdminResult = await sendScheduleCallNotificationToAdmin({
          name: updatedCall.name,
          email: updatedCall.email,
          phone: updatedCall.phone,
          companyName: updatedCall.companyName || undefined,
          scheduledDate: updatedCall.scheduledDate,
          scheduledTime: updatedCall.scheduledTime,
          duration: updatedCall.duration,
          meetingLink: updatedCall.meetingLink,
          submissionId: updatedCall.id,
          projectBrief: updatedCall.projectBrief,
        });

        if (whatsappAdminResult.success) {
          console.log('WhatsApp notification sent to admin for confirmed call');
        } else {
          console.error('Failed to send WhatsApp notification to admin:', whatsappAdminResult.error);
        }
      } catch (whatsappError) {
        console.error('Error sending WhatsApp notification to admin:', whatsappError);
      }
    }

    // Send only the Google Meet-styled calendar invite email when status is COMPLETED
    if (validatedData.status === 'COMPLETED' && updatedCall.meetingLink) {
      console.log('Call completed, sending Google Meet-styled calendar invite email...');

      try {
        // Generate calendar attachment
        const calendarAttachment = generateCalendarAttachment(
          updatedCall.name,
          updatedCall.email,
          updatedCall.scheduledDate,
          updatedCall.scheduledTime,
          updatedCall.duration,
          updatedCall.projectBrief,
          updatedCall.meetingLink || generateGoogleMeetLink()
        );

        // Send Google Meet-styled calendar invite email
        await sendEmail({
          to: updatedCall.email,
          subject: `📅 Calendar Invite: Tech Morphers Consultation Call - ${updatedCall.name}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
              <!-- Video Call Header -->
              <div style="background: #1d76d3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 400;">🎥 Video Call</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">Tech Morphers Consultation Call</p>
              </div>
              
              <!-- Meeting Details -->
              <div style="background: #f8f9fa; padding: 24px; border: 1px solid #dadce0; border-top: none;">
                <h2 style="margin: 0 0 16px 0; color: #3c4043; font-size: 20px;">Meeting Confirmed!</h2>
                
                <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #dadce0; margin-bottom: 16px;">
                  <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 14px;">📅 <strong>Date:</strong> ${updatedCall.scheduledDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 14px;">⏰ <strong>Time:</strong> ${updatedCall.scheduledTime}</p>
                  <p style="margin: 0; color: #5f6368; font-size: 14px;">⏱️ <strong>Duration:</strong> ${updatedCall.duration} minutes</p>
                </div>
                
                <!-- Join Button -->
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${updatedCall.meetingLink}" style="background: #1d76d3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    🎥 Join Video Call
                  </a>
                </div>
                
                <!-- Meeting Link -->
                <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #dadce0; text-align: center;">
                  <p style="margin: 0 0 8px 0; color: #5f6368; font-size: 12px;">Or join by clicking this link:</p>
                  <a href="${updatedCall.meetingLink}" style="color: #1d76d3; font-size: 14px; word-break: break-all; font-family: monospace;">${updatedCall.meetingLink}</a>
                </div>
                
                <!-- Project Brief -->
                <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #dadce0; margin-top: 16px;">
                  <h3 style="margin: 0 0 8px 0; color: #3c4043; font-size: 16px;">📋 Your Project Brief:</h3>
                  <p style="margin: 0; color: #5f6368; font-size: 14px; font-style: italic;">"${updatedCall.projectBrief}"</p>
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
                  Your consultation call has been confirmed by our team<br>
                  <a href="https://www.techmorphers.com" style="color: #1d76d3;">techmorphers.com</a>
                </p>
              </div>
            </div>
          `,
          text: `📅 Tech Morphers Consultation Call - CONFIRMED

Join with Video Call: ${updatedCall.meetingLink}

Date: ${updatedCall.scheduledDate.toLocaleDateString()}
Time: ${updatedCall.scheduledTime}
Duration: ${updatedCall.duration} minutes

Your Project Brief: "${updatedCall.projectBrief}"

Before Our Call:
• Prepare any relevant documents or ideas
• Test your camera and microphone beforehand
• Have your project requirements ready to discuss
• Join the meeting 2-3 minutes early

Your consultation call has been confirmed. Please find the calendar invite attached.

Tech Morphers Team
https://www.techmorphers.com`,
          attachments: [calendarAttachment]
        });

        console.log('Video Call-styled calendar invite sent to user on admin confirmation');
      } catch (emailError) {
        console.error('Error sending calendar invite on admin confirmation:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      call: updatedCall,
    });

  } catch (error) {
    console.error('Error updating scheduled call:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update scheduled call' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.scheduledCall.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Call deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting scheduled call:', error);
    return NextResponse.json(
      { error: 'Failed to delete scheduled call' },
      { status: 500 }
    );
  }
} 