import jsPDF from 'jspdf';
import { Estimator } from '@prisma/client';
import { generateQuotationWithAI, QuotationContent } from '@/lib/openai'; // Updated import

export const generateQuotationPDF = async (estimateData: Estimator): Promise<Blob> => {
  const doc = new jsPDF();

  // Generate AI-powered quotation content
  let aiQuotation: QuotationContent;
  try {
    aiQuotation = await generateQuotationWithAI(estimateData);
  } catch (error) {
    console.error('Failed to generate AI quotation, using fallback:', error);
    // Fallback quotation structure
    aiQuotation = {
      title: `Project Quotation for ${estimateData.fullName}`,
      introduction: "Thank you for your interest in Tech Morphers. We've reviewed your project requirements and are excited to present this quotation.",
      projectScope: `Based on your requirements for a ${estimateData.projectType || 'custom project'}, we understand you need a comprehensive solution.`,
      detailedBreakdown: {
        phases: [
          {
            phase: "Phase 1: Planning & Analysis",
            duration: "1-2 weeks",
            deliverables: ["Requirements analysis", "Project planning", "Technical specifications"],
            cost: "₹20,000"
          },
          {
            phase: "Phase 2: Development",
            duration: "4-6 weeks",
            deliverables: ["Core development", "Feature implementation", "Testing"],
            cost: "₹60,000"
          }
        ]
      },
      timeline: estimateData.deliveryTimeline || "6-8 weeks",
      pricing: estimateData.budgetRange || "To be discussed after consultation",
      quotationSummary: {
        tableData: [
          {
            item: "Planning & Analysis",
            description: "Requirements gathering and project planning",
            timeline: "1-2 weeks",
            cost: "₹20,000"
          },
          {
            item: "Development",
            description: "Core development and implementation",
            timeline: "4-6 weeks",
            cost: "₹60,000"
          }
        ],
        totalCost: "₹80,000",
        totalTimeline: "6-8 weeks"
      },
      nextSteps: [
        "Review this quotation",
        "Schedule a consultation call",
        "Finalize project requirements",
        "Begin development"
      ]
    };
  }

  // --- Document Settings ---
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // --- Fonts & Colors (Basic) ---
  const FONT_TITLE = 'helvetica';
  const FONT_HEADING = 'helvetica';
  const FONT_BODY = 'times';
  const COLOR_PRIMARY = '#007bff'; // Example: Blue
  const COLOR_TEXT_DARK = '#333333';
  const COLOR_TEXT_LIGHT = '#777777';
  const COLOR_BORDER = '#DDDDDD';

  // --- Helper Functions for PDF generation ---
  const addText = (text: string | string[], x: number, y: number, options?: any) => {
    doc.text(text, x, y, options);
  };

  const addLine = (x1: number, y1: number, x2: number, y2: number, color = COLOR_BORDER) => {
    doc.setDrawColor(color);
    doc.line(x1, y1, x2, y2);
  };

  const addSectionTitle = (title: string) => {
    if (yPos + 15 > pageHeight - margin) { // Check for page break
      doc.addPage();
      yPos = margin;
    }
    doc.setFont(FONT_HEADING, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(COLOR_PRIMARY);
    addText(title, margin, yPos);
    yPos += 8;
    addLine(margin, yPos - 2, margin + contentWidth, yPos - 2);
    yPos += 5;
    doc.setFont(FONT_BODY, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLOR_TEXT_DARK);
    return yPos;
  };
  
  const addParagraph = (text: string | undefined | null, indent = 0) => {
    if (!text) return;
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line: string) => {
      if (yPos + 5 > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      addText(line, margin + indent, yPos);
      yPos += 5;
    });
    yPos += 3; // Paragraph spacing
  };

  const addDetailItem = (label: string, value: string | undefined | null, indent = 0) => {
    if (value === undefined || value === null || value.trim() === '') return;
     if (yPos + 10 > pageHeight - margin) { // Check space for label + value
        doc.addPage();
        yPos = margin;
    }
    doc.setFont(FONT_BODY, 'bold');
    addText(label, margin + indent, yPos);
    doc.setFont(FONT_BODY, 'normal');
    const valueLines = doc.splitTextToSize(String(value), contentWidth - indent - doc.getTextWidth(label) - 2);
    addText(valueLines, margin + indent + doc.getTextWidth(label) + 2, yPos);
    yPos += (valueLines.length * 5) + 2; // Adjust yPos based on number of lines for value
  };
  
  const addListItems = (items: string[] | undefined | null, indent = 5) => {
    if (!items || items.length === 0) {
        addParagraph("Not specified.", indent);
        return;
    }
    items.forEach(item => {
      addParagraph(`• ${item}`, indent);
    });
  };

  // --- 1. Header ---
  doc.setFont(FONT_TITLE, 'bold');
  doc.setFontSize(22);
  doc.setTextColor(COLOR_PRIMARY);
  addText(aiQuotation.title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  doc.setFont(FONT_BODY, 'italic');
  doc.setFontSize(10);
  doc.setTextColor(COLOR_TEXT_LIGHT);
  addText(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
  addText("Ref: EST-" + estimateData.id.substring(0,8).toUpperCase(), pageWidth - margin, yPos, { align: 'right'});
  yPos += 10;
  addLine(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // --- 2. Client Information ---
  addSectionTitle("Client Information");
  addDetailItem("Full Name:", estimateData.fullName);
  if (estimateData.companyName) addDetailItem("Company:", estimateData.companyName);
  addDetailItem("Email:", estimateData.email);
  if (estimateData.phone) addDetailItem("Phone:", estimateData.phone);
  if (estimateData.userRole) addDetailItem("Your Role:", estimateData.userRole);
  yPos += 5;

  // --- 3. Introduction ---
  addSectionTitle("Introduction");
  addParagraph(aiQuotation.introduction);
  yPos += 5;

  // --- 4. Project Scope ---
  addSectionTitle("Project Scope");
  addParagraph(aiQuotation.projectScope);
  
  // Display recommended package if available
  if (aiQuotation.recommendedPackage) {
    yPos += 3;
    doc.setFont(FONT_BODY, 'bold');
    addParagraph(`Recommended Package: ${aiQuotation.recommendedPackage.name}`, 0);
    doc.setFont(FONT_BODY, 'normal');
    addDetailItem("Package Price:", aiQuotation.recommendedPackage.price);
    
    if (aiQuotation.recommendedPackage.features && aiQuotation.recommendedPackage.features.length > 0) {
      yPos += 3;
      doc.setFont(FONT_BODY, 'bold');
      addParagraph("Core Features Included:", 0);
      doc.setFont(FONT_BODY, 'normal');
      addListItems(aiQuotation.recommendedPackage.features);
    }
    
    if (aiQuotation.recommendedPackage.addons && aiQuotation.recommendedPackage.addons.length > 0) {
      yPos += 2;
      doc.setFont(FONT_BODY, 'bold');
      addParagraph("Available Add-ons:", 0);
      doc.setFont(FONT_BODY, 'normal');
      addListItems(aiQuotation.recommendedPackage.addons);
    }
  }

  // Display custom features if available
  if (aiQuotation.customFeatures && aiQuotation.customFeatures.length > 0) {
    yPos += 3;
    doc.setFont(FONT_BODY, 'bold');
    addParagraph("Custom Features & Requirements:", 0);
    doc.setFont(FONT_BODY, 'normal');
    addListItems(aiQuotation.customFeatures);
  }
  yPos += 5;

  // --- 5. Timeline & Pricing ---
  addSectionTitle("Timeline & Pricing");
  addDetailItem("Estimated Timeline:", aiQuotation.timeline);
  addParagraph(aiQuotation.pricing);
  yPos += 5;

  // --- 6. Detailed Project Breakdown ---
  if (aiQuotation.detailedBreakdown && aiQuotation.detailedBreakdown.phases.length > 0) {
    addSectionTitle("Detailed Project Breakdown");
    aiQuotation.detailedBreakdown.phases.forEach((phase, index) => {
      yPos += 2;
      doc.setFont(FONT_BODY, 'bold');
      addParagraph(`${phase.phase}`, 0);
      doc.setFont(FONT_BODY, 'normal');
      addDetailItem("Duration:", phase.duration, 5);
      addDetailItem("Estimated Cost:", phase.cost, 5);
      
      if (phase.deliverables && phase.deliverables.length > 0) {
        doc.setFont(FONT_BODY, 'bold');
        addParagraph("Key Deliverables:", 5);
        doc.setFont(FONT_BODY, 'normal');
        addListItems(phase.deliverables, 10);
      }
      
      if (index < aiQuotation.detailedBreakdown.phases.length - 1) {
        yPos += 3;
      }
    });
    yPos += 5;
  }

  // --- 7. Quotation Summary Table ---
  if (aiQuotation.quotationSummary) {
    addSectionTitle("Project Summary");
    
    // Table setup
    const colWidths = [40, 80, 30, 30]; // Adjust column widths
    const tableX = margin;
    
    // Check if we need a new page for the table
    const estimatedTableHeight = (aiQuotation.quotationSummary.tableData.length + 3) * 8; // Rough estimate
    if (yPos + estimatedTableHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin + 10;
    }
    
    // Draw table header
    doc.setFont(FONT_BODY, 'bold');
    doc.setFontSize(9);
    doc.setFillColor(240, 240, 240); // Light gray background
    doc.rect(tableX, yPos - 2, colWidths[0], 8, 'F');
    doc.rect(tableX + colWidths[0], yPos - 2, colWidths[1], 8, 'F');
    doc.rect(tableX + colWidths[0] + colWidths[1], yPos - 2, colWidths[2], 8, 'F');
    doc.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2], yPos - 2, colWidths[3], 8, 'F');
    
    addText("Item", tableX + 2, yPos + 3);
    addText("Description", tableX + colWidths[0] + 2, yPos + 3);
    addText("Timeline", tableX + colWidths[0] + colWidths[1] + 2, yPos + 3);
    addText("Cost", tableX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos + 3);
    
    yPos += 8;
    
    // Draw table rows
    doc.setFont(FONT_BODY, 'normal');
    doc.setFontSize(8);
    
    aiQuotation.quotationSummary.tableData.forEach((row) => {
      const rowHeight = 12; // Minimum row height
      
      // Check if we need a new page
      if (yPos + rowHeight > pageHeight - margin) {
        doc.addPage();
        yPos = margin + 10;
      }
      
      // Draw row borders
      doc.setDrawColor(200, 200, 200);
      doc.rect(tableX, yPos - 2, colWidths[0], rowHeight);
      doc.rect(tableX + colWidths[0], yPos - 2, colWidths[1], rowHeight);
      doc.rect(tableX + colWidths[0] + colWidths[1], yPos - 2, colWidths[2], rowHeight);
      doc.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2], yPos - 2, colWidths[3], rowHeight);
      
      // Add row content
      addText(row.item, tableX + 2, yPos + 3);
      
      // Handle long descriptions by wrapping text
      const descLines = doc.splitTextToSize(row.description, colWidths[1] - 4);
      descLines.forEach((line: string, lineIndex: number) => {
        addText(line, tableX + colWidths[0] + 2, yPos + 3 + (lineIndex * 4));
      });
      
      addText(row.timeline, tableX + colWidths[0] + colWidths[1] + 2, yPos + 3);
      addText(row.cost, tableX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos + 3);
      
      yPos += Math.max(rowHeight, descLines.length * 4 + 6);
    });
    
    // Add total row
    yPos += 2;
    doc.setFont(FONT_BODY, 'bold');
    doc.setFillColor(230, 230, 230); // Slightly darker gray for total row
    doc.rect(tableX, yPos - 2, colWidths[0] + colWidths[1], 8, 'F');
    doc.rect(tableX + colWidths[0] + colWidths[1], yPos - 2, colWidths[2], 8, 'F');
    doc.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2], yPos - 2, colWidths[3], 8, 'F');
    
    addText("TOTAL", tableX + 2, yPos + 3);
    addText(aiQuotation.quotationSummary.totalTimeline, tableX + colWidths[0] + colWidths[1] + 2, yPos + 3);
    addText(aiQuotation.quotationSummary.totalCost, tableX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos + 3);
    
    yPos += 10;
    doc.setFont(FONT_BODY, 'normal');
    doc.setFontSize(10);
  }

  // --- 8. Next Steps ---
  addSectionTitle("Next Steps");
  addListItems(aiQuotation.nextSteps, 0);
  yPos += 5;

  // --- 9. Additional Notes ---
  if (aiQuotation.additionalNotes) {
    addSectionTitle("Additional Notes");
    addParagraph(aiQuotation.additionalNotes);
    yPos += 5;
  }

  // --- 10. Footer ---
  const footerY = pageHeight - (margin / 2); 
  doc.setLineWidth(0.5);
  addLine(margin, footerY - 7, pageWidth - margin, footerY - 7, COLOR_BORDER);
  
  doc.setFont(FONT_BODY, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(COLOR_TEXT_LIGHT);
  
  const companyName = "Tech Morphers";
  const companyWebsite = "www.techmorphers.com";
  const companyEmail = "contact@techmorphers.com";
  
  addText(companyName, margin, footerY -2);
  addText(companyEmail, pageWidth / 2, footerY -2, { align: 'center' });
  addText(companyWebsite, pageWidth - margin, footerY -2, { align: 'right' });
  
  // --- Generate PDF Blob ---
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

// Example of how it might be called (for testing, not for direct client-side use without an API route)
// async function testGenerate() {
//   const dummyEstimatorData: Estimator = {
//     id: "clk123xyz",
//     projectType: "SaaS Platform Development",
//     projectPurpose: "To build a new CRM for small businesses",
//     targetAudience: "SMB owners and sales teams",
//     features: ["user_authentication", "dashboard_analytics", "contact_management", "email_integration"],
//     designPreference: "Modern and Clean, similar to HubSpot",
//     needsCustomBranding: true,
//     deliveryTimeline: "3-4 Months",
//     budgetRange: "₹5,00,000 - ₹8,00,000", // Example that might not match a plan exactly
//     addons: ["api_for_third_party", "advanced_reporting_module"],
//     customRequests: "The platform needs to be highly scalable from day one. We also need a mobile responsive admin panel.",
//     fullName: "Ankit Biswas",
//     email: "ankit@example.com",
//     phone: "+919876543210",
//     companyName: "Ankit Innovations Ltd.",
//     userRole: "Founder & CEO",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };
//   try {
//     const blob = await generateQuotationPDF(dummyEstimatorData);
//     const url = URL.createObjectURL(blob);
//     window.open(url); // Opens the PDF in a new tab for review
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//   }
// }
// // testGenerate(); // Uncomment to test in a browser environment where `window` is available. 