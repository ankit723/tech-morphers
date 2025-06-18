"use client"

import { CommentItem } from "./comment-item"

interface CommentPreviewProps {
  comment: any
  blogSlug: string
}

export function CommentPreview({ comment, blogSlug }: CommentPreviewProps) {
  // Mock handlers for preview (no functionality)
  const mockVote = async () => {
    // No functionality in preview
  }

  const mockReply = async () => {
    // No functionality in preview
  }

  const mockReport = async () => {
    // No functionality in preview
  }

  return (
    <CommentItem
      comment={comment}
      blogSlug={blogSlug}
      onVote={mockVote}
      onReply={mockReply}
      onReport={mockReport}
      level={0}
      maxNestingLevel={2} // Limit nesting in preview
    />
  )
} 