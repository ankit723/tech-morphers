"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface CreateProjectModalProps {
  clientId: string
  onClose: () => void
  onSuccess: () => void
}

export function CreateProjectModal({ clientId, onClose, onSuccess }: CreateProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectType: '',
    projectPurpose: '',
    budgetRange: '',
    deliveryTimeline: '',
    customRequests: '',
    projectCost: '',
    currency: 'USD',
    projectStatus: 'JUST_STARTED'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.projectType || !formData.projectPurpose) {
      alert('Please fill in the required fields (Project Type and Project Purpose)')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          projectType: formData.projectType,
          projectPurpose: formData.projectPurpose,
          budget: formData.budgetRange,
          timeline: formData.deliveryTimeline,
          status: formData.customRequests,
          projectCost: formData.projectCost ? parseFloat(formData.projectCost) : null,
          currency: formData.currency,
          projectStatus: formData.projectStatus
        })
      })

      const result = await response.json()
      if (result.success) {
        onSuccess()
      } else {
        alert('Failed to create project: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const projectStatusOptions = [
    { value: 'JUST_STARTED', label: 'Just Started' },
    { value: 'TEN_PERCENT', label: '10% Completed' },
    { value: 'THIRTY_PERCENT', label: '30% Completed' },
    { value: 'FIFTY_PERCENT', label: '50% Completed' },
    { value: 'SEVENTY_PERCENT', label: '70% Completed' },
    { value: 'ALMOST_COMPLETED', label: 'Almost Completed' },
    { value: 'COMPLETED', label: 'Completed' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New Project</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <span className="text-xl">×</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectType">Project Type *</Label>
              <Select 
                value={formData.projectType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website Development">Website Development</SelectItem>
                  <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                  <SelectItem value="E-commerce Platform">E-commerce Platform</SelectItem>
                  <SelectItem value="Custom Software">Custom Software</SelectItem>
                  <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="projectStatus">Project Status</Label>
              <Select 
                value={formData.projectStatus} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, projectStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {projectStatusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="projectPurpose">Project Purpose *</Label>
            <Textarea
              id="projectPurpose"
              value={formData.projectPurpose}
              onChange={(e) => setFormData(prev => ({ ...prev, projectPurpose: e.target.value }))}
              placeholder="Describe the purpose and goals of this project..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budgetRange">Budget Range</Label>
              <Select 
                value={formData.budgetRange} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="₹10000 - ₹25000">₹10000 - ₹25000</SelectItem>
                  <SelectItem value="₹25000 - ₹50000">₹25000 - ₹50000</SelectItem>
                  <SelectItem value="₹50000 - ₹75000">₹50000 - ₹75000</SelectItem>
                  <SelectItem value="₹75000 +">₹75000 +</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deliveryTimeline">Delivery Timeline</Label>
              <Select 
                value={formData.deliveryTimeline} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryTimeline: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASAP (Rush)">ASAP (Rush)</SelectItem>
                  <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                  <SelectItem value="1 month">1 month</SelectItem>
                  <SelectItem value="2-3 months">2-3 months</SelectItem>
                  <SelectItem value="3-6 months">3-6 months</SelectItem>
                  <SelectItem value="6+ months">6+ months</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="projectCost">Project Cost</Label>
              <Input
                id="projectCost"
                type="number"
                step="0.01"
                min="0"
                value={formData.projectCost}
                onChange={(e) => setFormData(prev => ({ ...prev, projectCost: e.target.value }))}
                placeholder="Enter total project cost"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
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

          <div>
            <Label htmlFor="customRequests">Additional Notes</Label>
            <Textarea
              id="customRequests"
              value={formData.customRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, customRequests: e.target.value }))}
              placeholder="Any additional requirements or notes..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 