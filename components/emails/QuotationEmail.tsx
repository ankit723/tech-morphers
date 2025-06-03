import * as React from 'react';

interface QuotationEmailProps {
  fullName: string;
  estimateId: string; // Short ID for display
  // We'll pass the pre-generated markdown content for the attachment,
  // but the email body itself will be structured HTML here.
  // For a more advanced setup, you could convert markdown to React components too.
  siteUrl?: string;
  supportEmail?: string;
}

// Inline styles for broad email client compatibility
const styles = {
  body: {
    margin: '0',
    padding: '0',
    width: '100% !important' as React.CSSProperties['width'],
    WebkitFontSmoothing: 'antialiased' as React.CSSProperties['WebkitFontSmoothing'],
    backgroundColor: '#f4f4f7',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    color: '#333333',
  },
  emailWrapper: {
    width: '100%',
    backgroundColor: '#f4f4f7',
    padding: '20px 0',
  },
  emailContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden' as React.CSSProperties['overflow'],
    boxShadow: '0 6px 18px rgba(0,0,0,0.07)',
    border: '1px solid #e0e0e0',
  },
  header: {
    backgroundColor: '#2c3e50', // Dark blue-grey
    color: '#ffffff',
    padding: '35px 25px',
    textAlign: 'center' as React.CSSProperties['textAlign'],
  },
  headerH1: {
    color: '#ffffff',
    margin: '0',
    fontSize: '26px',
    fontWeight: 600,
  },
  bodyContent: {
    padding: '30px 35px',
    fontSize: '15px',
    lineHeight: '1.65',
    color: '#555555',
  },
  bodyH2: {
    color: '#34495e', // Secondary accent
    fontSize: '22px',
    fontWeight: 500,
    marginTop: '0',
    marginBottom: '20px',
  },
  paragraph: {
    marginBottom: '16px',
  },
  strong: {
    color: '#2c3e50',
    fontWeight: 500,
  },
  link: {
    color: '#3498db',
    textDecoration: 'underline',
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: '#3498db', // Vibrant blue
    color: '#ffffff',
    padding: '12px 28px',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 500,
    margin: '15px 0 20px',
    fontSize: '16px',
    border: '0',
  },
  attachmentNote: {
    backgroundColor: '#eef5fa',
    borderLeft: '4px solid #3498db',
    padding: '15px 20px',
    margin: '25px 0',
    fontSize: '14px',
    borderRadius: '4px',
  },
  attachmentNoteP: {
    marginBottom: '8px',
  },
  code: {
    backgroundColor: '#dfeaf2',
    padding: '3px 6px',
    borderRadius: '3px',
    fontFamily: 'monospace',
    color: '#2c3e50',
  },
  footer: {
    backgroundColor: '#f8f9fa',
    padding: '25px 35px',
    textAlign: 'center' as React.CSSProperties['textAlign'],
    fontSize: '13px',
    color: '#888888',
    borderTop: '1px solid #e0e0e0',
  },
  footerLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: 500,
  },
  contentBlock: {
    marginBottom: '20px',
  },
};

export const QuotationEmailTemplate: React.FC<Readonly<QuotationEmailProps>> = ({ 
  fullName, 
  estimateId, 
  siteUrl = 'https://techmorphers.com', // Default, can be passed from .env
  supportEmail = 'support@techmorphers.com' // Default
}) => (
  <div style={styles.body}>
    <div style={styles.emailWrapper}>
      <div style={styles.emailContainer}>
        <div style={styles.header}>
          {/* Optional: <img src="YOUR_LOGO_URL_HERE" alt="Tech Morphers Logo" style={{maxWidth: '160px', marginBottom: '10px'}} /> */}
          <h1 style={styles.headerH1}>Tech Morphers</h1>
        </div>
        <div style={styles.bodyContent}>
          <h2 style={styles.bodyH2}>Your Custom Project Quotation is Ready!</h2>
          <div style={styles.contentBlock}>
            <p style={styles.paragraph}>Dear {fullName},</p>
            <p style={styles.paragraph}>
              Thank you for your interest in Tech Morphers! We&apos;ve prepared a preliminary quotation based on the project details you provided. 
              Your vision is important to us, and this document outlines the initial scope we&apos;ve derived.
            </p>
          </div>
          <div style={styles.attachmentNote}>
            <p style={{...styles.paragraph, ...styles.attachmentNoteP, fontWeight: 'bold' as React.CSSProperties['fontWeight']}}>Quotation Document Attached</p>
            <p style={{...styles.paragraph, ...styles.attachmentNoteP}}>
              Please find your personalized quotation (<code style={styles.code}>Quotation-TM-{estimateId}.md</code>) attached to this email.
            </p>
            <p style={{...styles.paragraph, ...styles.attachmentNoteP}}>
              This Markdown document details the potential scope, features, and considerations for your project. 
              You can open it with any standard text editor or a dedicated Markdown viewer.
            </p>
          </div>
          <div style={styles.contentBlock}>
            <p style={{...styles.paragraph, fontWeight: 'bold' as React.CSSProperties['fontWeight']}}>Next Steps:</p>
            <p style={styles.paragraph}>
              Our team will carefully review your submission. We may reach out if we have any questions or to discuss your project in more detail. 
              Please allow us some time to give your request the attention it deserves.
            </p>
          </div>
          <div style={styles.contentBlock}>
            <p style={styles.paragraph}>
              If you have any immediate questions, or if you&apos;d like to discuss this quotation, please don&apos;t hesitate to contact us. 
              You can reply directly to this email or use the button below.
            </p>
            <a href={`${siteUrl}/contact`} target="_blank" style={styles.ctaButton}>Contact Our Team</a> 
          </div>
          <p style={{...styles.paragraph, marginTop: '25px'}}>
            We are excited about the possibility of collaborating with you and bringing your project to life!
          </p>
        </div>
        <div style={styles.footer}>
          <p style={styles.paragraph}>&copy; {new Date().getFullYear()} Tech Morphers. All rights reserved.</p>
          <p style={styles.paragraph}>
            <a href={siteUrl} target="_blank" style={styles.footerLink}>{siteUrl.replace(/^https?_\/\//, '')}</a> | <a href={`mailto:${supportEmail}`} style={styles.footerLink}>{supportEmail}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default QuotationEmailTemplate; 