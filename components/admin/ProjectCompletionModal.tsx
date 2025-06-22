import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Upload, X, FileText, CheckCircle, AlertCircle, Download, Clock } from 'lucide-react'

interface ProjectCompletionModalProps {
  project: {
    id: string
    projectType: string | null
    projectPurpose: string | null
    projectStatus?: string
  }
  onClose: () => void
  onSuccess: () => void
}

interface UploadedFile {
  id: string
  fileName: string
  url: string
  size: number
}

interface ExistingDeliverable {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedBy: string
  uploadedAt: string
  isDelivered: boolean
  deliveredAt: string | null
  clientSignedAt: string | null
}

export function ProjectCompletionModal({ project, onClose, onSuccess }: ProjectCompletionModalProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loadingExisting, setLoadingExisting] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [existingDeliverables, setExistingDeliverables] = useState<ExistingDeliverable[]>([])
  const [uploadError, setUploadError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch existing deliverables when modal opens
  useEffect(() => {
    fetchExistingDeliverables()
  }, [project.id])

  const fetchExistingDeliverables = async () => {
    try {
      setLoadingExisting(true)
      const response = await fetch(`/api/admin/projects/${project.id}/deliverables`)
      const result = await response.json()

      if (result.success) {
        setExistingDeliverables(result.deliverables || [])
      } else {
        console.error('Failed to fetch existing deliverables:', result.error)
      }
    } catch (error) {
      console.error('Error fetching existing deliverables:', error)
    } finally {
      setLoadingExisting(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Validate file types (only ZIP files)
    const invalidFiles = files.filter(file => !file.name.toLowerCase().endsWith('.zip'))
    if (invalidFiles.length > 0) {
      setUploadError(`Only ZIP files are allowed. Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`)
      return
    }

    setSelectedFiles(files)
    setUploadError('')
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select files to upload')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })
      formData.append('uploadedBy', 'Admin') // In production, get from auth context

      const response = await fetch(`/api/admin/projects/${project.id}/deliverables`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setUploadedFiles(prev => [...prev, ...result.uploadedFiles])
        setSelectedFiles([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        // Refresh existing deliverables to show newly uploaded files
        await fetchExistingDeliverables()

        if (result.failedUploads && result.failedUploads.length > 0) {
          setUploadError(`Some files failed to upload: ${result.failedUploads.map((f: any) => f.fileName).join(', ')}`)
        }
      } else {
        setUploadError(result.error || 'Failed to upload files')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('An error occurred while uploading files')
    } finally {
      setUploading(false)
    }
  }

  const markProjectCompleted = async () => {
    if (uploadedFiles.length === 0 && selectedFiles.length === 0) {
      setUploadError('Please upload project deliverables before marking as completed')
      return
    }

    // Upload any pending files first
    if (selectedFiles.length > 0) {
      await uploadFiles()
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/admin/projects/${project.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        onSuccess()
      } else {
        setUploadError(result.error || 'Failed to update project status')
      }
    } catch (error) {
      console.error('Error completing project:', error)
      setUploadError('Failed to complete project')
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">
              {project.projectStatus === 'COMPLETED' ? 'Upload Project Deliverables' : 'Complete Project'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {project.projectStatus === 'COMPLETED' 
                ? 'Upload deliverables for the completed project'
                : 'Upload project deliverables and mark as completed'
              }
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Project Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{project.projectType || 'Untitled Project'}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {project.projectPurpose || 'No description available'}
                </p>
              </div>
              <Badge variant="outline">
                {project.projectStatus?.replace('_', ' ') || 'Just Started'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Existing Deliverables Section */}
        {loadingExisting ? (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Loading existing deliverables...</span>
              </div>
            </CardContent>
          </Card>
        ) : existingDeliverables.length > 0 ? (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Previously Uploaded Deliverables ({existingDeliverables.length})</span>
                </h4>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {existingDeliverables.map((deliverable) => (
                  <div key={deliverable.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{deliverable.fileName}</p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>{formatFileSize(deliverable.fileSize)}</span>
                          <span>•</span>
                          <span>By {deliverable.uploadedBy}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(deliverable.uploadedAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {deliverable.clientSignedAt && (
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          Client Signed
                        </Badge>
                      )}
                      {deliverable.isDelivered && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                          Delivered
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(deliverable.fileUrl, '_blank')}
                        className="text-blue-600 hover:text-blue-700"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-center py-4">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No deliverables uploaded yet for this project
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Upload Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="deliverables" className="text-base font-medium">
              Project Deliverables (ZIP files only)
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Upload all project files and folders in ZIP format. Multiple ZIP files are allowed.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <input
                ref={fileInputRef}
                type="file"
                id="deliverables"
                multiple
                accept=".zip"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Select ZIP Files
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Only ZIP files are accepted
              </p>
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected Files:</Label>
              <div className="space-y-2 mt-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSelectedFile(index)}
                      disabled={uploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Uploaded Files:</Label>
              <div className="space-y-2 mt-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">{file.fileName}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Uploaded
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {uploadError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          
          {/* Upload Files Button - Always available when files are selected */}
          {selectedFiles.length > 0 && (
            <Button 
              onClick={uploadFiles}
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Files'
              )}
            </Button>
          )}
          
          {/* Mark as Completed Button - Only for non-completed projects */}
          {project.projectStatus !== 'COMPLETED' && (
            <Button 
              onClick={markProjectCompleted} 
              disabled={loading || uploading || (uploadedFiles.length === 0 && selectedFiles.length === 0)}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Completing Project...
                </>
              ) : (
                'Mark as Completed'
              )}
            </Button>
          )}
          
          {/* Done Button - For completed projects after uploading */}
          {project.projectStatus === 'COMPLETED' && uploadedFiles.length > 0 && (
            <Button 
              onClick={onSuccess}
              className="flex-1"
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 