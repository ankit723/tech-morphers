import { NextRequest, NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY || '{}'),
})

const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'techmorphers'
const bucket = storage.bucket(bucketName)

// Allowed file types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
]

// Max file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const filename = formData.get('filename') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
        },
        { status: 400 }
      )
    }

    // Generate unique filename if not provided
    const finalFilename = filename || `${Date.now()}_${Math.random().toString(36).substring(2)}_${file.name}`
    
    // Create file path with organized structure

    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const filePath = `blog-images/${year}/${month}/${finalFilename}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a reference to the file in Google Cloud Storage
    const cloudFile = bucket.file(filePath)

    // Upload the file
    await cloudFile.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000', // Cache for 1 year
      },
    })

    // Generate the public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: finalFilename,
      path: filePath,
      size: file.size,
      type: file.type,
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 