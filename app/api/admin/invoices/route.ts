import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateInvoicePDF, calculateInvoiceTotals, InvoiceItem, InvoiceData, BankInfo } from '@/lib/invoiceGenerator';
import { uploadPDFToGCS } from '@/lib/googleCloudStorage';
import { sendEmail } from '@/lib/emailer';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { 
      clientId, 
      projectId,
      items, 
      currency = 'USD', 
      dueDate, 
      paymentTerms, 
      notes 
    } = await request.json();

    if (!clientId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Client ID and invoice items are required' },
        { status: 400 }
      );
    }

    // Get client details
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Validate project if provided
    let project = null;
    if (projectId) {
      project = await prisma.estimator.findFirst({
        where: {
          id: projectId,
          clientId: clientId
        }
      });

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found or does not belong to this client' },
          { status: 404 }
        );
      }
    }

    // Get or create invoice settings
    let invoiceSettings = await prisma.invoiceSettings.findFirst();
    if (!invoiceSettings) {
      // Create default settings
      invoiceSettings = await prisma.invoiceSettings.create({
        data: {
          companyName: 'Tech Morphers',
          companyAddress: 'Your Company Address',
          companyEmail: 'hello@techmorphers.com',
          companyPhone: '+1 (555) 123-4567',
          companyWebsite: 'https://www.techmorphers.com',
          taxRate: 18.0, // Default GST rate
          invoicePrefix: 'INV',
          currentNumber: 1000,
          defaultDueDays: 30,
          paymentTerms: 'Payment is due within 30 days of invoice date.',
          footerText: 'Thank you for your business!'
        }
      });
    }

    // Get bank details
    const bankDetails = await prisma.bankDetails.findFirst({
      where: { isActive: true, isDefault: true }
    });

    if (!bankDetails) {
      return NextResponse.json(
        { error: 'No active bank details found. Please configure bank details first.' },
        { status: 400 }
      );
    }

    // Generate invoice number
    const invoiceNumber = `${invoiceSettings.invoicePrefix}-${invoiceSettings.currentNumber.toString().padStart(4, '0')}`;

    // Calculate totals (no tax)
    const invoiceItems: InvoiceItem[] = items.map((item: any) => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.quantity * item.rate
    }));

    const { subtotal } = calculateInvoiceTotals(invoiceItems, 0); // Set tax rate to 0

    // Prepare invoice data
    const invoiceDate = new Date();
    const dueDateObj = dueDate ? new Date(dueDate) : new Date(Date.now() + (invoiceSettings.defaultDueDays * 24 * 60 * 60 * 1000));

    const invoiceData: InvoiceData = {
      invoiceNumber,
      invoiceDate,
      dueDate: dueDateObj,
      clientName: client.fullName,
      clientEmail: client.email,
      clientPhone: client.phone || undefined,
      clientCompany: client.companyName || undefined,
      items: invoiceItems,
      subtotal,
      taxRate: 0, // No tax
      taxAmount: 0, // No tax amount
      total: subtotal, // Total equals subtotal without tax
      currency,
      paymentTerms: paymentTerms || invoiceSettings.paymentTerms || undefined,
      notes: notes || undefined
    };

    // Company details for invoice (removed tax number)
    const companyDetails = {
      name: 'Tech Morphers',
      address: 'Your Company Address\nCity, State, ZIP',
      email: 'contact@techmorphers.com',
      phone: '+919795786303',
      website: 'www.techmorphers.com'
      // Removed taxNumber field
    };

    const bankInfo: BankInfo = {
      bankName: bankDetails.bankName,
      accountHolderName: bankDetails.accountHolderName,
      accountNumber: bankDetails.accountNumber,
      ifscCode: bankDetails.ifscCode,
      branchName: bankDetails.branchName,
      upiId: bankDetails.upiId || undefined
    };

    // Generate PDF
    const pdfBlob = await generateInvoicePDF(invoiceData, companyDetails, bankInfo);
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    // Upload to GCS
    const fileName = `${invoiceNumber}.pdf`;
    const uploadResult = await uploadPDFToGCS(
      pdfBuffer,
      fileName,
      `invoices/${clientId}/`
    );

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Failed to upload invoice' },
        { status: 500 }
      );
    }

    // Create document record
    const document = await prisma.clientDocument.create({
      data: {
        clientId,
        estimatorId: projectId || null, // Link to specific project if provided
        title: `Invoice ${invoiceNumber}`,
        description: `Invoice for ${client.fullName}${project ? ` - ${project.projectType}` : ''}`,
        type: 'INVOICE',
        fileUrl: uploadResult.url!,
        fileName: uploadResult.fileName!,
        fileSize: pdfBuffer.length,
        uploadedBy: 'varanasiartist.omg@gmail.com', // Updated admin email
        
        // Invoice-specific fields
        invoiceNumber,
        invoiceAmount: subtotal,
        currency,
        dueDate: dueDateObj,
        paymentStatus: 'PENDING'
      }
    });

    // Update invoice settings current number
    await prisma.invoiceSettings.update({
      where: { id: invoiceSettings.id },
      data: { currentNumber: invoiceSettings.currentNumber + 1 }
    });

    // Send notifications to the client
    try {
      // Get client data
      const clientData = await prisma.client.findUnique({
        where: { id: clientId },
        select: {
          fullName: true,
          email: true,
          phone: true
        }
      });

      if (clientData) {
        // Send email notification
        try {
          await sendEmail({
            to: clientData.email,
            subject: `New Invoice: ${invoiceNumber}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">New Invoice Received</h2>
                <p>Dear ${clientData.fullName},</p>
                <p>You have received a new invoice from Tech Morphers.</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin: 0 0 10px 0;">Invoice Details:</h3>
                  <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
                  <p><strong>Amount:</strong> ${currency} ${subtotal.toFixed(2)}</p>
                  <p><strong>Due Date:</strong> ${dueDateObj.toLocaleDateString()}</p>
                </div>
                <p>Please log in to your client portal to view and pay the invoice.</p>
                <p>Thank you for your business!</p>
                <p>Best regards,<br>Tech Morphers Team</p>
              </div>
            `
          });
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
        }

        // Send WhatsApp notification if phone number exists
        if (clientData.phone) {
          try {
            const whatsappMessage = `🧾 New Invoice from Tech Morphers

Dear ${clientData.fullName},

You have received a new invoice:
📋 Invoice: ${invoiceNumber}
💰 Amount: ${currency} ${subtotal.toFixed(2)}
📅 Due Date: ${dueDateObj.toLocaleDateString()}

Please log in to your client portal to view and pay the invoice.

Thank you for your business! 🙏`;

            await sendWhatsAppMessage({
              to: clientData.phone,
              message: whatsappMessage
            });
          } catch (whatsappError) {
            console.error('Failed to send WhatsApp notification:', whatsappError);
          }
        }
      }
    } catch (notificationError) {
      console.error('Failed to send notifications:', notificationError);
      // Don't fail the invoice creation if notifications fail
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      invoice: {
        id: document.id,
        invoiceNumber,
        amount: subtotal,
        currency,
        dueDate: dueDateObj,
        fileUrl: uploadResult.url,
        client: {
          id: client.id,
          fullName: client.fullName,
          email: client.email
        }
      }
    });

  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');

    const whereClause: any = { type: 'INVOICE' };

    if (clientId) {
      whereClause.clientId = clientId;
    }

    if (status) {
      whereClause.paymentStatus = status;
    }

    const invoices = await prisma.clientDocument.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
            companyName: true
          }
        }
      },
      orderBy: { uploadedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      invoices: invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.invoiceAmount ? Number(invoice.invoiceAmount) : 0,
        currency: invoice.currency,
        dueDate: invoice.dueDate,
        paymentStatus: invoice.paymentStatus,
        createdAt: invoice.uploadedAt,
        client: invoice.client,
        fileUrl: invoice.fileUrl
      }))
    });

  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 