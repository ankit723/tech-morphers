export type ClientDocument = {
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

export type ClientEstimator = {
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

export type Client = {
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