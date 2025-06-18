"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  onCancel?: () => void
  placeholder?: string
  className?: string
  isReply?: boolean
}

export function CommentForm({
  onSubmit,
  onCancel,
  placeholder = "Share your thoughts...",
  className,
  isReply = false,
}: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!content.trim()) {
      newErrors.content = "Comment content is required"
    } else if (content.length > 5000) {
      newErrors.content = "Comment must be less than 5000 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(content.trim())
      
      // Reset form
      setContent("")
      setErrors({})
    } catch {
      setErrors({ submit: "Failed to submit comment. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setContent("")
    setErrors({})
    onCancel?.()
  }

  const characterCount = content.length
  const isNearLimit = characterCount > 4500
  const isOverLimit = characterCount > 5000

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Comment content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">
                {isReply ? "Reply" : "Comment"} (Anonymous)
              </Label>
              <div className="relative">
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={placeholder}
                  className={cn(
                    "min-h-[120px] resize-vertical",
                    errors.content && "border-red-500 focus:border-red-500",
                    isOverLimit && "border-red-500"
                  )}
                  disabled={isSubmitting}
                />
                
                {/* Character count */}
                <div className={cn(
                  "absolute bottom-2 right-2 text-xs",
                  isOverLimit ? "text-red-500" : 
                  isNearLimit ? "text-yellow-500" : 
                  "text-gray-400"
                )}>
                  {characterCount}/5000
                </div>
              </div>
              
              {errors.content && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.content}
                </p>
              )}
            </div>

            {/* Anonymous notice */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-medium">Anonymous commenting:</span> Your comment will be posted anonymously. 
                No personal information is collected or stored.
              </p>
            </div>

            {/* Submit error */}
            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>Comments are moderated and may take a moment to appear.</p>
              </div>
              
              <div className="flex items-center gap-3">
                {onCancel && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                )}
                
                <Button
                  type="submit"
                  disabled={isSubmitting || isOverLimit || !content.trim()}
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
                  {isSubmitting ? "Submitting..." : isReply ? "Reply" : "Post Comment"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
} 