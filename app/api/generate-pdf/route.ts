import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateQuotationPDF } from '@/lib/pdfGenerator';

export async function POST(req: NextRequest) {
  try {
    const { estimatorId } = await req.json();
    
    if (!estimatorId) {
      return NextResponse.json({ error: 'Estimator ID is required' }, { status: 400 });
    }

    // Fetch the estimator data from the database
    const estimatorData = await prisma.estimator.findUnique({
      where: { id: estimatorId }
    });

    if (!estimatorData) {
      return NextResponse.json({ error: 'Estimator not found' }, { status: 404 });
    }

    // Generate the PDF with AI-enhanced content
    const pdfBlob = await generateQuotationPDF(estimatorData);
    
    // Convert blob to buffer for response
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return the PDF as a response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quotation-${estimatorData.fullName.replace(/\s+/g, '-')}-${estimatorId.substring(0, 8)}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    if (error instanceof Error && error.message === 'OpenAI API key is not configured') {
      return NextResponse.json({ 
        error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate PDF quotation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'PDF Generation API endpoint. Use POST method with estimatorId in the request body.' 
  });
} 