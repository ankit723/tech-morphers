"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  User, 
  FileText, 
  Calendar, 
  Mail, 
  Phone, 
  Building2,
  Loader2,
  LogOut,
  Settings,
  Lock,
  X,
  FolderOpen,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type ClientDocument = {
  id: string
  title: string
  type: string
  uploadedAt: string
  fileUrl: string
  requiresSignature: boolean
  isSigned: boolean
  signedAt?: string
  invoiceNumber?: string
  invoiceAmount?: number
  currency?: string
  dueDate?: string
  paymentStatus?: string
}

type ClientEstimator = {
  id: string
  projectType: string | null
  createdAt: string
  status?: string
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
  documents: ClientDocument[]
}

export default function ClientDashboard() {
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [forcePasswordChange, setForcePasswordChange] = useState(false)
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
        
        // Check if password change is required
        if (!result.data.client.hasChangedPassword) {
          setForcePasswordChange(true)
          setShowPasswordModal(true)
        }
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

  const handleLogout = async () => {
    try {
      await fetch('/api/client/auth', { method: 'DELETE' })
      router.push('/client/login')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/client/login')
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long')
      return
    }

    setPasswordLoading(true)
    setPasswordError('')

    try {
      const response = await fetch('/api/client/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientData!.client.id,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      const result = await response.json()

      if (result.success) {
        setShowPasswordModal(false)
        setForcePasswordChange(false)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        // Refresh dashboard data to update hasChangedPassword status
        await loadDashboardData()
        alert('Password changed successfully!')
      } else {
        setPasswordError(result.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Password change failed:', error)
      setPasswordError('An error occurred while changing password')
    } finally {
      setPasswordLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!clientData) {
    return null
  }

  const { client, estimators, documents } = clientData

  // Calculate statistics
  const totalProjects = estimators.length
  const totalDocuments = documents.length
  const pendingSignatures = documents.filter(doc => doc.requiresSignature && !doc.isSigned).length
  const pendingPayments = documents.filter(doc => doc.paymentStatus === 'PENDING').length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Welcome, {client.fullName}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {client.companyName || 'Client Dashboard'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Client Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Account Information</span>
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
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
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProjects}</p>
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

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access your projects and manage your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => router.push('/client/projects')}
                    className="flex items-center justify-center space-x-2 h-16"
                  >
                    <FolderOpen className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">View Projects</div>
                      <div className="text-sm opacity-90">Browse all your projects and documents</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center justify-center space-x-2 h-16"
                  >
                    <Settings className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">Account Settings</div>
                      <div className="text-sm opacity-90">Change password and preferences</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Your latest projects</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/client/projects')}
                >
                  View All Projects
                </Button>
              </CardHeader>
              <CardContent>
                {estimators.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
                    <p className="text-sm text-gray-400 mt-2">Contact us to get started with your first project!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {estimators.slice(0, 3).map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => router.push(`/client/projects/${project.id}/documents`)}
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
                              Created: {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {project.status && (
                            <Badge variant="outline">
                              {project.status}
                            </Badge>
                          )}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            View Documents →
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {estimators.length > 3 && (
                      <div className="text-center pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => router.push('/client/projects')}
                        >
                          View {estimators.length - 3} more projects
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </h3>
              {!forcePasswordChange && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPasswordModal(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {forcePasswordChange && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  For security reasons, you must change your password before continuing.
                </p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  minLength={8}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  minLength={8}
                  className="mt-1"
                />
              </div>

              {passwordError && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {passwordError}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                {!forcePasswordChange && (
                  <Button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={passwordLoading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className={forcePasswordChange ? "w-full" : "flex-1"}
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 