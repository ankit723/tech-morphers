"use client"

import { useState } from 'react'
import { X, Loader2, Upload, FileText, Video, Link, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface CreateDocumentModalProps {
  clientId: string
  projectId: string
  onClose: () => void
  onSuccess: () => void
}

export function CreateDocumentModal({ clientId, projectId, onClose, onSuccess }: CreateDocumentModalProps) {
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    requiresSignature: false,
    contentType: 'FILE', // FILE, VIDEO, LINK
    url: '' // For links
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    if (!formData.title) {
      // Auto-populate title from filename
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "")
      setFormData(prev => ({ ...prev, title: nameWithoutExtension }))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || !formData.type) {
      alert('Please fill in all required fields')
      return
    }

    // Validate based on content type
    if (formData.contentType === 'LINK') {
      if (!formData.url) {
        alert('Please provide a URL for the link')
        return
      }
      // Basic URL validation
      try {
        new URL(formData.url)
      } catch {
        alert('Please provide a valid URL')
        return
      }
    } else {
      if (!selectedFile) {
        alert('Please select a file to upload')
        return
      }
    }

    if (!projectId) {
      alert('Project ID is required. This document must be associated with a specific project.')
      return
    }

    setLoading(true)

    try {
      if (formData.contentType === 'LINK') {
        // Handle link submission
        const response = await fetch('/api/admin/project-documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId,
            projectId,
            title: formData.title,
            description: formData.description,
            type: formData.type,
            requiresSignature: formData.requiresSignature,
            uploadedBy: 'varanasiartist.omg@gmail.com', // Admin email
            contentType: 'LINK',
            url: formData.url
          })
        })

        const result = await response.json()
        if (result.success) {
          onSuccess()
        } else {
          alert('Failed to create link: ' + (result.error || 'Unknown error'))
        }
      } else {
        // Handle file upload (documents and videos)
        const formDataToSend = new FormData()
        formDataToSend.append('file', selectedFile!)
        formDataToSend.append('clientId', clientId)
        formDataToSend.append('title', formData.title)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('type', formData.type)
        formDataToSend.append('requiresSignature', formData.requiresSignature.toString())
        formDataToSend.append('uploadedBy', 'varanasiartist.omg@gmail.com') // Admin email
        formDataToSend.append('contentType', formData.contentType)
        
        if (projectId) {
          formDataToSend.append('projectId', projectId)
        }

        const response = await fetch('/api/admin/project-documents', {
          method: 'POST',
          body: formDataToSend
        })

        const result = await response.json()
        if (result.success) {
          onSuccess()
        } else {
          alert('Failed to upload: ' + (result.error || 'Unknown error'))
        }
      }
    } catch (error) {
      console.error('Error submitting content:', error)
      alert('Failed to submit content')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Add Content</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload files or add links to your project
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Type Selector */}
          <div>
            <Label htmlFor="contentType">Content Type <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.contentType} 
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, contentType: value }))
                setSelectedFile(null) // Reset file when changing type
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FILE">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Document</span>
                  </div>
                </SelectItem>
                <SelectItem value="VIDEO">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </div>
                </SelectItem>
                <SelectItem value="LINK">
                  <div className="flex items-center space-x-2">
                    <Link className="w-4 h-4" />
                    <span>Link</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area (for documents and videos) */}
          {formData.contentType !== 'LINK' && (
            <div>
              <Label>{formData.contentType === 'VIDEO' ? 'Video' : 'File'} <span className="text-red-500">*</span></Label>
              <div
                className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    {formData.contentType === 'VIDEO' ? (
                      <Video className="w-8 h-8 text-blue-600 mx-auto" />
                    ) : (
                      <FileText className="w-8 h-8 text-blue-600 mx-auto" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Drag and drop a {formData.contentType === 'VIDEO' ? 'video' : 'file'} here, or{' '}
                        <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                          browse
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept={formData.contentType === 'VIDEO' 
                              ? ".mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.m4v" 
                              : ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                            }
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.contentType === 'VIDEO' 
                          ? 'MP4, AVI, MOV, WMV, FLV, WEBM, MKV, M4V up to 100MB'
                          : 'PDF, DOC, DOCX, TXT, JPG, PNG, GIF up to 10MB'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* URL Input (for links) */}
          {formData.contentType === 'LINK' && (
            <div>
              <Label htmlFor="url">URL <span className="text-red-500">*</span></Label>
              <div className="mt-1 relative">
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                  className="pl-10"
                  required
                />
                <ExternalLink className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter a valid URL starting with http:// or https://
              </p>
            </div>
          )}

          {/* Content Details */}
          <div>
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={`Enter ${formData.contentType === 'LINK' ? 'link' : formData.contentType === 'VIDEO' ? 'video' : 'document'} title`}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Content Type <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="PROPOSAL">Proposal</SelectItem>
                <SelectItem value="REPORT">Report</SelectItem>
                <SelectItem value="SPECIFICATION">Specification</SelectItem>
                <SelectItem value="WIREFRAME">Wireframe</SelectItem>
                <SelectItem value="DESIGN">Design</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="LINK">Link</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={`Optional description of the ${formData.contentType === 'LINK' ? 'link' : formData.contentType === 'VIDEO' ? 'video' : 'document'}`}
              rows={3}
            />
          </div>

          {/* Show signature checkbox only for documents and contracts */}
          {formData.contentType === 'FILE' && (formData.type === 'CONTRACT' || formData.type === 'PROPOSAL' || formData.type === 'REPORT') && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresSignature"
                checked={formData.requiresSignature}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, requiresSignature: checked as boolean }))
                }
              />
              <Label htmlFor="requiresSignature" className="text-sm">
                This document requires client signature
              </Label>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (formData.contentType !== 'LINK' && !selectedFile) || (formData.contentType === 'LINK' && !formData.url)} 
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {formData.contentType === 'LINK' ? 'Saving...' : 'Uploading...'}
                </>
              ) : (
                <>
                  {formData.contentType === 'LINK' ? (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      Save Link
                    </>
                  ) : formData.contentType === 'VIDEO' ? (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Upload Video
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 