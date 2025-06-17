"use client"
import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Calculator, 
  Phone,
  TrendingUp,
  Clock,
  Mail,
  Star,
  Loader2,
  Contact
} from "lucide-react"
import { getDashboardStats, type DashboardStats } from "@/lib/actions"
import { useEffect } from "react"
import { useState } from "react"

export default function AdminDashboard() {
  // Fetch real data using server actions
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    getDashboardStats().then((stats) => {
      setStats(stats)
    })
  }, [])

  if (!stats) {
    return <div className="flex justify-center items-center h-[95vh]"><Loader2 className="w-10 h-10 animate-spin text-blue-700" /></div>
  }

  const statCards = [
    {
      title: "Contact Inquiries",
      value: stats.contactInquiries.toString(),
      change: stats.monthlyTrends.contactUs.change >= 0 
        ? `+${stats.monthlyTrends.contactUs.change.toFixed(1)}%`
        : `${stats.monthlyTrends.contactUs.change.toFixed(1)}%`,
      changeType: stats.monthlyTrends.contactUs.change >= 0 ? "increase" as const : "decrease" as const,
      icon: MessageSquare,
      color: "blue" as const,
      description: "Package inquiries from ContactUs form",
      currentMonth: stats.monthlyTrends.contactUs.current
    },
    {
      title: "Project Estimates",
      value: stats.estimatorRequests.toString(),
      change: stats.monthlyTrends.estimator.change >= 0 
        ? `+${stats.monthlyTrends.estimator.change.toFixed(1)}%`
        : `${stats.monthlyTrends.estimator.change.toFixed(1)}%`,
      changeType: stats.monthlyTrends.estimator.change >= 0 ? "increase" as const : "decrease" as const,
      icon: Calculator,
      color: "green" as const,
      description: "Detailed project estimate requests",
      currentMonth: stats.monthlyTrends.estimator.current
    },
    {
      title: "Get Started Forms",
      value: stats.getStartedForms.toString(),
      change: stats.monthlyTrends.getStarted.change >= 0 
        ? `+${stats.monthlyTrends.getStarted.change.toFixed(1)}%`
        : `${stats.monthlyTrends.getStarted.change.toFixed(1)}%`,
      changeType: stats.monthlyTrends.getStarted.change >= 0 ? "increase" as const : "decrease" as const,
      icon: Star,
      color: "purple" as const,
      description: "Service inquiry submissions",
      currentMonth: stats.monthlyTrends.getStarted.current
    },
    {
      title: "Talk To Us",
      value: stats.talkToUsForms.toString(),
      change: stats.monthlyTrends.talkToUs.change >= 0 
        ? `+${stats.monthlyTrends.talkToUs.change.toFixed(1)}%`
        : `${stats.monthlyTrends.talkToUs.change.toFixed(1)}%`,
      changeType: stats.monthlyTrends.talkToUs.change >= 0 ? "increase" as const : "decrease" as const,
      icon: Phone,
      color: "orange" as const,
      description: "General consultation requests",
      currentMonth: stats.monthlyTrends.talkToUs.current
    },
    {
      title: "Let's Talk",
      value: stats.letsTalkSubscriptions.toString(),
      change: stats.monthlyTrends.letsTalk.change >= 0 
        ? `+${stats.monthlyTrends.letsTalk.change.toFixed(1)}%`
        : `${stats.monthlyTrends.letsTalk.change.toFixed(1)}%`,
      changeType: stats.monthlyTrends.letsTalk.change >= 0 ? "increase" as const : "decrease" as const,
      icon: Mail,
      color: "cyan" as const,
      description: "Newsletter email subscriptions",
      currentMonth: stats.monthlyTrends.letsTalk.current
    },
    {
      title: "Contact Page",
      value: stats.contactPageForms.toString(),
      change: stats.monthlyTrends.contactPage.change >= 0 
        ? `+${stats.monthlyTrends.contactPage.change.toFixed(1)}%`
        : `${stats.monthlyTrends.contactPage.change.toFixed(1)}%`,
      changeType: stats.monthlyTrends.contactPage.change >= 0 ? "increase" as const : "decrease" as const,
      icon: Contact,
      color: "indigo" as const,
      description: "General contact page inquiries",
      currentMonth: stats.monthlyTrends.contactPage.current
    }
  ]

  type StatColor = "blue" | "green" | "purple" | "orange" | "cyan" | "indigo"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor leads, inquiries, and business metrics from your Tech Morphers platform.
        </p>
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Total Leads: {stats.totalLeads}
              </span>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              This Month: {statCards.reduce((acc, card) => acc + card.currentMonth, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses: Record<StatColor, string> = {
            blue: "from-blue-500 to-blue-600",
            green: "from-green-500 to-green-600",
            purple: "from-purple-500 to-purple-600",
            orange: "from-orange-500 to-orange-600",
            cyan: "from-cyan-500 to-cyan-600",
            indigo: "from-indigo-500 to-indigo-600"
          }
          
          const TrendIcon = stat.changeType === "increase" ? TrendingUp : TrendingUp
          const trendColor = stat.changeType === "increase" ? "text-green-500" : "text-red-500"
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center mb-2">
                    <TrendIcon className={`w-4 h-4 ${trendColor} mr-1`} />
                    <span className={`text-sm font-medium ${trendColor.replace('text-', 'text-').replace('500', '600 dark:text-').replace('-600', '-400')}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      vs last month
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {stat.description}
                  </p>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    This month: <span className="font-semibold">{stat.currentMonth}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[stat.color]} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity) => {
                const typeConfig = {
                  contact: { icon: MessageSquare, color: 'text-blue-500', label: 'Contact Inquiry' },
                  estimator: { icon: Calculator, color: 'text-green-500', label: 'Project Estimate' },
                  getstarted: { icon: Star, color: 'text-purple-500', label: 'Get Started' },
                  talktous: { icon: Phone, color: 'text-orange-500', label: 'Talk To Us' },
                  letstalk: { icon: Mail, color: 'text-cyan-500', label: 'Let\'s Talk' },
                  contactpage: { icon: Contact, color: 'text-indigo-500', label: 'Contact Page' }
                }
                
                const config = typeConfig[activity.type]
                const StatusIcon = config.icon
                
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 ${config.color.replace('text-', 'border-')} flex items-center justify-center`}>
                        <StatusIcon className={`w-4 h-4 ${config.color}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${config.color.replace('text-', 'bg-').replace('500', '100')} ${config.color} font-medium`}>
                          {config.label}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.status === 'new' ? 'bg-red-100 text-red-600' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {activity.name}
                      </p>
                      {activity.details && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {activity.details}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Package Distribution & Top Services */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Package Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Package Distribution
            </h3>
            <div className="space-y-3">
              {Object.keys(stats.packageDistribution).length > 0 ? (
                Object.entries(stats.packageDistribution).map(([pkg, count]) => {
                  const total = Object.values(stats.packageDistribution).reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? (count / total) * 100 : 0
                  
                  const packageColors = {
                    STARTER: 'bg-blue-500',
                    GROWTH: 'bg-green-500',
                    PRO: 'bg-purple-500',
                    ENTERPRISE: 'bg-orange-500'
                  }
                  
                  return (
                    <div key={pkg} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${packageColors[pkg as keyof typeof packageColors]}`}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{pkg}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900 dark:text-white">{count}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No package data available
                </p>
              )}
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Services Requested
            </h3>
            <div className="space-y-3">
              {stats.topServices.length > 0 ? (
                stats.topServices.map((service, index) => (
                  <div key={service.service} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {index + 1}. {service.service}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      {service.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No service data available
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: "View Contacts", icon: MessageSquare, href: "/admin/contact-us", color: "blue" },
            { title: "Review Estimates", icon: Calculator, href: "/admin/estimators", color: "green" },
            { title: "Get Started Forms", icon: Star, href: "/admin/get-started", color: "purple" },
            { title: "Talk To Us", icon: Phone, href: "/admin/talk-to-us", color: "orange" },
            { title: "Let's Talk", icon: Mail, href: "/admin/lets-talk", color: "cyan" },
            { title: "Contact Page", icon: Contact, href: "/admin/contact-page", color: "indigo" }
          ].map((action) => {
            const Icon = action.icon
            const colorClasses: Record<string, string> = {
              blue: "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400",
              green: "hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400",
              purple: "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400",
              orange: "hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400",
              cyan: "hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400",
              indigo: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
            }
            
            return (
              <motion.button
                key={action.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors ${colorClasses[action.color]}`}
                onClick={() => window.location.href = action.href}
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.title}
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}