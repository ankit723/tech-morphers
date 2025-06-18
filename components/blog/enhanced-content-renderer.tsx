"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { CodeBlock } from "@/components/ui/code-block"
import { VanishInput } from "@/components/ui/vanish-input"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { cn } from "@/lib/utils"

interface EnhancedContentRendererProps {
  content: string
  title?: string
  showSearch?: boolean
  searchPlaceholders?: string[]
  onSearch?: (query: string) => void
  className?: string
}

interface ParsedCodeBlock {
  id: string
  language: string
  code?: string
  filename?: string
  tabs?: Array<{
    name: string
    code: string
    language?: string
  }>
}

export function EnhancedContentRenderer({
  content,
  title,
  showSearch = false,
  searchPlaceholders = [
    "Search in this article...",
    "Find code examples...",
    "Look for specific topics...",
    "Search for tutorials..."
  ],
  onSearch,
  className
}: EnhancedContentRendererProps) {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Generate unique component ID to prevent key conflicts
  const componentId = useMemo(() => `renderer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, [])

  // Parse content and extract code blocks
  const { processedContent, codeBlocks } = useMemo(() => {
    const blocks: ParsedCodeBlock[] = []
    let blockCounter = 0

    // First, add IDs to headings to ensure consistency between server and client
    let headingIdCounter = 0
    const contentWithHeadingIds = content.replace(
      /<(h[1-6])([^>]*?)>(.*?)<\/h[1-6]>/gi,
      (match, tag, attributes, innerText) => {
        // Clean attributes to check for existing ID
        const cleanAttributes = attributes.trim()
        
        // Don't add ID if one already exists (more robust check)
        if (/\bid\s*=\s*["'][^"']*["']/i.test(cleanAttributes)) {
          return match
        }
        
        const headingId = `content-heading-${headingIdCounter++}`
        
        // Ensure proper spacing for attributes
        const finalAttributes = cleanAttributes ? ` ${cleanAttributes}` : ''
        return `<${tag}${finalAttributes} id="${headingId}">${innerText}</${tag}>`
      }
    )

    // Pattern to match code blocks
    const codeBlockPattern = /<pre><code(?:\s+class="language-(\w+)")?[^>]*>([\s\S]*?)<\/code><\/pre>/g
    
    const processed = contentWithHeadingIds.replace(codeBlockPattern, (match, language, code) => {
      // Decode HTML entities
      const decodedCode = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .trim()

      const blockId = `codeblock-${blockCounter++}`

      // Check for multi-tab syntax
      // Format: 
      // tabs:filename.ext
      // Tab 1: Component.tsx
      // ```tsx
      // code here
      // ```
      // Tab 2: styles.css
      // ```css
      // code here
      // ```
      
      const multiTabPattern = /^tabs:(.+?)\n((?:Tab \d+: .+\n```\w*\n[\s\S]*?\n```\n?)+)$/
      const multiTabMatch = decodedCode.match(multiTabPattern)
      
      if (multiTabMatch) {
        const filename = multiTabMatch[1].trim()
        const tabsContent = multiTabMatch[2]
        
        // Parse individual tabs
        const tabPattern = /Tab \d+: (.+)\n```(\w*)\n([\s\S]*?)\n```/g
        const tabs: Array<{ name: string; code: string; language?: string }> = []
        let tabMatch
        
        while ((tabMatch = tabPattern.exec(tabsContent)) !== null) {
          tabs.push({
            name: tabMatch[1].trim(),
            code: tabMatch[3].trim(),
            language: tabMatch[2] || language || 'text'
          })
        }
        
        if (tabs.length > 0) {
          blocks.push({
            id: blockId,
            language: language || 'text',
            filename,
            tabs
          })
          
          return `<div data-code-block-id="${blockId}"></div>`
        }
      }
      
      // Single code block
      blocks.push({
        id: blockId,
        language: language || 'text',
        code: decodedCode,
        filename: `code.${language || 'txt'}`
      })
      
      return `<div data-code-block-id="${blockId}"></div>`
    })

    return { processedContent: processed, codeBlocks: blocks }
  }, [content])

  // Component to render content with code blocks
  const ContentWithCodeBlocks = () => {
    // Split content by code block placeholders
    const parts = processedContent.split(/(<div data-code-block-id="[^"]+"><\/div>)/)
    
    return (
      <div className={cn(
        "prose prose-lg max-w-none prose-gray dark:prose-invert",
        "[&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4",
        "[&_blockquote]:italic [&_blockquote]:bg-blue-50 [&_blockquote]:dark:bg-blue-900/20",
        "[&_blockquote]:p-4 [&_blockquote]:rounded-r-lg",
        "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4",
        "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3",
        "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
        "[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1",
        "[&_a]:text-blue-600 [&_a]:underline [&_a]:dark:text-blue-400",
        "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4",
        className
      )}>
        {parts.map((part, index) => {
          // Check if this part is a code block placeholder
          const codeBlockMatch = part.match(/data-code-block-id="([^"]+)"/)
          
          if (codeBlockMatch) {
            const blockId = codeBlockMatch[1]
            const codeBlock = codeBlocks.find(block => block.id === blockId)
            
            if (codeBlock) {
              return (
                <motion.div
                  key={`${componentId}-code-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="my-8"
                >
                  {codeBlock.tabs && codeBlock.tabs.length > 0 ? (
                    <CodeBlock
                      language={codeBlock.language}
                      filename={codeBlock.filename || `code.${codeBlock.language}`}
                      tabs={codeBlock.tabs}
                    />
                  ) : (
                    <CodeBlock
                      language={codeBlock.language}
                      filename={codeBlock.filename || `code.${codeBlock.language}`}
                      code={codeBlock.code || ''}
                    />
                  )}
                </motion.div>
              )
            }
          }
          
          // Regular content
          if (part.trim()) {
            return (
              <motion.div
                key={`${componentId}-content-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                dangerouslySetInnerHTML={{ __html: part }}
              />
            )
          }
          
          return null
        })}
      </div>
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Title with Text Generate Effect */}
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <TextGenerateEffect
            words={title}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          />
        </motion.div>
      )}

      {/* Search Input */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <VanishInput
            placeholders={searchPlaceholders}
            onChange={handleSearch}
            onSubmit={handleSearchSubmit}
            value={searchQuery}
            className="max-w-2xl mx-auto"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <ContentWithCodeBlocks />
      </motion.div>
    </div>
  )
} 