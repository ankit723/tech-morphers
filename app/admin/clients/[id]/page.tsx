"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Users, 
  Mail, 
  Phone, 
  Building2,
  Calendar,
  Loader2,
  FolderOpen,
  FileText,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    paymentStatus?: string
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
  documents: Array<{
    id: string
    title: string
    type: string
    uploadedAt: Date
    paymentStatus?: string
    requiresSignature: boolean
    isSigned: boolean
  }>
  estimators: ClientEstimator[]
}

interface ClientPageProps {
  params: Promise<{ id: string }>
}

export default function ClientPage({ params }: ClientPageProps) {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading client data...</p>
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

  // Calculate statistics
  const totalDocuments = client.documents.length
  const pendingSignatures = client.documents.filter(doc => doc.requiresSignature && !doc.isSigned).length
  const pendingPayments = client.documents.filter(doc => doc.paymentStatus === 'PENDING').length
  // const completedProjects = client.estimators.filter(project => 
  //   project.documents && project.documents.length > 0 && 
  //   project.documents.every(doc => !doc.requiresSignature || doc.isSigned)
  // ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/clients')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Clients</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {client.fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {client.companyName || 'Individual Client'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => router.push(`/admin/clients/${client.id}/projects`)}
            className="flex items-center space-x-2"
          >
            <FolderOpen className="w-4 h-4" />
            <span>View Projects</span>
          </Button>
        </div>
      </div>

      {/* Client Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Client Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm text-gray-900 dark:text-white">{client.email}</p>
                </div>
              </div>
              {client.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm text-gray-900 dark:text-white">{client.phone}</p>
                  </div>
                </div>
              )}
              {client.companyName && (
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
                    <p className="text-sm text-gray-900 dark:text-white">{client.companyName}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Badge variant={client.hasChangedPassword ? "default" : "secondary"}>
                {client.hasChangedPassword ? 'Password Updated' : 'Default Password'}
              </Badge>
              {client.lastLoginAt && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last login: {new Date(client.lastLoginAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{client.estimators.length}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDocuments}</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Signatures</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingSignatures}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingPayments}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest projects for this client</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/admin/clients/${client.id}/projects`)}
            >
              View All Projects
            </Button>
          </CardHeader>
          <CardContent>
            {client.estimators.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {client.estimators.slice(0, 3).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/clients/${client.id}/projects/${project.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {project.projectType || 'Untitled Project'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.projectPurpose || 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">
                        {project.documentsCount || 0} documents
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {client.estimators.length > 3 && (
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => router.push(`/admin/clients/${client.id}/projects`)}
                    >
                      View {client.estimators.length - 3} more projects
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest document activity for this client</CardDescription>
          </CardHeader>
          <CardContent>
            {client.documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No documents yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {client.documents.slice(0, 5).map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {document.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {document.type} • {new Date(document.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {document.requiresSignature && (
                        <Badge variant={document.isSigned ? "default" : "secondary"} className="text-xs">
                          {document.isSigned ? 'Signed' : 'Pending Signature'}
                        </Badge>
                      )}
                      {document.paymentStatus && (
                        <Badge variant="outline" className="text-xs">
                          {document.paymentStatus}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
                {client.documents.length > 5 && (
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => router.push(`/admin/clients/${client.id}/projects`)}
                    >
                      View all documents
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 