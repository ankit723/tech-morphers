"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FolderOpen, Edit, Trash2, DollarSign, Clock, MoreVertical, Loader2, FileText, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ClientEstimator = {
  id: string
  projectType: string | null
  createdAt: Date
  projectPurpose?: string
  budgetRange?: string
  deliveryTimeline?: string
  customRequests?: string
  documentsCount?: number
  documents?: Array<{
    id: string
    title: string
    type: string
    uploadedAt: Date
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
    customRequests: project.customRequests || ''
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
          status: formData.customRequests
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Project</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <span className="text-xl">×</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="projectPurpose">Project Purpose</Label>
            <Textarea
              id="projectPurpose"
              value={formData.projectPurpose}
              onChange={(e) => setFormData(prev => ({ ...prev, projectPurpose: e.target.value }))}
              placeholder="Describe the purpose of this project..."
              rows={3}
            />
          </div>

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

export function ProjectsList({ projects, clientId, onProjectSelect, onRefresh }: ProjectsListProps) {
  const router = useRouter()
  const [editingProject, setEditingProject] = useState<ClientEstimator | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleEdit = (project: ClientEstimator, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingProject(project)
  }

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    setDeletingId(projectId)

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        onRefresh()
      } else {
        alert('Failed to delete project: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    } finally {
      setDeletingId(null)
    }
  }

  const handleViewDocuments = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/admin/clients/${clientId}/projects/${projectId}`)
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div 
            key={project.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                    <span className="truncate">{project.projectType || `Project #${index + 1}`}</span>
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEdit(project, e)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleDelete(project.id, e)}
                        className="text-red-600 dark:text-red-400"
                        disabled={deletingId === project.id}
                      >
                        {deletingId === project.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
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
                  
                  {project.documents && project.documents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recent Documents:</p>
                      <div className="space-y-1">
                        {project.documents.slice(0, 2).map(doc => (
                          <div key={doc.id} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                              {doc.title}
                            </span>
                            <Badge variant="secondary" className="text-xs ml-2">
                              {doc.type}
                            </Badge>
                          </div>
                        ))}
                        {project.documents.length > 2 && (
                          <p className="text-xs text-gray-400">
                            +{project.documents.length - 2} more documents
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2 pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleViewDocuments(project.id, e)}
                      className="flex-1 flex items-center justify-center space-x-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Documents</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onProjectSelect(project)
                      }}
                      className="flex-1 flex items-center justify-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Details</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={() => {
            setEditingProject(null)
            onRefresh()
          }}
        />
      )}
    </>
  )
} 