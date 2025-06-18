"use client"

import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Check, ExternalLink, Heart, Share2 } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"
import Image from "next/image"
import { BlogPostWithRelations, likeBlogPost } from "@/lib/blog-actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EnhancedContentRenderer } from "./enhanced-content-renderer"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

interface BlogPostContentProps {
  post: BlogPostWithRelations
}

interface ContentBlock {
  type: string
  children?: any[]
  text?: string
  code?: string
  language?: string
  src?: string
  alt?: string
  url?: string
  title?: string
  level?: number
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const { theme } = useTheme()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isLiking, setIsLiking] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(post.likes)
  const [searchQuery, setSearchQuery] = useState("")

  const handleCopyCode = async (code: string, blockId: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(blockId)
    setTimeout(() => setCopiedCode(null), 2000)
  }

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

  const renderContent = (content: any): React.ReactElement[] => {
    if (!Array.isArray(content)) {
      return [<p key="content" className="prose-p">Invalid content format</p>]
    }

    return content.map((block: ContentBlock, index: number) => {
      const blockId = `block-${index}`

      switch (block.type) {
        case 'paragraph':
          return (
            <motion.p
              key={blockId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="prose-p mb-6 text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              {block.children?.map((child: any, childIndex: number) => (
                <span key={childIndex}>
                  {child.text}
                </span>
              ))}
            </motion.p>
          )

        case 'heading':
          const HeadingTag = `h${block.level || 2}` as React.ElementType
          const headingClasses = {
            1: "text-4xl font-bold mt-12 mb-6",
            2: "text-3xl font-bold mt-10 mb-5",
            3: "text-2xl font-semibold mt-8 mb-4",
            4: "text-xl font-semibold mt-6 mb-3",
            5: "text-lg font-semibold mt-4 mb-2",
            6: "text-base font-semibold mt-4 mb-2"
          }
          
          return (
            <motion.div
              key={blockId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <HeadingTag className={cn(
                headingClasses[block.level as keyof typeof headingClasses] || headingClasses[2],
                "text-gray-900 dark:text-white scroll-mt-24"
              )}>
                {block.children?.map((child: any) => child.text).join('')}
              </HeadingTag>
            </motion.div>
          )

        case 'code':
          return (
            <motion.div
              key={blockId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="my-8"
            >
              <div className="relative group">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {block.language || 'code'}
                  </span>
                  <button
                    onClick={() => handleCopyCode(block.code || '', blockId)}
                    className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    {copiedCode === blockId ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <SyntaxHighlighter
                    language={block.language || 'text'}
                    style={theme === 'dark' ? oneDark : oneLight}
                    customStyle={{
                      margin: 0,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      fontSize: '0.9rem',
                      lineHeight: '1.5'
                    }}
                    showLineNumbers
                  >
                    {block.code || ''}
                  </SyntaxHighlighter>
                </div>
              </div>
            </motion.div>
          )

        case 'image':
          return (
            <motion.figure
              key={blockId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="my-8"
            >
              <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <Image
                  src={block.src || ''}
                  alt={block.alt || ''}
                  width={800}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              {block.alt && (
                <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {block.alt}
                </figcaption>
              )}
            </motion.figure>
          )

        case 'link':
          return (
            <motion.a
              key={blockId}
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
            >
              {block.title || block.url}
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          )

        case 'list':
        case 'ordered-list':
          const ListTag = block.type === 'ordered-list' ? 'ol' : 'ul'
          return (
            <motion.div
              key={blockId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="my-6"
            >
              <ListTag className={cn(
                "ml-6 space-y-2",
                block.type === 'ordered-list' ? "list-decimal" : "list-disc"
              )}>
                {block.children?.map((item: any, itemIndex: number) => (
                  <li key={itemIndex} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.children?.map((child: any) => child.text).join('')}
                  </li>
                ))}
              </ListTag>
            </motion.div>
          )

        case 'blockquote':
          return (
            <motion.blockquote
              key={blockId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="my-8 pl-6 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg"
            >
              <p className="text-gray-800 dark:text-gray-200 italic text-lg leading-relaxed">
                {block.children?.map((child: any) => child.text).join('')}
              </p>
            </motion.blockquote>
          )

        case 'callout':
          return (
            <motion.div
              key={blockId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="my-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
            >
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                💡 {block.children?.map((child: any) => child.text).join('')}
              </p>
            </motion.div>
          )

        default:
          return (
            <motion.div
              key={blockId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Unsupported content type: {block.type}
              </p>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(block, null, 2)}
              </pre>
            </motion.div>
          )
      }
    })
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
              <img
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