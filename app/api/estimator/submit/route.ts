import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Estimator } from '@prisma/client'; // Import Estimator type
import { generateQuotationContent } from '@/lib/gemini';
import { prepareMarkdownDocument, getMarkdownBuffer } from '@/lib/documentGenerator'; // Updated import
import { sendEmail } from '@/lib/emailer';
import { QuotationEmailTemplate } from '@/components/emails/QuotationEmail'; // Import the React Email Template

export async function POST(request: Request) {
  let newEstimate: Estimator | null = null; // Define newEstimate here to be accessible in catch

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

    // 1. Generate quotation content using Gemini AI (Markdown format)
    const rawMarkdownQuotation = await generateQuotationContent(newEstimate);
    console.log("AI Generated Markdown Quotation (first 200 chars):", rawMarkdownQuotation.substring(0,200) + "...");

    // 2. Prepare Markdown document and get its buffer
    const finalMarkdownContent = prepareMarkdownDocument(rawMarkdownQuotation);
    const markdownBuffer = getMarkdownBuffer(finalMarkdownContent);
    console.log('Markdown document prepared successfully. Buffer length:', markdownBuffer.length);

    const emailSubject = `Your Project Quotation Document from Tech Morphers - Ref: ${newEstimate.id.substring(0,8)}`;
    const estimateShortId = newEstimate.id.substring(0, 8);

    // Use the React Email Template
    const emailReactBody = QuotationEmailTemplate({
      fullName: newEstimate.fullName,
      estimateId: estimateShortId,
      // You can pass siteUrl and supportEmail from .env if needed, or use defaults in template
      // siteUrl: process.env.NEXT_PUBLIC_SITE_URL, 
      // supportEmail: process.env.SUPPORT_EMAIL 
    }) as React.ReactElement; // Explicitly cast to React.ReactElement
    
    // Optional: Provide a plain text version for email clients that don't render HTML/React
    const emailTextBody = `
Dear ${newEstimate.fullName},

Thank you for your interest in Tech Morphers! We've prepared a preliminary quotation based on the project details you provided.

Please find your personalized quotation document (Quotation-TM-${estimateShortId}.md) attached to this email. This Markdown document outlines the potential scope, features, and considerations for your project.

Our team will review your submission, and we may reach out if we have any questions or to discuss the next steps.

If you have any immediate questions, feel free to reply to this email or contact us through our website (https://techmorphers.com).

We look forward to the possibility of collaborating with you!

Best regards,
The Tech Morphers Team
https://techmorphers.com
    `.trim();

    const emailResult = await sendEmail({
      to: newEstimate.email,
      subject: emailSubject,
      react: emailReactBody, // Pass the React component here
      text: emailTextBody,    // Pass the plain text version
      attachments: [
        {
          filename: `Quotation-TM-${estimateShortId}.md`,
          content: markdownBuffer,
          // contentType is not strictly needed for Resend as it infers from filename for common types
        },
      ],
    });

    if (emailResult.error) {
        console.error('Failed to send email via Resend:', emailResult.error);
        // Even if email fails, the estimate was created. Inform user.
        return NextResponse.json({ 
            message: 'Estimate processed, but there was an issue sending the quotation email. Please contact support.', 
            warning: 'Email send failed.',
            errorDetails: emailResult.error, // Send back Resend's error
            estimateId: newEstimate.id,
        }, { status: 200 }); // Or 500 if you prefer to indicate a server-side issue more strongly for email failure
    }

    console.log(`Email with Markdown quotation sent to ${newEstimate.email} via Resend. ID: ${emailResult.data?.id}`);

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
    } else if (error.message?.includes('Failed to generate Markdown document')) { // Assuming document generator might throw this
        errorMessage = 'There was an issue generating your quotation document. Please try again or contact support.';
    } else if (error.message?.includes('Gemini')) { 
        errorMessage = 'There was an issue preparing the content for your quotation with our AI. Please try again or contact support.';
    }

    const errorResponse: { error: string; estimateId?: string } = { error: errorMessage };
    if (newEstimate?.id) {
        errorResponse.estimateId = newEstimate.id;
    }

    return NextResponse.json(errorResponse, { status: statusCode });
  }
} 