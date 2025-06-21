"use client"

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
    customRequests: ''
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
          status: formData.customRequests
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New Project</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="projectType">Project Type <span className="text-red-500">*</span></Label>
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
            <Label htmlFor="projectPurpose">Project Purpose <span className="text-red-500">*</span></Label>
            <Textarea
              id="projectPurpose"
              value={formData.projectPurpose}
              onChange={(e) => setFormData(prev => ({ ...prev, projectPurpose: e.target.value }))}
              placeholder="Describe the purpose and goals of this project..."
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="budgetRange">Budget Range</Label>
            <Select 
              value={formData.budgetRange} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget range (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Under $5,000">Under $5,000</SelectItem>
                <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                <SelectItem value="$10,000 - $25,000">$10,000 - $25,000</SelectItem>
                <SelectItem value="$25,000 - $50,000">$25,000 - $50,000</SelectItem>
                <SelectItem value="$50,000+">$50,000+</SelectItem>
                <SelectItem value="To be discussed">To be discussed</SelectItem>
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
                <SelectValue placeholder="Select expected timeline (optional)" />
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

          <div>
            <Label htmlFor="customRequests">Additional Notes</Label>
            <Textarea
              id="customRequests"
              value={formData.customRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, customRequests: e.target.value }))}
              placeholder="Any additional requirements, notes, or special considerations..."
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