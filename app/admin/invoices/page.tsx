"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  IndianRupeeIcon,
  Clock,
  CheckCircle,
  Upload,
  AlertTriangle,
  BarChart3,
  X,
  Loader2,
  Calendar,
  FileSpreadsheet,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import * as XLSX from 'xlsx'
import { format, parseISO, isWithinInterval } from 'date-fns'

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

type DateRange = {
  startDate: string
  endDate: string
}

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  
  // Date filtering states
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    dateType: 'createdAt' // 'createdAt' or 'dueDate'
  })

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

  // Excel export functionality
  const exportToExcel = (filteredData: Invoice[], dateRange?: DateRange) => {
    setExportLoading(true)
    
    try {
      // Prepare data for Excel
      const excelData = filteredData.map((invoice, index) => ({
        'S.No': index + 1,
        'Invoice Number': invoice.invoiceNumber,
        'Client Name': invoice.client.fullName,
        'Client Email': invoice.client.email,
        'Company Name': invoice.client.companyName || 'N/A',
        'Amount': invoice.amount,
        'Currency': invoice.currency,
        'Created Date': format(parseISO(invoice.createdAt), 'dd/MM/yyyy'),
        'Due Date': format(parseISO(invoice.dueDate), 'dd/MM/yyyy'),
        'Status': getStatusText(invoice.paymentStatus),
        'Days to Due': Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)),
        'Is Overdue': new Date(invoice.dueDate) < new Date() && invoice.paymentStatus === 'PENDING' ? 'Yes' : 'No',
        'File URL': invoice.fileUrl
      }))

      // Create summary data
      const totalInvoices = filteredData.length
      const paidInvoices = filteredData.filter(inv => inv.paymentStatus === 'PAID').length
      const pendingInvoices = filteredData.filter(inv => inv.paymentStatus === 'PENDING').length
      const overdueInvoices = filteredData.filter(inv => 
        inv.paymentStatus === 'PENDING' && new Date(inv.dueDate) < new Date()
      ).length
      
      const totalRevenue = filteredData
        .filter(inv => inv.paymentStatus === 'PAID')
        .reduce((sum, inv) => sum + inv.amount, 0)
      
      const pendingRevenue = filteredData
        .filter(inv => inv.paymentStatus !== 'PAID')
        .reduce((sum, inv) => sum + inv.amount, 0)

      const summaryData = [
        { 'Metric': 'Total Invoices', 'Value': totalInvoices },
        { 'Metric': 'Paid Invoices', 'Value': paidInvoices },
        { 'Metric': 'Pending Invoices', 'Value': pendingInvoices },
        { 'Metric': 'Overdue Invoices', 'Value': overdueInvoices },
        { 'Metric': 'Total Revenue', 'Value': totalRevenue.toFixed(2) },
        { 'Metric': 'Pending Revenue', 'Value': pendingRevenue.toFixed(2) },
        { 'Metric': 'Payment Success Rate', 'Value': totalInvoices > 0 ? `${Math.round((paidInvoices / totalInvoices) * 100)}%` : '0%' }
      ]

      // Create workbook
      const workbook = XLSX.utils.book_new()

      // Add summary sheet
      const summarySheet = XLSX.utils.json_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

      // Add main data sheet
      const mainSheet = XLSX.utils.json_to_sheet(excelData)

      // Auto-size columns
      const columnWidths = [
        { wch: 8 },   // S.No
        { wch: 15 },  // Invoice Number
        { wch: 20 },  // Client Name
        { wch: 25 },  // Client Email
        { wch: 20 },  // Company Name
        { wch: 12 },  // Amount
        { wch: 10 },  // Currency
        { wch: 12 },  // Created Date
        { wch: 12 },  // Due Date
        { wch: 12 },  // Status
        { wch: 12 },  // Days to Due
        { wch: 10 },  // Is Overdue
        { wch: 50 }   // File URL
      ]
      mainSheet['!cols'] = columnWidths

      XLSX.utils.book_append_sheet(workbook, mainSheet, 'Invoices')

      // Create status-wise sheets
      const statuses = ['PAID', 'PENDING', 'SUBMITTED', 'VERIFIED']
      statuses.forEach(status => {
        const statusData = excelData.filter(invoice => 
          invoice.Status === getStatusText(status)
        )
        if (statusData.length > 0) {
          const statusSheet = XLSX.utils.json_to_sheet(statusData)
          statusSheet['!cols'] = columnWidths
          XLSX.utils.book_append_sheet(workbook, statusSheet, `${status} Invoices`)
        }
      })

      // Generate filename with date range
      let filename = 'invoices_export'
      if (dateRange?.startDate && dateRange?.endDate) {
        filename += `_${format(parseISO(dateRange.startDate), 'dd-MM-yyyy')}_to_${format(parseISO(dateRange.endDate), 'dd-MM-yyyy')}`
      } else {
        filename += `_${format(new Date(), 'dd-MM-yyyy')}`
      }
      filename += '.xlsx'

      // Export file
      XLSX.writeFile(workbook, filename)
      
      alert(`Excel file exported successfully! Total ${totalInvoices} invoices exported.`)
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('Error exporting to Excel. Please try again.')
    } finally {
      setExportLoading(false)
      setShowExportModal(false)
    }
  }

  const handleQuickExport = () => {
    const dateRange = dateFilter.startDate && dateFilter.endDate ? {
      startDate: dateFilter.startDate,
      endDate: dateFilter.endDate
    } : undefined
    
    exportToExcel(filteredInvoices, dateRange)
  }

  const handleAdvancedExport = () => {
    setShowExportModal(true)
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

  // Enhanced filter function with date filtering
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || invoice.paymentStatus === statusFilter
    
    // Date filtering
    let matchesDate = true
    if (dateFilter.startDate && dateFilter.endDate) {
      const startDate = parseISO(dateFilter.startDate)
      const endDate = parseISO(dateFilter.endDate)
      const invoiceDate = parseISO(dateFilter.dateType === 'createdAt' ? invoice.createdAt : invoice.dueDate)
      
      matchesDate = isWithinInterval(invoiceDate, { start: startDate, end: endDate })
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Calculate statistics for filtered invoices
  const totalInvoices = filteredInvoices.length
  const paidInvoices = filteredInvoices.filter(inv => inv.paymentStatus === 'PAID').length
  const pendingInvoices = filteredInvoices.filter(inv => inv.paymentStatus === 'PENDING').length
  const overdueInvoices = filteredInvoices.filter(inv => 
    inv.paymentStatus === 'PENDING' && new Date(inv.dueDate) < new Date()
  ).length
  
  const totalRevenue = filteredInvoices
    .filter(inv => inv.paymentStatus === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0)
  
  const pendingRevenue = filteredInvoices
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
            onClick={handleQuickExport}
            disabled={exportLoading || filteredInvoices.length === 0}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {exportLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            <span>Export Excel</span>
          </Button>
          <Button
            onClick={handleAdvancedExport}
            disabled={exportLoading || filteredInvoices.length === 0}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Advanced Export</span>
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

      {/* Stats Cards - Now showing filtered data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {dateFilter.startDate ? 'Filtered' : 'Total'} Invoices
              </p>
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
            <IndianRupeeIcon className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toFixed(2)}</p>
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

      {/* Enhanced Filters with Date Range */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
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
          
          <div>
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

          <div>
            <Select value={dateFilter.dateType} onValueChange={(value) => setDateFilter(prev => ({ ...prev, dateType: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                placeholder="Start Date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                placeholder="End Date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Quick Date Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
              setDateFilter(prev => ({
                ...prev,
                startDate: startOfMonth.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
              }))
            }}
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
              const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
              setDateFilter(prev => ({
                ...prev,
                startDate: lastMonth.toISOString().split('T')[0],
                endDate: endOfLastMonth.toISOString().split('T')[0]
              }))
            }}
          >
            Last Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              const startOfYear = new Date(today.getFullYear(), 0, 1)
              setDateFilter(prev => ({
                ...prev,
                startDate: startOfYear.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
              }))
            }}
          >
            This Year
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDateFilter(prev => ({
                ...prev,
                startDate: '',
                endDate: ''
              }))
            }}
          >
            Clear Dates
          </Button>
        </div>

        {/* Show active filters */}
        {(dateFilter.startDate || dateFilter.endDate || statusFilter !== 'ALL' || searchTerm) && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Active Filters:</span>
              {searchTerm && <span className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">Search: &ldquo;{searchTerm}&rdquo;</span>}
              {statusFilter !== 'ALL' && <span className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">Status: {statusFilter}</span>}
              {dateFilter.startDate && <span className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">From: {format(parseISO(dateFilter.startDate), 'dd/MM/yyyy')}</span>}
              {dateFilter.endDate && <span className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">To: {format(parseISO(dateFilter.endDate), 'dd/MM/yyyy')}</span>}
              <span className="text-blue-600 dark:text-blue-300 font-medium">({filteredInvoices.length} results)</span>
            </div>
          </div>
        )}
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
            <p className="text-gray-500 dark:text-gray-400">
              {invoices.length === 0 ? 'No invoices found' : 'No invoices match your filters'}
            </p>
            {invoices.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('ALL')
                  setDateFilter({ startDate: '', endDate: '', dateType: 'createdAt' })
                }}
                className="mt-2"
              >
                Clear All Filters
              </Button>
            )}
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

      {/* Advanced Export Modal */}
      {showExportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowExportModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FileSpreadsheet className="w-5 h-5 mr-2" />
                Export to Excel
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Export Summary</h4>
                <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <p>• Total invoices to export: <strong>{filteredInvoices.length}</strong></p>
                  <p>• Date range: {dateFilter.startDate && dateFilter.endDate 
                    ? `${format(parseISO(dateFilter.startDate), 'dd/MM/yyyy')} to ${format(parseISO(dateFilter.endDate), 'dd/MM/yyyy')}`
                    : 'All dates'}</p>
                  <p>• Status filter: <strong>{statusFilter === 'ALL' ? 'All statuses' : statusFilter}</strong></p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Excel Export Features</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>✓ Summary sheet with key metrics</li>
                  <li>✓ Detailed invoice data with all fields</li>
                  <li>✓ Separate sheets by payment status</li>
                  <li>✓ Auto-sized columns for readability</li>
                  <li>✓ Overdue status indicators</li>
                  <li>✓ Searchable and filterable data</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    const dateRange = dateFilter.startDate && dateFilter.endDate ? {
                      startDate: dateFilter.startDate,
                      endDate: dateFilter.endDate
                    } : undefined
                    exportToExcel(filteredInvoices, dateRange)
                  }}
                  disabled={exportLoading || filteredInvoices.length === 0}
                  className="flex-1"
                >
                  {exportLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                  )}
                  Export Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowExportModal(false)}
                  disabled={exportLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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

            {/* Additional Analytics for Filtered Data */}
            {(dateFilter.startDate || dateFilter.endDate || statusFilter !== 'ALL') && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Filtered Data Analytics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{filteredInvoices.length}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Total</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {Math.round((paidInvoices / (filteredInvoices.length || 1)) * 100)}%
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">Success Rate</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      ${(totalRevenue / (filteredInvoices.length || 1)).toFixed(0)}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">Avg. Value</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">{overdueInvoices}</div>
                    <div className="text-xs text-red-600 dark:text-red-400">Overdue</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 