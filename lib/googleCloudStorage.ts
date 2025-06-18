import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
let storage: Storage | null = null;
let bucketName: string | null = null;

// Configuration from environment variables
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const bucketNameEnv = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;

// Alternative: Use service account key JSON directly
const serviceAccountKey = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY; // JSON string

if (projectId && bucketNameEnv) {
  bucketName = bucketNameEnv;
  
  try {
    if (serviceAccountKey) {
      // Use service account key from environment variable (recommended for production)
      const credentials = JSON.parse(serviceAccountKey);
      storage = new Storage({
        projectId,
        credentials,
      });
    } else {
      // Use default credentials (Application Default Credentials)
      storage = new Storage({
        projectId,
      });
    }
    
    console.log('Google Cloud Storage initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Google Cloud Storage:', error);
    storage = null;
  }
} else {
  console.warn(
    'Google Cloud Storage not configured. Please set GOOGLE_CLOUD_PROJECT_ID and GOOGLE_CLOUD_STORAGE_BUCKET environment variables.'
  );
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
}

/**
 * Upload a PDF buffer to Google Cloud Storage
 * @param buffer - PDF file buffer
 * @param fileName - Name for the file
 * @param folder - Optional folder path (e.g., 'quotations/')
 * @returns Promise with upload result
 */
export async function uploadPDFToGCS(
  buffer: Buffer,
  fileName: string,
  folder = 'quotations/'
): Promise<UploadResult> {
  if (!storage || !bucketName) {
    return {
      success: false,
      error: 'Google Cloud Storage not configured',
    };
  }

  try {
    const bucket = storage.bucket(bucketName);
    const fullFileName = `${folder}${fileName}`;
    const file = bucket.file(fullFileName);

    // Upload the buffer
    await file.save(buffer, {
      metadata: {
        contentType: 'application/pdf',
        cacheControl: 'public, max-age=3600', // Cache for 1 hour
      },
    });

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fullFileName}`;

    console.log(`PDF uploaded successfully to: ${publicUrl}`);

    return {
      success: true,
      url: publicUrl,
      fileName: fullFileName,
    };
  } catch (error) {
    console.error('Error uploading PDF to Google Cloud Storage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete a file from Google Cloud Storage
 * @param fileName - Full file name including folder path
 * @returns Promise with deletion result
 */
export async function deletePDFFromGCS(fileName: string): Promise<boolean> {
  if (!storage || !bucketName) {
    console.warn('Google Cloud Storage not configured');
    return false;
  }

  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    await file.delete();
    console.log(`File ${fileName} deleted successfully from GCS`);
    return true;
  } catch (error) {
    console.error('Error deleting file from Google Cloud Storage:', error);
    return false;
  }
}

/**
 * Check if a file exists in Google Cloud Storage
 * @param fileName - Full file name including folder path
 * @returns Promise<boolean>
 */
export async function fileExistsInGCS(fileName: string): Promise<boolean> {
  if (!storage || !bucketName) {
    return false;
  }

  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    return exists;
  } catch (error) {
    console.error('Error checking file existence in GCS:', error);
    return false;
  }
}

/**
 * Generate a signed URL for temporary access to a file
 * @param fileName - Full file name including folder path
 * @param expirationMinutes - Expiration time in minutes (default: 60)
 * @returns Promise with signed URL or null
 */
export async function generateSignedUrl(
  fileName: string,
  expirationMinutes = 60
): Promise<string | null> {
  if (!storage || !bucketName) {
    console.warn('Google Cloud Storage not configured');
    return null;
  }

  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const options = {
      version: 'v4' as const,
      action: 'read' as const,
      expires: Date.now() + expirationMinutes * 60 * 1000, // Convert minutes to milliseconds
    };

    const [signedUrl] = await file.getSignedUrl(options);
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
}

/**
 * Get file metadata from Google Cloud Storage
 * @param fileName - Full file name including folder path
 * @returns Promise with file metadata or null
 */
export async function getFileMetadata(fileName: string) {
  if (!storage || !bucketName) {
    return null;
  }

  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    const [metadata] = await file.getMetadata();
    return metadata;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    return null;
  }
} 