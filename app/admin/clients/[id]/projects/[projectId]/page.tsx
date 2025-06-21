"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  FileText, 
  Upload, 
  Calendar,
  User,
  Loader2,
  FolderOpen,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DocumentsList } from '@/components/shared/DocumentsList'
import { DocumentData } from '@/components/shared/DocumentCard'
import { CreateDocumentModal } from '../../../components/CreateDocumentModal'
import { CreateInvoiceModal } from '../../../components/CreateInvoiceModal'

type Project = {
  id: string
  projectType: string | null
  projectPurpose?: string
  budgetRange?: string
  deliveryTimeline?: string
  createdAt: Date
  customRequests?: string
}

type Client = {
  id: string
  fullName: string
  email: string
  companyName?: string | null
}

interface ProjectDocumentsPageProps {
  params: Promise<{ id: string; projectId: string }>
}

export default function ProjectDocumentsPage({ params }: ProjectDocumentsPageProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  
  // Payment approval state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentDocument, setSelectedPaymentDocument] = useState<DocumentData | null>(null)
  const [paymentForm, setPaymentForm] = useState({
    status: '',
    verificationNotes: ''
  })
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    loadProjectData()
  }, [])

  const loadProjectData = async () => {
    try {
      const resolvedParams = await params
      const { id: clientId, projectId } = resolvedParams

      // Load client data
      const clientResponse = await fetch(`/api/admin/clients/${clientId}`)
      const clientResult = await clientResponse.json()
      
      if (clientResult.success) {
        setClient({
          id: clientResult.client.id,
          fullName: clientResult.client.fullName,
          email: clientResult.client.email,
          companyName: clientResult.client.companyName
        })

        // Find the specific project
        const foundProject = clientResult.client.estimators.find((est: any) => est.id === projectId)
        if (foundProject) {
          setProject(foundProject)
        }
      }

      // Load project documents
      const docsResponse = await fetch(`/api/admin/project-documents?projectId=${projectId}`)
      const docsResult = await docsResponse.json()
      
      if (docsResult.success) {
        // Transform documents to match DocumentData interface
        const transformedDocs: DocumentData[] = docsResult.documents.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          type: doc.type,
          uploadedAt: new Date(doc.uploadedAt),
          fileUrl: doc.fileUrl,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
          uploadedBy: doc.uploadedBy,
          requiresSignature: doc.requiresSignature,
          isSigned: doc.isSigned,
          signedAt: doc.signedAt ? new Date(doc.signedAt) : null,
          invoiceNumber: doc.invoiceNumber,
          invoiceAmount: doc.invoiceAmount,
          currency: doc.currency,
          dueDate: doc.dueDate ? new Date(doc.dueDate) : null,
          paymentStatus: doc.paymentStatus,
          paymentProof: doc.paymentProof,
          verifiedAt: doc.verifiedAt ? new Date(doc.verifiedAt) : null,
          verifiedBy: doc.verifiedBy,
          paidAt: doc.paidAt ? new Date(doc.paidAt) : null,
          description: doc.description,
          project: doc.estimator ? {
            id: doc.estimator.id,
            projectType: doc.estimator.projectType,
            projectPurpose: doc.estimator.projectPurpose
          } : null
        }))
        setDocuments(transformedDocs)
      }
    } catch (error) {
      console.error('Error loading project data:', error)
      router.push('/admin/clients')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (document: DocumentData) => {
    try {
      const response = await fetch(`/api/admin/project-documents/${document.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        await loadProjectData()
      } else {
        throw new Error(result.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  const handlePaymentApproval = (document: DocumentData) => {
    setSelectedPaymentDocument(document)
    setPaymentForm({ status: '', verificationNotes: '' })
    setPaymentError('')
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentDocument || !paymentForm.status) {
      setPaymentError('Please select a payment status')
      return
    }

    setPaymentLoading(true)
    setPaymentError('')

    try {
      const response = await fetch(`/api/admin/project-documents/${selectedPaymentDocument.id}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentStatus: paymentForm.status,
          verificationNotes: paymentForm.verificationNotes,
          verifiedBy: 'Admin' // In production, get from auth context
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setShowPaymentModal(false)
        await loadProjectData()
        
        // Send notification to client about payment status update
        if (client) {
          try {
            await fetch('/api/admin/notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                clientId: client.id,
                documentId: selectedPaymentDocument.id,
                notificationType: 'email',
                customMessage: `Payment status updated to: ${paymentForm.status}`
              })
            })
          } catch (notificationError) {
            console.error('Failed to send notification:', notificationError)
          }
        }
      } else {
        setPaymentError(result.error || 'Failed to update payment status')
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      setPaymentError('Failed to update payment status')
    } finally {
      setPaymentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading project data...</p>
        </div>
      </div>
    )
  }

  if (!project || !client) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Project not found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          The project you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => router.push('/admin/clients')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/clients/${client.id}/projects`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Button>
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
              <span 
                className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => router.push(`/admin/clients/${client.id}`)}
              >
                {client.fullName}
              </span>
              <span>•</span>
              <span 
                className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => router.push(`/admin/clients/${client.id}/projects`)}
              >
                Projects
              </span>
              <span>•</span>
              <span>{project.projectType || 'Project'}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Project Documents
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {project.projectType} for {client.fullName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowInvoiceModal(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <FileText className="w-4 h-4" />
            <span>Create Invoice</span>
          </Button>
          <Button
            onClick={() => setShowDocumentModal(true)}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* Project Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              <span>Project Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Project Type</Label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {project.projectType || 'Not specified'}
                </p>
              </div>
              {project.projectPurpose && (
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Purpose</Label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {project.projectPurpose}
                  </p>
                </div>
              )}
              {project.budgetRange && (
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget Range</Label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {project.budgetRange}
                  </p>
                </div>
              )}
              {project.deliveryTimeline && (
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeline</Label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {project.deliveryTimeline}
                  </p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</Label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Client</Label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {client.fullName}
                </p>
              </div>
            </div>
            {project.customRequests && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Custom Requests</Label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {project.customRequests}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Documents Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DocumentsList
          documents={documents}
          variant="admin"
          title="Project Documents"
          emptyMessage={`No documents have been uploaded for this ${project.projectType || 'project'} yet.`}
          showProject={false}
          onRefresh={loadProjectData}
          onDelete={handleDeleteDocument}
          onReviewPayment={handlePaymentApproval}
        />
      </motion.div>

      {/* Modals */}
      {showDocumentModal && (
        <CreateDocumentModal
          clientId={client.id}
          projectId={project.id}
          onClose={() => setShowDocumentModal(false)}
          onSuccess={() => {
            setShowDocumentModal(false)
            loadProjectData()
          }}
        />
      )}

      {showInvoiceModal && (
        <CreateInvoiceModal
          clientId={client.id}
          projectId={project.id}
          onClose={() => setShowInvoiceModal(false)}
          onSuccess={() => {
            setShowInvoiceModal(false)
            loadProjectData()
          }}
        />
      )}

      {/* Payment Approval Modal */}
      {showPaymentModal && selectedPaymentDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Review Payment</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPaymentModal(false)}
                className="h-8 w-8 p-0"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Document</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPaymentDocument.title}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Invoice Amount</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPaymentDocument.currency} {selectedPaymentDocument.invoiceAmount}
                </p>
              </div>

              {selectedPaymentDocument.paymentProof && (
                <div>
                  <Label className="text-sm font-medium">Payment Proof</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedPaymentDocument.paymentProof!, '_blank')}
                    className="mt-1 w-full"
                  >
                    View Payment Proof
                  </Button>
                </div>
              )}

              <div>
                <Label htmlFor="payment-status" className="text-sm font-medium">
                  Payment Status
                </Label>
                <Select 
                  value={paymentForm.status} 
                  onValueChange={(value) => setPaymentForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VERIFIED">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Verified</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PAID">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Paid</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PENDING">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>Pending</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="verification-notes" className="text-sm font-medium">
                  Verification Notes (Optional)
                </Label>
                <Textarea
                  id="verification-notes"
                  value={paymentForm.verificationNotes}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, verificationNotes: e.target.value }))}
                  placeholder="Add any notes about the payment verification..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              {paymentError && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {paymentError}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => setShowPaymentModal(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={paymentLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePaymentSubmit}
                  disabled={paymentLoading || !paymentForm.status}
                  className="flex-1"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 