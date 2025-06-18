// Image Upload Utility for Blog System
// Handles file validation, compression, and Google Cloud Storage

export interface ImageUploadOptions {
  maxSize?: number // in MB
  maxWidth?: number
  maxHeight?: number
  quality?: number // 0-1
  allowedTypes?: string[]
  useCloudStorage?: boolean
}

export interface ImageUploadResult {
  success: boolean
  url?: string
  error?: string
  metadata?: {
    originalName: string
    size: number
    width: number
    height: number
    type: string
  }
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSize: 5, // 5MB
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  useCloudStorage: true
}

export class ImageUploadService {
  private options: ImageUploadOptions

  constructor(options: Partial<ImageUploadOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  /**
   * Validate image file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!this.options.allowedTypes?.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} not allowed. Supported types: ${this.options.allowedTypes?.join(', ')}`
      }
    }

    // Check file size
    const maxSizeBytes = (this.options.maxSize || 5) * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${this.options.maxSize}MB`
      }
    }

    return { valid: true }
  }

  /**
   * Compress and resize image
   */
  async compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        const maxWidth = this.options.maxWidth || 1920
        const maxHeight = this.options.maxHeight || 1080

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          file.type,
          this.options.quality || 0.8
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(file: File): Promise<{
    width: number
    height: number
    size: number
    type: string
    name: string
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
          type: file.type,
          name: file.name
        })
      }

      img.onerror = () => reject(new Error('Failed to load image metadata'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Generate unique filename for cloud storage
   */
  private generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "")
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_')
    
    return `${sanitizedName}_${timestamp}_${randomString}.${extension}`
  }

  /**
   * Upload to Google Cloud Storage
   */
  async uploadToGoogleCloud(file: File): Promise<ImageUploadResult> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('filename', this.generateUniqueFilename(file.name))

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      
      if (result.success) {
        const metadata = await this.getImageMetadata(file)
        return {
          success: true,
          url: result.url,
          metadata: {
            originalName: file.name,
            size: metadata.size,
            width: metadata.width,
            height: metadata.height,
            type: metadata.type
          }
        }
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Upload image with validation and compression
   */
  async uploadImage(file: File): Promise<ImageUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Get original metadata
      const originalMetadata = await this.getImageMetadata(file)

      // Compress if needed
      const shouldCompress = 
        originalMetadata.width > (this.options.maxWidth || 1920) ||
        originalMetadata.height > (this.options.maxHeight || 1080) ||
        file.size > 1024 * 1024 // Compress if larger than 1MB

      const processedFile = shouldCompress ? await this.compressImage(file) : file

      // Upload to cloud storage if enabled
      if (this.options.useCloudStorage) {
        return await this.uploadToGoogleCloud(processedFile)
      }

      // Fallback to local blob URL
      const url = URL.createObjectURL(processedFile)
      const finalMetadata = await this.getImageMetadata(processedFile)

      return {
        success: true,
        url,
        metadata: {
          originalName: file.name,
          size: finalMetadata.size,
          width: finalMetadata.width,
          height: finalMetadata.height,
          type: finalMetadata.type
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Create optimized image variants (thumbnail, medium, large)
   */
  async createImageVariants(file: File): Promise<{
    thumbnail: string
    medium: string
    large: string
    original: string
  }> {
    const variants = {
      thumbnail: { width: 300, height: 200, quality: 0.7 },
      medium: { width: 800, height: 600, quality: 0.8 },
      large: { width: 1200, height: 800, quality: 0.85 },
      original: { width: 1920, height: 1080, quality: 0.9 }
    }

    const results: any = {}

    for (const [variant, options] of Object.entries(variants)) {
      const service = new ImageUploadService({ ...options, useCloudStorage: this.options.useCloudStorage })
      const result = await service.uploadImage(file)
      if (result.success && result.url) {
        results[variant] = result.url
      }
    }

    return results
  }
}

// Utility functions for common use cases
export const uploadFeaturedImage = async (file: File): Promise<ImageUploadResult> => {
  const service = new ImageUploadService({
    maxSize: 10, // 10MB for featured images
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    useCloudStorage: true
  })
  return service.uploadImage(file)
}

export const uploadProfileImage = async (file: File): Promise<ImageUploadResult> => {
  const service = new ImageUploadService({
    maxSize: 2, // 2MB for profile images
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.8,
    useCloudStorage: true
  })
  return service.uploadImage(file)
}

export const uploadContentImage = async (file: File): Promise<ImageUploadResult> => {
  const service = new ImageUploadService({
    maxSize: 5, // 5MB for content images
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.8,
    useCloudStorage: true
  })
  return service.uploadImage(file)
}

export const uploadOGImage = async (file: File): Promise<ImageUploadResult> => {
  const service = new ImageUploadService({
    maxSize: 3, // 3MB for OG images
    maxWidth: 1200,
    maxHeight: 630, // Standard OG image ratio
    quality: 0.85,
    useCloudStorage: true
  })
  return service.uploadImage(file)
}

// Image preview component helper
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to create preview'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

// Cleanup utility for blob URLs
export const cleanupImageURL = (url: string) => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
} 