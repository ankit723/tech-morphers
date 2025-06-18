"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Eye, Upload, Code, Image as ImageIcon, Type, List, Quote, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogEditor } from "@/components/blog/blog-editor"
import { BlogPreview } from "@/components/blog/blog-preview"
import { SEOSettings } from "@/components/blog/seo-settings"
import { PublishSettings } from "@/components/blog/publish-settings"
import { createBlogPost } from "@/lib/blog-actions"
import { calculateReadTime } from "@/lib/utils"
import { useRouter } from "next/navigation"

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

export default function CreateBlogPost() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'seo' | 'settings'>('editor')
  const [isSaving, setIsSaving] = useState(false)
  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: null,
    bannerImage: null,
    author: 'Tech Morphers Team',
    authorImage: null,
    authorBio: 'Expert software development team creating innovative solutions.',
    status: 'DRAFT',
    publishedAt: null,
    categories: [],
    tags: [],
    metaTitle: null,
    metaDescription: null,
    metaKeywords: [],
    canonicalUrl: null,
    ogImage: null,
    ogDescription: null
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setBlogPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      metaTitle: title.length > 60 ? title.slice(0, 57) + '...' : title
    }))
  }

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED' = 'DRAFT') => {
    setIsSaving(true)
    try {
      // Calculate read time from HTML content
      const textContent = blogPost.content.replace(/<[^>]*>/g, '').trim()
      const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length
      const readTime = Math.max(1, Math.ceil(wordCount / 225))
      
      const postData = {
        title: blogPost.title,
        slug: blogPost.slug,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        featuredImage: blogPost.featuredImage,
        bannerImage: blogPost.bannerImage,
        author: blogPost.author,
        authorImage: blogPost.authorImage,
        authorBio: blogPost.authorBio,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : blogPost.publishedAt,
        readTime,
        metaTitle: blogPost.metaTitle,
        metaDescription: blogPost.metaDescription,
        metaKeywords: blogPost.metaKeywords,
        canonicalUrl: blogPost.canonicalUrl,
        ogImage: blogPost.ogImage,
        ogDescription: blogPost.ogDescription,
        categories: blogPost.categories,
        tags: blogPost.tags
      }

      const result = await createBlogPost(postData)
      
      if (result.success) {
        router.push('/admin/blogs')
      } else {
        console.error('Failed to save blog post:', result.error)
        alert('Failed to save blog post: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Error saving blog post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'editor', label: 'Editor', icon: Type },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'seo', label: 'SEO', icon: AlertCircle },
    { id: 'settings', label: 'Settings', icon: Save }
  ]

  const isValid = blogPost.title && blogPost.excerpt && blogPost.content.trim() !== ''

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/blogs">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blogs
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Blog Post
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {blogPost.title || 'Untitled Post'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => handleSave('DRAFT')}
                variant="outline"
                disabled={isSaving || !blogPost.title}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave('PUBLISHED')}
                disabled={isSaving || !isValid}
                className="flex items-center gap-2"
              >
                {isSaving ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'editor' && (
            <BlogEditor
              blogPost={blogPost}
              setBlogPost={setBlogPost}
              onTitleChange={handleTitleChange}
            />
          )}
          
          {activeTab === 'preview' && (
            <BlogPreview blogPost={blogPost} />
          )}
          
          {activeTab === 'seo' && (
            <SEOSettings
              blogPost={blogPost}
              setBlogPost={setBlogPost}
            />
          )}
          
          {activeTab === 'settings' && (
            <PublishSettings
              blogPost={blogPost}
              setBlogPost={setBlogPost}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
} 