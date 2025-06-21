"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Users, 
  FolderOpen,
  Calendar,
  Loader2,
  Plus,
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectsList } from '../../components/ProjectsList'
import { CreateProjectModal } from '../../components/CreateProjectModal'

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

type Client = {
  id: string
  email: string
  fullName: string
  phone: string | null
  companyName: string | null
  systemPassword: string
  hasChangedPassword: boolean
  createdAt: Date
  lastLoginAt: Date | null
  estimators: ClientEstimator[]
}

interface ClientProjectsPageProps {
  params: Promise<{ id: string }>
}

export default function ClientProjectsPage({ params }: ClientProjectsPageProps) {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [showProjectModal, setShowProjectModal] = useState(false)

  useEffect(() => {
    loadClient()
  }, [])

  const loadClient = async () => {
    try {
      const resolvedParams = await params
      const clientId = resolvedParams.id

      const response = await fetch(`/api/admin/clients/${clientId}`)
      const result = await response.json()

      if (result.success) {
        setClient(result.client)
      } else {
        router.push('/admin/clients')
      }
    } catch (error) {
      console.error('Error loading client:', error)
      router.push('/admin/clients')
    } finally {
      setLoading(false)
    }
  }

  const handleProjectSelect = (project: ClientEstimator) => {
    router.push(`/admin/clients/${client!.id}/projects/${project.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading client projects...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Client not found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          The client you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => router.push('/admin/clients')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/clients/${client.id}`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Client</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Projects for {client.fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {client.companyName || 'Individual Client'} • {client.estimators.length} projects
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowProjectModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Client Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Client Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Client</p>
                  <p className="text-sm text-gray-900 dark:text-white">{client.fullName}</p>
                </div>
              </div>
              
              {client.companyName && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
                    <p className="text-sm text-gray-900 dark:text-white">{client.companyName}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</p>
                  <p className="text-sm text-gray-900 dark:text-white">{client.estimators.length}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Since</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Projects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              <span>All Projects</span>
            </CardTitle>
            <CardDescription>
              Click on any project to view its documents and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsList
              projects={client.estimators}
              clientId={client.id}
              onProjectSelect={handleProjectSelect}
              onRefresh={loadClient}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Project Modal */}
      {showProjectModal && (
        <CreateProjectModal
          clientId={client.id}
          onClose={() => setShowProjectModal(false)}
          onSuccess={() => {
            setShowProjectModal(false)
            loadClient()
          }}
        />
      )}
    </div>
  )
} 