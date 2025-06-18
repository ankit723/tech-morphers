import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate read time from content (client-side utility)
export function calculateReadTime(content: any): number {
  let wordCount = 0
  
  if (typeof content === 'string') {
    wordCount = content.split(/\s+/).length
  } else if (Array.isArray(content)) {
    content.forEach((block: any) => {
      if (block.type === 'paragraph' || block.type === 'heading') {
        wordCount += block.children?.reduce((acc: number, child: any) => {
          return acc + (child.text?.split(/\s+/).length || 0)
        }, 0) || 0
      } else if (block.type === 'code') {
        // Count code blocks as fewer words for reading time
        wordCount += Math.ceil((block.code?.split(/\s+/).length || 0) / 3)
      }
    })
  }

  // Average reading speed is 200-250 words per minute
  return Math.max(1, Math.ceil(wordCount / 225))
}

// Generate slug from title (client-side utility)
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
