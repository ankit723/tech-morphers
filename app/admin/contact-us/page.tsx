"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Package, 
  Calendar,
  Mail,
  Phone,
  Building2,
  Search,
  Download,
  Eye,
  Trash2,
  SortAsc,
  SortDesc,
  Loader2
} from "lucide-react"
import { getContactUsEntries } from "@/lib/actions"
import { Button } from "@/components/ui/button"

type ContactEntry = {
  id: string
  name: string
  email: string
  phone: string
  companyName: string | null
  selectedPackage: "STARTER" | "GROWTH" | "PRO" | "ENTERPRISE"
  message: string
  createdAt: Date
  updatedAt: Date
}

export default function ContactUsAdmin() {
  const [entries, setEntries] = useState<ContactEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [packageFilter, setPackageFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<"createdAt" | "name" | "package">("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedEntry, setSelectedEntry] = useState<ContactEntry | null>(null)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const data = await getContactUsEntries()
      setEntries(data as ContactEntry[])
    } catch (error) {
      console.error("Failed to load entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (entry.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      const matchesPackage = packageFilter === "all" || entry.selectedPackage === packageFilter
      return matchesSearch && matchesPackage
    })
    .sort((a, b) => {
      let aVal: string | Date
      let bVal: string | Date
      
      switch (sortField) {
        case "name":
          aVal = a.name
          bVal = b.name
          break
        case "package":
          aVal = a.selectedPackage
          bVal = b.selectedPackage
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

  const packageColors = {
    STARTER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    GROWTH: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    PRO: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    ENTERPRISE: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

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
              <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
              Contact Us Inquiries
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and review package inquiry submissions from your contact form.
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Total Inquiries: {entries.length}
              </span>
            </div>
          </div>
          {Object.entries(
            entries.reduce((acc, entry) => {
              acc[entry.selectedPackage] = (acc[entry.selectedPackage] || 0) + 1
              return acc
            }, {} as Record<string, number>)
          ).map(([pkg, count]) => (
            <div key={pkg} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {pkg}: {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Package Filter */}
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Packages</option>
            <option value="STARTER">Starter</option>
            <option value="GROWTH">Growth</option>
            <option value="PRO">Pro</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>

          {/* Sort Field */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as "createdAt" | "name" | "package")}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="package">Sort by Package</option>
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
                  Package
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
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {entry.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {entry.email}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {entry.phone}
                          </div>
                          {entry.companyName && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Building2 className="w-3 h-3 mr-1" />
                              {entry.companyName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${packageColors[entry.selectedPackage]}`}>
                      {entry.selectedPackage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
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
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Details
              </h3>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <p className="text-gray-900 dark:text-white">{selectedEntry.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="text-gray-900 dark:text-white">{selectedEntry.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <p className="text-gray-900 dark:text-white">{selectedEntry.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                  <p className="text-gray-900 dark:text-white">{selectedEntry.companyName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Package</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${packageColors[selectedEntry.selectedPackage]}`}>
                    {selectedEntry.selectedPackage}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Submitted</label>
                  <p className="text-gray-900 dark:text-white">{new Date(selectedEntry.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <p className="text-gray-900 dark:text-white mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {selectedEntry.message}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
} 