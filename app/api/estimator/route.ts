import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Estimator } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Basic validation (can be expanded with Zod or similar)
    if (!body.fullName || !body.email) {
      return NextResponse.json({ error: 'Full name and email are required.' }, { status: 400 });
    }

    // Ensure arrays are handled correctly, even if empty
    const features = Array.isArray(body.features) ? body.features : [];
    const addons = Array.isArray(body.addons) ? body.addons : [];

    const estimatorData: Omit<Estimator, 'id' | 'createdAt' | 'updatedAt'> = {
      projectType: body.projectType || null,
      projectPurpose: body.projectPurpose || null,
      targetAudience: body.targetAudience || null,
      features: features,
      designPreference: body.designPreference || null,
      needsCustomBranding: typeof body.needsCustomBranding === 'boolean' ? body.needsCustomBranding : null,
      deliveryTimeline: body.deliveryTimeline || null,
      budgetRange: body.budgetRange || null,
      addons: addons,
      customRequests: body.customRequests || null,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone || null,
      companyName: body.companyName || null,
      userRole: body.userRole || null,
    };

    const savedEstimator = await prisma.estimator.create({
      data: estimatorData,
    });

    return NextResponse.json(savedEstimator, { status: 201 });

  } catch (error) {
    console.error("Error saving estimator data:", error);
    let errorMessage = "An unknown error occurred while saving the estimator data.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: "Failed to save estimator data", details: errorMessage }, { status: 500 });
  }
} 