"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Download,
  Loader2,
  DollarSign,
  IndianRupeeIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type Payment = {
  id: string
  amount: number
  currency: string
  paymentMethod: string
  transactionId: string
  status: string
  proofImageUrl: string
  proofFileName: string
  verifiedBy?: string
  verifiedAt?: string
  createdAt: string
  client: {
    id: string
    fullName: string
    email: string
    companyName?: string
  }
  document: {
    id: string
    title: string
    invoiceNumber: string
    invoiceAmount: number
    currency: string
    dueDate: string
    fileUrl: string
  }
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    status: '',
    verificationNotes: ''
  })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments')
      const result = await response.json()
      if (result.success) {
        setPayments(result.payments)
      }
    } catch (error) {
      console.error('Failed to load payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setReviewForm({ status: '', verificationNotes: '' })
    setShowReviewModal(true)
    setReviewError('')
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPayment || !reviewForm.status) {
      setReviewError('Please select a status')
      return
    }

    setReviewLoading(true)
    setReviewError('')

    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: selectedPayment.id,
          status: reviewForm.status,
          verificationNotes: reviewForm.verificationNotes,
          verifiedBy: 'varanasiartist.omg@gmail.com'
        })
      })

      const result = await response.json()

      if (result.success) {
        setShowReviewModal(false)
        await loadPayments()
        alert(`Payment ${reviewForm.status.toLowerCase()} successfully!`)
      } else {
        setReviewError(result.error || 'Failed to update payment')
      }
    } catch (error) {
      console.error('Review submission failed:', error)
      setReviewError('An error occurred while updating payment')
    } finally {
      setReviewLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return <Clock className="w-4 h-4 text-blue-500" />
      case 'VERIFIED': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'PAID': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />
      case 'DISPUTED': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'Under Review'
      case 'VERIFIED': return 'Verified'
      case 'PAID': return 'Paid'
      case 'FAILED': return 'Failed'
      case 'DISPUTED': return 'Disputed'
      default: return 'Unknown'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
      case 'VERIFIED': case 'PAID': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
      case 'FAILED': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
      case 'DISPUTED': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300'
    }
  }

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.document.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate statistics
  const totalPayments = payments.length
  const submittedPayments = payments.filter(p => p.status === 'SUBMITTED').length
  const verifiedPayments = payments.filter(p => p.status === 'VERIFIED' || p.status === 'PAID').length
  const totalAmount = payments
    .filter(p => p.status === 'VERIFIED' || p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Review and manage client payment submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPayments}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{submittedPayments}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{verifiedPayments}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <IndianRupeeIcon className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Received</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="SUBMITTED">Under Review</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="DISPUTED">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center p-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client & Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.client.fullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.client.email}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          {payment.document.invoiceNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.currency} {payment.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Due: {new Date(payment.document.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {payment.paymentMethod}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {payment.transactionId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                      {payment.verifiedBy && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          by {payment.verifiedBy}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(payment.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(payment.proofImageUrl, '_blank')}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Proof</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(payment.document.fileUrl, '_blank')}
                          className="flex items-center space-x-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Invoice</span>
                        </Button>
                        {payment.status === 'SUBMITTED' && (
                          <Button
                            size="sm"
                            onClick={() => handleReviewPayment(payment)}
                            className="flex items-center space-x-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Review</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowReviewModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Review Payment
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white">Payment Details</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Client: {selectedPayment.client.fullName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Invoice: {selectedPayment.document.invoiceNumber}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Amount: {selectedPayment.currency} {selectedPayment.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Method: {selectedPayment.paymentMethod}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transaction ID: {selectedPayment.transactionId}
              </p>
            </div>

            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <Label htmlFor="status">Review Decision</Label>
                <Select 
                  value={reviewForm.status} 
                  onValueChange={(value) => setReviewForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VERIFIED">Verify Payment</SelectItem>
                    <SelectItem value="PAID">Mark as Paid</SelectItem>
                    <SelectItem value="FAILED">Mark as Failed</SelectItem>
                    <SelectItem value="DISPUTED">Mark as Disputed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="verificationNotes">Notes (Optional)</Label>
                <Textarea
                  id="verificationNotes"
                  value={reviewForm.verificationNotes}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, verificationNotes: e.target.value }))}
                  placeholder="Add any verification notes..."
                  rows={3}
                />
              </div>

              {reviewError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{reviewError}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={reviewLoading}
                  className="flex-1"
                >
                  {reviewLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Submit Review
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 