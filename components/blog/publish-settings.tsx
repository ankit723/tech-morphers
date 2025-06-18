"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, User, Tag, Folder, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"

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

interface PublishSettingsProps {
  blogPost: BlogPost
  setBlogPost: (blogPost: BlogPost) => void
}

export function PublishSettings({ blogPost, setBlogPost }: PublishSettingsProps) {
  const [newCategory, setNewCategory] = useState("")
  const [newTag, setNewTag] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")

  // Set current date/time for scheduling
  useEffect(() => {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().slice(0, 5)
    setScheduledDate(date)
    setScheduledTime(time)
  }, [])

  const addCategory = (category: string) => {
    if (category && !blogPost.categories.includes(category)) {
      setBlogPost({
        ...blogPost,
        categories: [...blogPost.categories, category]
      })
    }
    setNewCategory("")
  }

  const removeCategory = (index: number) => {
    setBlogPost({
      ...blogPost,
      categories: blogPost.categories.filter((_, i) => i !== index)
    })
  }

  const addTag = (tag: string) => {
    if (tag && !blogPost.tags.includes(tag)) {
      setBlogPost({
        ...blogPost,
        tags: [...blogPost.tags, tag]
      })
    }
    setNewTag("")
  }

  const removeTag = (index: number) => {
    setBlogPost({
      ...blogPost,
      tags: blogPost.tags.filter((_, i) => i !== index)
    })
  }

  const handleStatusChange = (status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED') => {
    let publishedAt = null

    if (status === 'PUBLISHED') {
      publishedAt = new Date()
    } else if (status === 'SCHEDULED' && scheduledDate && scheduledTime) {
      publishedAt = new Date(`${scheduledDate}T${scheduledTime}`)
    }

    setBlogPost({
      ...blogPost,
      status,
      publishedAt
    })
  }

  const handleScheduleChange = () => {
    if (scheduledDate && scheduledTime) {
      const publishedAt = new Date(`${scheduledDate}T${scheduledTime}`)
      setBlogPost({
        ...blogPost,
        publishedAt,
        status: 'SCHEDULED'
      })
    }
  }

  const handleAuthorImageChange = (url: string | null) => {
    setBlogPost({
      ...blogPost,
      authorImage: url
    })
  }

  return (
    <div className="space-y-6">
      {/* Publishing Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Publishing
        </h3>

        <div className="space-y-4">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'DRAFT', label: 'Draft', description: 'Save as draft' },
                { value: 'PUBLISHED', label: 'Published', description: 'Publish immediately' },
                { value: 'SCHEDULED', label: 'Scheduled', description: 'Schedule for later' },
                { value: 'ARCHIVED', label: 'Archived', description: 'Archive the post' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value as any)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    blogPost.status === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scheduling */}
          {blogPost.status === 'SCHEDULED' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => {
                    setScheduledDate(e.target.value)
                    handleScheduleChange()
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => {
                    setScheduledTime(e.target.value)
                    handleScheduleChange()
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}

          {/* Current Status Display */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                blogPost.status === 'PUBLISHED' ? 'bg-green-500' :
                blogPost.status === 'SCHEDULED' ? 'bg-yellow-500' :
                blogPost.status === 'ARCHIVED' ? 'bg-gray-500' : 'bg-gray-500'
              }`} />
              <span className="font-medium text-gray-900 dark:text-white">
                {blogPost.status === 'PUBLISHED' && 'Published'}
                {blogPost.status === 'SCHEDULED' && `Scheduled for ${blogPost.publishedAt?.toLocaleDateString()}`}
                {blogPost.status === 'DRAFT' && 'Draft'}
                {blogPost.status === 'ARCHIVED' && 'Archived'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Categories
        </h3>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory(newCategory))}
              placeholder="Add category..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button onClick={() => addCategory(newCategory)} size="default">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {blogPost.categories.map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
              >
                <Folder className="w-3 h-3 mr-2" />
                {category}
                <button
                  onClick={() => removeCategory(index)}
                  className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {blogPost.categories.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No categories added yet. Categories help organize your content.
            </p>
          )}
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Tags
        </h3>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
              placeholder="Add tag..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button onClick={() => addTag(newTag)} size="default">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {blogPost.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
              >
                <Tag className="w-3 h-3 mr-2" />
                {tag}
                <button
                  onClick={() => removeTag(index)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {blogPost.tags.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No tags added yet. Tags help readers find related content.
            </p>
          )}
        </div>
      </motion.div>

      {/* Author Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Author Information
        </h3>

        <div className="space-y-6">
          {/* Author Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author Name
            </label>
            <input
              type="text"
              value={blogPost.author}
              onChange={(e) => setBlogPost({ ...blogPost, author: e.target.value })}
              placeholder="Enter author name..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Author Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author Profile Picture
            </label>
            <ImageUpload
              value={blogPost.authorImage}
              onChange={handleAuthorImageChange}
              variant="profile"
              showMetadata={false}
              placeholder="Upload author profile picture"
            />
          </div>

          {/* Author Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author Bio
            </label>
            <textarea
              value={blogPost.authorBio || ''}
              onChange={(e) => setBlogPost({ ...blogPost, authorBio: e.target.value })}
              placeholder="Brief bio about the author..."
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This will be displayed at the end of the blog post.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBlogPost({ ...blogPost, categories: ['Technology', 'Development'] })}
            className="justify-start"
          >
            <Folder className="w-4 h-4 mr-2" />
            Add Tech Categories
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBlogPost({ ...blogPost, tags: ['tutorial', 'guide', 'tips'] })}
            className="justify-start"
          >
            <Tag className="w-4 h-4 mr-2" />
            Add Common Tags
          </Button>
        </div>
      </motion.div>
    </div>
  )
} 