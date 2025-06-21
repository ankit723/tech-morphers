"use client"

import { motion } from 'framer-motion'
import { FileText, Download, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type ClientDocument = {
  id: string
  title: string
  type: string
  uploadedAt: Date
  fileUrl: string
  requiresSignature: boolean
  isSigned: boolean
  invoiceNumber?: string | null
  paymentStatus?: string | null
  project?: {
    id: string
    projectType: string
    projectPurpose: string
  } | null
}

interface DocumentsListProps {
  documents: ClientDocument[]
  projectName?: string
  onBack?: () => void
  onRefresh: () => void
}

export function DocumentsList({ documents, projectName, onBack }: DocumentsListProps) {
  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Documents Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {projectName ? `No documents for ${projectName} yet.` : 'No documents have been uploaded yet.'}
          </p>
          {onBack && (
            <Button onClick={onBack} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {onBack && (
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {documents.map((document) => (
          <motion.div key={document.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{document.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Badge variant="outline">{document.type}</Badge>
                        <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                        {document.invoiceNumber && <span>#{document.invoiceNumber}</span>}
                        {document.project && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {document.project.projectType}
                          </Badge>
                        )}
                      </div>
                      {document.project && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                          Project: {document.project.projectPurpose || document.project.projectType}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {document.requiresSignature && (
                      <Badge variant={document.isSigned ? "default" : "secondary"}>
                        {document.isSigned ? 'Signed' : 'Signature Required'}
                      </Badge>
                    )}
                    {document.paymentStatus && (
                      <Badge variant="outline">{document.paymentStatus}</Badge>
                    )}
                    <Button size="sm" variant="outline" onClick={() => window.open(document.fileUrl, '_blank')}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 