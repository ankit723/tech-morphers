"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Download,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

interface ProjectDeliverable {
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

interface ProjectData {
  id: string
  projectType: string | null
  projectPurpose: string | null
  projectStatus: string
  client: {
    id: string
    fullName: string
    email: string
  }
  deliverables: ProjectDeliverable[]
}

export default function ClientProjectDeliverablesPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [signing, setSigning] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [agreementChecked, setAgreementChecked] = useState(false)

  useEffect(() => {
    loadProjectData()
  }, [projectId])

  const loadProjectData = async () => {
    try {
      setLoading(true)
      
      // Get project details with deliverables
      const response = await fetch(`/api/admin/projects/${projectId}/deliverables`)
      const result = await response.json()

      if (result.success) {
        // Get project basic info
        const projectResponse = await fetch(`/api/client/projects/${projectId}`)
        const projectResult = await projectResponse.json()

        if (projectResult.success) {
          setProject({
            ...projectResult.project,
            deliverables: result.deliverables
          })
        } else {
          setError('Failed to load project details')
        }
      } else {
        setError('Failed to load project deliverables')
      }
    } catch (error) {
      console.error('Error loading project data:', error)
      setError('An error occurred while loading project data')
    } finally {
      setLoading(false)
    }
  }

  const handleSignAndDownload = () => {
    if (!project?.deliverables?.length) {
      setError('No deliverables available to download')
      return
    }

    // Check if already signed
    const isAlreadySigned = project.deliverables.some(d => d.isDelivered)
    
    if (isAlreadySigned) {
      // Already signed, proceed to download all files
      downloadAllFiles()
    } else {
      // Show signature modal
      setShowSignatureModal(true)
    }
  }

  const submitSignature = async () => {
    if (!agreementChecked) {
      setError('Please confirm the project completion agreement')
      return
    }

    setSigning(true)
    setError('')

    try {
      // Get client ID from session instead of localStorage
      const sessionResponse = await fetch('/api/client/dashboard')
      const sessionResult = await sessionResponse.json()
      
      if (!sessionResult.success) {
        setError('Authentication required. Please log in again.')
        router.push('/client/login')
        return
      }

      const clientId = sessionResult.data.client.id
      
      const response = await fetch(`/api/client/projects/${projectId}/deliverables/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSignature: `Digital confirmation by ${project?.client?.fullName} on ${new Date().toISOString()}`,
          clientId: clientId
        })
      })

      const result = await response.json()

      if (result.success) {
        setShowSignatureModal(false)
        await loadProjectData() // Reload to get updated data
        downloadAllFiles()
      } else {
        setError(result.error || 'Failed to submit signature')
      }
    } catch (error) {
      console.error('Error submitting signature:', error)
      setError('An error occurred while submitting signature')
    } finally {
      setSigning(false)
    }
  }

  const downloadAllFiles = async () => {
    if (!project?.deliverables?.length) return

    for (const deliverable of project.deliverables) {
      await downloadFile(deliverable)
      // Add a small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const downloadFile = async (deliverable: ProjectDeliverable) => {
    setDownloadingId(deliverable.id)
    
    try {
      const response = await fetch(deliverable.fileUrl)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = deliverable.fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError(`Failed to download ${deliverable.fileName}`)
      }
    } catch (error) {
      console.error('Download failed:', error)
      setError(`Failed to download ${deliverable.fileName}`)
    } finally {
      setDownloadingId(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'ALMOST_COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Project</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested project could not be found.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const isProjectCompleted = project.projectStatus === 'COMPLETED'
  const hasDeliverables = project.deliverables && project.deliverables.length > 0
  const isAlreadySigned = project.deliverables?.some(d => d.isDelivered) || false

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Project Deliverables
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Download your completed project files
            </p>
          </div>
        </div>
        
        <Badge className={getStatusBadgeColor(project.projectStatus)}>
          {project.projectStatus?.replace('_', ' ') || 'In Progress'}
        </Badge>
      </div>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>{project.projectType || 'Untitled Project'}</span>
          </CardTitle>
          <CardDescription>
            {project.projectPurpose || 'No description available'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Deliverables Section */}
      {isProjectCompleted ? (
        hasDeliverables ? (
          <Card>
            <CardHeader>
              <CardTitle>Project Deliverables</CardTitle>
              <CardDescription>
                {isAlreadySigned 
                  ? 'You have successfully received and confirmed the project deliverables.'
                  : 'Your project has been completed! Please review and confirm receipt of deliverables to download.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Deliverables List */}
              <div className="space-y-3">
                {project.deliverables.map((deliverable) => (
                  <motion.div
                    key={deliverable.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{deliverable.fileName}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{formatFileSize(deliverable.fileSize)}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(deliverable.uploadedAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {deliverable.uploadedBy}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {deliverable.isDelivered && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Delivered
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Signature Status */}
              {isAlreadySigned && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        Project Delivery Confirmed
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Confirmed on {new Date(project.deliverables[0]?.clientSignedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={handleSignAndDownload}
                  disabled={downloadingId !== null}
                  className="w-full"
                  size="lg"
                >
                  {downloadingId ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : isAlreadySigned ? (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download All Files
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Confirm Receipt & Download
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Deliverables Available</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your project is marked as completed, but no deliverables have been uploaded yet.
                Please contact support for assistance.
              </p>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-400" />
            <h3 className="text-lg font-medium mb-2">Project In Progress</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your project is currently {project.projectStatus?.replace('_', ' ').toLowerCase()} and deliverables will be available once completed.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Signature Modal */}
      <Dialog open={showSignatureModal} onOpenChange={setShowSignatureModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Project Delivery</DialogTitle>
            <DialogDescription>
              Please confirm that you have received and reviewed the project deliverables.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                What you&apos;re confirming:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• You have received all project deliverables</li>
                <li>• The project has been completed successfully</li>
                <li>• You acknowledge the final delivery of the project</li>
              </ul>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreement"
                checked={agreementChecked}
                onCheckedChange={(checked) => setAgreementChecked(checked as boolean)}
              />
              <label htmlFor="agreement" className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
                I confirm that I have received the project deliverables and acknowledge the successful completion of the project.
              </label>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSignatureModal(false)}
                className="flex-1"
                disabled={signing}
              >
                Cancel
              </Button>
              <Button
                onClick={submitSignature}
                disabled={signing || !agreementChecked}
                className="flex-1"
              >
                {signing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  'Confirm & Download'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 