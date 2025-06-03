import { Estimator } from '@prisma/client'; // Assuming Estimator type is available

function buildQuotationPrompt(estimateData: Estimator): string {
  // Destructure with defaults for optional fields to ensure they are handled
  const {
    projectType = 'Not specified',
    projectPurpose = 'Not specified',
    targetAudience = 'Not specified',
    features = [], // JSON, so it will be an array
    designPreference = 'Not specified',
    needsCustomBranding = false,
    deliveryTimeline = 'Not specified',
    budgetRange = 'Not specified',
    addons = [], // JSON, so it will be an array
    customRequests = 'None',
    fullName = 'Valued Client',
    companyName,
    userRole = 'N/A',
  } = estimateData;

  let prompt = `**Provide a detailed project quotation proposal for: ${fullName}${companyName ? ' (from ' + companyName + ')' : ''}**\n\n`;
  prompt += `Here are some details about the project, these are not final and will be discussed further. Please provide a detailed quotation proposal based on the following details:\n\n`;

  prompt += `**I. Project Overview**\n`;
  prompt += `  - **Project Type:** ${projectType}\n`;
  prompt += `  - **Primary Purpose:** ${projectPurpose}\n`;
  prompt += `  - **Target Audience:** ${targetAudience}\n`;
  if (userRole !== 'N/A') prompt += `  - **Your Role:** ${userRole}\n`;
  prompt += `\n`;

  prompt += `**II. Core Features & Functionality**\n`;
  if (Array.isArray(features) && features.length > 0) {
    (features as string[]).forEach(feature => {
      prompt += `  - ${feature.charAt(0).toUpperCase() + feature.slice(1).replace(/_/g, ' ')}\n`; // Simple formatting
    });
  } else {
    prompt += `  - Feature details to be discussed.\n`;
  }
  prompt += `\n`;

  prompt += `**III. Design & User Experience**\n`;
  prompt += `  - **Preferred Style:** ${designPreference}\n`;
  if (needsCustomBranding) {
    prompt += `  - **Custom Branding Package:** Included (Logo, Style Guide, etc.)\n`;
  } else {
    prompt += `  - **Custom Branding Package:** Not explicitly requested, can be added.\n`;
  }
  prompt += `\n`;

  prompt += `**IV. Optional Add-ons & Enhancements**\n`;
  if (Array.isArray(addons) && addons.length > 0) {
    (addons as string[]).forEach(addon => {
      prompt += `  - ${addon.charAt(0).toUpperCase() + addon.slice(1).replace(/_/g, ' ')}\n`; // Simple formatting
    });
  } else {
    prompt += `  - No specific add-ons selected at this stage.\n`;
  }
  prompt += `\n`;

  if (customRequests && customRequests.trim() !== 'None' && customRequests.trim() !== '') {
    prompt += `**V. Specific Requirements & Notes**\n`;
    prompt += `  - ${customRequests.replace(/\n/g, '\n  - ' )}\n\n`;
  }

  prompt += `**VI. Estimated Timeline & Budget Considerations**\n`;
  prompt += `  - **Anticipated Timeline:** ${deliveryTimeline}\n`;
  prompt += `  - **Indicative Budget Range:** ${budgetRange}\n`;
  prompt += `  *Note: These are initial estimates. A detailed timeline and final quote will be provided after a thorough requirements analysis.*\n\n`;

  prompt += `**VII. Next Steps**\n`;
  prompt += `  1. Our team will review your submission in detail.\n`;
  prompt += `  2. We may contact you at ${estimateData.email} or ${estimateData.phone || 'your provided phone number'} for any clarifications.\n`;
  prompt += `  3. A formal proposal and detailed quotation document will be prepared and sent to you.\n\n`;

  prompt += `We are excited about the possibility of working with you!\n\n`;
  prompt += `Sincerely,\nThe Tech Morphers Team\n\n`;
  prompt += `--- End of AI Generated Section --- \nThis document is intended for discussion purposes. Please do not reply directly to the AI.`;

  return prompt;
}

export { buildQuotationPrompt }; 