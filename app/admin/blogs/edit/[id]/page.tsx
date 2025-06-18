"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogEditor } from "@/components/blog/blog-editor"
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
        publishedAt: status === 'PUBLISHED' ? new Date() : blogPost.publishedAt,
        metaTitle: blogPost.metaTitle,
        metaDescription: blogPost.metaDescription,
        metaKeywords: blogPost.metaKeywords,
        canonicalUrl: blogPost.canonicalUrl,
        ogImage: blogPost.ogImage,
        ogDescription: blogPost.ogDescription,
        categories: blogPost.categories.map(cat => cat.name),
        tags: blogPost.tags.map(tag => tag.name)
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/blogs">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit Blog Post
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update your blog content and settings
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
              disabled={saving}
              variant="outline"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave('PUBLISHED')}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {blogPost.status === 'PUBLISHED' ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {transformedBlogPost && (
            <>
              <BlogEditor 
                blogPost={transformedBlogPost} 
                setBlogPost={handleBlogPostUpdate}
              />
              
              <SEOSettings 
                blogPost={transformedBlogPost} 
                setBlogPost={handleBlogPostUpdate}
              />
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {transformedBlogPost && (
            <PublishSettings 
              blogPost={transformedBlogPost} 
              setBlogPost={handleBlogPostUpdate}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
} 