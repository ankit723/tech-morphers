"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Hash, Twitter, Facebook, Linkedin, Link as LinkIcon, Mail, Clock, Eye, Heart, Calendar } from "lucide-react"
import Link from "next/link"
import { BlogPostWithRelations } from "@/lib/blog-actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BlogPostSidebarProps {
  post: BlogPostWithRelations
}

interface TOCItem {
  id: string
  text: string
  level: number
}

export function BlogPostSidebar({ post }: BlogPostSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const [tableOfContents, setTableOfContents] = useState<TOCItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [shareUrls, setShareUrls] = useState({
    twitter: '',
    facebook: '',
    linkedin: '',
    email: ''
  })

  // Set mounted state to prevent SSR/client mismatch
  useEffect(() => {
    setMounted(true)
    
    // Generate share URLs only on client
    const currentUrl = window.location.href
    setShareUrls({
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this article: ${currentUrl}`)}`
    })
  }, [post.title])

  // Generate table of contents from headings - only on client
  useEffect(() => {
    if (!mounted) return

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const toc: TOCItem[] = []

    headings.forEach((heading, index) => {
      // Only use headings that already have IDs - don't modify DOM after hydration
      let id = heading.id
      if (!id) {
        // If no ID exists, create a unique identifier for React key purposes only
        // But don't assign it to the DOM element to avoid hydration issues
        id = `fallback-${index}-${heading.textContent?.slice(0, 20).replace(/\s+/g, '-').toLowerCase() || 'heading'}`
      }
      
      toc.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      })
    })

    setTableOfContents(toc)
  }, [mounted])

  // Track active section on scroll
  useEffect(() => {
    if (!mounted || tableOfContents.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { 
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0.1
      }
    )

    tableOfContents.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [tableOfContents, mounted])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(date))
  }

  const handleCopyLink = async () => {
    if (mounted && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  const scrollToSection = (id: string) => {
    // Only scroll if the element actually has this ID in the DOM
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    } else {
      // Fallback: find heading by text content if ID doesn't exist
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const targetItem = tableOfContents.find(item => item.id === id)
      if (targetItem) {
        const matchingHeading = Array.from(headings).find(h => 
          h.textContent?.trim() === targetItem.text.trim()
        )
        if (matchingHeading) {
          matchingHeading.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }
  }

  // Don't render share section until mounted to prevent hydration mismatch
  const ShareSection = () => {
    if (!mounted) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {/* Placeholder buttons to maintain layout */}
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg animate-pulse">
            <Twitter className="w-4 h-4" />
            <span className="text-sm font-medium">Twitter</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg animate-pulse">
            <Facebook className="w-4 h-4" />
            <span className="text-sm font-medium">Facebook</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg animate-pulse">
            <Linkedin className="w-4 h-4" />
            <span className="text-sm font-medium">LinkedIn</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg animate-pulse">
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">Email</span>
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Twitter className="w-4 h-4" />
          <span className="text-sm font-medium">Twitter</span>
        </a>
        <a
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Facebook className="w-4 h-4" />
          <span className="text-sm font-medium">Facebook</span>
        </a>
        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          <span className="text-sm font-medium">LinkedIn</span>
        </a>
        <a
          href={shareUrls.email}
          className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span className="text-sm font-medium">Email</span>
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Article Meta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Article Info
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Published {formatDate(post.publishedAt!)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} minute read</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Eye className="w-4 h-4" />
            <span>{post.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Heart className="w-4 h-4" />
            <span>{post.likes.toLocaleString()} likes</span>
          </div>
        </div>
      </motion.div>

      {/* Table of Contents */}
      {tableOfContents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Table of Contents
          </h3>
          <nav className="space-y-2">
            {tableOfContents.map((item, index) => (
              <button
                key={`toc-${item.id}-${index}`}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "w-full text-left text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                  activeSection === item.id 
                    ? "text-blue-600 dark:text-blue-400 font-medium" 
                    : "text-gray-600 dark:text-gray-400",
                  item.level === 2 && "pl-0",
                  item.level === 3 && "pl-4",
                  item.level === 4 && "pl-8",
                  item.level >= 5 && "pl-12"
                )}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </motion.div>
      )}

      {/* Share */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Share Article
        </h3>
        <ShareSection />
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          className="w-full mt-3 flex items-center justify-center gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          Copy Link
        </Button>
      </motion.div>

      {/* Categories */}
      {post.categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            {post.categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                style={{
                  backgroundColor: category.color ? `${category.color}10` : undefined
                }}
              >
                {category.icon && <span>{category.icon}</span>}
                <span className="text-sm font-medium" style={{ color: category.color || undefined }}>
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                style={{
                  backgroundColor: tag.color ? `${tag.color}15` : undefined,
                  color: tag.color || undefined
                }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Newsletter CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Stay Updated
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Get the latest articles and insights delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
          />
          <Button size="sm" className="w-full">
            Subscribe
          </Button>
        </div>
      </motion.div>
    </div>
  )
} 