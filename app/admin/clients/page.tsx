"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus } from 'lucide-react'
import { getClients } from '@/lib/actions'
import { ClientsList } from './components/ClientsList'
import { CreateClientModal } from './components/CreateClientModal'
import DeleteClientModal from './components/DeleteClientModal'
import { Button } from '@/components/ui/button'

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
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

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

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    loadClients() // Refresh the clients list after deletion
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
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{clients.length} total clients</span>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Client</span>
          </Button>
        </div>
      </div>

      {/* Clients List */}
      <ClientsList 
        clients={clients} 
        onClientSelect={handleClientSelect}
        onDeleteClient={handleDeleteClient}
      />

      {/* Create Client Modal */}
      {showCreateModal && (
        <CreateClientModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            loadClients() // Refresh the clients list
          }}
        />
      )}

      {/* Delete Client Modal */}
      {showDeleteModal && clientToDelete && (
        <DeleteClientModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setClientToDelete(null)
          }}
          client={{
            id: clientToDelete.id,
            fullName: clientToDelete.fullName,
            email: clientToDelete.email,
            documentsCount: clientToDelete.documents.length,
            estimatorsCount: clientToDelete.estimators.length
          }}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  )
}