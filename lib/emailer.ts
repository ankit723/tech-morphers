import { Resend } from 'resend';
import type { CreateEmailOptions, CreateEmailResponse } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM; // e.g., 'Tech Morphers <quotations@yourverifieddomain.com>'

let resend: Resend | null = null;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn(
    "RESEND_API_KEY is not set. Email sending via Resend will be disabled. " +
    "Please ensure RESEND_API_KEY and EMAIL_FROM are set in your .env file."
  );
}

if (!emailFrom && resendApiKey) {
    console.warn(
        "EMAIL_FROM is not set, but RESEND_API_KEY is. " +
        "Resend requires a 'from' address. Email sending might fail or use a Resend default."
    );
}

export interface ResendEmailOptions {
  to: string | string[];
  subject: string;
  react?: React.ReactElement; 
  html?: string; 
  text?: string; 
  attachments?: {
    filename: string;
    content: Buffer; 
  }[];
}

// Adjusted return type for clarity and to match Resend's error structure more closely
type SendEmailResult =
  | { data: CreateEmailResponse; error: null } // Success case
  | { data: null; error: { message: string; name: string; statusCode: number } }; // Error case

export async function sendEmail(options: ResendEmailOptions): Promise<SendEmailResult> {
  if (!resend || !emailFrom) {
    const warningMessage = "Resend client is not initialized or EMAIL_FROM is not set. Skipping email send.";
    console.warn(warningMessage);
    return {
        data: null,
        error: {
            message: warningMessage,
            name: "ConfigurationError",
            statusCode: 500
        }
    };
  }

  // CreateEmailOptions requires one of 'react', 'html', or 'text'.
  // 'text' must be a string if 'react' or 'html' is provided.
  let mailContentOptions: Pick<CreateEmailOptions, 'react' | 'html' | 'text'>;

  if (options.react) {
    mailContentOptions = { react: options.react, text: options.text || "" };
  } else if (options.html) {
    mailContentOptions = { html: options.html, text: options.text || "" };
  } else if (options.text && typeof options.text === 'string') { // Ensure text is a string
    mailContentOptions = { text: options.text };
  } else {
    const errorMessage = "Email content is missing or invalid. Please provide 'react' (React.Element), 'html' (string), or 'text' (string) option.";
    console.error(errorMessage);
    return {
        data: null,
        error: { message: errorMessage, name: "InputValidationError", statusCode: 400 }
    };
  }

  const mailOptions: CreateEmailOptions = {
    from: emailFrom,
    to: options.to,
    subject: options.subject,
    ...mailContentOptions, // This correctly includes either react/text, html/text, or just text
    attachments: options.attachments?.map(att => ({
        filename: att.filename,
        content: att.content, 
    })),
  };

  try {
    // Resend SDK v3+ send() returns CreateEmailResponse ({ id: string }) on success, or throws an error.
    const response: CreateEmailResponse = await resend.emails.send(mailOptions);
    console.log("Email sent successfully via Resend, ID:", response.id);
    return { data: response, error: null }; // 'response' is { id: string }

  } catch (error: any) {
    console.error("Error sending email via Resend:", error);
    // Attempt to construct a Resend-like error object
    const resendError = error as { message?: string; name?: string; statusCode?: number; response?: { status?: number } };
    
    const errorMessage = resendError.message || 'Unknown error during email sending.';
    const errorName = resendError.name || 'ResendError';
    // Resend errors might have statusCode directly, or nested in response.status
    const statusCode = resendError.statusCode || resendError.response?.status || 500;

    return {
        data: null,
        error: {
            message: errorMessage,
            name: errorName,
            statusCode: statusCode
        }
    };
  }
} 