"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Mail, 
  Users, 
  Database, 
  TrendingUp,
  ArrowLeft,
  Loader2,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { getBlogNotificationStats } from "@/lib/blog-email-notifications"

interface EmailStats {
  totalUniqueEmails: number
  emailsBySource: {
    contactUs: number
    estimator: number
    getStarted: number
    talkToUs: number
    letsTalk: number
    contactPage: number
  }
}

export default function BlogEmailStatsPage() {
  const [stats, setStats] = useState<EmailStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async () => {
    try {
      setRefreshing(true)
      const emailStats = await getBlogNotificationStats()
      setStats(emailStats)
    } catch (error) {
      console.error("Error fetching email stats:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Failed to load email statistics</p>
      </div>
    )
  }

  const sourceLabels = {
    contactUs: 'Contact Us',
    estimator: 'Project Estimates',
    getStarted: 'Get Started',
    talkToUs: 'Talk To Us',
    letsTalk: 'Newsletter',
    contactPage: 'Contact Page'
  }

  const sourceColors = {
    contactUs: 'from-blue-500 to-blue-600',
    estimator: 'from-green-500 to-green-600',
    getStarted: 'from-purple-500 to-purple-600',
    talkToUs: 'from-orange-500 to-orange-600',
    letsTalk: 'from-cyan-500 to-cyan-600',
    contactPage: 'from-indigo-500 to-indigo-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link 
              href="/admin/blogs"
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Blogs
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blog Email Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Statistics about email addresses that receive blog notifications
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Unique Emails
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalUniqueEmails.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Will receive blog notifications
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Email Sources
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                6
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Different data sources
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Potential Reach
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalUniqueEmails > 0 ? '100%' : '0%'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Email delivery coverage
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Email Sources Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Email Sources Breakdown
          </h3>
          <Mail className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.emailsBySource).map(([source, count], index) => {
            const percentage = stats.totalUniqueEmails > 0 
              ? ((count / stats.totalUniqueEmails) * 100).toFixed(1)
              : '0'
            
            return (
              <motion.div
                key={source}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${sourceColors[source as keyof typeof sourceColors]}`}></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {sourceLabels[source as keyof typeof sourceLabels]}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {percentage}% of total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {count.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    emails
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Information Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
      >
        <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          📧 How Blog Notifications Work
        </h4>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p>• <strong>Automatic Notifications:</strong> When you publish a new blog post, emails are automatically sent to all unique email addresses in your database.</p>
          <p>• <strong>Smart Deduplication:</strong> Duplicate emails across different sources are automatically removed to prevent spam.</p>
          <p>• <strong>Batch Processing:</strong> Emails are sent in batches of 50 with 1-second delays to respect rate limits.</p>
          <p>• <strong>Background Processing:</strong> Email sending happens in the background so it doesn&apos;t slow down blog publishing.</p>
          <p>• <strong>Professional Templates:</strong> All notifications use responsive, branded email templates with unsubscribe links.</p>
        </div>
      </motion.div>
    </motion.div>
  )
} 