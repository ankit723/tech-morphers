"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { getClients } from '@/lib/actions'
import { ClientsList } from './components/ClientsList'

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

export default function AdminClients() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const data = await getClients()
      setClients(data as Client[])
    } catch (error) {
      console.error('Failed to load clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClientSelect = (client: Client) => {
    router.push(`/admin/clients/${client.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Client Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage client accounts and projects
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{clients.length} total clients</span>
        </div>
      </div>

      {/* Clients List */}
      <ClientsList 
        clients={clients} 
        onClientSelect={handleClientSelect} 
      />
    </div>
  )
}