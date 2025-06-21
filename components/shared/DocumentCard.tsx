import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Edit, 
  Trash2, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload, 
  Loader2,
  CreditCard,
  AlertTriangle,
  FileSignature
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface DocumentData {
  id: string
  title: string
  type: string
  uploadedAt: Date
  fileUrl: string
  fileName: string
  fileSize: number
  uploadedBy: string
  requiresSignature: boolean
  isSigned: boolean
  signedAt?: Date | null
  invoiceNumber?: string | null
  invoiceAmount?: number | null
  currency?: string | null
  dueDate?: Date | null
  paymentStatus?: string | null
  paymentProof?: string | null
  verifiedAt?: Date | null
  verifiedBy?: string | null
  paidAt?: Date | null
  description?: string | null
  project?: {
    id: string
    projectType?: string | null
    projectPurpose?: string | null
  } | null
}

export interface DocumentCardProps {
  document: DocumentData
  variant: 'admin' | 'client'
  showProject?: boolean
  isLoading?: boolean
  onView?: (document: DocumentData) => void
  onDownload?: (document: DocumentData) => void
  onEdit?: (document: DocumentData) => void
  onDelete?: (document: DocumentData) => void
  onSign?: (document: DocumentData) => void
  onSubmitPayment?: (document: DocumentData) => void
  onReviewPayment?: (document: DocumentData) => void
  onViewPaymentProof?: (document: DocumentData) => void
  className?: string
}

export function DocumentCard({
  document,
  variant,
  showProject = false,
  isLoading = false,
  onView,
  onDownload,
  onEdit,
  onDelete,
  onSign,
  onSubmitPayment,
  onReviewPayment,
  onViewPaymentProof,
  className
}: DocumentCardProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'CONTRACT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'PROPOSAL': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'INVOICE': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'REPORT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4 text-orange-500" />
      case 'SUBMITTED': return <Upload className="w-4 h-4 text-blue-500" />
      case 'VERIFIED': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'PAID': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <XCircle className="w-4 h-4 text-red-500" />
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'VERIFIED': case 'PAID': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
  }

  const handleAction = async (action: string, handler?: (document: DocumentData) => void | Promise<void>) => {
    if (!handler || actionLoading) return

    setActionLoading(action)
    try {
      await handler(document)
    } catch (error) {
      console.error(`Error executing ${action}:`, error)
    } finally {
      setActionLoading(null)
    }
  }

  // Context-aware action visibility
  const canSign = variant === 'client' && document.requiresSignature && !document.isSigned
  const canSubmitPayment = variant === 'client' && document.type === 'INVOICE' && document.paymentStatus === 'PENDING'
  const canReviewPayment = variant === 'admin' && document.type === 'INVOICE' && document.paymentStatus === 'SUBMITTED'
  const canViewPaymentProof = variant === 'admin' && document.paymentProof
  const canEdit = variant === 'admin' && onEdit
  const canDelete = variant === 'admin' && onDelete

  const isOverdue = document.dueDate && new Date(document.dueDate) < new Date() && document.paymentStatus === 'PENDING'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative transition-all duration-200",
        isLoading && "opacity-50 pointer-events-none",
        className
      )}
    >
      <Card className={cn(
        "hover:shadow-md transition-shadow duration-200",
        isOverdue && "border-red-200 dark:border-red-800",
        document.type === 'INVOICE' && document.paymentStatus === 'SUBMITTED' && variant === 'admin' && "border-blue-200 dark:border-blue-800"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0 mt-1">
                <FileText className={cn(
                  "w-8 h-8",
                  document.type === 'INVOICE' ? "text-purple-600" :
                  document.type === 'CONTRACT' ? "text-blue-600" :
                  document.type === 'PROPOSAL' ? "text-green-600" :
                  "text-gray-600"
                )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {document.title}
                  </h4>
                  {isOverdue && (
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mb-2 flex-wrap gap-y-1">
                  <Badge variant="outline" className={getDocumentTypeColor(document.type)}>
                    {document.type}
                  </Badge>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </span>
                  <span>{formatFileSize(document.fileSize)}</span>
                  {variant === 'admin' && (
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {document.uploadedBy}
                    </span>
                  )}
                </div>

                {/* Project Information */}
                {showProject && document.project && (
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {document.project.projectType || 'Project'}
                    </Badge>
                    {document.project.projectPurpose && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                        {document.project.projectPurpose}
                      </p>
                    )}
                  </div>
                )}

                {/* Description */}
                {document.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {document.description}
                  </p>
                )}

                {/* Invoice Information */}
                {document.invoiceNumber && (
                  <div className="mb-2 space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <Badge variant="outline">Invoice #{document.invoiceNumber}</Badge>
                      {document.invoiceAmount && (
                        <span className="font-medium text-gray-900 dark:text-white">
                          {document.currency} {Number(document.invoiceAmount).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {document.dueDate && (
                      <div className="flex items-center space-x-1 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Due:</span>
                        <span className={cn(
                          "font-medium",
                          isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"
                        )}>
                          {new Date(document.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Status Badges */}
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  {document.requiresSignature && (
                    <Badge variant={document.isSigned ? "default" : "secondary"} className="text-xs">
                      <FileSignature className="w-3 h-3 mr-1" />
                      {document.isSigned ? 'Signed' : 'Signature Required'}
                    </Badge>
                  )}
                  
                  {document.paymentStatus && (
                    <div className="flex items-center space-x-1">
                      {getPaymentStatusIcon(document.paymentStatus)}
                      <Badge variant="outline" className={cn("text-xs", getPaymentStatusColor(document.paymentStatus))}>
                        {getPaymentStatusText(document.paymentStatus)}
                      </Badge>
                    </div>
                  )}
                  
                  {document.signedAt && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Signed {new Date(document.signedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 ml-2">
              {/* Primary Actions */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction('view', onView)}
                disabled={actionLoading === 'view'}
                className="flex items-center space-x-1"
                title="View document"
              >
                {actionLoading === 'view' ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">View</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction('download', onDownload)}
                disabled={actionLoading === 'download'}
                className="flex items-center space-x-1"
                title="Download document"
              >
                {actionLoading === 'download' ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">Download</span>
              </Button>

              {/* Context-Aware Actions */}
              {canSign && onSign && (
                <Button
                  size="sm"
                  onClick={() => handleAction('sign', onSign)}
                  disabled={actionLoading === 'sign'}
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700"
                  title="Sign document"
                >
                  {actionLoading === 'sign' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <FileSignature className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">Sign</span>
                </Button>
              )}

              {canSubmitPayment && onSubmitPayment && (
                <Button
                  size="sm"
                  onClick={() => handleAction('submit-payment', onSubmitPayment)}
                  disabled={actionLoading === 'submit-payment'}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-700"
                  title="Submit payment"
                >
                  {actionLoading === 'submit-payment' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <CreditCard className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">Pay</span>
                </Button>
              )}

              {canReviewPayment && onReviewPayment && (
                <Button
                  size="sm"
                  onClick={() => handleAction('review-payment', onReviewPayment)}
                  disabled={actionLoading === 'review-payment'}
                  className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700"
                  title="Review payment"
                >
                  {actionLoading === 'review-payment' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">Review</span>
                </Button>
              )}

              {canViewPaymentProof && onViewPaymentProof && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction('view-proof', onViewPaymentProof)}
                  disabled={actionLoading === 'view-proof'}
                  className="flex items-center space-x-1"
                  title="View payment proof"
                >
                  {actionLoading === 'view-proof' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">Proof</span>
                </Button>
              )}

              {/* More Actions Menu */}
              {(canEdit || canDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="More actions">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canEdit && (
                      <DropdownMenuItem onClick={() => handleAction('edit', onEdit)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem 
                        onClick={() => handleAction('delete', onDelete)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 