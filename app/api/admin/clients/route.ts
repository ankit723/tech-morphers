import { NextResponse } from 'next/server';
import { getClients } from '@/lib/actions';

export async function GET() {
  try {
    const clients = await getClients();
    
    return NextResponse.json({
      success: true,
      clients: clients.map(client => ({
        id: client.id,
        fullName: client.fullName,
        email: client.email,
        companyName: client.companyName,
        phone: client.phone,
        hasChangedPassword: client.hasChangedPassword,
        systemPassword: client.systemPassword,
        lastLoginAt: client.lastLoginAt,
        createdAt: client.createdAt,
        estimators: client.estimators,
        documents: client.documents
      }))
    });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 