"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Download, 
  Calendar, 
  Loader2,
  Upload,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  Pen,
  FolderOpen,
  ArrowLeft,
  User,
  X,
  Package,
  Video,
  Link,
  ExternalLink,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import { BankInfo } from '@/lib/invoiceGenerator'
import QRCode from 'qrcode'
import Image from 'next/image'
import PaymentButton from '@/components/payment-button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'

type ClientDocument = {
  id: string
  title: string
  type: string
  contentType: string
  uploadedAt: string
  fileUrl: string
  fileName: string
  fileSize: number
  uploadedBy: string
  requiresSignature: boolean
  isSigned: boolean
  signedAt?: string
  invoiceNumber?: string
  invoiceAmount?: number
  currency?: string
  dueDate?: string
  paymentStatus?: string
  description?: string
  project?: {
    id: string
    projectType: string
    projectPurpose: string
  }
}

type Project = {
  id: string
  projectType: string | null
  projectPurpose?: string
  projectCost?: string
  currency?: string
  deliveryTimeline?: string
  createdAt: string
  customRequests?: string
}

type Client = {
  id: string
  fullName: string
  email: string
  phone: string
  companyName?: string | null
}

interface ClientProjectDocumentsPageProps {
  params: Promise<{ projectId: string }>
}

// Helper function to get the appropriate icon based on content type
const getContentIcon = (contentType: string, type: string) => {
  switch (contentType) {
    case 'VIDEO':
      return <Video className="w-6 h-6 text-red-600" />
    case 'LINK':
      return <Link className="w-6 h-6 text-blue-600" />
    default:
      // Different icons for different document types
      switch (type) {
        case 'INVOICE':
          return <CreditCard className="w-6 h-6 text-green-600" />
        case 'CONTRACT':
          return <FileText className="w-6 h-6 text-purple-600" />
        case 'PROPOSAL':
          return <FileText className="w-6 h-6 text-orange-600" />
        case 'REPORT':
          return <FileText className="w-6 h-6 text-indigo-600" />
        default:
          return <FileText className="w-6 h-6 text-gray-600" />
      }
  }
}

// Helper function to check if the document is a link
const isLink = (contentType: string, type?: string, fileUrl?: string, fileName?: string) => {
  // Primary check: contentType should be 'LINK'
  if (contentType === 'LINK') return true;
  
  // Backward compatibility: check if it's a link based on other indicators
  if (type === 'LINK') return true;
  if (fileUrl && fileName && 
      (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) && 
      fileName.startsWith('link_')) return true;
  
  return false;
}

// Helper function to check if the document is a video
const isVideo = (contentType: string, fileName?: string) => {
  // Primary check: contentType should be 'VIDEO'
  if (contentType === 'VIDEO') return true;
  
  // Backward compatibility: check file extension
  if (fileName && /\.(mp4|avi|mov|wmv|flv|webm|mkv|m4v)$/i.test(fileName)) return true;
  
  return false;
}

// Helper function to format file size for display
const formatFileSize = (fileSize: number, contentType: string, type?: string, fileUrl?: string, fileName?: string) => {
  if (isLink(contentType, type, fileUrl, fileName)) {
    return 'External Link'
  }
  
  if (fileSize < 1024) {
    return `${fileSize} B`
  } else if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(1)} KB`
  } else {
    return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
  }
}

// Helper function to get content type badge with appropriate colors
const getContentTypeBadge = (contentType: string, type: string, fileUrl?: string, fileName?: string) => {
  if (isLink(contentType, type, fileUrl, fileName)) {
    return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">🔗 Link</Badge>
  }
  
  if (isVideo(contentType, fileName)) {
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">📹 Video</Badge>
  }
  
  // Handle document types
  switch (type) {
    case 'INVOICE':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">💰 Invoice</Badge>
    case 'CONTRACT':
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">📄 Contract</Badge>
    case 'PROPOSAL':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">📋 Proposal</Badge>
    case 'REPORT':
      return <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">📊 Report</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">📄 Document</Badge>
  }
}

// Helper function to check if document can be viewed in browser
const canViewInBrowser = (contentType: string, fileName: string, type?: string, fileUrl?: string) => {
  if (isLink(contentType, type, fileUrl, fileName)) return true // Links can always be "viewed" (opened)
  
  const extension = fileName.split('.').pop()?.toLowerCase()
  const viewableExtensions = ['pdf', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'mp4', 'webm', 'mov', 'avi']
  return viewableExtensions.includes(extension || '')
}

export default function ClientProjectDocumentsPage({ params }: ClientProjectDocumentsPageProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [documents, setDocuments] = useState<ClientDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<string | null>(null)
  const [bankDetails, setBankDetails] = useState<BankInfo | null>(null)
  const [upiQRCode, setUpiQRCode] = useState<string | null>(null)
  const [upiAmount, setUpiAmount] = useState<number>(0)
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<ClientDocument | null>(null)
  const [paymentForm, setPaymentForm] = useState({
    transactionId: '',
    paymentMethod: 'UPI',
    paymentNotes: '',
    proofFile: null as File | null
  })
  const [paymentError, setPaymentError] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  
  // Signing modal state
  const [showSigningModal, setShowSigningModal] = useState(false)
  const [signingDocument, setSigningDocument] = useState<ClientDocument | null>(null)
  const [signingLoading, setSigningLoading] = useState(false)
  const [signingError, setSigningError] = useState('')

  const fetchBankDetails = async () => {
    const response = await fetch('/api/admin/bank-details')
    const data = await response.json()
    setBankDetails(data)
  }

  const createQRCode=async()=>{
    const upiUrl = `upi://pay?pa=${bankDetails?.upiId}&pn=${encodeURIComponent(bankDetails?.accountHolderName || "")}&am=${upiAmount}&cu=${project?.currency}&tn=${encodeURIComponent(`Invoice ${project?.id}`)}`;
      console.log("UPI URL", upiUrl);
      const qrCodeDataUrl = await QRCode.toDataURL(upiUrl, { width: 100, margin: 1 });
      setUpiQRCode(qrCodeDataUrl)
  }

  useEffect(() => {
    loadProjectData()
    fetchBankDetails()
    createQRCode()
  }, [])

  const loadProjectData = async () => {
    try {
      const resolvedParams = await params
      const projectId = resolvedParams.projectId

      // Load client data to get project info
      const dashboardResponse = await fetch('/api/client/dashboard')
      const dashboardResult = await dashboardResponse.json()
      
      if (dashboardResult.success) {
        const clientData = dashboardResult.data
        setClient({
          id: clientData.client.id,
          fullName: clientData.client.fullName,
          email: clientData.client.email,
          phone: clientData.client.phone,
          companyName: clientData.client.companyName
        })

        // Find the specific project
        const foundProject = clientData.estimators.find((est: any) => est.id === projectId)
        if (foundProject) {
          setProject(foundProject)
        }
      }

      // Load project-specific documents
      const docsResponse = await fetch(`/api/client/project-documents?projectId=${projectId}`)
      const docsResult = await docsResponse.json()
      
      if (docsResult.success) {
        setDocuments(docsResult.documents)
      }
    } catch (error) {
      console.error('Error loading project data:', error)
      router.push('/client/projects')
    } finally {
      setLoading(false)
    }
  }

  const downloadDocument = async (documentId: string, title: string, fileName: string) => {
    setDownloadingDocumentId(documentId)
    try {
      console.log('Downloading document:', { documentId, title, fileName })
      
      const response = await fetch(`/api/client/documents/${documentId}`)
      
      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status} ${response.statusText}`)
      }
      
      // Check content type
      const contentType = response.headers.get('content-type')
      console.log('Response content type:', contentType)
      
      const blob = await response.blob()
      console.log('Downloaded blob size:', blob.size, 'bytes')
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Use the original filename if available, otherwise use title
      const downloadFileName = fileName || title
      a.download = downloadFileName
      
      console.log('Downloading as:', downloadFileName)
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success(`Downloaded ${downloadFileName}`)
      
    } catch (error) {
      console.error('Download failed:', error)
      toast.error(`Failed to download document: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDownloadingDocumentId(null)
    }
  }

  const openDocument = (document: ClientDocument) => {
    if (isLink(document.contentType, document.type, document.fileUrl, document.fileName)) {
      // For links, open in new tab
      window.open(document.fileUrl, '_blank')
    } else {
      // For files, trigger download with proper filename
      downloadDocument(document.id, document.title, document.fileName)
    }
  }

  const viewDocument = (document: ClientDocument) => {
    if (isLink(document.contentType, document.type, document.fileUrl, document.fileName)) {
      // For links, open in new tab
      window.open(document.fileUrl, '_blank')
    } else if (isVideo(document.contentType, document.fileName)) {
      // For videos and media files, open the direct file URL in new tab
      window.open(document.fileUrl, '_blank')
    } else if (canViewInBrowser(document.contentType, document.fileName, document.type, document.fileUrl)) {
      // For other viewable files (PDFs, etc.), open direct URL
      window.open(document.fileUrl, '_blank')
    } else {
      // Fallback to download for non-viewable files
      downloadDocument(document.id, document.title, document.fileName)
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4 text-orange-500" />
      case 'SUBMITTED': return <Upload className="w-4 h-4 text-blue-500" />
      case 'VERIFIED': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'PAID': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Payment Pending'
      case 'SUBMITTED': return 'Under Review'
      case 'VERIFIED': return 'Payment Verified'
      case 'PAID': return 'Paid'
      default: return 'Unknown Status'
    }
  }

  const handlePaymentSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDocument || !paymentForm.proofFile) {
      setPaymentError('Please fill all required fields and upload payment proof')
      return
    }

    setPaymentLoading(true)
    setPaymentError('')

    try {
      const formData = new FormData()
      formData.append('documentId', selectedDocument.id)
      formData.append('transactionId', paymentForm.transactionId)
      formData.append('paymentMethod', paymentForm.paymentMethod)
      formData.append('paymentNotes', paymentForm.paymentNotes)
      formData.append('proofFile', paymentForm.proofFile)

      const response = await fetch('/api/client/payments', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setShowPaymentModal(false)
        setPaymentForm({
          transactionId: '',
          paymentMethod: 'UPI',
          paymentNotes: '',
          proofFile: null
        })
        setSelectedDocument(null)
        // Refresh project data
        await loadProjectData()
        toast.success('Payment proof submitted successfully! It will be reviewed by our team.')
      } else {
        setPaymentError(result.error || 'Failed to submit payment')
      }
    } catch (error) {
      console.error('Payment submission failed:', error)
      setPaymentError('An error occurred while submitting payment')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleDocumentSigning = async () => {
    if (!signingDocument) return

    setSigningLoading(true)
    setSigningError('')

    try {
      const response = await fetch(`/api/client/documents/${signingDocument.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()

      if (result.success) {
        setShowSigningModal(false)
        setSigningDocument(null)
        // Refresh project data
        await loadProjectData()
        toast.success('Document signed successfully!')
      } else {
        setSigningError(result.error || 'Failed to sign document')
      }
    } catch (error) {
      console.error('Document signing failed:', error)
      setSigningError('An error occurred while signing the document')
    } finally {
      setSigningLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading project documents...</p>
        </div>
      </div>
    )
  }

  if (!project || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Project not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The project you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push('/client/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/client/projects')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Projects</span>
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>{client.fullName}</span>
                  <span>•</span>
                  <span>Projects</span>
                  <span>•</span>
                  <span>{project.projectType || 'Project'}</span>
                </div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Project Documents
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => router.push(`/client/projects/${project.id}/deliverables`)}
                className="flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>Project Deliverables</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
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
                  {project.projectCost && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Project Price</Label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {project.currency} {project.projectCost}
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Project Documents</span>
                </CardTitle>
                <CardDescription>
                  All documents, invoices, and files related to this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Documents Yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No documents have been uploaded for this project yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {documents.map((document) => (
                      <div key={document.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {/* Icon */}
                            <div className="flex-shrink-0 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              {getContentIcon(document.contentType, document.type)}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Title and Content Type Badge */}
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                                  {document.title}
                                </h3>
                                {getContentTypeBadge(document.contentType, document.type, document.fileUrl, document.fileName)}
                              </div>
                              
                              {/* Basic Info */}
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Package className="w-4 h-4" />
                                  <span>{formatFileSize(document.fileSize, document.contentType, document.type, document.fileUrl, document.fileName)}</span>
                                </div>
                              </div>

                              {/* Invoice specific info */}
                              {document.type === 'INVOICE' && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 mb-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                          Invoice #{document.invoiceNumber}
                                        </Badge>
                                        <span className="font-semibold text-green-800 dark:text-green-300">
                                          {document.currency} {document.invoiceAmount?.toFixed(2)}
                                        </span>
                                      </div>
                                      {document.dueDate && (
                                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                          Due: {new Date(document.dueDate).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                    {document.paymentStatus && (
                                      <div className="flex items-center space-x-2">
                                        {getPaymentStatusIcon(document.paymentStatus)}
                                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                                          {getPaymentStatusText(document.paymentStatus)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Signature status for non-invoices */}
                              {document.type !== 'INVOICE' && document.requiresSignature && (
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md p-3 mb-3">
                                  <div className="flex items-center space-x-2">
                                    {document.isSigned ? (
                                      <>
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm text-green-600 dark:text-green-400">
                                          ✅ Signed on {document.signedAt ? new Date(document.signedAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <Pen className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm text-orange-600 dark:text-orange-400">
                                          ⚠️ Signature Required
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Description */}
                              {document.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {document.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 ml-4">
                            {/* View Button - Show for viewable content */}
                            {(canViewInBrowser(document.contentType, document.fileName, document.type, document.fileUrl) || isLink(document.contentType, document.type, document.fileUrl, document.fileName)) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewDocument(document)}
                                className="flex items-center space-x-2"
                                disabled={downloadingDocumentId === document.id}
                              >
                                {downloadingDocumentId === document.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    {isLink(document.contentType, document.type, document.fileUrl, document.fileName) ? (
                                      <>
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Open Link</span>
                                      </>
                                    ) : isVideo(document.contentType, document.fileName) ? (
                                      <>
                                        <Eye className="w-4 h-4" />
                                        <span>Watch</span>
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-4 h-4" />
                                        <span>View</span>
                                      </>
                                    )}
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {/* Download Button - Show for non-link content */}
                            {!isLink(document.contentType, document.type, document.fileUrl, document.fileName) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDocument(document)}
                                className="flex items-center space-x-2"
                                disabled={downloadingDocumentId === document.id}
                              >
                                {downloadingDocumentId === document.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {/* Payment button for pending invoices */}
                            {document.type === 'INVOICE' && document.paymentStatus === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDocument(document)
                                    setShowPaymentModal(true)
                                    setUpiAmount(document.invoiceAmount || 0)
                                  }}
                                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                                >
                                  <CreditCard className="w-4 h-4" />
                                  <span>Pay Manually</span>
                                </Button>
                                <PaymentButton invoiceNumber={document.invoiceNumber || ""} amount={document.invoiceAmount || 0} currency={document.currency || "INR"} receipt={document.invoiceNumber || ""} name={client.fullName} email={client.email} phone={client.phone} />
                              </>
                            )}
                            
                            {/* Sign button for documents requiring signature */}
                            {document.type !== 'INVOICE' && document.requiresSignature && !document.isSigned && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSigningDocument(document)
                                  setShowSigningModal(true)
                                }}
                                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
                              >
                                <Pen className="w-4 h-4" />
                                <span>Sign Document</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Submit Payment</span>
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPaymentModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Invoice Details</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {selectedDocument.invoiceNumber} - {selectedDocument.currency} {selectedDocument.invoiceAmount?.toFixed(2)}
              </p>
              {selectedDocument.dueDate && (
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Due: {new Date(selectedDocument.dueDate).toLocaleDateString()}
                </p>
              )}
              <Accordion type="single" collapsible defaultValue="item-2">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Bank Details</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader className="bg-accent">
                        <TableRow>
                          <TableHead className="w-[100px]">Type</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                          <TableRow>
                            <TableCell><b>Bank Name:</b></TableCell>
                            <TableCell>{bankDetails?.bankName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><b>Account Holder Name:</b></TableCell>
                            <TableCell>{bankDetails?.accountHolderName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><b>Account Number:</b></TableCell>
                            <TableCell>{bankDetails?.accountNumber}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><b>IFSC Code:</b></TableCell>
                            <TableCell>{bankDetails?.ifscCode}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><b>Branch Name:</b></TableCell>
                            <TableCell>{bankDetails?.branchName}</TableCell>
                          </TableRow>
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>UPI Details</AccordionTrigger>
                  <AccordionContent>
                    UPI ID: {bankDetails?.upiId}
                    <Image src={upiQRCode || ""} alt="UPI QR Code" width={100} height={100} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <form onSubmit={handlePaymentSubmission} className="space-y-4">
              <div>
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select 
                  value={paymentForm.paymentMethod} 
                  onValueChange={(value) => setPaymentForm(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>

              </div>

              <div>
                <Label htmlFor="transaction-id">Transaction ID / Reference Number</Label>
                <Input
                  id="transaction-id"
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                  placeholder="Enter transaction ID or reference number"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="proof-file">Payment Proof (Screenshot/Receipt)</Label>
                <Input
                  id="proof-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, proofFile: e.target.files?.[0] || null }))}
                  required
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Upload a screenshot or photo of your payment confirmation (Max 5MB)
                </p>
              </div>

              <div>
                <Label htmlFor="payment-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="payment-notes"
                  value={paymentForm.paymentNotes}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentNotes: e.target.value }))}
                  placeholder="Any additional information about the payment"
                  rows={3}
                  className="mt-1"
                />
              </div>

              {paymentError && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {paymentError}
                </div>
              )}

              <div className="flex flex-col justify-center items-center gap-5">
                <p className='text-center text-xs text-primary'>Too many process, Pay directly using dashboard</p>

                <PaymentButton invoiceNumber={selectedDocument.invoiceNumber || ""} amount={selectedDocument.invoiceAmount || 0} currency={selectedDocument.currency || "INR"} receipt={selectedDocument.invoiceNumber || ""} name={client.fullName} email={client.email} phone={client.phone} />
              </div>



              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1"
                  disabled={paymentLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={paymentLoading}
                  className="flex-1"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Payment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Signing Modal */}
      {showSigningModal && signingDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Pen className="w-5 h-5" />
                <span>Sign Document</span>
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSigningModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100">Document Details</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>Title:</strong> {signingDocument.title}
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>Type:</strong> {signingDocument.type}
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>Uploaded:</strong> {new Date(signingDocument.uploadedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-900 dark:text-amber-100">Digital Signature Agreement</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    By clicking &quot;Sign Document&quot;, you are providing your digital signature and agreeing to the terms and conditions outlined in this document. This action is legally binding and cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {signingError && (
              <div className="mb-4 text-red-600 dark:text-red-400 text-sm">
                {signingError}
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSigningModal(false)}
                className="flex-1"
                disabled={signingLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDocumentSigning}
                disabled={signingLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {signingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <Pen className="w-4 h-4 mr-2" />
                    Sign Document
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 