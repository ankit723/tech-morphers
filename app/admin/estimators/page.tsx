"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Calculator, 
  Calendar,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Clock,
  Search,
  Download,
  Eye,
  Trash2,
  SortAsc,
  SortDesc,
  Loader2,
  Briefcase,
  Palette,
  CheckCircle,
  FileText,
  UserCheck,
  Users
} from "lucide-react"
import { getEstimatorEntries } from "@/lib/actions"
import { Button } from "@/components/ui/button"

type EstimatorEntry = {
  id: string
  projectType: string | null
  projectPurpose: string | null
  targetAudience: string | null
  features: string[]
  designPreference: string | null
  needsCustomBranding: boolean | null
  deliveryTimeline: string | null
  budgetRange: string | null
  addons: string[]
  customRequests: string | null
  fullName: string
  email: string
  phone: string | null
  companyName: string | null
  userRole: string | null
  pdfUrl: string | null
  isConverted: boolean
  convertedAt: Date | null
  clientId: string | null
  createdAt: Date
  updatedAt: Date
}

export default function EstimatorsAdmin() {
  const [entries, setEntries] = useState<EstimatorEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>("all")
  const [budgetFilter, setBudgetFilter] = useState<string>("all")
  const [timelineFilter, setTimelineFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<"createdAt" | "fullName" | "projectType">("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedEntry, setSelectedEntry] = useState<EstimatorEntry | null>(null)
  const [convertingId, setConvertingId] = useState<string | null>(null)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const data = await getEstimatorEntries()
      setEntries(data as EstimatorEntry[])
    } catch (error) {
      console.error("Failed to load entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConvertToClient = async (estimatorId: string) => {
    if (convertingId) return
    
    setConvertingId(estimatorId)
    
    try {
      const response = await fetch('/api/admin/convert-to-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estimatorId,
          adminEmail: 'varanasiartist.omg@gmail.com'
        }),
      })

      const result = await response.json()

      if (result.success) {
        setEntries(prev => prev.map(entry => 
          entry.id === estimatorId 
            ? { ...entry, isConverted: true, convertedAt: new Date(), clientId: result.client.id }
            : entry
        ))

        alert(`Successfully converted to client! ${result.isNewClient ? `System password: ${result.systemPassword}` : 'Linked to existing client.'}`)
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error converting to client:', error)
      alert('Error converting to client. Please try again.')
    } finally {
      setConvertingId(null)
    }
  }

  const uniqueProjectTypes = [...new Set(entries.map(entry => entry.projectType).filter(Boolean))]
  const uniqueBudgets = [...new Set(entries.map(entry => entry.budgetRange).filter(Boolean))]
  const uniqueTimelines = [...new Set(entries.map(entry => entry.deliveryTimeline).filter(Boolean))]

  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (entry.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                           (entry.projectType?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      const matchesProjectType = projectTypeFilter === "all" || entry.projectType === projectTypeFilter
      const matchesBudget = budgetFilter === "all" || entry.budgetRange === budgetFilter
      const matchesTimeline = timelineFilter === "all" || entry.deliveryTimeline === timelineFilter
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "converted" && entry.isConverted) ||
                           (statusFilter === "not-converted" && !entry.isConverted)
      return matchesSearch && matchesProjectType && matchesBudget && matchesTimeline && matchesStatus
    })
    .sort((a, b) => {
      let aVal: string | Date
      let bVal: string | Date
      
      switch (sortField) {
        case "fullName":
          aVal = a.fullName
          bVal = b.fullName
          break
        case "projectType":
          aVal = a.projectType || ""
          bVal = b.projectType || ""
          break
        default:
          aVal = new Date(a.createdAt)
          bVal = new Date(b.createdAt)
      }
      
      if (sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  const totalCount = entries.length
  const convertedCount = entries.filter(e => e.isConverted).length
  const conversionRate = totalCount > 0 ? Math.round((convertedCount / totalCount) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Calculator className="w-8 h-8 mr-3 text-green-600" />
              Project Estimator Requests
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and review detailed project estimation requests from potential clients.
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Calculator className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Total Requests: {totalCount}
              </span>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Project Types: {uniqueProjectTypes.length}
              </span>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Calculator className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Conversion Rate: {conversionRate}%
              </span>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                With Budget: {entries.filter(e => e.budgetRange).length}
              </span>
            </div>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-cyan-600 mr-2" />
              <span className="text-sm font-medium text-cyan-800 dark:text-cyan-200">
                Custom Branding: {entries.filter(e => e.needsCustomBranding).length}
              </span>
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                Converted: {convertedCount}/{totalCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Project Type Filter */}
          <select
            value={projectTypeFilter}
            onChange={(e) => setProjectTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Project Types</option>
            {uniqueProjectTypes.map(type => (
              <option key={type} value={type ?? ""}>{type}</option>
            ))}
          </select>

          {/* Budget Filter */}
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Budgets</option>
            {uniqueBudgets.map(budget => (
              <option key={budget} value={budget ?? ""}>{budget}</option>
            ))}
          </select>

          {/* Timeline Filter */}
          <select
            value={timelineFilter}
            onChange={(e) => setTimelineFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Timelines</option>
            {uniqueTimelines.map(timeline => (
              <option key={timeline} value={timeline ?? ""}>{timeline}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="converted">Converted to Client</option>
            <option value="not-converted">Not Converted</option>
          </select>

          {/* Sort Field */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as "createdAt" | "fullName" | "projectType")}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="fullName">Sort by Name</option>
            <option value="projectType">Sort by Project Type</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            <span className="ml-2">{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Project Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Budget & Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredEntries.map((entry) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.fullName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {entry.email}
                      </div>
                      {entry.phone && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {entry.phone}
                        </div>
                      )}
                      {entry.companyName && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          {entry.companyName}
                        </div>
                      )}
                      {entry.userRole && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Role: {entry.userRole}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {entry.projectType && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {entry.projectType}
                        </span>
                      )}
                      {entry.projectPurpose && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Purpose: {entry.projectPurpose}
                        </div>
                      )}
                      {entry.features.length > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Features: {entry.features.length} selected
                        </div>
                      )}
                      {entry.needsCustomBranding && (
                        <div className="flex items-center">
                          <Palette className="w-3 h-3 text-purple-500 mr-1" />
                          <span className="text-xs text-purple-600 dark:text-purple-400">Custom Branding</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {entry.budgetRange && (
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-sm text-gray-900 dark:text-white">{entry.budgetRange}</span>
                        </div>
                      )}
                      {entry.deliveryTimeline && (
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 text-blue-500 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{entry.deliveryTimeline}</span>
                        </div>
                      )}
                      {entry.addons.length > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{entry.addons.length} addon{entry.addons.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {entry.isConverted ? (
                      <div className="space-y-1">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Client
                        </span>
                        {entry.convertedAt && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(entry.convertedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Lead
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(entry.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {entry.pdfUrl && (
                        <button
                          onClick={() => window.open(entry.pdfUrl!, '_blank')}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                      {!entry.isConverted && (
                        <button
                          onClick={() => handleConvertToClient(entry.id)}
                          disabled={convertingId === entry.id}
                          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 disabled:opacity-50"
                          title="Convert to Client"
                        >
                          {convertingId === entry.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <button 
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No estimator requests found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search or filters.' : 'No project estimation requests yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEntry(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Project Estimation Details
                </h3>
                {selectedEntry.isConverted && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Converted to Client
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.phone || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.companyName || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.userRole || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                  Project Details
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Type</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.projectType || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Purpose</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.projectPurpose || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Audience</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.targetAudience || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Design Preference</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.designPreference || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Branding</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedEntry.needsCustomBranding ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features & Requirements */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                  Features & Requirements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Required Features</label>
                    <div className="mt-1">
                      {selectedEntry.features.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedEntry.features.map((feature, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              {feature}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No features specified</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Add-ons</label>
                    <div className="mt-1">
                      {selectedEntry.addons.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedEntry.addons.map((addon, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              {addon}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No add-ons specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline & Budget */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                  Timeline & Budget
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Range</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.budgetRange || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Timeline</label>
                    <p className="text-gray-900 dark:text-white">{selectedEntry.deliveryTimeline || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submitted</label>
                    <p className="text-gray-900 dark:text-white">{new Date(selectedEntry.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Custom Requests */}
              {selectedEntry.customRequests && (
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                    Custom Requests
                  </h4>
                  <p className="text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg whitespace-pre-wrap">
                    {selectedEntry.customRequests}
                  </p>
                </div>
              )}

              {/* PDF Document */}
              {selectedEntry.pdfUrl && (
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                    PDF Document
                  </h4>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-gray-900 dark:text-white">Project Estimate Document</span>
                    </div>
                    <Button
                      onClick={() => window.open(selectedEntry.pdfUrl!, '_blank')}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View PDF</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="lg:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex space-x-3">
                  <Button className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Estimate
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                  {!selectedEntry.isConverted && (
                    <Button 
                      variant="outline"
                      onClick={() => handleConvertToClient(selectedEntry.id)}
                      disabled={convertingId === selectedEntry.id}
                      className="flex-1"
                    >
                      {convertingId === selectedEntry.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <UserCheck className="w-4 h-4 mr-2" />
                      )}
                      Convert to Client
                    </Button>
                  )}
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
} 