"use client"

import React, { useEffect } from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Share2 } from "lucide-react"
import { BlogPostWithRelations, likeBlogPost } from "@/lib/blog-actions"
import { Button } from "@/components/ui/button"
import { EnhancedContentRenderer } from "./enhanced-content-renderer"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import Image from "next/image"

interface BlogPostContentProps {
  post: BlogPostWithRelations
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(post.likes)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    console.log(searchQuery)
  }, [searchQuery])

  const handleLike = async () => {
    if (isLiking) return
    
    setIsLiking(true)
    const result = await likeBlogPost(post.id)
    
    if (result.success) {
      setCurrentLikes(prev => prev + 1)
    }
    
    setIsLiking(false)
  }

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      })
    } else if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Implement search highlighting or filtering
    console.log("Searching for:", query)
    
    // You can implement search highlighting by scrolling to matching content
    if (query.trim()) {
      const content = document.querySelector('.enhanced-content')
      if (content) {
        // Simple text search and highlight
        const walker = document.createTreeWalker(
          content,
          NodeFilter.SHOW_TEXT,
          null
        )
        
        let node
        const regex = new RegExp(query, 'gi')
        
        while (node = walker.nextNode()) {
          if (node.textContent && regex.test(node.textContent)) {
            const parent = node.parentElement
            if (parent) {
              parent.scrollIntoView({ behavior: 'smooth', block: 'center' })
              break
            }
          }
        }
      }
    }
  }

  // Convert legacy content format to HTML if needed
  const getContentHtml = () => {
    if (typeof post.content === 'string') {
      return post.content
    }
    
    // Handle legacy array-based content format
    if (Array.isArray(post.content)) {
      return post.content.map((block: any) => {
        switch (block.type) {
          case 'paragraph':
            return `<p>${block.children?.map((child: any) => child.text).join('') || ''}</p>`
          case 'heading':
            return `<h${block.level || 2}>${block.children?.map((child: any) => child.text).join('') || ''}</h${block.level || 2}>`
          case 'code':
            return `<pre><code class="language-${block.language || 'text'}">${block.code || ''}</code></pre>`
          case 'image':
            return `<img src="${block.src || ''}" alt="${block.alt || ''}" />`
          case 'link':
            return `<a href="${block.url || ''}">${block.title || block.url || ''}</a>`
          case 'list':
            const listTag = block.listType === 'ordered' ? 'ol' : 'ul'
            const items = block.children?.map((item: any) => 
              `<li>${item.children?.map((child: any) => child.text).join('') || ''}</li>`
            ).join('') || ''
            return `<${listTag}>${items}</${listTag}>`
          case 'blockquote':
            return `<blockquote>${block.children?.map((child: any) => child.text).join('') || ''}</blockquote>`
          default:
            return `<p>${block.children?.map((child: any) => child.text).join('') || ''}</p>`
        }
      }).join('')
    }
    
    return '<p>No content available</p>'
  }

  return (
    <article className="max-w-none">
      {/* Article Header with Text Generate Effect */}
      <motion.header 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <TextGenerateEffect
          words={post.title}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          duration={0.8}
        />
        
        {post.excerpt && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl"
          >
            {post.excerpt}
          </motion.p>
        )}
      </motion.header>

      {/* Enhanced Content with Search */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="enhanced-content"
      >
        <EnhancedContentRenderer
          content={getContentHtml()}
          showSearch={true}
          searchPlaceholders={[
            "Search in this article...",
            "Find code examples...",
            "Look for specific sections...",
            "Search for keywords...",
            "Explore the content..."
          ]}
          onSearch={handleSearch}
          className="mb-12"
        />
      </motion.div>

      {/* Article Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-4">
          <Button
            onClick={handleLike}
            disabled={isLiking}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${currentLikes > post.likes ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{currentLikes}</span>
            <span className="hidden sm:inline">
              {currentLikes === 1 ? 'Like' : 'Likes'}
            </span>
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{post.views} views</span>
          <span>•</span>
          <span>{post.readTime} min read</span>
        </div>
      </motion.div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Author Bio */}
      {post.authorBio && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-4">
            {post.authorImage ? (
              <Image
                src={post.authorImage}
                alt={post.author}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {post.author.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                About {post.author}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {post.authorBio}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </article>
  )
} 