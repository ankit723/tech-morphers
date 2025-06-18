"use client"

import React from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Eye, Heart, User, Tag, Folder } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { EnhancedContentRenderer } from "./enhanced-content-renderer"

interface BlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string | null
  bannerImage: string | null
  author: string
  authorImage: string | null
  authorBio: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
  publishedAt: Date | null
  categories: string[]
  tags: string[]
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string[]
  canonicalUrl: string | null
  ogImage: string | null
  ogDescription: string | null
}

interface BlogPreviewProps {
  blogPost: BlogPost
}

export function BlogPreview({ blogPost }: BlogPreviewProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    }).format(new Date(date))
  }

  const getReadTime = () => {
    // Strip HTML tags and calculate read time
    const textContent = blogPost.content.replace(/<[^>]*>/g, '').trim()
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length
    return Math.max(1, Math.ceil(wordCount / 225))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // You can implement search highlighting or filtering here
    console.log("Searching for:", query)
  }

  const renderContent = () => {
    if (!blogPost.content || blogPost.content.trim() === '') {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No content yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add content in the editor to see the preview.
          </p>
        </div>
      )
    }

    return (
      <EnhancedContentRenderer
        content={blogPost.content}
        showSearch={true}
        searchPlaceholders={[
          "Search in this article...",
          "Find code examples...",
          "Look for specific topics...",
          "Search for tutorials...",
          "Explore content..."
        ]}
        onSearch={handleSearch}
        className="max-w-none"
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <header className="relative">
          {/* Hero Image */}
          <div className="relative h-[40vh] min-h-[300px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {(blogPost.bannerImage || blogPost.featuredImage) && (
              <Image
                src={(blogPost.bannerImage || blogPost.featuredImage)!}
                alt={blogPost.title}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blogPost.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20 text-white bg-white/10"
                      >
                        <Folder className="w-3 h-3 mr-1" />
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* Title with Text Generate Effect */}
                  <div className="mb-4">
                    {blogPost.title ? (
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                        {blogPost.title}
                      </h1>
                    ) : (
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                        Untitled Post
                      </h1>
                    )}
                  </div>

                  {/* Excerpt */}
                  {blogPost.excerpt && (
                    <p className="text-lg text-gray-200 mb-6 max-w-3xl leading-relaxed">
                      {blogPost.excerpt}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-gray-300">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      {blogPost.authorImage ? (
                        <Image
                          src={blogPost.authorImage}
                          alt={blogPost.author}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-white/20"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/20">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <span className="font-medium text-white">{blogPost.author}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blogPost.publishedAt || new Date())}</span>
                    </div>

                    {/* Read Time */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{getReadTime()} min read</span>
                    </div>

                    {/* Mock Stats */}
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>0 views</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>0 likes</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Tags Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-700/50 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Preview Mode • {getReadTime()} min read
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Status: <span className="font-medium">{blogPost.status}</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
} 