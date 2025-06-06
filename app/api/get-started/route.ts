import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const { name, email, phone, service, budget, companyName, projectVision } = formData;

    // Basic validation
    if (!name || !email || !service || !projectVision) {
      return NextResponse.json({ error: 'Missing required fields: Name, Email, Service, and Project Vision are required.' }, { status: 400 });
    }

    // Optional: More specific validation for email, phone, etc.

    const getStartedSubmission = await prisma.getStarted.create({
      data: {
        name,
        email,
        phone: phone || null,
        service,
        budget: budget || null,
        companyName: companyName || null,
        projectVision,
      },
    });

    console.log('New Get Started submission saved:', getStartedSubmission);
    return NextResponse.json({ 
      message: 'Get Started form submitted successfully!', 
      submissionId: getStartedSubmission.id 
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting Get Started form:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
      // Example: if you add a unique constraint on email for GetStarted model
      // if ((error as any).meta?.target?.includes('email')) {
      //   return NextResponse.json({ error: 'An inquiry with this email already exists.' }, { status: 409 });
      // }
      return NextResponse.json({ error: 'A submission with these details might already exist.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to submit Get Started form.' }, { status: 500 });
  }
} 