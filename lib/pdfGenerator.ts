import jsPDF from 'jspdf';
import { Estimator } from '@prisma/client';
import { plans, Plan } from '@/lib/plansData'; // Updated import

// Helper function to find a matching plan (simplified heuristic)
const findMatchingPlan = (estimateData: Estimator): Plan | null => {
  const { budgetRange, projectType, features } = estimateData;

  // Attempt to match by budget first (very simplified)
  if (budgetRange) {
    const matchedByBudget = plans.find(plan => {
      // This is a naive comparison. Real budget matching would be more complex.
      // E.g., parsing budgetRange like "₹10L - ₹25L" and comparing with plan.price
      return plan.price.includes(budgetRange.split(' ')[0]); // Example: "₹10L"
    });
    if (matchedByBudget) return matchedByBudget;
  }

  // Attempt to match by project type (keywords in 'bestFor' or 'description')
  if (projectType) {
    const projectTypeLower = projectType.toLowerCase();
    const matchedByType = plans.find(plan => 
      plan.bestFor.toLowerCase().includes(projectTypeLower) ||
      plan.description.toLowerCase().includes(projectTypeLower)
    );
    if (matchedByType) return matchedByType;
  }
  
  // If many features align with a Pro or Enterprise plan, lean towards that
  if (features && features.length > 5) {
    const proPlan = plans.find(p => p.id === 'pro');
    if (proPlan) return proPlan;
  }

  return null; // Explicitly return null if no match
};

export const generateQuotationPDF = async (estimateData: Estimator): Promise<Blob> => {
  const doc = new jsPDF();

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
  // Placeholder for Logo - e.g., doc.addImage(logoDataUrl, 'PNG', margin, yPos, 40, 15); yPos += 20;
  doc.setFont(FONT_TITLE, 'bold');
  doc.setFontSize(22);
  doc.setTextColor(COLOR_PRIMARY);
  addText("Project Quotation", pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  doc.setFont(FONT_BODY, 'italic');
  doc.setFontSize(10);
  doc.setTextColor(COLOR_TEXT_LIGHT);
  addText(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
  addText("Ref: EST-" + estimateData.id.substring(0,8).toUpperCase(), pageWidth - margin, yPos, { align: 'right'});
  yPos += 10;
  addLine(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // --- 2. Client & Company Information ---
  addSectionTitle("Client Information");
  addDetailItem("Full Name:", estimateData.fullName);
  if (estimateData.companyName) addDetailItem("Company:", estimateData.companyName);
  addDetailItem("Email:", estimateData.email);
  if (estimateData.phone) addDetailItem("Phone:", estimateData.phone);
  if (estimateData.userRole) addDetailItem("Your Role:", estimateData.userRole);
  yPos += 5;

  // --- Try to match a plan ---
  const matchedPlan = findMatchingPlan(estimateData);

  // --- 3. Project Scope & Selected Package (if applicable) ---
  addSectionTitle("Project Scope");

  if (matchedPlan && matchedPlan.id !== 'custom') {
    addParagraph(`Based on your requirements, the **${matchedPlan.name}** package seems like a good starting point.`);
    yPos += 2;
    addDetailItem("Package Price:", matchedPlan.price);
    addDetailItem("Delivery Time:", matchedPlan.deliveryTime);
    yPos +=3;
    
    doc.setFont(FONT_BODY, 'bold');
    addParagraph("Core Features Included:", 0);
    doc.setFont(FONT_BODY, 'normal');
    addListItems(matchedPlan.features);
    
    if (matchedPlan.addOns && matchedPlan.addOns.length > 0) {
        yPos += 2;
        doc.setFont(FONT_BODY, 'bold');
        addParagraph("Available Add-ons for this Package:", 0);
        doc.setFont(FONT_BODY, 'normal');
        addListItems(matchedPlan.addOns);
    }
  } else {
     addParagraph("This is a custom quotation tailored to your specific needs.");
     yPos += 2;
     doc.setFont(FONT_BODY, 'bold');
     addParagraph("Requested Core Features:", 0);
     doc.setFont(FONT_BODY, 'normal');
     if (estimateData.features && estimateData.features.length > 0) {
        addListItems(estimateData.features.map(f => f.charAt(0).toUpperCase() + f.slice(1).replace(/_/g, ' ')));
     } else {
        addParagraph("To be discussed and finalized.", 5);
     }
  }
  yPos += 5;
  
  // --- 4. Detailed Project Requirements (from Estimator) ---
  addSectionTitle("Your Project Details");
  addDetailItem("Project Type:", estimateData.projectType);
  addDetailItem("Primary Purpose:", estimateData.projectPurpose);
  addDetailItem("Target Audience:", estimateData.targetAudience);
  
  yPos +=3;
  doc.setFont(FONT_BODY, 'bold');
  addParagraph("Design Preferences:", 0);
  doc.setFont(FONT_BODY, 'normal');
  addParagraph(estimateData.designPreference || "Not specified.", 5);
  addDetailItem("Custom Branding:", estimateData.needsCustomBranding ? "Yes, required" : "Not explicitly requested, can be added.");

  if (estimateData.addons && estimateData.addons.length > 0 && (!matchedPlan || matchedPlan.id === 'custom')) {
    yPos +=3;
    doc.setFont(FONT_BODY, 'bold');
    addParagraph("Requested Add-ons/Enhancements:", 0);
    doc.setFont(FONT_BODY, 'normal');
    addListItems(estimateData.addons.map(a => a.charAt(0).toUpperCase() + a.slice(1).replace(/_/g, ' ')));
  }

  if (estimateData.customRequests && estimateData.customRequests.trim() !== '' && estimateData.customRequests.trim().toLowerCase() !== 'none') {
    yPos +=3;
    doc.setFont(FONT_BODY, 'bold');
    addParagraph("Specific Requirements & Notes:", 0);
    doc.setFont(FONT_BODY, 'normal');
    addParagraph(estimateData.customRequests, 5);
  }
  yPos += 5;

  // --- 5. Timeline & Budget Indication ---
  addSectionTitle("Timeline & Budget");
  addDetailItem("Your Anticipated Timeline:", estimateData.deliveryTimeline);
  if (matchedPlan && matchedPlan.id !== 'custom' && matchedPlan.deliveryTime !== estimateData.deliveryTimeline) {
      addDetailItem("Standard Plan Delivery:", matchedPlan.deliveryTime);
  }
  addDetailItem("Your Indicative Budget Range:", estimateData.budgetRange);
   if (matchedPlan && matchedPlan.id !== 'custom' && matchedPlan.price !== estimateData.budgetRange) {
      addDetailItem("Selected Plan Price:", matchedPlan.price);
  }
  yPos += 2;
  doc.setFont(FONT_BODY, 'italic');
  doc.setFontSize(9);
  addParagraph("Note: All prices are indicative. Timelines and costs are estimates and will be finalized after a detailed project discovery and requirements analysis. For 'Custom Quote' plans, a detailed proposal will follow.", 0);
  doc.setFont(FONT_BODY, 'normal');
  doc.setFontSize(10);
  yPos += 5;

  // --- 6. Next Steps & Call to Action ---
  addSectionTitle("Next Steps");
  addParagraph("1. Review this preliminary quotation. We recommend noting any questions or areas for clarification.");
  addParagraph("2. Our team will reach out to you within 1-2 business days to schedule a consultation call to discuss your project in more detail.");
  addParagraph("3. Following the consultation, we will provide a comprehensive proposal and a final, binding quotation if applicable.");
  addParagraph("We are excited about the potential to partner with you on this project!");
  yPos += 10;

  // --- 7. Footer ---
  const footerY = pageHeight - (margin / 2); 
  doc.setLineWidth(0.5);
  addLine(margin, footerY - 7, pageWidth - margin, footerY - 7, COLOR_BORDER);
  
  doc.setFont(FONT_BODY, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(COLOR_TEXT_LIGHT);
  
  // This needs to be repeated on each page if content spans multiple pages
  // For simplicity in this initial setup, it's added once.
  // Proper footers on each page require more complex logic checking page breaks.
  const companyName = "Tech Morphers";
  const companyWebsite = "www.techmorphers.com"; // Replace with actual
  const companyEmail = "contact@techmorphers.com"; // Replace with actual
  
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