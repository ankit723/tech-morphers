"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ClientCard } from './ClientCard'

type ClientDocument = {
  id: string
  title: string
  type: string
  uploadedAt: Date
  fileUrl: string
  fileName: string
  fileSize: number
  uploadedBy: string
  requiresSignature: boolean
  isSigned: boolean
  signedAt?: Date | null
  invoiceNumber?: string | null
  invoiceAmount?: number | null
  currency?: string | null
  dueDate?: Date | null
  paymentStatus?: string | null
  paymentProof?: string | null
  verifiedAt?: Date | null
  verifiedBy?: string | null
  paidAt?: Date | null
}

type ClientEstimator = {
  id: string
  projectType: string | null
  fullName: string
  email: string
  phone?: string
  companyName?: string
  projectPurpose?: string
  budgetRange?: string
  deliveryTimeline?: string
  createdAt: Date
  customRequests?: string
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
  documents: ClientDocument[]
  estimators: ClientEstimator[]
}

interface ClientsListProps {
  clients: Client[]
  onClientSelect: (client: Client) => void
}

export function ClientsList({ clients, onClientSelect }: ClientsListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.companyName && client.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search clients by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results count */}
      {searchTerm && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      )}

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No clients found' : 'No clients yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm 
              ? `No clients match "${searchTerm}". Try adjusting your search.`
              : 'Clients will appear here once they are added to the system.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <ClientCard
              key={client.id}
              client={client}
              index={index}
              onClientSelect={onClientSelect}
            />
          ))}
        </div>
      )}
    </>
  )
} 