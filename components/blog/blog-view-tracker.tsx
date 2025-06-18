"use client"

import { useEffect } from 'react'

interface BlogViewTrackerProps {
  blogId: string
  blogSlug: string
}

export function BlogViewTracker({ blogId, blogSlug }: BlogViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      // Check if we already tracked this view in this session
      const sessionKey = `blog_view_${blogId}`
      const hasViewed = sessionStorage.getItem(sessionKey)
      
      if (hasViewed) {
        return // Already tracked in this session
      }

      try {
        // Call API to increment view
        const response = await fetch('/api/blog/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ blogId, blogSlug }),
        })

        if (response.ok) {
          // Mark as viewed in this session
          sessionStorage.setItem(sessionKey, 'true')
        }
      } catch (error) {
        console.error('Failed to track blog view:', error)
      }
    }

    // Track view after a small delay to ensure it's a real visit
    const timer = setTimeout(trackView, 2000) // 2 second delay

    return () => clearTimeout(timer)
  }, [blogId, blogSlug])

  return null // This component doesn't render anything
} 