import { NextResponse } from 'next/server';
import { getClientDashboardData } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get client session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('client-session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const clientId = session.id;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const dashboardData = await getClientDashboardData(clientId);

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error: any) {
    console.error('Error getting client dashboard data:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 