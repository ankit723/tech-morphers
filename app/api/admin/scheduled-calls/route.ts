import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const calls = await prisma.scheduledCall.findMany({
      orderBy: {
        scheduledDate: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      calls: calls,
    });

  } catch (error) {
    console.error('Error fetching scheduled calls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled calls' },
      { status: 500 }
    );
  }
} 