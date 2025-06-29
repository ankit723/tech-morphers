"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  Mail, 
  Phone, 
  Building, 
  AlertCircle, 
  Search,
  Download,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type PartialSubmission = {
  id: string
  projectType: string | null
  projectPurpose: string | null
  features: string[]
  fullName: string
  email: string
  phone: string | null
  companyName: string | null
  customRequests: string | null
  createdAt: string
  updatedAt: string
}

export default function PartialSubmissionsPage() {
  const [submissions, setSubmissions] = useState<PartialSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    loadPartialSubmissions()
  }, [])

  const loadPartialSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/partial-submissions')
      const data = await response.json()
      
      if (data.success) {
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('Error loading partial submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const extractStepInfo = (customRequests: string) => {
    const match = customRequests?.match(/Step: (\d+)\/7, Time Spent: (\d+)min/)
    return {
      step: match ? parseInt(match[1]) : 0,
      timeSpent: match ? parseInt(match[2]) : 0
    }
  }

  const getCompletionPercentage = (step: number) => {
    return Math.round((step / 7) * 100)
  }

  const filteredSubmissions = submissions
    .filter(submission => {
      const matchesSearch = 
        submission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (submission.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      
      const matchesFilter = filterType === 'all' || 
        (filterType === 'with-email' && submission.email && !submission.email.includes('temp.com')) ||
        (filterType === 'anonymous' && submission.email.includes('temp.com')) ||
        (filterType === 'high-progress' && extractStepInfo(submission.customRequests || '').step >= 4)
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'progress') {
        const aStep = extractStepInfo(a.customRequests || '').step
        const bStep = extractStepInfo(b.customRequests || '').step
        return bStep - aStep
      } else if (sortBy === 'time-spent') {
        const aTime = extractStepInfo(a.customRequests || '').timeSpent
        const bTime = extractStepInfo(b.customRequests || '').timeSpent
        return bTime - aTime
      }
      return 0
    })

  const stats = {
    total: submissions.length,
    withEmail: submissions.filter(s => s.email && !s.email.includes('temp.com')).length,
    highProgress: submissions.filter(s => extractStepInfo(s.customRequests || '').step >= 4).length,
    avgTimeSpent: Math.round(
      submissions.reduce((sum, s) => sum + extractStepInfo(s.customRequests || '').timeSpent, 0) / submissions.length
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading partial submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Partial Submissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track users who started but didn&apos;t complete the estimator
          </p>
        </div>
        <Button onClick={loadPartialSubmissions} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Partial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">All incomplete submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">With Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.withEmail}</div>
            <p className="text-xs text-gray-500">Can follow up via email</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">High Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highProgress}</div>
            <p className="text-xs text-gray-500">Reached step 4+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.avgTimeSpent}m</div>
            <p className="text-xs text-gray-500">Time spent on form</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="with-email">With Email</SelectItem>
                <SelectItem value="anonymous">Anonymous</SelectItem>
                <SelectItem value="high-progress">High Progress</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="progress">By Progress</SelectItem>
                <SelectItem value="time-spent">By Time Spent</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No partial submissions found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search terms.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSubmissions.map((submission) => {
            const stepInfo = extractStepInfo(submission.customRequests || '')
            const completion = getCompletionPercentage(stepInfo.step)
            const isAnonymous = submission.email.includes('temp.com')
            
            return (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {isAnonymous ? 'Anonymous User' : submission.fullName}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {!isAnonymous && (
                                <>
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {submission.email}
                                  </div>
                                  {submission.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-4 h-4" />
                                      {submission.phone}
                                    </div>
                                  )}
                                  {submission.companyName && (
                                    <div className="flex items-center gap-1">
                                      <Building className="w-4 h-4" />
                                      {submission.companyName}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={completion >= 50 ? "default" : "secondary"}>
                              {completion}% Complete
                            </Badge>
                            {!isAnonymous && (
                              <Badge variant="outline" className="text-green-600">
                                Contactable
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress: Step {stepInfo.step}/7</span>
                            <span>Time spent: {stepInfo.timeSpent} minutes</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Project Type:</span>
                            <p className="text-gray-600 dark:text-gray-400">
                              {submission.projectType || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Purpose:</span>
                            <p className="text-gray-600 dark:text-gray-400">
                              {submission.projectPurpose || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Submitted:</span>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {!isAnonymous && (
                          <Button size="sm" variant="outline">
                            Send Follow-up
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
} 