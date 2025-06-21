import { NextRequest, NextResponse } from 'next/server';
import { authenticateClient, changeClientPassword } from '@/lib/auth';
import { cookies } from 'next/headers';

// Login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await authenticateClient(email, password);

    if (result.success && result.client) {
      // Set session cookie (simple implementation)
      const cookieStore = await cookies();
      cookieStore.set('client-session', JSON.stringify({
        id: result.client.id,
        email: result.client.email,
        fullName: result.client.fullName
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return NextResponse.json({
        success: true,
        client: result.client
      });
    }

    return NextResponse.json(
      { error: result.error || 'Authentication failed' },
      { status: 401 }
    );

  } catch (error: any) {
    console.error('Error in client authentication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Change password
export async function PUT(request: NextRequest) {
  try {
    const { clientId, currentPassword, newPassword } = await request.json();

    if (!clientId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const result = await changeClientPassword(clientId, currentPassword, newPassword);

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: result.error || 'Failed to change password' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Error changing client password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('client-session');

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error in client logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 