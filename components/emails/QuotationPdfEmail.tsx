import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr, Button, Link } from '@react-email/components';
import * as React from 'react';

interface QuotationPdfEmailProps {
  fullName: string;
  estimateId: string; // Short ID, e.g., TM-862654c3
  companyName?: string; // Company name from form, or defaults to "Tech Morphers"
  pdfFileName?: string; // e.g., Quotation-TM-862654c3.pdf
  pdfUrl?: string; // URL to access PDF online
  contactUrl?: string; // URL for the "Contact Our Team" button
  siteUrl?: string;
}

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
  backgroundColor: '#0A2540', // Dark blue, similar to image
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
  color: '#1d3557', // Darker text color
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

const attachmentInfoBox = {
  backgroundColor: '#e9f5fe', // Light blue background
  borderLeft: '4px solid #2a9df4', // Blue left border
  padding: '15px 20px',
  margin: '20px 0',
  borderRadius: '4px',
};

const onlineAccessBox = {
  backgroundColor: '#f0f9ff', // Very light blue background
  borderLeft: '4px solid #10b981', // Green left border
  padding: '15px 20px',
  margin: '20px 0',
  borderRadius: '4px',
};

const attachmentText = {
  ...paragraph,
  fontSize: '15px',
  color: '#1d3557',
};

const nextStepsTitle = {
  ...paragraph,
  fontWeight: 'bold' as const,
  color: '#1d3557',
  marginTop: '25px',
};

const button = {
  backgroundColor: '#2a9df4', // Blue button
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

const pdfButton = {
  backgroundColor: '#10b981', // Green button for PDF access
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
  marginRight: '10px',
};

const footerText = {
  ...paragraph,
  fontSize: '14px',
  textAlign: 'center' as const,
  color: '#8898aa',
  marginTop: '20px',
  marginBottom: '0px',
};

const defaultSiteUrl = 'https://www.techmorphers.com'; // Fallback site URL

const defaultContactUrl = 'https://www.techmorphers.com/contact';

export const QuotationPdfEmail = ({
  fullName,
  estimateId,
  companyName = "Tech Morphers",
  pdfFileName = `Quotation-TM-${estimateId}.pdf`,
  pdfUrl,
  contactUrl = defaultContactUrl,
  siteUrl = defaultSiteUrl,
}: QuotationPdfEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Custom Project Quotation is Ready - {companyName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          {/* Optionally add an Img tag here if you have a logoUrl */}
          {/* <Img src={logoUrl} width="180" height="50" alt="Tech Morphers Logo" style={{ margin: 'auto' }} /> */}
          <Text style={headerText}>Tech Morphers</Text>
        </Section>

        <Section style={box}>
          <Heading style={heading}>Your Custom Project Quotation is Ready!</Heading>
          <Text style={paragraph}>Dear {fullName},</Text>
          <Text style={paragraph}>
            Thank you for your interest in Tech Morphers! We&apos;ve prepared a preliminary quotation based on the project details you provided. Your vision is important to us, and this document outlines the initial scope we&apos;ve derived.
          </Text>

          <Section style={attachmentInfoBox}>
            <Heading as="h3" style={{ ...nextStepsTitle, marginTop: '0', marginBottom: '10px' }}>📎 Quotation Document Attached</Heading>
            <Text style={attachmentText}>
              Please find your personalized quotation (<strong>{pdfFileName}</strong>) attached to this email.
            </Text>
            <Text style={attachmentText}>
              This PDF document details the potential scope, features, and considerations for your project. 
            </Text>
          </Section>

          {pdfUrl && (
            <Section style={onlineAccessBox}>
              <Heading as="h3" style={{ ...nextStepsTitle, marginTop: '0', marginBottom: '10px' }}>🌐 Online Access Available</Heading>
              <Text style={attachmentText}>
                You can also access your quotation online at any time using the link below:
              </Text>
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <Button style={pdfButton} href={pdfUrl}>
                  View Quotation Online
                </Button>
              </div>
              <Text style={{...attachmentText, fontSize: '13px', marginTop: '10px'}}>
                This link will remain active and can be shared with your team or stakeholders.
              </Text>
            </Section>
          )}

          <Heading as="h3" style={nextStepsTitle}>Next Steps:</Heading>
          <Text style={paragraph}>
            Our team will carefully review your submission. We may reach out if we have any questions or to discuss your project in more detail. Please allow us some time to give your request the attention it deserves.
          </Text>

          <Text style={paragraph}>
            If you have any immediate questions, or if you&apos;d like to discuss this quotation, please don&apos;t hesitate to contact us. You can reply directly to this email or use the button below.
          </Text>
          
          <div style={{ textAlign: 'center' }}>
             <Button style={button} href={contactUrl}>
              Contact Our Team
            </Button>
          </div>

          <Text style={paragraph}>
            We&apos;re excited to provide you with an estimate for your project. Here&apos;s a breakdown of the estimated costs based on your requirements.
          </Text>

          <Text style={paragraph}>
            We&apos;re looking forward to working with you and helping you bring your vision to life. Let&apos;s create something amazing together!
          </Text>

          <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
          <Text style={footerText}>
            © {new Date().getFullYear()} Tech Morphers. All rights reserved. <br />
            <Link href={siteUrl} style={{ color: '#8898aa', textDecoration: 'underline' }}>{siteUrl}</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default QuotationPdfEmail; 