"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Save, Eye, Type, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogEditor } from "@/components/blog/blog-editor"
import { BlogPreview } from "@/components/blog/blog-preview"
import { SEOSettings } from "@/components/blog/seo-settings"
import { PublishSettings } from "@/components/blog/publish-settings"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getAdminBlogPost, updateBlogPost } from "@/lib/blog-actions"
import { BlogStatus } from "@prisma/client"
import type { BlogPostWithRelations } from "@/lib/blog-actions"

export default function EditBlogPage() {
  const params = useParams()
  const router = useRouter()
  const blogId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'seo' | 'settings'>('editor')
  const [blogPost, setBlogPost] = useState<BlogPostWithRelations | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Transform the blog post data for components that expect string arrays
  const transformedBlogPost = blogPost ? {
    ...blogPost,
    categories: blogPost.categories.map(cat => cat.name),
    tags: blogPost.tags.map(tag => tag.name)
  } : null

  const handleBlogPostUpdate = (updatedPost: any) => {
    if (!blogPost) return
    
    // Update the original blogPost while preserving the object structure for categories/tags
    setBlogPost({
      ...blogPost,
      ...updatedPost,
      // Keep the original object structure for categories and tags
      categories: blogPost.categories,
      tags: blogPost.tags
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    if (!blogPost) return
    
    const updatedPost = {
      ...blogPost,
      title,
      slug: generateSlug(title),
      metaTitle: title.length > 60 ? title.slice(0, 57) + '...' : title
    }
    setBlogPost(updatedPost)
  }

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true)
        const post = await getAdminBlogPost(blogId)
        if (!post) {
          setError("Blog post not found")
          return
        }
        setBlogPost(post)
      } catch (err) {
        console.error("Error fetching blog post:", err)
        setError("Failed to load blog post")
      } finally {
        setLoading(false)
      }
    }

    if (blogId) {
      fetchBlogPost()
    }
  }, [blogId])

  const handleSave = async (status: BlogStatus = 'DRAFT') => {
    if (!blogPost) return

    setSaving(true)
    try {
      // Calculate read time from HTML content
      const textContent = blogPost.content.replace(/<[^>]*>/g, '').trim()
      const wordCount = textContent.split(/\s+/).filter((word: string) => word.length > 0).length
      const readTime = Math.max(1, Math.ceil(wordCount / 225))

      const result = await updateBlogPost(blogPost.id, {
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
        publishedAt: status === 'PUBLISHED' ? (blogPost.publishedAt || new Date()) : blogPost.publishedAt,
        readTime,
        metaTitle: blogPost.metaTitle,
        metaDescription: blogPost.metaDescription,
        metaKeywords: blogPost.metaKeywords,
        canonicalUrl: blogPost.canonicalUrl,
        ogImage: blogPost.ogImage,
        ogDescription: blogPost.ogDescription,
        categories: blogPost.categories.map(cat => typeof cat === 'string' ? cat : cat.name),
        tags: blogPost.tags.map(tag => typeof tag === 'string' ? tag : tag.name)
      })

      if (result.success) {
        router.push('/admin/blogs')
      } else {
        alert(result.error || 'Failed to update blog post')
      }
    } catch (error) {
      console.error('Error updating blog post:', error)
      alert('Failed to update blog post')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'editor', label: 'Editor', icon: Type },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'seo', label: 'SEO', icon: AlertCircle },
    { id: 'settings', label: 'Settings', icon: Save }
  ]

  const isValid = blogPost?.title && blogPost?.excerpt && blogPost?.content.trim() !== ''

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !blogPost) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || "Blog post not found"}
        </h2>
        <Link href="/admin/blogs">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>
      </div>
    )
  }

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
                  Edit Blog Post
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {blogPost.title || 'Untitled Post'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {blogPost.status === 'PUBLISHED' && (
                <Link href={`/blog/${blogPost.slug}`} target="_blank">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Live
                  </Button>
                </Link>
              )}
              <Button
                onClick={() => handleSave('DRAFT')}
                variant="outline"
                disabled={saving || !blogPost.title}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave('PUBLISHED')}
                disabled={saving || !isValid}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {blogPost.status === 'PUBLISHED' ? 'Update' : 'Publish'}
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
          {activeTab === 'editor' && transformedBlogPost && (
            <BlogEditor
              blogPost={transformedBlogPost}
              setBlogPost={handleBlogPostUpdate}
              onTitleChange={handleTitleChange}
            />
          )}
          
          {activeTab === 'preview' && transformedBlogPost && (
            <BlogPreview blogPost={transformedBlogPost} />
          )}
          
          {activeTab === 'seo' && transformedBlogPost && (
            <SEOSettings
              blogPost={transformedBlogPost}
              setBlogPost={handleBlogPostUpdate}
            />
          )}
          
          {activeTab === 'settings' && transformedBlogPost && (
            <PublishSettings
              blogPost={transformedBlogPost}
              setBlogPost={handleBlogPostUpdate}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
} 