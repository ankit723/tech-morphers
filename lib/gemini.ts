import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Estimator } from '@prisma/client'; // Assuming Estimator type is available

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const modelConfig = {
  model: "gemini-1.5-flash-latest", // Use a cost-effective model for text generation
  generationConfig: {
    temperature: 0.7,
    topK: 0.95,
    topP: 1,
    maxOutputTokens: 2048, // Adjust as needed for quotation length
  },
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
};

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

  let prompt = `**Project Quotation Proposal for: ${fullName}${companyName ? ' (from ' + companyName + ')' : ''}**\n\n`;
  prompt += `Thank you for providing details for your project. Based on the information you submitted, here is a preliminary project outline and estimated scope. This is not a final binding quote but serves as a starting point for our discussion.\n\n`;

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

export async function generateQuotationContent(estimateData: Estimator): Promise<string> {
  if (!genAI) {
    console.warn("Gemini AI client not initialized. API_KEY might be missing. Returning fallback content.");
    // Fallback: Generate a simpler text-based quotation if AI is unavailable
    return buildQuotationPrompt(estimateData); // Use the same prompt structure for non-AI fallback
  }

  try {
    const model = genAI.getGenerativeModel({ model: modelConfig.model, safetySettings: modelConfig.safetySettings });
    const promptText = buildQuotationPrompt(estimateData);
    
    console.log("--- Sending Prompt to Gemini ---");
    // console.log(promptText);
    console.log("-------------------------------");

    const result = await model.generateContent(promptText);
    const response = result.response;
    const text = response.text();
    
    console.log("--- Received Response from Gemini ---");
    // console.log(text);
    console.log("-----------------------------------");
    return text;

  } catch (error) {
    console.error("Error generating quotation with Gemini:", error);
    // Fallback to simpler generation if AI fails
    return `Error generating AI quotation. Please contact support. Fallback content:\n\n${buildQuotationPrompt(estimateData)}`;
  }
}

// Example of how this might be used with a specific model if needed differently elsewhere
// export async function generateFlashResponse(prompt: string): Promise<string> {
//   if (!genAI) return "AI not available.";
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
//   const result = await model.generateContent(prompt);
//   return result.response.text();
// } 