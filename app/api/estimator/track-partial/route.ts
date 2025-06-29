import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendFormLeadNotificationToAdmin } from '@/lib/whatsapp'
import { sendEmail } from '@/lib/emailer'

export async function POST(request: NextRequest) {
  try {
    const { 
      formData, 
      currentStep, 
      timeSpent, 
      sessionId 
    } = await request.json()

    // Track partial submission for analytics and follow-up
    const partialSubmission = await prisma.estimator.create({
      data: {
        // Basic info (might be empty initially)
        projectType: formData.projectType || null,
        projectPurpose: formData.projectPurpose || null,
        targetAudience: formData.targetAudience || null,
        features: formData.features || [],
        designPreference: formData.designPreference || null,
        needsCustomBranding: formData.needsCustomBranding || false,
        deliveryTimeline: formData.deliveryTimeline || null,
        budgetRange: formData.budgetRange || null,
        addons: formData.addons || [],
        
        // Contact info (usually empty for partial submissions)
        fullName: formData.fullName || 'Anonymous User',
        email: formData.email || `partial_${sessionId}@temp.com`,
        phone: formData.phone || null,
        companyName: formData.companyName || null,
        userRole: formData.userRole || null,
        
        // Mark as partial submission
        isConverted: false,
        projectStatus: 'JUST_STARTED',
        
        // Add metadata
        customRequests: `PARTIAL SUBMISSION - Step: ${currentStep}/${7}, Time Spent: ${Math.floor(timeSpent/60)}min, Session: ${sessionId}. Original data: ${formData.customRequests || 'None'}`
      }
    })

    console.log('Partial submission tracked:', partialSubmission.id)

    // Send gentle follow-up email if we have email
    if (formData.email && formData.email.includes('@') && !formData.email.includes('temp.com')) {
      try {
        await sendEstimatorFollowUpEmail({
          email: formData.email,
          name: formData.fullName || 'there',
          currentStep,
          projectType: formData.projectType,
          completionPercentage: Math.round((currentStep / 7) * 100)
        })
        console.log('Follow-up email sent to:', formData.email)
      } catch (emailError) {
        console.error('Failed to send follow-up email:', emailError)
      }
    }

    // Notify admin about partial submission for follow-up
    if (currentStep >= 3) { // Only if user showed some engagement
      try {
        await sendFormLeadNotificationToAdmin({
          name: formData.fullName || 'Anonymous User',
          email: formData.email || 'No email provided',
          phone: formData.phone || 'No phone provided',
          companyName: formData.companyName || 'Not specified',
          message: `PARTIAL ESTIMATOR SUBMISSION - User reached step ${currentStep}/7 but didn't complete. Project: ${formData.projectType || 'Not specified'}. Time spent: ${Math.floor(timeSpent/60)} minutes.`,
          formType: 'Partial Estimator Submission',
          submissionId: partialSubmission.id,
        })
        console.log('Admin notification sent for partial submission')
      } catch (whatsappError) {
        console.error('Failed to send admin notification:', whatsappError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      submissionId: partialSubmission.id,
      message: 'Partial submission tracked'
    })
  } catch (error) {
    console.error('Error tracking partial submission:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to track partial submission'
    }, { status: 500 })
  }
}

// Helper function to send follow-up email
async function sendEstimatorFollowUpEmail({
  email,
  name,
  projectType,
  completionPercentage
}: {
  email: string
  name: string
  currentStep: number
  projectType?: string
  completionPercentage: number
}) {
  const subject = "Your project estimate is waiting! 🚀📱"
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Complete Your Project Estimate</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background: #f8f9fa;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 30px 20px; 
                border-radius: 15px; 
                text-align: center; 
                margin-bottom: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .content { 
                background: white; 
                padding: 25px; 
                border-radius: 15px; 
                box-shadow: 0 2px 15px rgba(0,0,0,0.08);
                margin-bottom: 20px;
            }
            .progress-container {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
            }
            .progress-bar { 
                background: #e9ecef; 
                border-radius: 15px; 
                height: 12px; 
                margin: 15px 0; 
                overflow: hidden;
                box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            }
            .progress-fill { 
                background: linear-gradient(90deg, #667eea, #764ba2); 
                height: 100%; 
                border-radius: 15px;
                transition: width 0.3s ease;
            }
            .cta-button { 
                display: inline-block; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 18px 35px; 
                text-decoration: none; 
                border-radius: 12px; 
                font-weight: bold; 
                margin: 20px 0;
                font-size: 16px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                transition: transform 0.2s ease;
            }
            .cta-button:hover {
                transform: translateY(-2px);
            }
            .benefits { 
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                padding: 25px; 
                border-radius: 12px; 
                margin: 20px 0;
                border-left: 4px solid #667eea;
            }
            .benefit-item {
                display: flex;
                align-items: center;
                margin: 12px 0;
                font-size: 15px;
            }
            .emoji {
                font-size: 20px;
                margin-right: 12px;
            }
            .footer { 
                text-align: center; 
                color: #6c757d; 
                font-size: 14px; 
                margin-top: 30px;
                padding: 20px;
                background: white;
                border-radius: 12px;
            }
            .mobile-friendly {
                font-size: 16px;
                line-height: 1.7;
            }
            @media (max-width: 600px) {
                .container { padding: 15px; }
                .header { padding: 25px 15px; }
                .content { padding: 20px; }
                .cta-button { 
                    padding: 16px 30px; 
                    font-size: 15px;
                    width: 100%;
                    text-align: center;
                    display: block;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 24px;">Don't lose your progress! 💡</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">
                    Your project estimate is ${completionPercentage}% complete! 📊
                </p>
            </div>
            
            <div class="content mobile-friendly">
                <h2 style="color: #333; margin-top: 0;">Hey ${name}! 👋</h2>
                
                <p>We noticed you started building your <strong>${projectType || 'project'}</strong> estimate but got distracted (totally happens! 😅).</p>
                
                <div class="progress-container">
                    <div style="font-size: 18px; font-weight: bold; color: #667eea; margin-bottom: 10px;">
                        ${completionPercentage}% Complete! 🎯
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${completionPercentage}%"></div>
                    </div>
                    <div style="font-size: 14px; color: #6c757d;">
                        You're so close to getting your custom quote! 🚀
                    </div>
                </div>
                
                <div class="benefits">
                    <h3 style="margin-top: 0; color: #333;">🎁 Why finish your estimate?</h3>
                    <div class="benefit-item">
                        <span class="emoji">💰</span>
                        <span><strong>FREE consultation</strong> worth $150 with our experts</span>
                    </div>
                    <div class="benefit-item">
                        <span class="emoji">🎯</span>
                        <span><strong>Accurate pricing</strong> tailored to your specific needs</span>
                    </div>
                    <div class="benefit-item">
                        <span class="emoji">✅</span>
                        <span><strong>No commitment</strong> - just valuable insights</span>
                    </div>
                    <div class="benefit-item">
                        <span class="emoji">⚡</span>
                        <span><strong>2 minutes left</strong> - we saved your progress!</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/estimator" class="cta-button">
                        🚀 Complete My Estimate (2 mins left)
                    </a>
                </div>
                
                <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 15px; color: #1565c0;">
                        <strong>🔒 Privacy Promise:</strong> Your info is secure & we'll never spam you. 
                        We're here to help you build something amazing! ✨
                    </p>
                </div>
                
                <p style="color: #6c757d; font-size: 15px;">
                    Questions? Just reply to this email - we'd love to help! 💬
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0;"><strong>Tech Morphers Team</strong> 🚀</p>
                    <p style="margin: 5px 0 0 0; color: #6c757d; font-size: 14px;">
                        Building the future, one project at a time ✨
                    </p>
                </div>
            </div>
            
            <div class="footer">
                <p style="margin: 0; font-weight: 500;">Tech Morphers | Building Tomorrow's Technology Today 🌟</p>
                <p style="margin: 10px 0 0 0; font-size: 13px;">
                    Don't want these emails? Just let us know! 📧
                </p>
            </div>
        </div>
    </body>
    </html>
  `

  const textContent = `
Hey ${name}! 👋

We noticed you started your ${projectType || 'project'} estimate but got distracted (happens to the best of us! 😅)

Your estimate is ${completionPercentage}% complete! 📊

🎁 Complete it to get:
💰 FREE consultation worth $150
🎯 Accurate pricing for your needs  
✅ No commitment required
⚡ Just 2 minutes left!

Continue here: ${process.env.NEXT_PUBLIC_APP_URL}/estimator

Questions? Just reply! 💬

Tech Morphers Team 🚀
Building the future, one project at a time ✨
  `

  await sendEmail({
    to: email,
    subject,
    text: textContent,
    html: htmlContent
  })
} 