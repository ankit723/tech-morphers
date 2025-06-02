import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Package } from '@prisma/client'; // Import the enum

// Helper to validate enum, not strictly necessary if form sends valid IDs
function isValidPackage(pkg: string): pkg is Package {
  return Object.values(Package).includes(pkg as Package);
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const { fullName, email, phone, companyName, selectedPackage, message } = formData;

    // Basic validation
    if (!fullName || !email || !phone || !selectedPackage || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (!isValidPackage(selectedPackage)) {
        return NextResponse.json({ error: 'Invalid package selected.' }, { status: 400 });
    }

    const contactSubmission = await prisma.contactUs.create({
      data: {
        name: fullName, // Ensure field names match Prisma schema
        email,
        phone,
        companyName: companyName || null, // Handle optional field
        selectedPackage: selectedPackage as Package, // Cast to enum type
        message,
      },
    });

    console.log('New contact form submission saved:', contactSubmission);
    return NextResponse.json({ 
      message: 'Contact form submitted successfully!', 
      submissionId: contactSubmission.id 
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    // Handle potential Prisma errors, e.g., unique constraint if any
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'A submission with these details might already exist.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to submit contact form.' }, { status: 500 });
  }
} 