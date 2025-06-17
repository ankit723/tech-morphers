import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Package } from '@prisma/client'; // Import the enum

// Helper to validate and map plan IDs to Package enum
function mapToPackageEnum(planId: string): Package | null {
  const packageMapping: Record<string, Package> = {
    'starter': Package.STARTER,
    'growth': Package.GROWTH,
    'pro': Package.PRO,
    'custom': Package.ENTERPRISE, // Map 'custom' plan to ENTERPRISE enum
  };
  
  return packageMapping[planId.toLowerCase()] || null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const { fullName, email, phone, companyName, selectedPackage, message } = formData;

    // Basic validation
    if (!fullName || !email || !phone || !selectedPackage || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Map the plan ID to the correct enum value
    const mappedPackage = mapToPackageEnum(selectedPackage);
    if (!mappedPackage) {
      return NextResponse.json({ error: 'Invalid package selected.' }, { status: 400 });
    }

    const contactSubmission = await prisma.contactUs.create({
      data: {
        name: fullName, // Ensure field names match Prisma schema
        email,
        phone,
        companyName: companyName || null, // Handle optional field
        selectedPackage: mappedPackage, // Use the mapped enum value
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