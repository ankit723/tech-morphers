"use client"

import React, { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  ImageUploadService, 
  ImageUploadResult, 
  ImageUploadOptions 
} from "@/lib/image-upload"
import NextImage from "next/image"

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  options?: Partial<ImageUploadOptions>
  placeholder?: string
  className?: string
  disabled?: boolean
  showPreview?: boolean
  showMetadata?: boolean
  variant?: 'featured' | 'profile' | 'content' | 'og'
}

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  metadata?: {
    originalName: string
    size: number
    width: number
    height: number
    type: string
  }
}

export function ImageUpload({
  value,
  onChange,
  options = {},
  placeholder = "Click to upload image or drag and drop",
  className,
  disabled = false,
  showPreview = true,
  showMetadata = false,
  variant = 'content'
}: ImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get variant-specific options
  const getVariantOptions = useCallback((): Partial<ImageUploadOptions> => {
    const variants = {
      featured: { maxSize: 10, maxWidth: 1920, maxHeight: 1080, quality: 0.85 },
      profile: { maxSize: 2, maxWidth: 400, maxHeight: 400, quality: 0.8 },
      content: { maxSize: 5, maxWidth: 1200, maxHeight: 800, quality: 0.8 },
      og: { maxSize: 3, maxWidth: 1200, maxHeight: 630, quality: 0.85 }
    }
    return { ...variants[variant], ...options }
  }, [variant, options])

  const handleFileUpload = useCallback(async (file: File) => {
    if (disabled) return

    setUploadState({
      uploading: true,
      progress: 0,
      error: null
    })

    try {
      const service = new ImageUploadService(getVariantOptions())
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }))
      }, 100)

      const result: ImageUploadResult = await service.uploadImage(file)
      
      clearInterval(progressInterval)

      if (result.success && result.url) {
        setUploadState({
          uploading: false,
          progress: 100,
          error: null,
          metadata: result.metadata
        })
        onChange(result.url)
      } else {
        setUploadState({
          uploading: false,
          progress: 0,
          error: result.error || 'Upload failed'
        })
      }
    } catch (error) {
      setUploadState({
        uploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }, [disabled, getVariantOptions, onChange])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFileUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleRemove = useCallback(() => {
    onChange(null)
    setUploadState({
      uploading: false,
      progress: 0,
      error: null
    })
  }, [onChange])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const variantConfig = {
    featured: { 
      title: "Featured Image", 
      description: "Recommended: 1920×1080px, up to 10MB",
      aspectRatio: "aspect-video"
    },
    profile: { 
      title: "Profile Image", 
      description: "Recommended: 400×400px, up to 2MB",
      aspectRatio: "aspect-square"
    },
    content: { 
      title: "Content Image", 
      description: "Recommended: 1200×800px, up to 5MB",
      aspectRatio: "aspect-[3/2]"
    },
    og: { 
      title: "Social Media Image", 
      description: "Recommended: 1200×630px, up to 3MB",
      aspectRatio: "aspect-[1.91/1]"
    }
  }

  const config = variantConfig[variant]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all duration-200",
          isDragOver 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
            : "border-gray-300 dark:border-gray-600",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Existing Image Preview */}
        {value && showPreview && (
          <div className="relative">
            <div className={cn("relative overflow-hidden rounded-lg", config.aspectRatio)}>
              <NextImage
                src={value}
                alt="Uploaded image"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={() => window.open(value, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={handleRemove}
                    disabled={disabled}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Interface */}
        {!value && (
          <div
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center p-8 cursor-pointer",
              config.aspectRatio,
              disabled && "cursor-not-allowed"
            )}
          >
            <AnimatePresence mode="wait">
              {uploadState.uploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Uploading...
                  </p>
                  <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadState.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {uploadState.progress}%
                  </p>
                </motion.div>
              ) : uploadState.error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                  <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                    Upload Failed
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {uploadState.error}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUploadState({ uploading: false, progress: 0, error: null })}
                  >
                    Try Again
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4",
                    isDragOver 
                      ? "bg-blue-100 dark:bg-blue-900/30" 
                      : "bg-gray-100 dark:bg-gray-800"
                  )}>
                    <Upload className={cn(
                      "w-6 h-6",
                      isDragOver ? "text-blue-500" : "text-gray-400"
                    )} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {config.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {placeholder}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {config.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Image Metadata */}
      {value && showMetadata && uploadState.metadata && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Image Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Filename:</span>
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {uploadState.metadata.originalName}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Size:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatFileSize(uploadState.metadata.size)}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Dimensions:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {uploadState.metadata.width} × {uploadState.metadata.height}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Type:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {uploadState.metadata.type}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      {value && !uploadState.uploading && !uploadState.error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Image uploaded successfully</span>
        </motion.div>
      )}
    </div>
  )
} 