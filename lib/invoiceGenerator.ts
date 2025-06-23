import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  // Invoice details
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  
  // Client details
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  clientPhone?: string;
  clientCompany?: string;
  
  // Invoice items
  items: InvoiceItem[];
  
  // Amounts
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  
  // Payment terms
  paymentTerms?: string;
  notes?: string;
}

export interface CompanyDetails {
  name: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  taxNumber?: string;
}

export interface BankInfo {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  upiId?: string;
}

export async function generateInvoicePDF(
  invoiceData: InvoiceData,
  companyDetails: CompanyDetails,
  bankInfo: BankInfo
): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  let yPosition = 20;
  const leftMargin = 20;
  const rightMargin = pageWidth - 20;
  
  // Colors
  const primaryColor = '#0A2540';
  const grayColor = '#666666';
  
  // Helper function to add text with automatic line breaks
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.35);
  };
  
  // Header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(companyDetails.name, leftMargin, 25);
  
  // Invoice title
  doc.setFontSize(16);
  doc.text('INVOICE', rightMargin - 40, 25);
  
  yPosition = 50;
  
  // Company details (left side)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  yPosition = addWrappedText(companyDetails.address, leftMargin, yPosition, 100);
  yPosition = addWrappedText(`Email: ${companyDetails.email}`, leftMargin, yPosition + 5, 100);
  yPosition = addWrappedText(`Phone: ${companyDetails.phone}`, leftMargin, yPosition + 5, 100);
  if (companyDetails.website) {
    yPosition = addWrappedText(`Website: ${companyDetails.website}`, leftMargin, yPosition + 5, 100);
  }
  
  // Invoice details (right side)
  const invoiceDetailsX = pageWidth - 120;
  let invoiceDetailsY = 50;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Details:', invoiceDetailsX, invoiceDetailsY);
  doc.setFont('helvetica', 'normal');
  
  invoiceDetailsY += 10;
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, invoiceDetailsX, invoiceDetailsY);
  invoiceDetailsY += 8;
  doc.text(`Date: ${invoiceData.invoiceDate.toLocaleDateString()}`, invoiceDetailsX, invoiceDetailsY);
  invoiceDetailsY += 8;
  doc.text(`Due Date: ${invoiceData.dueDate.toLocaleDateString()}`, invoiceDetailsX, invoiceDetailsY);
  
  yPosition = Math.max(yPosition, invoiceDetailsY) + 20;
  
  // Bill To section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Bill To:', leftMargin, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition = addWrappedText(invoiceData.clientName, leftMargin, yPosition, 150);
  if (invoiceData.clientCompany) {
    yPosition = addWrappedText(invoiceData.clientCompany, leftMargin, yPosition + 3, 150);
  }
  yPosition = addWrappedText(invoiceData.clientEmail, leftMargin, yPosition + 3, 150);
  if (invoiceData.clientPhone) {
    yPosition = addWrappedText(invoiceData.clientPhone, leftMargin, yPosition + 3, 150);
  }
  if (invoiceData.clientAddress) {
    yPosition = addWrappedText(invoiceData.clientAddress, leftMargin, yPosition + 3, 150);
  }
  
  yPosition += 20;
  
  // Items table
  const tableHeaders = ['Description', 'Qty', 'Rate', 'Amount'];
  const colX = [leftMargin, leftMargin + 100, leftMargin + 125, leftMargin + 160];
  
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(leftMargin, yPosition, 175, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  tableHeaders.forEach((header, index) => {
    doc.text(header, colX[index] + 2, yPosition + 7);
  });
  
  yPosition += 10;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  invoiceData.items.forEach((item, index) => {
    const rowY = yPosition + (index * 12);
    
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(leftMargin, rowY, 175, 12, 'F');
    }
    
    doc.text(item.description, colX[0] + 2, rowY + 8);
    doc.text(item.quantity.toString(), colX[1] + 2, rowY + 8);
    doc.text(`${invoiceData.currency} ${item.rate.toFixed(2)}`, colX[2] + 2, rowY + 8);
    doc.text(`${invoiceData.currency} ${item.amount.toFixed(2)}`, colX[3] + 2, rowY + 8);
  });
  
  yPosition += (invoiceData.items.length * 12) + 10;
  
  // Totals section
  const totalsX = pageWidth - 80;
  doc.setFont('helvetica', 'normal');
  
  doc.text('Subtotal:', totalsX - 40, yPosition);
  doc.text(`${invoiceData.currency} ${invoiceData.subtotal.toFixed(2)}`, totalsX, yPosition);
  yPosition += 8;
  
  // Only show tax if tax rate is greater than 0
  if (invoiceData.taxRate > 0) {
    doc.text(`Tax (${invoiceData.taxRate}%):`, totalsX - 40, yPosition);
    doc.text(`${invoiceData.currency} ${invoiceData.taxAmount.toFixed(2)}`, totalsX, yPosition);
    yPosition += 8;
  }
  
  // Total line
  doc.setLineWidth(0.5);
  doc.line(totalsX - 45, yPosition, totalsX + 35, yPosition);
  yPosition += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', totalsX - 40, yPosition);
  doc.text(`${invoiceData.currency} ${invoiceData.total.toFixed(2)}`, totalsX, yPosition);
  
  yPosition += 20;
  
  // Payment Information Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Payment Information:', leftMargin, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Bank details
  yPosition = addWrappedText(`Bank Name: ${bankInfo.bankName}`, leftMargin, yPosition, 150);
  yPosition = addWrappedText(`Account Holder: ${bankInfo.accountHolderName}`, leftMargin, yPosition + 3, 150);
  yPosition = addWrappedText(`Account Number: ${bankInfo.accountNumber}`, leftMargin, yPosition + 3, 150);
  yPosition = addWrappedText(`IFSC Code: ${bankInfo.ifscCode}`, leftMargin, yPosition + 3, 150);
  yPosition = addWrappedText(`Branch: ${bankInfo.branchName}`, leftMargin, yPosition + 3, 150);
  if (bankInfo.upiId) {
    yPosition = addWrappedText(`UPI ID: ${bankInfo.upiId}`, leftMargin, yPosition + 3, 150);
  }
  
  // Generate UPI QR Code if UPI ID is available
  if (bankInfo.upiId) {
    try {
      const upiUrl = `upi://pay?pa=${bankInfo.upiId}&pn=${encodeURIComponent(bankInfo.accountHolderName)}&am=${invoiceData.total}&cu=${invoiceData.currency}&tn=${encodeURIComponent(`Invoice ${invoiceData.invoiceNumber}`)}`;
      console.log("UPI URL", upiUrl);
      const qrCodeDataUrl = await QRCode.toDataURL(upiUrl, { width: 100, margin: 1 });
      
      // Add QR code to the right side
      const qrX = pageWidth - 80;
      const qrY = yPosition - 40;
      doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, 50, 50);
      
      doc.setFontSize(8);
      doc.text('Scan to Pay', qrX + 10, qrY + 55);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }
  
  yPosition += 20;
  
  // Payment terms and notes
  if (invoiceData.paymentTerms) {
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Terms:', leftMargin, yPosition);
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText(invoiceData.paymentTerms, leftMargin, yPosition, pageWidth - 40);
    yPosition += 10;
  }
  
  if (invoiceData.notes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', leftMargin, yPosition);
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText(invoiceData.notes, leftMargin, yPosition, pageWidth - 40);
  }
  
  // Footer
  const footerY = pageHeight - 30;
  doc.setFontSize(8);
  doc.setTextColor(grayColor);
  doc.text('Thank you for your business!', leftMargin, footerY);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, rightMargin - 60, footerY);
  
  // Return as blob
  return new Promise((resolve) => {
    const pdfBlob = doc.output('blob');
    resolve(pdfBlob);
  });
}

export function calculateInvoiceTotals(items: InvoiceItem[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;
  
  return { subtotal, taxAmount, total };
} 