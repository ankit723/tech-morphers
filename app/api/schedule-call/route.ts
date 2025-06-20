import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

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
      }
    });

    // Here you could integrate with calendar services like Google Calendar
    // or generate meeting links with Zoom/Meet

    return NextResponse.json({
      success: true,
      message: 'Call scheduled successfully!',
      callId: scheduledCall.id,
      scheduledDate: scheduledCall.scheduledDate,
      scheduledTime: scheduledCall.scheduledTime,
    });

  } catch (error) {
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