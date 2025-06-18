"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronUp, 
  ChevronDown, 
  Reply, 
  Share2, 
  Flag, 
  MoreHorizontal,
  Pin,
  MessageSquare,
  User,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CommentForm } from "./comment-form"
import { ReportDialog } from "./report-dialog"
import { cn } from "@/lib/utils"

interface Comment {
  id: string
  content: string
  createdAt: string
  editedAt?: string | null
  depth: number
  score: number
  upvotes: number
  downvotes: number
  replies?: Comment[]
  userVote?: 'UPVOTE' | 'DOWNVOTE' | null
  isPinned?: boolean
}

interface CommentItemProps {
  comment: Comment
  blogSlug: string
  currentUserEmail?: string
  onVote: (commentId: string, type: 'UPVOTE' | 'DOWNVOTE') => Promise<void>
  onReply: (parentId: string, content: string) => Promise<void>
  onReport: (commentId: string, reason: string, details?: string) => Promise<void>
  level?: number
  maxNestingLevel?: number
}

export function CommentItem({
  comment,
  blogSlug,
  currentUserEmail,
  onVote,
  onReply,
  onReport,
  level = 0,
  maxNestingLevel = 5,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isVoting, setIsVoting] = useState<'UPVOTE' | 'DOWNVOTE' | null>(null)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const handleVote = async (type: 'UPVOTE' | 'DOWNVOTE') => {
    if (isVoting) return
    
    setIsVoting(type)
    try {
      await onVote(comment.id, type)
    } catch (error) {
      console.error("Failed to vote:", error)
    } finally {
      setIsVoting(null)
    }
  }

  const handleReplySubmit = async (content: string) => {
    try {
      await onReply(comment.id, content)
      setIsReplying(false)
    } catch (error) {
      console.error("Failed to reply:", error)
      throw error
    }
  }

  const handleReportSubmit = async (reason: string, details?: string) => {
    try {
      await onReport(comment.id, reason, details)
    } catch (error) {
      console.error("Failed to report:", error)
      throw error
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/blog/${blogSlug}/comments#comment-${comment.id}`
    if (navigator.share) {
      navigator.share({
        title: "Comment",
        url
      })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
    }
  }

  const hasReplies = comment.replies && comment.replies.length > 0
  const canReply = level < maxNestingLevel
  const indentLevel = Math.min(level, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      id={`comment-${comment.id}`}
      className={cn(
        "relative",
        level > 0 && "border-l-2 border-gray-200 dark:border-gray-700",
        indentLevel > 0 && `ml-${Math.min(indentLevel * 4, 12)}`,
        comment.isPinned && "bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4"
      )}
    >
      {/* Comment Content */}
      <div className={cn(
        "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4",
        level > 0 && "ml-4"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Anonymous Avatar */}
            <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600">
              <AvatarFallback className="bg-transparent text-white font-medium">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Anonymous
              </span>
              
              {comment.isPinned && (
                <Badge variant="secondary" className="text-xs">
                  <Pin className="w-3 h-3 mr-1" />
                  Pinned
                </Badge>
              )}
              
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {getTimeAgo(comment.createdAt)}
                {comment.editedAt && " (edited)"}
              </span>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsReportDialogOpen(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Flag className="w-4 h-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Comment Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Voting */}
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('UPVOTE')}
                disabled={isVoting === 'UPVOTE'}
                className={cn(
                  "h-7 px-2",
                  comment.userVote === 'UPVOTE' && "text-green-600 bg-green-50 dark:bg-green-900/20"
                )}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              
              <span className={cn(
                "px-2 text-sm font-medium min-w-[2rem] text-center",
                comment.score > 0 ? "text-green-600" : 
                comment.score < 0 ? "text-red-600" : 
                "text-gray-600 dark:text-gray-400"
              )}>
                {comment.score}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('DOWNVOTE')}
                disabled={isVoting === 'DOWNVOTE'}
                className={cn(
                  "h-7 px-2",
                  comment.userVote === 'DOWNVOTE' && "text-red-600 bg-red-50 dark:bg-red-900/20"
                )}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Reply Button */}
            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-2"
              >
                <Reply className="w-4 h-4" />
                Reply
              </Button>
            )}
          </div>

          {/* Collapse/Expand Button */}
          {hasReplies && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">
                {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}
              </span>
            </Button>
          )}
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <CommentForm
                onSubmit={handleReplySubmit}
                onCancel={() => setIsReplying(false)}
                placeholder="Write a reply..."
                isReply
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nested Replies */}
      <AnimatePresence>
        {hasReplies && !isCollapsed && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 space-y-4"
          >
            {comment.replies?.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                blogSlug={blogSlug}
                currentUserEmail={currentUserEmail}
                onVote={onVote}
                onReply={onReply}
                onReport={onReport}
                level={level + 1}
                maxNestingLevel={maxNestingLevel}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Dialog */}
      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        onSubmit={handleReportSubmit}
        commentAuthor="Anonymous"
      />
    </motion.div>
  )
} 