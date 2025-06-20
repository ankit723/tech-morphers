import { sendEmail } from './emailer';
import { 
  ContactUsEmail, 
  GetStartedEmail, 
  TalkToUsEmail, 
  NewsletterEmail, 
  ContactPageEmail,
  ScheduleCallEmail
} from '@/components/emails/NotificationEmails';

export interface ContactUsNotificationData {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  selectedPackage: string;
  message: string;
  submissionId: string;
}

export interface GetStartedNotificationData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  companyName?: string;
  projectVision: string;
  submissionId: string;
}

export interface TalkToUsNotificationData {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  message: string;
  submissionId: string;
}

export interface NewsletterNotificationData {
  email: string;
  subscriptionId: string;
}

export interface ContactPageNotificationData {
  name: string;
  email: string;
  phone: string;
  message: string;
  submissionId: string;
}

export interface ScheduleCallNotificationData {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  projectBrief: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  meetingLink: string;
  submissionId: string;
}

// Map package IDs to readable names
const packageNames: Record<string, string> = {
  'STARTER': 'Starter',
  'GROWTH': 'Growth',
  'PRO': 'Pro / SaaS MVP',
  'ENTERPRISE': 'Custom Enterprise'
};

export async function sendContactUsNotification(data: ContactUsNotificationData) {
  const packageName = packageNames[data.selectedPackage] || data.selectedPackage;
  
  const emailResult = await sendEmail({
    to: data.email,
    subject: `Thank you for your ${packageName} package inquiry - Tech Morphers`,
    react: ContactUsEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      selectedPackage: packageName,
      message: data.message,
      submissionId: data.submissionId,
    }),
    text: `Dear ${data.name},

Thank you for your interest in our ${packageName} package. We've received your inquiry and are excited to help bring your project to life.

What happens next:
1. Our team will review your requirements within 24 hours
2. We'll schedule a discovery call to discuss your project in detail
3. You'll receive a customized proposal tailored to your needs

Your Inquiry Details:
Package: ${packageName}
${data.companyName ? `Company: ${data.companyName}\n` : ''}Email: ${data.email}
Phone: ${data.phone}
Reference ID: ${data.submissionId.substring(0, 8).toUpperCase()}

If you have any immediate questions, feel free to reply to this email. We look forward to working with you!

Best regards,
Tech Morphers Team
https://www.techmorphers.com`
  });

  return emailResult;
}

export async function sendGetStartedNotification(data: GetStartedNotificationData) {
  const emailResult = await sendEmail({
    to: data.email,
    subject: `Welcome to Tech Morphers - Let's get started on your ${data.service} project!`,
    react: GetStartedEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      budget: data.budget,
      companyName: data.companyName,
      projectVision: data.projectVision,
      submissionId: data.submissionId,
    }),
    text: `Dear ${data.name},

Thank you for choosing Tech Morphers for your ${data.service} project. We're thrilled to help transform your vision into reality.

Your Project Journey Starts Now:
- Next 24 hours: Project assessment and team assignment
- Within 48 hours: Initial consultation call scheduled
- Week 1: Detailed project roadmap and timeline delivery

Project Overview:
Service: ${data.service}
${data.budget ? `Budget Range: ${data.budget}\n` : ''}${data.companyName ? `Company: ${data.companyName}\n` : ''}Reference ID: ${data.submissionId.substring(0, 8).toUpperCase()}

We're excited to work with you and bring your project vision to life!

Best regards,
Tech Morphers Team
https://www.techmorphers.com`
  });

  return emailResult;
}

export async function sendTalkToUsNotification(data: TalkToUsNotificationData) {
  const emailResult = await sendEmail({
    to: data.email,
    subject: `Thank you for reaching out to Tech Morphers - We'll be in touch soon!`,
    react: TalkToUsEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      message: data.message,
      submissionId: data.submissionId,
    }),
    text: `Dear ${data.name},

Thank you for contacting Tech Morphers. We've received your message and appreciate you taking the time to reach out to us.

We'll get back to you soon:
- Response time: Within 24 hours
- Contact method: Email or phone call
- Your reference: ${data.submissionId.substring(0, 8).toUpperCase()}

Your Message:
"${data.message}"

In the meantime, feel free to explore our services and recent projects on our website.

Best regards,
Tech Morphers Team
https://www.techmorphers.com`
  });

  return emailResult;
}

export async function sendNewsletterNotification(data: NewsletterNotificationData) {
  const emailResult = await sendEmail({
    to: data.email,
    subject: `Welcome to Tech Morphers Newsletter - Stay updated with our latest projects!`,
    react: NewsletterEmail({
      email: data.email,
      subscriptionId: data.subscriptionId,
    }),
    text: `Thank you for subscribing to the Tech Morphers newsletter! You're now part of our community.

What to expect from us:
✨ Latest project updates and case studies
💡 Exclusive development tips and insights
🚀 Early access to new services and features
📅 Monthly tech trends and industry updates

Have a project in mind? Don't hesitate to reach out - we'd love to help bring your ideas to life!

Best regards,
Tech Morphers Team
https://www.techmorphers.com

To unsubscribe: https://www.techmorphers.com/unsubscribe?id=${data.subscriptionId}`
  });

  return emailResult;
}

export async function sendContactPageNotification(data: ContactPageNotificationData) {
  const emailResult = await sendEmail({
    to: data.email,
    subject: `Thank you for contacting Tech Morphers - ${data.name}`,
    react: ContactPageEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      submissionId: data.submissionId,
    }),
    text: `Dear ${data.name},

Thank you for reaching out through our contact page. We've received your message and will respond as soon as possible.

What's next:
📞 We'll contact you within 24 hours
📧 Response via email: ${data.email}
📱 Or phone call: ${data.phone}

Your Message:
"${data.message}"

Reference ID: ${data.submissionId.substring(0, 8).toUpperCase()}

Best regards,
Tech Morphers Team
https://www.techmorphers.com`
  });

  return emailResult;
}

export async function sendScheduleCallNotification(data: ScheduleCallNotificationData) {
  const emailResult = await sendEmail({
    to: data.email,
    subject: `Your Consultation Call is Confirmed - ${new Date(data.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`,
    react: ScheduleCallEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      projectBrief: data.projectBrief,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      duration: data.duration,
      meetingLink: data.meetingLink,
      submissionId: data.submissionId,
    }),
    text: `Dear ${data.name},

Your consultation call with Tech Morphers has been successfully scheduled. We're excited to discuss your project and help bring your vision to life!

Call Details:
- Date: ${new Date(data.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Time: ${data.scheduledTime}
- Duration: ${data.duration} minutes
- Meeting Type: Video Call (Google Meet)
- Reference ID: ${data.submissionId.substring(0, 8).toUpperCase()}

Meeting Link: ${data.meetingLink}

Your Project Brief:
"${data.projectBrief}"

Before Our Call:
• Please prepare any relevant documents or ideas
• Test your camera and microphone beforehand
• Have your project requirements ready to discuss
• Join the meeting 2-3 minutes early

Contact Details:
Email: ${data.email}
Phone: ${data.phone}${data.companyName ? `\nCompany: ${data.companyName}` : ''}

If you need to reschedule or have any questions, please reply to this email or contact us at least 24 hours before the scheduled time.

We look forward to speaking with you and discussing how we can help transform your ideas into reality!

Best regards,
Tech Morphers Team
https://www.techmorphers.com`
  });

  return emailResult;
} 