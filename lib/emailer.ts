import { Resend } from 'resend';
import type { CreateEmailOptions, CreateEmailResponse as ResendSdkResponse } from 'resend';

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

// Define what we expect the successful 'data' part of ResendSdkResponse to be
interface EmailSentData {
  id: string;
}

// Adjusted return type for clarity and to match Resend's error structure more closely
type SendEmailResult =
  | { data: EmailSentData; error: null } // Success case, data is { id: string }
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
  let finalMailOptions: CreateEmailOptions;

  if (options.react) {
    finalMailOptions = {
      from: emailFrom,
      to: options.to,
      subject: options.subject,
      react: options.react,
      text: options.text || "", // Provide empty string as text fallback if not present
      attachments: options.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    };
  } else if (options.html) {
    finalMailOptions = {
      from: emailFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || "", // Provide empty string as text fallback if not present
      attachments: options.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    };
  } else if (options.text && typeof options.text === 'string') { // Ensure text is a string
    finalMailOptions = {
      from: emailFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      attachments: options.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    };
  } else {
    const errorMessage = "Email content is missing or invalid. Please provide 'react' (React.Element), 'html' (string), or 'text' (string) option.";
    console.error(errorMessage);
    return {
        data: null,
        error: { message: errorMessage, name: "InputValidationError", statusCode: 400 }
    };
  }

  try {
    // Resend SDK v4+ send() returns an object like { data: { id: string } | null, error: Error | null }
    // Let's call the type of this object ResendSdkResponse
    const sdkResponse: ResendSdkResponse = await resend.emails.send(finalMailOptions);

    if (sdkResponse.error) {
      console.error("Error sending email via Resend SDK:", sdkResponse.error);
      return {
        data: null,
        error: {
          message: sdkResponse.error.message,
          name: sdkResponse.error.name,
          // Attempt to get statusCode, ResendError might have it directly or under a different property
          statusCode: (sdkResponse.error as any).statusCode || (sdkResponse.error as any).status || 500,
        },
      };
    }

    if (sdkResponse.data) {
      // sdkResponse.data should be of type { id: string } (EmailSentData)
      console.log("Email sent successfully via Resend, ID:", sdkResponse.data.id);
      return { data: sdkResponse.data, error: null }; 
    } else {
      // This case implies success (no error) but no data, which is unusual for Resend v4 success.
      // Resend v4 success typically has data: { id: string }.
      // Handling this defensively.
      const errorMessage = "Resend SDK returned no error but also no data.id on success.";
      console.error(errorMessage);
      return { data: null, error: { message: errorMessage, name: "ResendUnexpectedSuccessResponse", statusCode: 500 } };
    }

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