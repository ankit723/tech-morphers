"use client"

import { motion } from "framer-motion"
import { FileText, Plus, Search, Edit, Trash2, Eye, Calendar, User, ChevronLeft, ChevronRight, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getAdminBlogPosts, deleteBlogPost, bulkUpdateBlogPosts, getBlogCategories, resetBlogPostViews, type BlogPostWithRelations } from "@/lib/blog-actions"
import { BlogStatus } from "@prisma/client"
import Image from "next/image"

interface BlogStats {
  total: number
  published: number
  draft: number
  scheduled: number
  archived: number
}

interface BlogData {
  posts: BlogPostWithRelations[]
  totalPosts: number
  totalPages: number
  currentPage: number
  stats: BlogStats
}

interface Category {
  id: string
  name: string
  slug: string
  _count: { posts: number }
}

export default function AdminBlogsPage() {
  const [blogData, setBlogData] = useState<BlogData | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  
  // Filters
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "">("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'publishedAt' | 'views' | 'likes'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [blogResult, categoriesResult] = await Promise.all([
        getAdminBlogPosts(
          currentPage,
          10,
          statusFilter || undefined,
          searchQuery || undefined,
          categoryFilter || undefined,
          sortBy,
          sortOrder
        ),
        getBlogCategories()
      ])
      
      setBlogData(blogResult)
      setCategories(categoriesResult as Category[])
    } catch (error) {
      console.error('Error fetching blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, searchQuery, statusFilter, categoryFilter, sortBy, sortOrder])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const result = await deleteBlogPost(id)
      if (result.success) {
        fetchData()
      } else {
        alert('Failed to delete blog post')
      }
    }
  }

  const handleResetViews = async (id: string) => {
    if (confirm('Are you sure you want to reset the view count to 0? This action cannot be undone.')) {
      const result = await resetBlogPostViews(id, 0)
      if (result.success) {
        fetchData()
      } else {
        alert('Failed to reset view count')
      }
    }
  }

  const handleBulkStatusUpdate = async (status: BlogStatus) => {
    if (selectedPosts.length === 0) return
    
    const result = await bulkUpdateBlogPosts(selectedPosts, { status })
    if (result.success) {
      setSelectedPosts([])
      fetchData()
    } else {
      alert('Failed to update blog posts')
    }
  }

  const togglePostSelection = (id: string) => {
    setSelectedPosts(prev => 
      prev.includes(id) 
        ? prev.filter(postId => postId !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (!blogData) return
    
    if (selectedPosts.length === blogData.posts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(blogData.posts.map(post => post.id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading && !blogData) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const stats = blogData?.stats || { total: 0, published: 0, draft: 0, scheduled: 0, archived: 0 }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className="w-8 h-8 mr-3 text-blue-600" />
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create, edit, and manage your blog content
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/blogs/email-stats">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Stats
              </Button>
            </Link>
            <Link href="/admin/blogs/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { label: "Total Posts", value: stats.total.toString(), color: "blue", icon: FileText },
          { label: "Published", value: stats.published.toString(), color: "green", icon: Eye },
          { label: "Drafts", value: stats.draft.toString(), color: "gray", icon: Edit },
          { label: "Scheduled", value: stats.scheduled.toString(), color: "yellow", icon: Calendar },
          { label: "Archived", value: stats.archived.toString(), color: "red", icon: Trash2 }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BlogStatus | "")}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name} ({category._count.posts})
                </option>
              ))}
            </select>

            <select 
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field as typeof sortBy)
                setSortOrder(order as typeof sortOrder)
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="updatedAt-desc">Recently Updated</option>
              <option value="publishedAt-desc">Recently Published</option>
              <option value="views-desc">Most Viewed</option>
              <option value="likes-desc">Most Liked</option>
            </select>
          </div>
        </form>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('PUBLISHED')}
                >
                  Publish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('DRAFT')}
                >
                  Draft
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('ARCHIVED')}
                >
                  Archive
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedPosts([])}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : !blogData || blogData.posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No blog posts found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || statusFilter || categoryFilter 
                ? "Try adjusting your filters or search query"
                : "Get started by creating your first blog post"
              }
            </p>
            <Link href="/admin/blogs/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Blog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === blogData.posts.length && blogData.posts.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {blogData.posts.map((blog, index) => (
                  <motion.tr
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(blog.id)}
                        onChange={() => togglePostSelection(blog.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        {blog.featuredImage && (
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={blog.featuredImage}
                              alt={blog.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {blog.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            /{blog.slug}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {blog.categories && blog.categories.length > 0 && blog.categories.slice(0, 2).map((category) => (
                              <span
                                key={category.id}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              >
                                {category.name}
                              </span>
                            ))}
                            {blog.categories && blog.categories.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{blog.categories.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                          {blog.authorImage ? (
                            <Image
                              src={blog.authorImage}
                              alt={blog.author}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {blog.author}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div>
                        {formatDate(blog.publishedAt)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Updated: {formatDate(blog.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                            {blog.views}
                          </span>
                          <span className="flex items-center gap-1">
                            ♥ {blog.likes}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {blog.readTime} min read
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/blogs/edit/${blog.id}`}>
                          <Button variant="outline" size="sm" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/blog/${blog.slug}`} target="_blank">
                          <Button variant="outline" size="sm" title="View">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {blog.views > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-orange-600 hover:text-orange-700"
                            onClick={() => handleResetViews(blog.id)}
                            title="Reset Views"
                          >
                            Reset
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(blog.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {blogData && blogData.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * 10, blogData.totalPosts)}</span> of{' '}
            <span className="font-medium">{blogData.totalPosts}</span> results
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, blogData.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(blogData.totalPages - 4, currentPage - 2)) + i
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage >= blogData.totalPages}
              onClick={() => setCurrentPage(prev => Math.min(blogData.totalPages, prev + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}