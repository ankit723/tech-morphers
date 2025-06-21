import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, ArrowLeft, Search, Filter, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DocumentCard, DocumentData } from './DocumentCard'

interface DocumentsListProps {
  documents: DocumentData[]
  variant: 'admin' | 'client'
  title?: string
  emptyMessage?: string
  showProject?: boolean
  isLoading?: boolean
  showFilters?: boolean
  showSearch?: boolean
  onBack?: () => void
  onRefresh?: () => void
  // Document actions
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

export function DocumentsList({
  documents,
  variant,
  title,
  emptyMessage,
  showProject = false,
  isLoading = false,
  showFilters = true,
  showSearch = true,
  onBack,
  onRefresh,
  onView,
  onDownload,
  onEdit,
  onDelete,
  onSign,
  onSubmitPayment,
  onReviewPayment,
  onViewPaymentProof,
  className
}: DocumentsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  // Filter and sort documents
  const filteredDocuments = React.useMemo(() => {
    let filtered = documents

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.invoiceNumber && doc.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'signed') {
        filtered = filtered.filter(doc => doc.isSigned)
      } else if (statusFilter === 'unsigned') {
        filtered = filtered.filter(doc => doc.requiresSignature && !doc.isSigned)
      } else if (statusFilter === 'overdue') {
        filtered = filtered.filter(doc => 
          doc.dueDate && 
          new Date(doc.dueDate) < new Date() && 
          doc.paymentStatus === 'PENDING'
        )
      } else {
        filtered = filtered.filter(doc => doc.paymentStatus === statusFilter)
      }
    }

    // Sort documents
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime())
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'type':
        filtered.sort((a, b) => a.type.localeCompare(b.type))
        break
      case 'dueDate':
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        break
    }

    return filtered
  }, [documents, searchTerm, typeFilter, statusFilter, sortBy])

  // Get unique document types for filter
  const documentTypes = React.useMemo(() => {
    const types = [...new Set(documents.map(doc => doc.type))]
    return types.sort()
  }, [documents])

  // Enhanced document actions with error handling
  const handleView = (document: DocumentData) => {
    if (onView) {
      onView(document)
    } else {
      // Default action: open in new tab
      window.open(document.fileUrl, '_blank')
    }
  }

  const handleDownload = async (document: DocumentData) => {
    if (onDownload) {
      onDownload(document)
    } else {
      // Default action: download file
      try {
        const link = window.document.createElement('a')
        link.href = document.fileUrl
        link.download = document.fileName
        link.target = '_blank'
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
      } catch (error) {
        console.error('Download failed:', error)
        // Fallback: open in new tab
        window.open(document.fileUrl, '_blank')
      }
    }
  }

  const handleViewPaymentProof = (document: DocumentData) => {
    if (onViewPaymentProof) {
      onViewPaymentProof(document)
    } else if (document.paymentProof) {
      // Default action: open payment proof in new tab
      window.open(document.paymentProof, '_blank')
    }
  }

  const handleDelete = async (document: DocumentData) => {
    if (!onDelete) return

    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${document.title}"? This action cannot be undone.`
    )

    if (confirmed) {
      try {
        await onDelete(document)
        onRefresh?.()
      } catch (error) {
        console.error('Delete failed:', error)
        alert('Failed to delete document. Please try again.')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading documents...</span>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Documents Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {emptyMessage || 'No documents have been uploaded yet.'}
          </p>
          {onBack && (
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title || 'Documents'} ({filteredDocuments.length})
            </h2>
            {documents.length !== filteredDocuments.length && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredDocuments.length} of {documents.length} documents shown
              </p>
            )}
          </div>
        </div>

        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Refresh
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (showSearch || documentTypes.length > 1) && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {showSearch && (
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}

              {documentTypes.length > 1 && (
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Payment Pending</SelectItem>
                  <SelectItem value="SUBMITTED">Payment Submitted</SelectItem>
                  <SelectItem value="VERIFIED">Payment Verified</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="unsigned">Needs Signature</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="type">Type A-Z</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Documents Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setTypeFilter('all')
                setStatusFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DocumentCard
                document={document}
                variant={variant}
                showProject={showProject}
                onView={handleView}
                onDownload={handleDownload}
                onEdit={onEdit}
                onDelete={handleDelete}
                onSign={onSign}
                onSubmitPayment={onSubmitPayment}
                onReviewPayment={onReviewPayment}
                onViewPaymentProof={handleViewPaymentProof}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 