"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flag, AlertTriangle, X, Send } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface ReportDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string, details?: string) => Promise<void>
  commentAuthor: string
}

const reportReasons = [
  {
    value: "SPAM",
    label: "Spam",
    description: "Repetitive, promotional, or irrelevant content"
  },
  {
    value: "HARASSMENT",
    label: "Harassment",
    description: "Bullying, threats, or personal attacks"
  },
  {
    value: "HATE_SPEECH",
    label: "Hate Speech",
    description: "Content that attacks or discriminates against groups"
  },
  {
    value: "INAPPROPRIATE_CONTENT",
    label: "Inappropriate Content",
    description: "Sexually explicit, violent, or disturbing content"
  },
  {
    value: "OFF_TOPIC",
    label: "Off Topic",
    description: "Content not related to the discussion"
  },
  {
    value: "COPYRIGHT",
    label: "Copyright Violation",
    description: "Unauthorized use of copyrighted material"
  },
  {
    value: "OTHER",
    label: "Other",
    description: "Something else not covered above"
  }
]

export function ReportDialog({ isOpen, onClose, onSubmit, commentAuthor }: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedReason) {
      setError("Please select a reason for reporting")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await onSubmit(selectedReason, details.trim() || undefined)
      handleClose()
    } catch {
      setError("Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedReason("")
    setDetails("")
    setError("")
    setIsSubmitting(false)
    onClose()
  }

  const selectedReasonData = reportReasons.find(r => r.value === selectedReason)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            Report Comment
          </DialogTitle>
          <DialogDescription>
            Report a comment by <span className="font-medium">{commentAuthor}</span> that violates our community guidelines.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Reason for reporting *</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              <div className="space-y-3">
                {reportReasons.map((reason) => (
                  <motion.div
                    key={reason.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reportReasons.indexOf(reason) * 0.05 }}
                  >
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem 
                        value={reason.value} 
                        id={reason.value}
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 leading-none flex-1">
                        <Label
                          htmlFor={reason.value}
                          className={cn(
                            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                            selectedReason === reason.value && "text-red-600 dark:text-red-400"
                          )}
                        >
                          {reason.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Additional details */}
          <AnimatePresence>
            {selectedReason && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="details" className="text-sm font-medium">
                  Additional details {selectedReason === "OTHER" ? "*" : "(optional)"}
                </Label>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    selectedReason === "OTHER" 
                      ? "Please describe the issue..."
                      : "Provide more context about why you're reporting this comment..."
                  }
                  className="min-h-[80px] resize-none"
                  maxLength={1000}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {selectedReasonData && (
                      <span className="text-red-600 dark:text-red-400">
                        Reporting for: {selectedReasonData.label}
                      </span>
                    )}
                  </span>
                  <span>{details.length}/1000</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Reports are reviewed by our moderation team. False reports may result in action against your account.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={
                isSubmitting || 
                !selectedReason || 
                (selectedReason === "OTHER" && !details.trim())
              }
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 