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
  Package
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

type ClientDocument = {
  id: string
  title: string
  type: string
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

  const downloadDocument = async (documentId: string, title: string) => {
    setDownloadingDocumentId(documentId)
    try {
      const response = await fetch(`/api/client/documents/${documentId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = title
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download document')
    } finally {
      setDownloadingDocumentId(null)
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
        alert('Payment proof submitted successfully! It will be reviewed by our team.')
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
        alert('Document signed successfully!')
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
                  <div className="space-y-4">
                    {documents.map((document) => (
                      <div key={document.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">{document.title}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                <Badge variant="secondary">{document.type}</Badge>
                                <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                                
                                {/* Invoice specific info */}
                                {document.type === 'INVOICE' && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="font-medium">
                                      {document.currency} {document.invoiceAmount?.toFixed(2)}
                                    </span>
                                    {document.dueDate && (
                                      <>
                                        <span className="text-gray-400">•</span>
                                        <span>Due: {new Date(document.dueDate).toLocaleDateString()}</span>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                              
                              {/* Payment status for invoices */}
                              {document.type === 'INVOICE' && document.paymentStatus && (
                                <div className="flex items-center space-x-2 mt-2">
                                  {getPaymentStatusIcon(document.paymentStatus)}
                                  <span className="text-sm font-medium">
                                    {getPaymentStatusText(document.paymentStatus)}
                                  </span>
                                </div>
                              )}
                              
                              {/* Signature status for non-invoices */}
                              {document.type !== 'INVOICE' && document.requiresSignature && (
                                <div className="flex items-center space-x-2 mt-2">
                                  {document.isSigned ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                      <span className="text-sm text-green-600 dark:text-green-400">
                                        Signed on {document.signedAt ? new Date(document.signedAt).toLocaleDateString() : 'N/A'}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Pen className="w-4 h-4 text-orange-500" />
                                      <span className="text-sm text-orange-600 dark:text-orange-400">
                                        Signature Required
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadDocument(document.id, document.title)}
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