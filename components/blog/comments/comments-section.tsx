"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  RefreshCw, 
  AlertCircle,
  Users,
  TrendingUp,
  Clock,
  Flame
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CommentItem } from "./comment-item"
import { CommentForm } from "./comment-form"
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

interface CommentsSectionProps {
  blogSlug: string
  commentsEnabled: boolean
  initialCommentsCount?: number
  currentUserEmail?: string
  className?: string
}

type SortOption = "top" | "newest" | "oldest" | "controversial"

const sortOptions = [
  { value: "top", label: "Top", icon: TrendingUp, description: "Best comments first" },
  { value: "newest", label: "Newest", icon: Clock, description: "Most recent first" },
  { value: "oldest", label: "Oldest", icon: Clock, description: "Oldest first" },
  { value: "controversial", label: "Controversial", icon: Flame, description: "Most debated" },
]

export function CommentsSection({
  blogSlug,
  commentsEnabled,
  initialCommentsCount = 0,
  currentUserEmail,
  className,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("top")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalComments, setTotalComments] = useState(initialCommentsCount)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch comments
  const fetchComments = useCallback(async (page = 1, sort = sortBy, append = false) => {
    try {
      const response = await fetch(
        `/api/blog/${blogSlug}/comments?page=${page}&sort=${sort}&limit=20`
      )
      
      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }

      const data = await response.json()
      
      if (append) {
        setComments(prev => [...prev, ...data.comments])
      } else {
        setComments(data.comments)
      }
      
      setTotalPages(data.pagination.totalPages)
      setTotalComments(data.pagination.totalCount)
      setCurrentPage(page)
      setError(null)
    } catch (error) {
      console.error("Error fetching comments:", error)
      setError("Failed to load comments")
    }
  }, [blogSlug, sortBy])

  // Initial load
  useEffect(() => {
    if (commentsEnabled) {
      setIsLoading(true)
      fetchComments().finally(() => setIsLoading(false))
    }
  }, [fetchComments, commentsEnabled])

  // Handle sort change
  const handleSortChange = async (newSort: SortOption) => {
    setSortBy(newSort)
    setIsLoading(true)
    setCurrentPage(1)
    await fetchComments(1, newSort)
    setIsLoading(false)
  }

  // Load more comments
  const loadMoreComments = async () => {
    if (currentPage >= totalPages || isLoadingMore) return
    
    setIsLoadingMore(true)
    const nextPage = currentPage + 1
    await fetchComments(nextPage, sortBy, true)
    setIsLoadingMore(false)
  }

  // Refresh comments
  const refreshComments = async () => {
    setIsRefreshing(true)
    setCurrentPage(1)
    await fetchComments(1, sortBy)
    setIsRefreshing(false)
  }

  // Handle voting
  const handleVote = async (commentId: string, type: 'UPVOTE' | 'DOWNVOTE') => {
    try {
      const response = await fetch(`/api/blog/comments/${commentId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type, 
          voterEmail: currentUserEmail 
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to vote")
      }

      const updatedComment = await response.json()
      
      // Update the comment in the local state
      const updateCommentInTree = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              score: updatedComment.score,
              upvotes: updatedComment.upvotes,
              downvotes: updatedComment.downvotes,
              userVote: updatedComment.userVote,
            }
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentInTree(comment.replies)
            }
          }
          return comment
        })
      }

      setComments(updateCommentInTree)
    } catch (error) {
      console.error("Failed to vote:", error)
      throw error
    }
  }

  // Handle new comment
  const handleNewComment = async (content: string) => {
    try {
      const response = await fetch(`/api/blog/${blogSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create comment")
      }

      const newComment = await response.json()
      
      // Add new comment to the top
      setComments(prev => [newComment, ...prev])
      setTotalComments(prev => prev + 1)
    } catch (error) {
      console.error("Failed to create comment:", error)
      throw error
    }
  }

  // Handle reply
  const handleReply = async (parentId: string, content: string) => {
    try {
      const response = await fetch(`/api/blog/${blogSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          parentId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create reply")
      }

      const newReply = await response.json()
      
      // Add reply to the appropriate parent comment
      const addReplyToTree = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            }
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToTree(comment.replies)
            }
          }
          return comment
        })
      }

      setComments(addReplyToTree)
      setTotalComments(prev => prev + 1)
    } catch (error) {
      console.error("Failed to create reply:", error)
      throw error
    }
  }

  // Handle report
  const handleReport = async (commentId: string, reason: string, details?: string) => {
    try {
      const response = await fetch(`/api/blog/comments/${commentId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          details,
          reporterEmail: currentUserEmail,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to report comment")
      }
      
      // Could show a success message here
    } catch (error) {
      console.error("Failed to report comment:", error)
      throw error
    }
  }

  if (!commentsEnabled) {
    return (
      <div className={cn("py-8", className)}>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Comments Disabled
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comments are currently disabled for this post.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("py-8", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <span>
                Comments
                {totalComments > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {totalComments}
                  </Badge>
                )}
              </span>
            </CardTitle>
            
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              {/* Refresh button */}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshComments}
                disabled={isRefreshing || isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* New comment form */}
          <div>
            <CommentForm
              onSubmit={handleNewComment}
              placeholder="Share your thoughts about this article..."
            />
          </div>

          {/* Error state */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-gray-600 dark:text-gray-400">Loading comments...</span>
              </div>
            </div>
          )}

          {/* Comments list */}
          {!isLoading && (
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No comments yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CommentItem
                        comment={comment}
                        blogSlug={blogSlug}
                        currentUserEmail={currentUserEmail}
                        onVote={handleVote}
                        onReply={handleReply}
                        onReport={handleReport}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {/* Load more button */}
              {currentPage < totalPages && (
                <div className="flex justify-center pt-6">
                  <Button
                    variant="outline"
                    onClick={loadMoreComments}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2"
                  >
                    {isLoadingMore ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                    {isLoadingMore ? "Loading..." : `Load More Comments (${totalPages - currentPage} pages)`}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 