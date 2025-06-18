"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareButtonProps {
  title: string
  excerpt: string
  className?: string
}

export function ShareButton({ title, excerpt, className }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title,
          text: excerpt,
          url: window.location.href
        })
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href)
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className={`flex items-center gap-2 ${className || ""}`}
    >
      <Share2 className="w-4 h-4" />
      Share
    </Button>
  )
} 