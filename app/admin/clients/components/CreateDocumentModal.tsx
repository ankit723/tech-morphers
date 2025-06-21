"use client"

import { useState } from 'react'
import { X, Loader2, Upload, FileText } from 'lucide-react'
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
    requiresSignature: false
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
    
    if (!selectedFile || !formData.title || !formData.type) {
      alert('Please fill in all required fields and select a file')
      return
    }

    if (!projectId) {
      alert('Project ID is required. This document must be associated with a specific project.')
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', selectedFile)
      formDataToSend.append('clientId', clientId)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('type', formData.type)
      formDataToSend.append('requiresSignature', formData.requiresSignature.toString())
      formDataToSend.append('uploadedBy', 'varanasiartist.omg@gmail.com') // Admin email
      
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
        alert('Failed to upload document: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Failed to upload document')
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
            <h3 className="text-lg font-semibold">Upload Document</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This document will be associated with the selected project
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div>
            <Label>File <span className="text-red-500">*</span></Label>
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
                  <FileText className="w-8 h-8 text-blue-600 mx-auto" />
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
                      Drag and drop a file here, or{' '}
                      <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC, DOCX, TXT, JPG, PNG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document Details */}
          <div>
            <Label htmlFor="title">Document Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter document title"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Document Type <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="PROPOSAL">Proposal</SelectItem>
                <SelectItem value="REPORT">Report</SelectItem>
                <SelectItem value="SPECIFICATION">Specification</SelectItem>
                <SelectItem value="WIREFRAME">Wireframe</SelectItem>
                <SelectItem value="DESIGN">Design</SelectItem>
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
              placeholder="Optional description of the document"
              rows={3}
            />
          </div>

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

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedFile} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 