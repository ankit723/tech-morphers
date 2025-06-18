"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, AlertCircle, CheckCircle, Twitter, Facebook, Globe, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import Image from "next/image"

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

interface SEOSettingsProps {
  blogPost: BlogPost
  setBlogPost: (blogPost: BlogPost) => void
}

interface SEOAnalysis {
  score: number
  issues: Array<{
    type: 'error' | 'warning' | 'success'
    message: string
  }>
}

export function SEOSettings({ blogPost, setBlogPost }: SEOSettingsProps) {
  const [keywordInput, setKeywordInput] = useState("")
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis>({ score: 0, issues: [] })

  useEffect(() => {
    analyzeSEO()
  }, [blogPost.title, blogPost.excerpt, blogPost.metaTitle, blogPost.metaDescription, blogPost.metaKeywords])

  const analyzeSEO = () => {
    const issues: SEOAnalysis['issues'] = []
    let score = 100

    // Meta Title Analysis
    if (!blogPost.metaTitle) {
      issues.push({
        type: 'error',
        message: 'Meta title is missing'
      })
      score -= 20
    } else {
      if (blogPost.metaTitle.length < 30) {
        issues.push({
          type: 'warning',
          message: 'Meta title is too short (recommended: 30-60 characters)'
        })
        score -= 10
      } else if (blogPost.metaTitle.length > 60) {
        issues.push({
          type: 'warning',
          message: 'Meta title is too long (recommended: 30-60 characters)'
        })
        score -= 10
      } else {
        issues.push({
          type: 'success',
          message: 'Meta title length is optimal'
        })
      }
    }

    // Meta Description Analysis
    if (!blogPost.metaDescription) {
      issues.push({
        type: 'error',
        message: 'Meta description is missing'
      })
      score -= 15
    } else {
      if (blogPost.metaDescription.length < 120) {
        issues.push({
          type: 'warning',
          message: 'Meta description is too short (recommended: 120-160 characters)'
        })
        score -= 8
      } else if (blogPost.metaDescription.length > 160) {
        issues.push({
          type: 'warning',
          message: 'Meta description is too long (recommended: 120-160 characters)'
        })
        score -= 8
      } else {
        issues.push({
          type: 'success',
          message: 'Meta description length is optimal'
        })
      }
    }

    // Keywords Analysis
    if (blogPost.metaKeywords.length === 0) {
      issues.push({
        type: 'warning',
        message: 'No focus keywords defined'
      })
      score -= 10
    } else if (blogPost.metaKeywords.length > 5) {
      issues.push({
        type: 'warning',
        message: 'Too many keywords (recommended: 3-5 focus keywords)'
      })
      score -= 5
    } else {
      issues.push({
        type: 'success',
        message: 'Good number of focus keywords'
      })
    }

    // Content Analysis
    if (!blogPost.excerpt) {
      issues.push({
        type: 'error',
        message: 'Excerpt is missing'
      })
      score -= 10
    }

    if (!blogPost.content || blogPost.content.trim() === '') {
      issues.push({
        type: 'error',
        message: 'Content is empty'
      })
      score -= 15
    } else {
      // Strip HTML tags and count words for content analysis
      const textContent = blogPost.content.replace(/<[^>]*>/g, '').trim()
      const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length
      
      if (wordCount < 300) {
        issues.push({
          type: 'warning',
          message: 'Content is too short for good SEO (aim for 300+ words)'
        })
        score -= 10
      } else if (wordCount >= 1000) {
        issues.push({
          type: 'success',
          message: 'Content length is excellent for SEO'
        })
      } else {
        issues.push({
          type: 'success',
          message: 'Content length is good'
        })
      }
    }

    // Featured Image
    if (!blogPost.featuredImage) {
      issues.push({
        type: 'warning',
        message: 'Featured image is missing'
      })
      score -= 5
    }

    // OpenGraph Image
    if (!blogPost.ogImage && !blogPost.featuredImage) {
      issues.push({
        type: 'warning',
        message: 'Social media image is missing'
      })
      score -= 5
    } else {
      issues.push({
        type: 'success',
        message: 'Social media image is set'
      })
    }

    setSeoAnalysis({ score: Math.max(0, score), issues })
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !blogPost.metaKeywords.includes(keywordInput.trim())) {
      setBlogPost({
        ...blogPost,
        metaKeywords: [...blogPost.metaKeywords, keywordInput.trim()]
      })
      setKeywordInput("")
    }
  }

  const removeKeyword = (index: number) => {
    setBlogPost({
      ...blogPost,
      metaKeywords: blogPost.metaKeywords.filter((_, i) => i !== index)
    })
  }

  const generateMetaFromContent = () => {
    if (!blogPost.metaTitle && blogPost.title) {
      const metaTitle = blogPost.title.length > 60 
        ? blogPost.title.slice(0, 57) + "..."
        : blogPost.title
      
      setBlogPost({
        ...blogPost,
        metaTitle
      })
    }

    if (!blogPost.metaDescription && blogPost.excerpt) {
      const metaDescription = blogPost.excerpt.length > 160
        ? blogPost.excerpt.slice(0, 157) + "..."
        : blogPost.excerpt
      
      setBlogPost({
        ...blogPost,
        metaDescription
      })
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20"
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20"
    return "bg-red-100 dark:bg-red-900/20"
  }

  const handleOGImageChange = (url: string | null) => {
    setBlogPost({
      ...blogPost,
      ogImage: url
    })
  }

  const useFeaturedImageAsOG = () => {
    setBlogPost({
      ...blogPost,
      ogImage: blogPost.featuredImage
    })
  }

  const seoPercentage = Math.round((seoAnalysis.score / seoAnalysis.issues.length) * 100)

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg p-6 border ${getScoreBackground(seoPercentage)}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            SEO Score
          </h3>
          <div className={`text-2xl font-bold ${getScoreColor(seoPercentage)}`}>
            {seoPercentage}%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {seoAnalysis.issues.map((issue, index) => {
            const Icon = issue.type === 'success' ? CheckCircle : AlertCircle
            const colorClass = {
              success: 'text-green-600',
              warning: 'text-yellow-600',
              error: 'text-red-600'
            }[issue.type]

            return (
              <div key={index} className={`flex items-center gap-2 ${colorClass}`}>
                <Icon className={`w-4 h-4 ${colorClass}`} />
                <span className={`text-sm ${colorClass}`}>{issue.message}</span>
              </div>
            )
          })}
        </div>

        <Button 
          onClick={generateMetaFromContent}
          variant="outline"
          size="sm"
          className="mt-4"
        >
          Auto-generate SEO Fields
        </Button>
      </motion.div>

      {/* Basic SEO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Basic SEO
        </h3>

        <div className="space-y-6">
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={blogPost.metaTitle || ''}
              onChange={(e) => setBlogPost({ ...blogPost, metaTitle: e.target.value })}
              placeholder="SEO-optimized title for search engines"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={60}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={`${(blogPost.metaTitle?.length || 0) >= 30 && (blogPost.metaTitle?.length || 0) <= 60 ? 'text-green-600' : 'text-red-600'}`}>
                Optimal: 30-60 characters
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {blogPost.metaTitle?.length || 0}/60
              </span>
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta Description
            </label>
            <textarea
              value={blogPost.metaDescription || ''}
              onChange={(e) => setBlogPost({ ...blogPost, metaDescription: e.target.value })}
              placeholder="Brief description that appears in search results"
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={160}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={`${(blogPost.metaDescription?.length || 0) >= 120 && (blogPost.metaDescription?.length || 0) <= 160 ? 'text-green-600' : 'text-red-600'}`}>
                Optimal: 120-160 characters
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {blogPost.metaDescription?.length || 0}/160
              </span>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta Keywords
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder="Add keyword and press Enter"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={addKeyword} size="sm">
                <Tag className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {blogPost.metaKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(index)}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {blogPost.metaKeywords.length >= 3 && blogPost.metaKeywords.length <= 10 
                ? `Good: ${blogPost.metaKeywords.length} keywords` 
                : `Recommended: 3-10 keywords (current: ${blogPost.metaKeywords.length})`}
            </p>
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Canonical URL
            </label>
            <input
              type="url"
              value={blogPost.canonicalUrl || ''}
              onChange={(e) => setBlogPost({ ...blogPost, canonicalUrl: e.target.value })}
              placeholder="https://example.com/blog/post-slug"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Leave empty to use the default URL
            </p>
          </div>
        </div>
      </motion.div>

      {/* Social Media Optimization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Social Media Optimization
        </h3>

        <div className="space-y-6">
          {/* Open Graph Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Social Media Image
            </label>
            <ImageUpload
              value={blogPost.ogImage}
              onChange={handleOGImageChange}
              variant="og"
              showMetadata={true}
              placeholder="Upload image for social media sharing"
            />
            {blogPost.featuredImage && !blogPost.ogImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={useFeaturedImageAsOG}
                className="mt-2"
              >
                Use Featured Image
              </Button>
            )}
          </div>

          {/* Open Graph Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Social Media Description
            </label>
            <textarea
              value={blogPost.ogDescription || ''}
              onChange={(e) => setBlogPost({ ...blogPost, ogDescription: e.target.value })}
              placeholder="Description for social media sharing"
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={200}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500 dark:text-gray-400">
                Recommended: 150-200 characters
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {blogPost.ogDescription?.length || 0}/200
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Media Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Social Media Preview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Twitter Preview */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Twitter className="w-4 h-4" />
              Twitter Card
            </h4>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {(blogPost.ogImage || blogPost.featuredImage) && (
                <div className="aspect-[2/1] relative">
                  <Image
                    src={blogPost.ogImage || blogPost.featuredImage || ""}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  techmorphers.com
                </p>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {blogPost.metaTitle || blogPost.title || "Blog Post Title"}
                </h5>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {blogPost.ogDescription || blogPost.metaDescription || blogPost.excerpt || "Blog post description..."}
                </p>
              </div>
            </div>
          </div>

          {/* Facebook Preview */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Facebook className="w-4 h-4" />
              Facebook Link
            </h4>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {(blogPost.ogImage || blogPost.featuredImage) && (
                <div className="aspect-[1.91/1] relative">
                  <Image
                    src={blogPost.ogImage || blogPost.featuredImage || ""}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-3 bg-gray-50 dark:bg-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase">
                  TECHMORPHERS.COM
                </p>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {blogPost.metaTitle || blogPost.title || "Blog Post Title"}
                </h5>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {blogPost.ogDescription || blogPost.metaDescription || blogPost.excerpt || "Blog post description..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Google Search Preview
        </h3>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-xs text-green-600 mb-1">
            https://www.techmorphers.com/blog/{blogPost.slug || 'post-slug'}
          </div>
          <h4 className="text-blue-600 text-lg mb-1 line-clamp-1">
            {blogPost.metaTitle || blogPost.title || "Blog Post Title"}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {blogPost.metaDescription || blogPost.excerpt || "Blog post description will appear here in search results..."}
          </p>
        </div>
      </motion.div>
    </div>
  )
} 