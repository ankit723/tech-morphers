"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  Building2,
  Loader2,
  FolderOpen,
  ArrowLeft,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

type ClientEstimator = {
  id: string
  projectType: string | null
  createdAt: string
  status?: string
  fullName: string
  email: string
  phone?: string
  companyName?: string
  projectDescription?: string
  budget?: string
  timeline?: string
}

type ClientData = {
  client: {
    id: string
    email: string
    fullName: string
    companyName: string | null
    phone: string | null
    hasChangedPassword: boolean
    createdAt: string
  }
  estimators: ClientEstimator[]
  documents: any[]
}

export default function ClientProjects() {
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/client/dashboard')
      const result = await response.json()

      if (result.success) {
        setClientData(result.data)
      } else {
        // Redirect to login if not authenticated
        router.push('/client/login')
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      router.push('/client/login')
    } finally {
      setLoading(false)
    }
  }

  const handleProjectSelect = (project: ClientEstimator) => {
    router.push(`/client/projects/${project.id}/documents`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (!clientData) {
    return null
  }

  const { client, estimators } = clientData

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/client/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  My Projects
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View all your projects and documents
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Client Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Account Overview</span>
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
                      <p className="text-sm text-gray-900 dark:text-white">{estimators.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
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
                {estimators.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Projects Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      You don&apos;t have any projects yet. Contact us to get started!
                    </p>
                    <Link href="/contact">
                      <Button className="mt-4">Get Started</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {estimators.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className="cursor-pointer hover:shadow-lg transition-shadow" 
                          onClick={() => handleProjectSelect(project)}
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span className="flex items-center space-x-2">
                                <FolderOpen className="w-5 h-5 text-blue-600" />
                                <span>Project #{index + 1}</span>
                              </span>
                              {project.status && (
                                <Badge variant="secondary">{project.status}</Badge>
                              )}
                            </CardTitle>
                            <CardDescription>
                              {project.projectType || 'General Project'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                              </div>
                              {project.companyName && (
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <Building2 className="w-4 h-4 mr-2" />
                                  <span>{project.companyName}</span>
                                </div>
                              )}
                              {project.projectDescription && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                    {project.projectDescription}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Click to view documents
                                </span>
                                <span className="text-blue-600 dark:text-blue-400">→</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
} 