"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Edit, DollarSign, Clock, Loader2, FileText, Eye, CheckCircle, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ProjectCompletionModal } from '@/components/admin/ProjectCompletionModal'

type ClientEstimator = {
  id: string
  projectType: string | null
  projectPurpose: string | null
  budgetRange: string | null
  deliveryTimeline: string | null
  customRequests: string | null
  createdAt: string
  documentsCount?: number
  projectCost?: number
  currency?: string
  projectStatus?: string
  totalPaid?: number
  totalVerified?: number
  isFullyPaid?: boolean
  exceededAmount?: number
  documents?: Array<{
    id: string
    title: string
    type: string
    paymentStatus?: string
    invoiceAmount?: number
    requiresSignature: boolean
    isSigned: boolean
  }>
}

interface ProjectsListProps {
  projects: ClientEstimator[]
  clientId: string
  onProjectSelect: (project: ClientEstimator) => void
  onRefresh: () => void
}

interface EditProjectModalProps {
  project: ClientEstimator
  onClose: () => void
  onSuccess: () => void
}

function EditProjectModal({ project, onClose, onSuccess }: EditProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectType: project.projectType || '',
    projectPurpose: project.projectPurpose || '',
    budgetRange: project.budgetRange || '',
    deliveryTimeline: project.deliveryTimeline || '',
    customRequests: project.customRequests || '',
    projectCost: project.projectCost ? project.projectCost.toString() : '',
    currency: project.currency || 'USD',
    projectStatus: project.projectStatus || 'JUST_STARTED'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        alert('Failed to update project: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project')
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
          <h3 className="text-lg font-semibold">Edit Project</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <span className="text-xl">×</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectType">Project Type</Label>
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
            <Label htmlFor="projectPurpose">Project Purpose</Label>
            <Textarea
              id="projectPurpose"
              value={formData.projectPurpose}
              onChange={(e) => setFormData(prev => ({ ...prev, projectPurpose: e.target.value }))}
              placeholder="Describe the purpose and goals of this project..."
              rows={3}
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
                  <SelectItem value="$500 - $2,000">$500 - $2,000</SelectItem>
                  <SelectItem value="$2,000 - $5,000">$2,000 - $5,000</SelectItem>
                  <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="$10,000 - $25,000">$10,000 - $25,000</SelectItem>
                  <SelectItem value="$25,000+">$25,000+</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Update Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ProjectsList({ projects, onProjectSelect, onRefresh }: ProjectsListProps) {
  const [editingProject, setEditingProject] = useState<ClientEstimator | null>(null)
  const [completingProject, setCompletingProject] = useState<ClientEstimator | null>(null)

  const formatProjectStatus = (status: string) => {
    return status?.replace('_', ' ') || 'Just Started'
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'ALMOST_COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'SEVENTY_PERCENT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'FIFTY_PERCENT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'THIRTY_PERCENT':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'TEN_PERCENT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPaymentStatusBadge = (project: ClientEstimator) => {
    if (!project.projectCost) return null

    const projectCost = Number(project.projectCost)
    const totalPaid = project.totalPaid || 0

    if (totalPaid >= projectCost) {
      if (project.exceededAmount && project.exceededAmount > 0) {
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid + ${project.exceededAmount.toFixed(2)} Exceeding
          </Badge>
        )
      } else {
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Total Project Cost Paid
          </Badge>
        )
      }
    }

    return null
  }

  const isProjectFullyPaid = (project: ClientEstimator) => {
    if (!project.projectCost) return false
    const projectCost = Number(project.projectCost)
    const totalPaid = project.totalPaid || 0
    return totalPaid >= projectCost
  }

  const canUploadDeliverables = (project: ClientEstimator) => {
    // Can upload deliverables if:
    // 1. Project is fully paid
    // 2. We don't have information about existing deliverables (assume none exist)
    // Note: We'll let the API handle the actual deliverable existence check
    return isProjectFullyPaid(project)
  }

  const handleEditSuccess = () => {
    setEditingProject(null)
    onRefresh()
  }

  const handleCompleteSuccess = () => {
    setCompletingProject(null)
    onRefresh()
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Projects Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">This client doesn&apos;t have any projects yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-medium truncate">
                      {project.projectType || 'Untitled Project'}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col space-y-1 ml-2">
                    <Badge className={getProjectStatusColor(project.projectStatus || '')}>
                      {formatProjectStatus(project.projectStatus || 'JUST_STARTED')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {project.projectPurpose && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {project.projectPurpose}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {project.budgetRange && (
                      <Badge variant="outline" className="text-xs">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {project.budgetRange}
                      </Badge>
                    )}
                    {project.deliveryTimeline && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {project.deliveryTimeline}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      {project.documentsCount || 0} Documents
                    </Badge>
                  </div>

                  {/* Project Cost and Payment Status */}
                  {project.projectCost && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Project Cost:</span>
                        <span className="font-medium">
                          {project.currency} {Number(project.projectCost).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Paid:</span>
                        <span className="font-medium">
                          {project.currency} {(project.totalPaid || 0).toFixed(2)}
                        </span>
                      </div>
                      
                      {getPaymentStatusBadge(project) && (
                        <div className="pt-1">
                          {getPaymentStatusBadge(project)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onProjectSelect(project)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProject(project)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {canUploadDeliverables(project) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCompletingProject(project)}
                        className="text-green-600 hover:text-green-700 border-green-600 hover:border-green-700"
                        title="Upload Project Deliverables"
                      >
                        <Package className="w-4 h-4" />
                      </Button>
                    )}
                    {!canUploadDeliverables(project) && project.projectCost && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="text-gray-400 border-gray-300 cursor-not-allowed"
                        title={`Payment required: ${project.currency || 'USD'} ${(Number(project.projectCost) - (project.totalPaid || 0)).toFixed(2)} remaining`}
                      >
                        <Package className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Complete Project Modal */}
      {completingProject && (
        <ProjectCompletionModal
          project={completingProject}
          onClose={() => setCompletingProject(null)}
          onSuccess={handleCompleteSuccess}
        />
      )}
    </div>
  )
} 