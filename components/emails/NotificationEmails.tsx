import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr, Button, Link } from '@react-email/components';

// Common styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #f0f0f0',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  maxWidth: '600px',
};

const headerSection = {
  backgroundColor: '#0A2540',
  padding: '24px 0',
  textAlign: 'center' as const,
  color: 'white',
};

const headerText = {
  fontSize: '28px',
  fontWeight: 'bold',
};

const box = {
  padding: '0 48px',
};

const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: 'bold',
  color: '#1d3557',
  textAlign: 'left' as const,
  marginTop: '30px',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.5',
  textAlign: 'left' as const,
  marginBottom: '15px',
};

const infoBox = {
  backgroundColor: '#e9f5fe',
  borderLeft: '4px solid #2a9df4',
  padding: '15px 20px',
  margin: '20px 0',
  borderRadius: '4px',
};

const button = {
  backgroundColor: '#2a9df4',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 25px',
  marginTop: '10px',
  marginBottom: '15px',
};

const footerText = {
  ...paragraph,
  fontSize: '14px',
  textAlign: 'center' as const,
  color: '#8898aa',
  marginTop: '20px',
  marginBottom: '0px',
};

// Contact Us Package Inquiry Email
interface ContactUsEmailProps {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  selectedPackage: string;
  message: string;
  submissionId: string;
}

export const ContactUsEmail = ({
  name,
  email,
  phone,
  companyName,
  selectedPackage,
  message,
  submissionId,
}: ContactUsEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for your inquiry about our {selectedPackage} package - Tech Morphers</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={headerText}>Tech Morphers</Text>
        </Section>
        <Section style={box}>
          <Heading style={heading}>Thank You for Your Inquiry!</Heading>
          <Text style={paragraph}>Dear {name},</Text>
          <Text style={paragraph}>
            Thank you for your interest in our <strong>{selectedPackage}</strong> package. We&apos;ve received your inquiry and are excited to help bring your project to life.
          </Text>
          
          <Section style={infoBox}>
            <Heading as="h3" style={{ ...heading, fontSize: '18px', marginTop: '0', marginBottom: '10px' }}>
              What happens next?
            </Heading>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              <strong>1.</strong> Our team will review your requirements within 24 hours
            </Text>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              <strong>2.</strong> We&apos;ll schedule a discovery call to discuss your project in detail
            </Text>
            <Text style={{...paragraph, marginBottom: '0'}}>
              <strong>3.</strong> You&apos;ll receive a customized proposal tailored to your needs
            </Text>
          </Section>

          <Text style={paragraph}>
            <strong>Your Inquiry Details:</strong><br/>
            Package: {selectedPackage}<br/>
            {companyName && <>Company: {companyName}<br/></>}
            Email: {email}<br/>
            Phone: {phone}<br/>
            Reference ID: {submissionId.substring(0, 8).toUpperCase()}
          </Text>

          <Text style={paragraph}>
            <strong>Your Message:</strong><br/>
            &quot;{message}&quot;
          </Text>

          <div style={{ textAlign: 'center' }}>
            <Button style={button} href="https://www.techmorphers.com/contact">
              Contact Our Team
            </Button>
          </div>

          <Text style={paragraph}>
            If you have any immediate questions, feel free to reply to this email. We look forward to working with you!
          </Text>

          <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
          <Text style={footerText}>
            © {new Date().getFullYear()} Tech Morphers. All rights reserved.<br />
            <Link href="https://www.techmorphers.com" style={{ color: '#8898aa', textDecoration: 'underline' }}>
              techmorphers.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Get Started Form Email
interface GetStartedEmailProps {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  companyName?: string;
  projectVision: string;
  submissionId: string;
}

export const GetStartedEmail = ({
  name,
  email,
  phone,
  service,
  budget,
  companyName,
  projectVision,
  submissionId,
}: GetStartedEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Tech Morphers - Let&apos;s get started on your {service} project!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={headerText}>Tech Morphers</Text>
        </Section>
        <Section style={box}>
          <Heading style={heading}>Welcome! Let&apos;s Get Started 🚀</Heading>
          <Text style={paragraph}>Dear {name},</Text>
          <Text style={paragraph}>
            Thank you for choosing Tech Morphers for your <strong>{service}</strong> project. We&apos;re thrilled to help transform your vision into reality.
          </Text>
          
          <Section style={infoBox}>
            <Heading as="h3" style={{ ...heading, fontSize: '18px', marginTop: '0', marginBottom: '10px' }}>
              Your Project Journey Starts Now
            </Heading>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              <strong>Next 24 hours:</strong> Project assessment and team assignment
            </Text>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              <strong>Within 48 hours:</strong> Initial consultation call scheduled
            </Text>
            <Text style={{...paragraph, marginBottom: '0'}}>
              <strong>Week 1:</strong> Detailed project roadmap and timeline delivery
            </Text>
          </Section>

          <Text style={paragraph}>
            <strong>Project Overview:</strong><br/>
            Service: {service}<br/>
            {budget && <>Budget Range: {budget}<br/></>}
            {companyName && <>Company: {companyName}<br/></>}
            {email && <>Email: {email}<br/></>}
            {phone && <>Phone: {phone}<br/></>}
            Reference ID: {submissionId.substring(0, 8).toUpperCase()}
          </Text>

          <Text style={paragraph}>
            <strong>Your Project Vision:</strong><br/>
            &quot;{projectVision}&quot;
          </Text>

          <div style={{ textAlign: 'center' }}>
            <Button style={button} href="https://www.techmorphers.com/packages">
              View Our Services
            </Button>
          </div>

          <Text style={paragraph}>
            We&apos;re excited to work with you and bring your project vision to life!
          </Text>

          <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
          <Text style={footerText}>
            © {new Date().getFullYear()} Tech Morphers. All rights reserved.<br />
            <Link href="https://www.techmorphers.com" style={{ color: '#8898aa', textDecoration: 'underline' }}>
              techmorphers.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Talk To Us Email
interface TalkToUsEmailProps {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  message: string;
  submissionId: string;
}

export const TalkToUsEmail = ({
  name,
  email,
  phone,
  companyName,
  message,
  submissionId,
}: TalkToUsEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for reaching out to Tech Morphers - We&apos;ll be in touch soon!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={headerText}>Tech Morphers</Text>
        </Section>
        <Section style={box}>
          <Heading style={heading}>Thanks for Reaching Out!</Heading>
          <Text style={paragraph}>Dear {name},</Text>
          <Text style={paragraph}>
            Thank you for contacting Tech Morphers. We&apos;ve received your message and appreciate you taking the time to reach out to us.
          </Text>
          
          <Section style={infoBox}>
            <Heading as="h3" style={{ ...heading, fontSize: '18px', marginTop: '0', marginBottom: '10px' }}>
              We&apos;ll get back to you soon
            </Heading>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              <strong>Response time:</strong> Within 24 hours
            </Text>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              <strong>Contact method:</strong> Email or phone call
            </Text>
            <Text style={{...paragraph, marginBottom: '0'}}>
              <strong>Your reference:</strong> {submissionId.substring(0, 8).toUpperCase()}
            </Text>
          </Section>

          <Text style={paragraph}>
            <strong>Your Message:</strong><br/>
            &quot;{message}&quot;
          </Text>

          <Text style={paragraph}>
            <strong>Your Contact Details:</strong><br/>
            Email: {email}<br/>
            {phone && <>Phone: {phone}<br/></>}
            {companyName && <>Company: {companyName}<br/></>}
            Reference ID: {submissionId.substring(0, 8).toUpperCase()}
          </Text>

          <div style={{ textAlign: 'center' }}>
            <Button style={button} href="https://www.techmorphers.com">
              Visit Our Website
            </Button>
          </div>

          <Text style={paragraph}>
            In the meantime, feel free to explore our services and recent projects on our website.
          </Text>

          <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
          <Text style={footerText}>
            © {new Date().getFullYear()} Tech Morphers. All rights reserved.<br />
            <Link href="https://www.techmorphers.com" style={{ color: '#8898aa', textDecoration: 'underline' }}>
              techmorphers.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Newsletter Subscription Email
interface NewsletterEmailProps {
  email: string;
  subscriptionId: string;
}

export const NewsletterEmail = ({
  email,
  subscriptionId,
}: NewsletterEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Tech Morphers Newsletter - Stay updated with our latest projects!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={headerText}>Tech Morphers</Text>
        </Section>
        <Section style={box}>
          <Heading style={heading}>Welcome to Our Newsletter! 📬</Heading>
          <Text style={paragraph}>
            Thank you for subscribing to the Tech Morphers newsletter! You&apos;re now part of our community.
          </Text>
          
          <Section style={infoBox}>
            <Heading as="h3" style={{ ...heading, fontSize: '18px', marginTop: '0', marginBottom: '10px' }}>
              What to expect from us
            </Heading>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              ✨ Latest project updates and case studies
            </Text>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              💡 Exclusive development tips and insights
            </Text>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              🚀 Early access to new services and features
            </Text>
            <Text style={{...paragraph, marginBottom: '0'}}>
              📅 Monthly tech trends and industry updates
            </Text>
          </Section>

          <div style={{ textAlign: 'center' }}>
            <Button style={button} href="https://www.techmorphers.com/packages">
              Explore Our Services
            </Button>
          </div>

          <Text style={paragraph}>
            Have a project in mind? Don&apos;t hesitate to reach out - we&apos;d love to help bring your ideas to life!
          </Text>

          <Text style={{ ...paragraph, fontSize: '14px', color: '#8898aa' }}>
            <strong>📧 Subscription Details:</strong><br/>
            Email: {email}<br/>
            Subscription ID: {subscriptionId.substring(0, 8).toUpperCase()}
          </Text>

          <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
          <Text style={footerText}>
            © {new Date().getFullYear()} Tech Morphers. All rights reserved.<br />
            <Link href="https://www.techmorphers.com" style={{ color: '#8898aa', textDecoration: 'underline' }}>
              techmorphers.com
            </Link> | 
            <Link href={`https://www.techmorphers.com/unsubscribe?id=${subscriptionId}`} style={{ color: '#8898aa', textDecoration: 'underline' }}>
              Unsubscribe
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Contact Page Email
interface ContactPageEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
  submissionId: string;
}

export const ContactPageEmail = ({
  name,
  email,
  phone,
  message,
  submissionId,
}: ContactPageEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for contacting Tech Morphers - We&apos;ll be in touch soon!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={headerText}>Tech Morphers</Text>
        </Section>
        <Section style={box}>
          <Heading style={heading}>Thank You for Contacting Us!</Heading>
          <Text style={paragraph}>Dear {name},</Text>
          <Text style={paragraph}>
            Thank you for reaching out to Tech Morphers. We&apos;ve received your message and will get back to you as soon as possible.
          </Text>
          
          <Section style={infoBox}>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              <strong>Expected Response Time:</strong> 24-48 hours
            </Text>
            <Text style={{...paragraph, marginBottom: '0'}}>
              <strong>For urgent matters:</strong> Please call us directly at (555) 123-4567
            </Text>
          </Section>

          <Text style={paragraph}>
            <strong>Your Message Details:</strong><br/>
            Email: {email}<br/>
            Phone: {phone}<br/>
            Reference ID: {submissionId.substring(0, 8).toUpperCase()}
          </Text>

          <Text style={paragraph}>
            <strong>Your Message:</strong><br/>
            &quot;{message}&quot;
          </Text>

          <div style={{ textAlign: 'center' }}>
            <Button style={button} href="https://www.techmorphers.com/services">
              Explore Our Services
            </Button>
          </div>

          <Text style={paragraph}>
            In the meantime, feel free to explore our portfolio and services on our website.
          </Text>

          <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
          <Text style={footerText}>
            © {new Date().getFullYear()} Tech Morphers. All rights reserved.<br />
            <Link href="https://www.techmorphers.com" style={{ color: '#8898aa', textDecoration: 'underline' }}>
              techmorphers.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Blog Notification Email
interface BlogNotificationEmailProps {
  blogTitle: string;
  blogExcerpt: string;
  blogSlug: string;
  blogAuthor: string;
  blogReadTime: number;
  blogFeaturedImage?: string;
  blogCategories: string[];
  subscriberEmail: string;
}

export const BlogNotificationEmail = ({
  blogTitle,
  blogExcerpt,
  blogSlug,
  blogAuthor,
  blogReadTime,
  blogFeaturedImage,
  blogCategories,
  subscriberEmail,
}: BlogNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>New Blog Post: {blogTitle} - Tech Morphers</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={headerText}>Tech Morphers</Text>
          <Text style={{ ...paragraph, color: 'white', marginBottom: '0', fontSize: '14px' }}>
            New Blog Post Published
          </Text>
        </Section>
        <Section style={box}>
          <Heading style={heading}>📖 New Blog Post Published!</Heading>
          
          {blogFeaturedImage && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img 
                src={blogFeaturedImage} 
                alt={blogTitle}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '1px solid #e6ebf1'
                }}
              />
            </div>
          )}

          <Heading as="h2" style={{ ...heading, fontSize: '20px', marginTop: '0', color: '#2a9df4' }}>
            {blogTitle}
          </Heading>
          
          <Text style={paragraph}>
            {blogExcerpt}
          </Text>

          <Section style={infoBox}>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              <strong>📝 Author:</strong> {blogAuthor}
            </Text>
            <Text style={{...paragraph, marginBottom: '8px'}}>
              <strong>⏱️ Read Time:</strong> {blogReadTime} min{blogReadTime !== 1 ? 's' : ''}
            </Text>
            {blogCategories.length > 0 && (
              <Text style={{...paragraph, marginBottom: '0'}}>
                <strong>🏷️ Categories:</strong> {blogCategories.join(', ')}
              </Text>
            )}
          </Section>

          <div style={{ textAlign: 'center' }}>
            <Button style={button} href={`https://www.techmorphers.com/blog/${blogSlug}`}>
              Read Full Article
            </Button>
          </div>

          <Text style={paragraph}>
            We hope you enjoy this new content! Stay tuned for more insights, tutorials, and industry updates from our team.
          </Text>

          <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
          
          <Text style={{ ...paragraph, fontSize: '14px', color: '#8898aa' }}>
            <strong>💡 Why am I receiving this?</strong><br/>
            You&apos;re receiving this because your email ({subscriberEmail}) is in our database from a previous interaction with Tech Morphers. We thought you&apos;d be interested in our latest content.
          </Text>

          <Text style={{ ...paragraph, fontSize: '14px', color: '#8898aa' }}>
            <Link href={`https://www.techmorphers.com/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`} style={{ color: '#8898aa', textDecoration: 'underline' }}>
              Unsubscribe from blog notifications
            </Link> | 
            <Link href="https://www.techmorphers.com/blog" style={{ color: '#8898aa', textDecoration: 'underline' }}>
              View all blog posts
            </Link>
          </Text>

          <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
          <Text style={footerText}>
            © {new Date().getFullYear()} Tech Morphers. All rights reserved.<br />
            <Link href="https://www.techmorphers.com" style={{ color: '#8898aa', textDecoration: 'underline' }}>
              techmorphers.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
); 