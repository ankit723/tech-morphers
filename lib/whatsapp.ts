import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

if (!accountSid || !authToken || !whatsappNumber) {
  console.warn('Twilio configuration missing. WhatsApp functionality will be disabled.');
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

interface WhatsAppMessageOptions {
  to: string;
  message: string;
  mediaUrl?: string;
}

interface EstimatorLeadData {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  projectType?: string;
  budgetRange?: string;
  estimateId: string;
  pdfUrl?: string;
}

export async function sendWhatsAppMessage({ to, message, mediaUrl }: WhatsAppMessageOptions) {
  if (!client || !whatsappNumber) {
    console.error('Twilio client not configured. Cannot send WhatsApp message.');
    return { success: false, error: 'WhatsApp service not configured' };
  }

  try {
    // Ensure the phone number is in the correct format for WhatsApp
    const formattedNumber = formatWhatsAppNumber(to);
    
    const messageOptions: any = {
      body: message,
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${formattedNumber}`,
    };

    // Add media if provided
    if (mediaUrl) {
      messageOptions.mediaUrl = [mediaUrl];
    }

    const twilioMessage = await client.messages.create(messageOptions);

    console.log(`WhatsApp message sent successfully. SID: ${twilioMessage.sid}`);
    return {
      success: true,
      messageSid: twilioMessage.sid,
      status: twilioMessage.status,
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Helper function to format phone numbers for WhatsApp
function formatWhatsAppNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  let cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // If the number doesn't start with a country code, assume it's Indian (+91)
  if (cleanNumber.length === 10) {
    cleanNumber = '91' + cleanNumber;
  }
  
  // If it starts with 0, replace with country code
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '91' + cleanNumber.substring(1);
  }
  
  // If it already has +91 but as text, clean it
  if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
    return cleanNumber;
  }
  
  return cleanNumber;
}

// Test function to verify WhatsApp configuration
export async function testWhatsAppConfiguration() {
  if (!client || !whatsappNumber) {
    return {
      success: false,
      error: 'Twilio client not configured',
      configured: false,
    };
  }

  try {
    // Send a test message to the admin number
    const result = await sendWhatsAppMessage({
      to: '+919795786303',
      message: '🧪 *WhatsApp Integration Test*\n\nThis is a test message to verify that WhatsApp integration is working correctly.\n\n*Tech Morphers WhatsApp Service* ✅',
    });

    return {
      success: result.success,
      configured: true,
      result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      configured: true,
    };
  }
}

export async function sendEstimatorPDFToUser(userData: {
  fullName: string;
  phone?: string;
  estimateId: string;
  pdfUrl?: string;
}) {
  if (!userData.phone) {
    console.log('No phone number provided for user WhatsApp notification');
    return { success: false, error: 'No phone number provided' };
  }

  const message = `🎉 *Your Project Quotation is Ready!*

Hi ${userData.fullName}! 

Thank you for using Tech Morphers' Project Estimator. Your personalized quotation is now ready.

📄 *Reference ID:* ${userData.estimateId.substring(0, 8).toUpperCase()}

${userData.pdfUrl ? '📎 Your detailed quotation PDF is attached above.' : '📧 We\'ve also sent the detailed quotation to your email.'}

✨ *Next Steps:*
• Review your quotation carefully
• Contact us if you have any questions
• We're ready to bring your project to life!

💬 Reply to this message or call us to discuss your project further.

Best regards,
*Tech Morphers Team* 🚀`;

  return await sendWhatsAppMessage({
    to: userData.phone,
    message,
    mediaUrl: userData.pdfUrl,
  });
}

export async function sendLeadNotificationToAdmin(leadData: EstimatorLeadData) {
  const adminWhatsApp = '+919795786303';

  const message = `🎯 *New Project Estimate Submission!*

*Lead Details:*
👤 *Name:* ${leadData.fullName}
📧 *Email:* ${leadData.email}
${leadData.phone ? `📱 *Phone:* ${leadData.phone}` : ''}
${leadData.companyName ? `🏢 *Company:* ${leadData.companyName}` : ''}

*Project Information:*
${leadData.projectType ? `🚀 *Project Type:* ${leadData.projectType}` : ''}
${leadData.budgetRange ? `💰 *Budget Range:* ${leadData.budgetRange}` : ''}

📄 *Reference ID:* ${leadData.estimateId.substring(0, 8).toUpperCase()}

${leadData.pdfUrl ? `📎 *Quotation PDF:* ${leadData.pdfUrl}` : ''}

🎯 *Action Required:*
• Review the estimate details
• Follow up with the lead within 24 hours
• Schedule a consultation call if needed

*Admin Dashboard:* https://techmorphers.com/admin/estimators

*Tech Morphers CRM* 📊`;

  return await sendWhatsAppMessage({
    to: adminWhatsApp,
    message,
  });
}

export async function sendFormLeadNotificationToAdmin(formData: {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  message: string;
  formType: string;
  submissionId: string;
}) {
  const adminWhatsApp = '+919795786303';

  const whatsappMessage = `📝 *New ${formData.formType} Submission!*

*Contact Details:*
👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
${formData.phone ? `📱 *Phone:* ${formData.phone}` : ''}
${formData.companyName ? `🏢 *Company:* ${formData.companyName}` : ''}

*Message:*
💬 "${formData.message}"

📄 *Reference ID:* ${formData.submissionId.substring(0, 8).toUpperCase()}

🎯 *Action Required:*
• Respond within 24 hours
• Schedule follow-up if needed

*Admin Dashboard:* https://techmorphers.com/admin

*Tech Morphers CRM* 📊`;

  return await sendWhatsAppMessage({
    to: adminWhatsApp,
    message: whatsappMessage,
  });
}

export async function sendScheduleCallConfirmationToUser(callData: {
  name: string;
  phone: string;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  meetingLink: string;
  submissionId: string;
  projectBrief: string;
}) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formattedPhone = formatWhatsAppNumber(callData.phone);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const message = `🎉 *Your Consultation Call is Confirmed!*

Hi ${callData.name}! 

Your consultation call with Tech Morphers has been successfully scheduled.

📅 *Call Details:*
• *Date:* ${formatDate(callData.scheduledDate)}
• *Time:* ${formatTime(callData.scheduledTime)}
• *Duration:* ${callData.duration} minutes
• *Meeting Type:* Video Call (Google Meet)

🎥 *Join Meeting:*
${callData.meetingLink}

📋 *Your Project Brief:*
"${callData.projectBrief}"

📝 *Before Our Call:*
• Prepare any relevant documents or ideas
• Test your camera and microphone
• Have your project requirements ready
• Join 2-3 minutes early

📄 *Reference ID:* ${callData.submissionId.substring(0, 8).toUpperCase()}

We're excited to discuss your project and help bring your vision to life! 

If you need to reschedule, please contact us at least 24 hours in advance.

*Tech Morphers Team* 🚀`;

  return await sendWhatsAppMessage({
    to: formattedPhone,
    message,
  });
}

export async function sendScheduleCallNotificationToAdmin(callData: {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  meetingLink: string;
  submissionId: string;
  projectBrief: string;
}) {
  const adminWhatsApp = '+919795786303';

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const message = `📞 *New Consultation Call Scheduled!*

*Client Details:*
👤 *Name:* ${callData.name}
📧 *Email:* ${callData.email}
📱 *Phone:* ${callData.phone}
${callData.companyName ? `🏢 *Company:* ${callData.companyName}` : ''}

*Call Information:*
📅 *Date:* ${formatDate(callData.scheduledDate)}
⏰ *Time:* ${formatTime(callData.scheduledTime)}
🕐 *Duration:* ${callData.duration} minutes

🎥 *Meeting Link:* ${callData.meetingLink}

📋 *Project Brief:*
"${callData.projectBrief}"

📄 *Reference ID:* ${callData.submissionId.substring(0, 8).toUpperCase()}

🎯 *Admin Actions:*
• Review client's project brief before the call
• Prepare consultation materials
• Test meeting link functionality
• Set calendar reminder 15 minutes before

*Admin Dashboard:* https://techmorphers.com/admin/scheduled-calls

*Tech Morphers CRM* 📊`;

  return await sendWhatsAppMessage({
    to: adminWhatsApp,
    message,
  });
}

export async function sendPaymentNotificationToClient(paymentData: {
  clientName: string;
  clientPhone: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  submissionId: string;
}) {
  const message = `💳 *Payment Submitted Successfully!*

Hi ${paymentData.clientName}! 

Your payment has been successfully submitted and is now under review.

💰 *Payment Details:*
📄 *Invoice:* ${paymentData.invoiceNumber}
💵 *Amount:* ${paymentData.currency} ${paymentData.amount.toFixed(2)}
💳 *Method:* ${paymentData.paymentMethod}
🔢 *Transaction ID:* ${paymentData.transactionId}

⏳ *Status:* Under Review
🕐 *Processing Time:* 24-48 hours

✅ *What's Next:*
• Our team will verify your payment
• You'll receive a confirmation once approved
• Invoice status will be updated in your portal

📄 *Reference ID:* ${paymentData.submissionId.substring(0, 8).toUpperCase()}

🔗 *Track Status:* ${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard

Thank you for your payment!

Best regards,
*Tech Morphers Team* 🚀`;

  return await sendWhatsAppMessage({
    to: paymentData.clientPhone,
    message,
  });
}

export async function sendPaymentNotificationToAdmin(paymentData: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  paymentProofUrl: string;
  submissionId: string;
}) {
  const adminWhatsApp = '+919795786303';

  const message = `💰 *New Payment Submitted!*

*Client Details:*
👤 *Name:* ${paymentData.clientName}
📧 *Email:* ${paymentData.clientEmail}
${paymentData.clientPhone ? `📱 *Phone:* ${paymentData.clientPhone}` : ''}

*Payment Details:*
📄 *Invoice:* ${paymentData.invoiceNumber}
💵 *Amount:* ${paymentData.currency} ${paymentData.amount.toFixed(2)}
💳 *Method:* ${paymentData.paymentMethod}
🔢 *Transaction ID:* ${paymentData.transactionId}

📎 *Payment Proof:* ${paymentData.paymentProofUrl}

📄 *Reference ID:* ${paymentData.submissionId.substring(0, 8).toUpperCase()}

🎯 *Action Required:*
• Verify the payment proof
• Approve or reject the payment
• Update client on payment status

*Admin Dashboard:* https://techmorphers.com/admin/clients

*Tech Morphers CRM* 📊`;

  return await sendWhatsAppMessage({
    to: adminWhatsApp,
    message,
  });
}

export async function sendPaymentStatusUpdateToClient(updateData: {
  clientName: string;
  clientPhone: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string; // VERIFIED, PAID, REJECTED
  submissionId: string;
}) {
  let statusMessage = '';
  let statusEmoji = '';
  let nextSteps = '';

  switch (updateData.status) {
    case 'VERIFIED':
      statusEmoji = '✅';
      statusMessage = 'Payment Verified';
      nextSteps = '• Your payment has been confirmed\n• Invoice will be marked as paid\n• Project work will proceed as planned';
      break;
    case 'PAID':
      statusEmoji = '🎉';
      statusMessage = 'Payment Completed';
      nextSteps = '• Payment successfully processed\n• Invoice is now fully paid\n• Thank you for your business!';
      break;
    case 'REJECTED':
      statusEmoji = '❌';
      statusMessage = 'Payment Needs Review';
      nextSteps = '• Please check your payment details\n• Contact support for assistance\n• Resubmit payment if necessary';
      break;
    default:
      statusEmoji = '📋';
      statusMessage = 'Payment Status Updated';
      nextSteps = '• Check your client portal for details\n• Contact support if you have questions';
  }

  const message = `${statusEmoji} *${statusMessage}*

Hi ${updateData.clientName}! 

Your payment status has been updated.

💰 *Payment Details:*
📄 *Invoice:* ${updateData.invoiceNumber}
💵 *Amount:* ${updateData.currency} ${updateData.amount.toFixed(2)}
📊 *Status:* ${statusMessage}

✨ *Next Steps:*
${nextSteps}

📄 *Reference ID:* ${updateData.submissionId.substring(0, 8).toUpperCase()}

🔗 *View Details:* ${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard

${updateData.status === 'REJECTED' ? '📞 Need help? Reply to this message or contact our support team.' : 'Thank you for choosing Tech Morphers!'}

Best regards,
*Tech Morphers Team* 🚀`;

  return await sendWhatsAppMessage({
    to: updateData.clientPhone,
    message,
  });
} 