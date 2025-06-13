# OpenAI-Powered PDF Quotation System

This system generates detailed, AI-powered quotations using OpenAI's GPT model and formats them into professional PDF documents.

## Features

✅ **AI-Generated Content**: Uses OpenAI to analyze client requirements and generate personalized quotations
✅ **Detailed Breakdown**: Provides phase-by-phase project breakdowns with specific timelines and costs
✅ **Realistic Pricing**: AI considers budget constraints and provides realistic cost estimates
✅ **Tabular Summary**: Professional table format summarizing all deliverables, timelines, and costs
✅ **Responsive to Client Input**: Adapts recommendations based on client's stated budget and timeline
✅ **Fallback Support**: Graceful fallback if OpenAI API is unavailable

## Setup

1. **Install Dependencies**:
   ```bash
   npm install openai
   ```

2. **Environment Variables**:
   Add to your `.env.local` file:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## API Usage

### Generate PDF Quotation

**Endpoint**: `POST /api/generate-pdf`

**Request Body**:
```json
{
  "estimatorId": "your-estimator-id-here"
}
```

**Response**: 
- Success: PDF file download
- Error: JSON error message

### Example Usage in Frontend

```javascript
const generatePDF = async (estimatorId) => {
  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estimatorId }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'quotation.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const error = await response.json();
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
```

## What the AI Analyzes

The AI considers the following client information:
- **Project Details**: Type, purpose, target audience
- **Technical Requirements**: Features, design preferences, custom branding needs
- **Timeline Constraints**: Client's expected delivery timeline
- **Budget Range**: Client's stated budget expectations
- **Additional Services**: Add-ons and custom requirements

## AI Output Structure

The generated quotation includes:

### 1. **Personalized Introduction**
- Addresses client by name
- Acknowledges specific requirements

### 2. **Detailed Project Scope**
- Technical complexity analysis
- Package recommendations or custom solutions

### 3. **Phase-by-Phase Breakdown**
```
Phase 1: Discovery & Planning (1-2 weeks) - ₹15,000
- Requirements analysis
- Technical architecture
- Project roadmap

Phase 2: Design & Development (4-6 weeks) - ₹60,000
- UI/UX design
- Core development
- Feature implementation
```

### 4. **Professional Summary Table**
| Item | Description | Timeline | Cost |
|------|-------------|----------|------|
| Discovery & Planning | Requirements analysis, wireframing | 1-2 weeks | ₹15,000 |
| Design & UI/UX | User interface design, UX optimization | 2-3 weeks | ₹25,000 |
| Development | Core development, feature implementation | 4-6 weeks | ₹50,000 |
| Testing & Deployment | QA, deployment, launch support | 1 week | ₹10,000 |
| **TOTAL** | | **8-12 weeks** | **₹1,00,000** |

### 5. **Realistic Timeline & Pricing**
- Considers client's budget constraints
- Suggests alternatives if budget is insufficient
- Provides phased approaches when needed

### 6. **Next Steps**
- Clear action items for client
- Professional engagement process

## Service Packages Available

The AI can recommend from these packages:

1. **Starter** (₹29,999) - 7-10 Days
   - Basic website/app with 5 pages
   - Basic branding + hosting

2. **Growth** (₹79,999) - 2-3 Weeks  
   - Advanced website/app with 8-12 pages
   - Admin dashboard, API integrations

3. **Pro/SaaS MVP** (₹99,999) - 4-5 Weeks
   - Full-stack MVP with authentication
   - Payments, database integration

4. **Custom Enterprise** (Custom Quote) - 6-10 Weeks
   - Enterprise solution with dedicated team

## Error Handling

- **Missing API Key**: Returns clear error message
- **Invalid Estimator ID**: Returns 404 error
- **AI Generation Failure**: Falls back to template-based quotation
- **JSON Parsing Issues**: Automatically cleans AI response

## Benefits

- **Consistency**: Every quotation follows professional standards
- **Personalization**: Each quotation is tailored to specific client needs
- **Efficiency**: Automated generation saves time
- **Professional Appearance**: High-quality PDF output
- **Intelligent Pricing**: AI considers market rates and client budgets
- **Detailed Breakdowns**: Clients understand exactly what they're paying for

## Future Enhancements

- Multi-language support
- Custom branding/logos in PDFs
- Integration with CRM systems
- Advanced pricing algorithms
- Client feedback integration 