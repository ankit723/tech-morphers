"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  DollarSign,
  Clock,
  CheckCircle,
  Upload,
  AlertTriangle,
  BarChart3,
  X,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type Invoice = {
  id: string
  invoiceNumber: string
  amount: number
  currency: string
  dueDate: string
  paymentStatus: string
  createdAt: string
  client: {
    id: string
    fullName: string
    email: string
    companyName?: string
  }
  fileUrl: string
}

type Client = {
  id: string
  fullName: string
  email: string
  companyName?: string
}

type InvoiceItem = {
  description: string
  quantity: number
  rate: number
  amount: number
}

type InvoiceFormData = {
  clientId: string
  items: InvoiceItem[]
  taxRate: number
  currency: string
  dueDate: string
  paymentTerms: string
  notes: string
}

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [invoiceForm, setInvoiceForm] = useState<InvoiceFormData>({
    clientId: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    taxRate: 0,
    currency: 'USD',
    dueDate: '',
    paymentTerms: 'Payment is due within 30 days of invoice date.',
    notes: ''
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    loadInvoices()
    loadClients()
  }, [])

  const loadInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices')
      const result = await response.json()
      if (result.success) {
        setInvoices(result.invoices)
      }
    } catch (error) {
      console.error('Failed to load invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      const result = await response.json()
      if (result.success) {
        setClients(result.clients)
      }
    } catch (error) {
      console.error('Failed to load clients:', error)
    }
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!invoiceForm.clientId || invoiceForm.items.length === 0) {
      setCreateError('Please select a client and add at least one item')
      return
    }

    // Validate items
    const validItems = invoiceForm.items.filter(item => 
      item.description.trim() && item.quantity > 0 && item.rate > 0
    )

    if (validItems.length === 0) {
      setCreateError('Please add valid items with description, quantity, and rate')
      return
    }

    setCreateLoading(true)
    setCreateError('')

    try {
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...invoiceForm,
          items: validItems
        })
      })

      const result = await response.json()

      if (result.success) {
        setShowCreateModal(false)
        setInvoiceForm({
          clientId: '',
          items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
          taxRate: 0,
          currency: 'USD',
          dueDate: '',
          paymentTerms: 'Payment is due within 30 days of invoice date.',
          notes: ''
        })
        await loadInvoices()
        alert('Invoice created successfully!')
      } else {
        setCreateError(result.error || 'Failed to create invoice')
      }
    } catch (error) {
      console.error('Invoice creation failed:', error)
      setCreateError('An error occurred while creating the invoice')
    } finally {
      setCreateLoading(false)
    }
  }

  const addInvoiceItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }))
  }

  const removeInvoiceItem = (index: number) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceForm(prev => {
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], [field]: value }
      
      // Calculate amount for quantity and rate changes
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate
      }
      
      return { ...prev, items: newItems }
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4 text-orange-500" />
      case 'SUBMITTED': return <Upload className="w-4 h-4 text-blue-500" />
      case 'VERIFIED': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'PAID': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Payment Pending'
      case 'SUBMITTED': return 'Under Review'
      case 'VERIFIED': return 'Payment Verified'
      case 'PAID': return 'Paid'
      default: return 'Unknown Status'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
      case 'SUBMITTED': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
      case 'VERIFIED': case 'PAID': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
      default: return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
    }
  }

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || invoice.paymentStatus === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate statistics
  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'PAID').length
  const pendingInvoices = invoices.filter(inv => inv.paymentStatus === 'PENDING').length
  const overdueInvoices = invoices.filter(inv => 
    inv.paymentStatus === 'PENDING' && new Date(inv.dueDate) < new Date()
  ).length
  
  const totalRevenue = invoices
    .filter(inv => inv.paymentStatus === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0)
  
  const pendingRevenue = invoices
    .filter(inv => inv.paymentStatus !== 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0)

  // Set default due date (30 days from now)
  useEffect(() => {
    const defaultDueDate = new Date()
    defaultDueDate.setDate(defaultDueDate.getDate() + 30)
    setInvoiceForm(prev => ({
      ...prev,
      dueDate: defaultDueDate.toISOString().split('T')[0]
    }))
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Create, track, and manage client invoices</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowStatsModal(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalInvoices}</p>
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
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{paidInvoices}</p>
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
            <DollarSign className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
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
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overdueInvoices}</p>
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
                placeholder="Search invoices..."
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
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SUBMITTED">Under Review</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center p-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No invoices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {invoice.invoiceNumber}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.client.fullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {invoice.client.email}
                        </div>
                        {invoice.client.companyName && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {invoice.client.companyName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.currency} {invoice.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                      {new Date(invoice.dueDate) < new Date() && invoice.paymentStatus === 'PENDING' && (
                        <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                          Overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(invoice.paymentStatus)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.paymentStatus)}`}>
                          {getStatusText(invoice.paymentStatus)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(invoice.fileUrl, '_blank')}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(invoice.fileUrl, '_blank')}
                          className="flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Invoice
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-6">
              {/* Client Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Select Client</Label>
                  <Select
                    value={invoiceForm.clientId}
                    onValueChange={(value) => setInvoiceForm(prev => ({ ...prev, clientId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.fullName} ({client.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={invoiceForm.currency}
                    onValueChange={(value) => setInvoiceForm(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Invoice Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Invoice Items</Label>
                  <Button
                    type="button"
                    onClick={addInvoiceItem}
                    size="sm"
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {invoiceForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Rate</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateInvoiceItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Amount</Label>
                        <Input
                          value={item.amount.toFixed(2)}
                          disabled
                          className="bg-gray-50 dark:bg-gray-700"
                        />
                      </div>
                      <div className="col-span-1">
                        {invoiceForm.items.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeInvoiceItem(index)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Terms and Notes */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Textarea
                    id="paymentTerms"
                    value={invoiceForm.paymentTerms}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={invoiceForm.notes}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Any additional information for the client"
                  />
                </div>
              </div>

              {createError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{createError}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1"
                >
                  {createLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Invoice
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Statistics Modal */}
      {showStatsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowStatsModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Invoice Analytics
              </h3>
              <button
                onClick={() => setShowStatsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Payment Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Paid Invoices</span>
                    <span className="font-medium text-green-600">{paidInvoices}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending Invoices</span>
                    <span className="font-medium text-orange-600">{pendingInvoices}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Overdue Invoices</span>
                    <span className="font-medium text-red-600">{overdueInvoices}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Revenue Summary</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
                    <span className="font-medium text-green-600">${totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending Revenue</span>
                    <span className="font-medium text-orange-600">${pendingRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Payment Rate</span>
                    <span className="font-medium text-blue-600">
                      {totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 