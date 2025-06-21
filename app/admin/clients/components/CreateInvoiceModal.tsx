"use client"

import { useState } from 'react'
import { X, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CreateInvoiceModalProps {
  clientId: string
  projectId?: string
  onClose: () => void
  onSuccess: () => void
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
  currency: string
  dueDate: string
  paymentTerms: string
  notes: string
}

export function CreateInvoiceModal({ clientId, projectId, onClose, onSuccess }: CreateInvoiceModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [invoiceForm, setInvoiceForm] = useState<InvoiceFormData>({
    clientId,
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    currency: 'USD',
    dueDate: '',
    paymentTerms: 'Payment is due within 30 days of invoice date.',
    notes: ''
  })

  // const updateItemAmount = (index: number, quantity: number, rate: number) => {
  //   const amount = quantity * rate
  //   setInvoiceForm(prev => ({
  //     ...prev,
  //     items: prev.items.map((item, i) => 
  //       i === index ? { ...item, quantity, rate, amount } : item
  //     )
  //   }))
  // }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceForm(prev => {
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], [field]: value }
      
      // Recalculate amount if quantity or rate changed
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate
      }
      
      return { ...prev, items: newItems }
    })
  }

  const addItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }))
  }

  const removeItem = (index: number) => {
    if (invoiceForm.items.length > 1) {
      setInvoiceForm(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
  }

  const calculateSubtotal = () => {
    return invoiceForm.items.reduce((sum, item) => sum + item.amount, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!invoiceForm.clientId || invoiceForm.items.length === 0) {
      setError('Please ensure client is selected and add at least one item')
      return
    }

    // Validate items
    const validItems = invoiceForm.items.filter(item => 
      item.description.trim() && item.quantity > 0 && item.rate > 0
    )

    if (validItems.length === 0) {
      setError('Please add valid items with description, quantity, and rate')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...invoiceForm,
          items: validItems,
          projectId: projectId || null
        })
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        setError(result.error || 'Failed to create invoice')
      }
    } catch (error) {
      console.error('Invoice creation failed:', error)
      setError('An error occurred while creating the invoice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Create Invoice</h3>
            {projectId && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This invoice will be associated with the selected project
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Currency and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                type="date"
                id="dueDate"
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Invoice Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {invoiceForm.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="col-span-5">
                    <Label className="text-xs">Description</Label>
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Rate</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Amount</Label>
                    <Input
                      type="number"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="h-8 bg-gray-100 dark:bg-gray-600"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={invoiceForm.items.length === 1}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="flex justify-end">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-sm font-medium">
                  Subtotal: {invoiceForm.currency} {calculateSubtotal().toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  No tax applied
                </div>
              </div>
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
                placeholder="Payment terms and conditions"
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={invoiceForm.notes}
                onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                placeholder="Any additional information for the client"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 