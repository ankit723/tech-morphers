"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, Upload, Users, FolderOpen, Loader2, Check, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjectCompletionModal } from '@/components/admin/ProjectCompletionModal'

interface Client {
  id: string
  fullName: string
  email: string
  companyName: string | null
}

interface Project {
  id: string
  projectType: string | null
  projectPurpose: string | null
  projectStatus: string
  projectCost: number | null
  currency: string | null
  totalPaid: number
  isFullyPaid: boolean
  client: {
    id: string
    fullName: string
    email: string
  }
}

type Step = 'client' | 'project' | 'upload'

export default function ClientDeliveriesPage() {
  const [currentStep, setCurrentStep] = useState<Step>('client')
  const [completedSteps, setCompletedSteps] = useState<Step[]>([])
  
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  const [clientSearch, setClientSearch] = useState('')
  const [projectSearch, setProjectSearch] = useState('')
  
  const [loadingClients, setLoadingClients] = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)

  const steps = [
    {
      id: 'client' as Step,
      title: 'Select Client',
      description: 'Choose the client for delivery',
      icon: Users
    },
    {
      id: 'project' as Step,
      title: 'Select Project',
      description: 'Choose the project to deliver',
      icon: FolderOpen
    },
    {
      id: 'upload' as Step,
      title: 'Upload Deliverables',
      description: 'Upload project files',
      icon: Package
    }
  ]

  // Load all clients on page mount
  useEffect(() => {
    loadClients()
  }, [])

  // Load projects when client is selected
  useEffect(() => {
    if (selectedClientId) {
      loadProjects(selectedClientId)
    } else {
      setProjects([])
      setFilteredProjects([])
      setSelectedProjectId('')
      setSelectedProject(null)
    }
  }, [selectedClientId])

  // Filter clients based on search
  useEffect(() => {
    if (clientSearch.trim() === '') {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(client =>
        client.fullName.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
        (client.companyName && client.companyName.toLowerCase().includes(clientSearch.toLowerCase()))
      )
      setFilteredClients(filtered)
    }
  }, [clientSearch, clients])

  // Filter projects based on search
  useEffect(() => {
    if (projectSearch.trim() === '') {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(project =>
        (project.projectType && project.projectType.toLowerCase().includes(projectSearch.toLowerCase())) ||
        (project.projectPurpose && project.projectPurpose.toLowerCase().includes(projectSearch.toLowerCase()))
      )
      setFilteredProjects(filtered)
    }
  }, [projectSearch, projects])

  const loadClients = async () => {
    try {
      setLoadingClients(true)
      const response = await fetch('/api/admin/clients')
      const result = await response.json()
      
      if (result.success) {
        setClients(result.clients)
      }
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoadingClients(false)
    }
  }

  const loadProjects = async (clientId: string) => {
    try {
      setLoadingProjects(true)
      const response = await fetch(`/api/admin/projects?clientId=${clientId}`)
      const result = await response.json()
      
      if (result.success) {
        setProjects(result.projects)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId)
    const client = clients.find(c => c.id === clientId)
    setSelectedClient(client || null)
    
    // Reset project selection
    setSelectedProjectId('')
    setSelectedProject(null)
    setProjectSearch('')
    
    // Update completed steps and move to next step
    if (!completedSteps.includes('client')) {
      setCompletedSteps(prev => [...prev, 'client'])
    }
    setCurrentStep('project')
  }

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId)
    const project = projects.find(p => p.id === projectId)
    setSelectedProject(project || null)
    
    // Update completed steps and move to next step
    if (!completedSteps.includes('project')) {
      setCompletedSteps(prev => [...prev, 'project'])
    }
    setCurrentStep('upload')
  }

  const handleUploadDeliverables = () => {
    if (selectedProject) {
      setShowDeliveryModal(true)
    }
  }

  const handleDeliverySuccess = () => {
    setShowDeliveryModal(false)
    // Mark upload step as completed
    if (!completedSteps.includes('upload')) {
      setCompletedSteps(prev => [...prev, 'upload'])
    }
    // Optionally refresh project data to update payment status
    if (selectedClientId) {
      loadProjects(selectedClientId)
    }
  }

  const handleStepClick = (stepId: Step) => {
    // Only allow going back to completed steps or current step
    if (completedSteps.includes(stepId) || stepId === currentStep) {
      setCurrentStep(stepId)
    }
  }

  const getStepStatus = (stepId: Step) => {
    if (completedSteps.includes(stepId)) return 'completed'
    if (stepId === currentStep) return 'current'
    return 'pending'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span>Client Deliveries</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload project deliverables to clients
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id)
              const Icon = step.icon
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={status === 'pending'}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50'
                        : status === 'current'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      status === 'completed'
                        ? 'border-green-500 bg-green-500 text-white'
                        : status === 'current'
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600'
                    }`}>
                      {status === 'completed' ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm opacity-75">{step.description}</div>
                    </div>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 1: Client Selection */}
        {currentStep === 'client' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Step 1: Select Client</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientSearch">Search Clients</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="clientSearch"
                    type="text"
                    placeholder="Search by name, email, or company..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="clientSelect">Select Client</Label>
                {loadingClients ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading clients...</span>
                  </div>
                ) : (
                  <Select value={selectedClientId} onValueChange={handleClientSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{client.fullName}</span>
                            <span className="text-sm text-gray-500">
                              {client.email} {client.companyName && `• ${client.companyName}`}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedClient && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Client Selected: {selectedClient.fullName}</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Proceed to select a project
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Project Selection */}
        {currentStep === 'project' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5" />
                <span>Step 2: Select Project</span>
              </CardTitle>
              {selectedClient && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selecting project for: <span className="font-medium">{selectedClient.fullName}</span>
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectSearch">Search Projects</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="projectSearch"
                    type="text"
                    placeholder="Search by project type or purpose..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="projectSelect">Select Project</Label>
                {loadingProjects ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading projects...</span>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No projects found for this client
                  </div>
                ) : (
                  <Select value={selectedProjectId} onValueChange={handleProjectSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {project.projectType || 'Untitled Project'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {project.projectPurpose || 'No description'} • 
                              {project.isFullyPaid ? (
                                <span className="text-green-600 ml-1">Fully Paid</span>
                              ) : (
                                <span className="text-red-600 ml-1">Payment Pending</span>
                              )}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedProject && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Project Selected: {selectedProject.projectType}</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Proceed to upload deliverables
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Upload Deliverables */}
        {currentStep === 'upload' && selectedProject && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Step 3: Upload Deliverables</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Client
                    </Label>
                    <p className="font-medium">{selectedProject.client.fullName}</p>
                    <p className="text-sm text-gray-500">{selectedProject.client.email}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Project Type
                    </Label>
                    <p className="font-medium">{selectedProject.projectType || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Purpose
                    </Label>
                    <p className="text-sm">{selectedProject.projectPurpose || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Project Cost
                    </Label>
                    <p className="font-medium">
                      {selectedProject.projectCost 
                        ? `${selectedProject.currency || 'USD'} ${selectedProject.projectCost.toFixed(2)}`
                        : 'Not set'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Paid
                    </Label>
                    <p className="font-medium">
                      {selectedProject.currency || 'USD'} {selectedProject.totalPaid.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Payment Status
                    </Label>
                    <div className="flex items-center space-x-2">
                      {selectedProject.isFullyPaid ? (
                        <span className="text-green-600 font-medium">✓ Fully Paid</span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          ✗ Payment Pending ({selectedProject.currency || 'USD'} {
                            selectedProject.projectCost 
                              ? (selectedProject.projectCost - selectedProject.totalPaid).toFixed(2)
                              : '0.00'
                          } remaining)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={handleUploadDeliverables}
                  disabled={!selectedProject.isFullyPaid}
                  className="flex items-center space-x-2"
                  size="lg"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Deliverables</span>
                </Button>
                
                {!selectedProject.isFullyPaid && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    Project must be fully paid before uploading deliverables
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Project Completion Modal */}
      {showDeliveryModal && selectedProject && (
        <ProjectCompletionModal
          project={{
            id: selectedProject.id,
            projectType: selectedProject.projectType,
            projectPurpose: selectedProject.projectPurpose,
            projectStatus: selectedProject.projectStatus
          }}
          onClose={() => setShowDeliveryModal(false)}
          onSuccess={handleDeliverySuccess}
        />
      )}
    </div>
  )
} 