"use client"

import { motion } from 'framer-motion'
import { 
  Users, 
  Mail, 
  Phone, 
  FolderOpen,
  FileText,
  Calendar,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

interface ClientCardProps {
  client: Client
  index: number
  onClientSelect: (client: Client) => void
  onDeleteClient: (client: Client) => void
}

export function ClientCard({ client, index, onClientSelect, onDeleteClient }: ClientCardProps) {
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClient(client);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" 
        onClick={() => onClientSelect(client)}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="truncate">{client.fullName}</span>
            </span>
            <div className="flex items-center space-x-2">
              <Badge variant={client.hasChangedPassword ? "default" : "secondary"}>
                {client.hasChangedPassword ? 'Active' : 'New'}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Client
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
          <CardDescription className="truncate">
            {client.companyName || 'Individual Client'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{client.phone}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FolderOpen className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{client.estimators.length} project{client.estimators.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{client.documents.length} document{client.documents.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Since {new Date(client.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 