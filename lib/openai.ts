import OpenAI from 'openai';
import { Estimator } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface QuotationContent {
  title: string;
  introduction: string;
  projectScope: string;
  recommendedPackage?: {
    name: string;
    price: string;
    features: string[];
    addons?: string[];
  };
  customFeatures?: string[];
  detailedBreakdown: {
    phases: Array<{
      phase: string;
      duration: string;
      deliverables: string[];
      cost: string;
    }>;
  };
  timeline: string;
  pricing: string;
  quotationSummary: {
    tableData: Array<{
      item: string;
      description: string;
      timeline: string;
      cost: string;
    }>;
    totalCost: string;
    totalTimeline: string;
  };
  nextSteps: string[];
  additionalNotes?: string;
}

export const generateQuotationWithAI = async (estimateData: Estimator): Promise<QuotationContent> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const prompt = `
You are a professional business development specialist for Tech Morphers, a software development company. Generate a comprehensive and detailed quotation based on the following client requirements.

Client Information:
- Name: ${estimateData.fullName}
- Company: ${estimateData.companyName || 'Individual Client'}
- Email: ${estimateData.email}
- Role: ${estimateData.userRole || 'Not specified'}

Project Details:
- Project Type: ${estimateData.projectType || 'Not specified'}
- Purpose: ${estimateData.projectPurpose || 'Not specified'}
- Target Audience: ${estimateData.targetAudience || 'Not specified'}
- Features Required: ${estimateData.features?.join(', ') || 'To be discussed'}
- Design Preference: ${estimateData.designPreference || 'Not specified'}
- Custom Branding Needed: ${estimateData.needsCustomBranding ? 'Yes' : 'No'}
- Client's Expected Timeline: ${estimateData.deliveryTimeline || 'Flexible'}
- Client's Budget Range: ${estimateData.budgetRange || 'To be discussed'}
- Additional Services: ${estimateData.addons?.join(', ') || 'None'}
- Custom Requirements: ${estimateData.customRequests || 'None'}

Available Service Packages:
1. Starter (₹29,999) - 7-10 Days - Basic website/app with 5 pages, branding, hosting
2. Growth (₹79,999) - 2-3 Weeks - Advanced website/app with 8-12 pages, admin dashboard, API integrations
3. Pro/SaaS MVP (₹99,999) - 4-5 Weeks - Full-stack MVP with authentication, payments, database
4. Custom Enterprise (Custom Quote) - 6-10 Weeks - Enterprise solution with dedicated team

IMPORTANT INSTRUCTIONS:
1. Analyze the client's budget range and timeline expectations carefully
2. Provide realistic cost estimates that align with their budget or explain if their budget needs adjustment
3. Break down the project into detailed phases with specific timelines and costs
4. Create a comprehensive table summarizing all deliverables, timelines, and costs
5. Consider the complexity of requested features when estimating time and cost
6. If the client's timeline is aggressive, mention potential risks and suggest realistic alternatives

Generate a professional quotation response in JSON format with the following structure:
{
  "title": "Detailed Project Quotation for [Client Name]",
  "introduction": "Professional introduction paragraph addressing the client personally and acknowledging their specific requirements",
  "projectScope": "Detailed description of the project scope based on requirements, including technical complexity analysis",
  "recommendedPackage": {
    "name": "Package name if applicable",
    "price": "Package price with justification",
    "features": ["List of core features with detail"],
    "addons": ["List of additional services if applicable"]
  },
  "customFeatures": ["List of custom features if not using a standard package"],
  "detailedBreakdown": {
    "phases": [
      {
        "phase": "Phase 1: Discovery & Planning",
        "duration": "X weeks",
        "deliverables": ["Specific deliverable 1", "Specific deliverable 2"],
        "cost": "₹X,XXX"
      },
      {
        "phase": "Phase 2: Design & Development",
        "duration": "X weeks", 
        "deliverables": ["Specific deliverable 1", "Specific deliverable 2"],
        "cost": "₹X,XXX"
      }
    ]
  },
  "timeline": "Realistic timeline assessment based on project complexity and client expectations",
  "pricing": "Detailed pricing breakdown and justification, addressing client's budget range",
  "quotationSummary": {
    "tableData": [
      {
        "item": "Discovery & Planning",
        "description": "Requirements analysis, wireframing, project setup",
        "timeline": "1-2 weeks",
        "cost": "₹X,XXX"
      },
      {
        "item": "Design & UI/UX",
        "description": "User interface design, user experience optimization",
        "timeline": "2-3 weeks", 
        "cost": "₹X,XXX"
      },
      {
        "item": "Development",
        "description": "Core development, feature implementation",
        "timeline": "X weeks",
        "cost": "₹X,XXX"
      },
      {
        "item": "Testing & Deployment",
        "description": "Quality assurance, deployment, launch support",
        "timeline": "1 week",
        "cost": "₹X,XXX"
      }
    ],
    "totalCost": "₹X,XXX (breakdown of total)",
    "totalTimeline": "X-Y weeks (realistic estimate)"
  },
  "nextSteps": ["Detailed step 1", "Detailed step 2", "Detailed step 3", "Detailed step 4"],
  "additionalNotes": "Important considerations, assumptions, terms, or recommendations"
}

Make the response highly detailed and professional. Ensure all costs are realistic for the Indian market and align with the client's stated budget range. If their budget is insufficient, provide alternative solutions or phased approaches.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional business development specialist creating detailed project quotations. Always respond with valid JSON format. Be thorough and realistic with timelines and pricing."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Clean the response by removing markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    const quotationContent: QuotationContent = JSON.parse(cleanedResponse);
    return quotationContent;

  } catch (error) {
    console.error('Error generating quotation with OpenAI:', error);
    // Enhanced fallback with more detail
    return {
      title: `Detailed Project Quotation for ${estimateData.fullName}`,
      introduction: "Thank you for your interest in Tech Morphers. We've carefully reviewed your project requirements and are excited to present this comprehensive quotation tailored to your specific needs.",
      projectScope: `Based on your requirements for a ${estimateData.projectType || 'custom project'}, we understand you need ${estimateData.features?.join(', ') || 'a comprehensive solution'}. This project will require careful planning and execution to meet your goals.`,
      detailedBreakdown: {
        phases: [
          {
            phase: "Phase 1: Discovery & Planning",
            duration: "1-2 weeks",
            deliverables: ["Requirements analysis", "Technical architecture", "Project roadmap"],
            cost: "₹15,000"
          },
          {
            phase: "Phase 2: Development & Implementation", 
            duration: "4-6 weeks",
            deliverables: ["Core development", "Feature implementation", "Integration testing"],
            cost: estimateData.budgetRange || "₹70,000"
          }
        ]
      },
      timeline: estimateData.deliveryTimeline || "6-8 weeks",
      pricing: `Total project cost: ${estimateData.budgetRange || "₹85,000"} (includes all phases and deliverables)`,
      quotationSummary: {
        tableData: [
          {
            item: "Discovery & Planning",
            description: "Requirements analysis, technical planning, project setup",
            timeline: "1-2 weeks",
            cost: "₹15,000"
          },
          {
            item: "Development",
            description: "Core development and feature implementation",
            timeline: "4-6 weeks", 
            cost: "₹60,000"
          },
          {
            item: "Testing & Deployment",
            description: "Quality assurance, deployment, launch support",
            timeline: "1 week",
            cost: "₹10,000"
          }
        ],
        totalCost: estimateData.budgetRange || "₹85,000",
        totalTimeline: "6-8 weeks"
      },
      nextSteps: [
        "Review this detailed quotation",
        "Schedule a consultation call to discuss requirements",
        "Finalize project scope and timeline",
        "Sign agreement and begin development"
      ]
    };
  }
}; 