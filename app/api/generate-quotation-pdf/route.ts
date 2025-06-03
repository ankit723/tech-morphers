import { NextRequest, NextResponse } from 'next/server';
import { Estimator } from '@prisma/client';
import { generateQuotationPDF } from '@/lib/pdfGenerator';
import { prisma } from '@/lib/db'; // Import prisma client

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const estimatorId = body.estimatorId as string;

    if (!estimatorId) {
      return NextResponse.json({ error: 'Estimator ID is required' }, { status: 400 });
    }

    // Fetch the estimator data from the database
    const estimateData: Estimator | null = await prisma.estimator.findUnique({
      where: { id: estimatorId },
    });

    if (!estimateData) {
      return NextResponse.json({ error: 'Estimator data not found' }, { status: 404 });
    }

    // Generate the PDF
    const pdfBlob = await generateQuotationPDF(estimateData);

    // Create a response with the PDF blob
    const response = new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Quotation-EST-${estimateData.id.substring(0,8).toUpperCase()}.pdf"`,
      },
    });

    return response;

  } catch (error) {
    console.error("Error generating PDF:", error);
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: "Failed to generate PDF", details: errorMessage }, { status: 500 });
  }
} 