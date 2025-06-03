import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Estimator } from '@prisma/client';
import { generateQuotationPDF } from '@/lib/pdfGenerator'; // Added for PDF generation
import { sendEmail } from '@/lib/emailer';
import { QuotationPdfEmail } from '@/components/emails/QuotationPdfEmail';

// Helper to convert Blob to Buffer
async function blobToBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(request: Request) {
  let newEstimate: Estimator | null = null;

  try {
    const formData = await request.json();

    if (!formData.fullName || !formData.email) {
      return NextResponse.json({ error: 'Full name and email are required.' }, { status: 400 });
    }

    const estimatorData = {
      projectType: formData.projectType,
      projectPurpose: formData.projectPurpose,
      targetAudience: formData.targetAudience,
      features: formData.features || [], 
      designPreference: formData.designPreference,
      needsCustomBranding: formData.needsCustomBranding || false,
      deliveryTimeline: formData.deliveryTimeline,
      budgetRange: formData.budgetRange,
      addons: formData.addons || [], 
      customRequests: formData.customRequests,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone, 
      companyName: formData.companyName, 
      userRole: formData.userRole, 
    };

    newEstimate = await prisma.estimator.create({
      data: estimatorData,
    });

    console.log('New estimate saved to DB:', newEstimate.id);

    // 1. Generate PDF Quotation
    const pdfBlob = await generateQuotationPDF(newEstimate);
    const pdfBuffer = await blobToBuffer(pdfBlob);
    console.log('PDF quotation generated successfully. Buffer length:', pdfBuffer.length);

    const estimateShortId = newEstimate.id.substring(0, 8).toUpperCase();
    const emailSubject = `Your Custom Project Quotation from Tech Morphers - Ref: ${estimateShortId}`;
    const pdfFileName = `Quotation-TM-${estimateShortId}.pdf`;

    // Use the new React Email Template for PDF
    const emailReactBody = QuotationPdfEmail({
      fullName: newEstimate.fullName,
      estimateId: estimateShortId,
      companyName: newEstimate.companyName || "Tech Morphers",
      // siteUrl and supportEmail can be passed from .env or use defaults in template
    }) as React.ReactElement; 
    
    // Optional: Plain text version (adjust as needed for the new PDF context)
    const emailTextBody = `
Dear ${newEstimate.fullName},

Thank you for your interest in Tech Morphers! We've prepared a preliminary quotation based on the project details you provided.

Please find your personalized quotation PDF (Filename: ${pdfFileName}) attached to this email.

Our team will carefully review your submission, and we may reach out if we have any questions or to discuss the next steps.

If you have any immediate questions, feel free to reply to this email or contact us through our website (e.g., https://techmorphers.com/contact).

We look forward to the possibility of collaborating with you!

Best regards,
The Tech Morphers Team
    `.trim();

    const emailResult = await sendEmail({
      to: newEstimate.email,
      subject: emailSubject,
      react: emailReactBody, 
      text: emailTextBody,    
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBuffer, 
        },
      ],
    });

    if (emailResult.error) {
        console.error('Failed to send email:', emailResult.error);
        return NextResponse.json({ 
            message: 'Estimate processed, but there was an issue sending the quotation email. Please contact support.', 
            warning: 'Email send failed.',
            errorDetails: emailResult.error.message || JSON.stringify(emailResult.error),
            estimateId: newEstimate.id,
        }, { status: 200 }); 
    }

    console.log(`Email with PDF quotation sent to ${newEstimate.email}.`);
    if (emailResult.data?.id) {
      console.log(`Resend Email ID: ${emailResult.data.id}`);
    }

    return NextResponse.json({
      message: 'Estimate processed, and your quotation document has been emailed to you!',
      estimateId: newEstimate.id,
      emailId: emailResult.data?.id
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in POST /api/estimator/submit:', error);
    
    let errorMessage = 'An unexpected error occurred during your estimate submission.';
    let statusCode = 500;

    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      errorMessage = 'An estimate with this email already exists. Please use a different email or contact support.';
      statusCode = 409; 
    } else if (error.message?.includes('Failed to generate PDF')) { 
        errorMessage = 'There was an issue generating your quotation PDF. Please try again or contact support.';
    } else if (error.message?.includes('Resend' ) || error.message?.includes('email')) { 
        errorMessage = 'There was an issue sending the quotation email. Please ensure your email settings are correct or contact support.';
    }

    const errorResponse: { error: string; estimateId?: string; details?: string } = { error: errorMessage };
    if (newEstimate?.id) {
        errorResponse.estimateId = newEstimate.id;
    }
    if (error.message) { // Add more error details if available
        errorResponse.details = error.message;
    }

    return NextResponse.json(errorResponse, { status: statusCode });
  }
} 