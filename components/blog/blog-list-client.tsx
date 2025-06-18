"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BlogPostWithRelations, BlogCategory, BlogTag } from "@/lib/blog-actions"
import { BlogCard } from "./blog-card"
import { Search, Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BlogListClientProps {
  initialPosts: BlogPostWithRelations[]
  categories: BlogCategory[]
  tags: BlogTag[]
  totalPosts: number
  totalPages: number
  currentPage: number
  initialFilters: {
    category?: string
    tag?: string
    search?: string
  }
}

export function BlogListClient({
  initialPosts,
  categories,
  tags,
  totalPosts,
  totalPages,
  currentPage,
  initialFilters
}: BlogListClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "")
  const [selectedCategory] = useState(initialFilters.category || "")
  const [selectedTag] = useState(initialFilters.tag || "")
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Navigate to new page with search
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    window.location.href = `/blog?${params.toString()}`
  }

  const handleCategoryChange = (categorySlug: string) => {
    const newCategory = categorySlug === selectedCategory ? "" : categorySlug
    const params = new URLSearchParams()
    if (newCategory) params.set('category', newCategory)
    window.location.href = `/blog?${params.toString()}`
  }

  const handleTagChange = (tagSlug: string) => {
    const newTag = tagSlug === selectedTag ? "" : tagSlug
    const params = new URLSearchParams()
    if (newTag) params.set('tag', newTag)
    window.location.href = `/blog?${params.toString()}`
  }

  const clearFilters = () => {
    window.location.href = "/blog"
  }

  const activeFiltersCount = [searchQuery, selectedCategory, selectedTag].filter(Boolean).length

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
            />
          </form>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                showFilters 
                  ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalPosts} articles
            </span>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-6"
            >
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.slug)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedCategory === category.slug
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent"
                      )}
                      style={{
                        backgroundColor: selectedCategory === category.slug 
                          ? category.color ? `${category.color}20` : undefined
                          : category.color ? `${category.color}10` : undefined,
                        color: selectedCategory === category.slug 
                          ? category.color || undefined
                          : category.color ? `${category.color}80` : undefined
                      }}
                    >
                      {category.icon && <span className="mr-2">{category.icon}</span>}
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagChange(tag.slug)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        selectedTag === tag.slug
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                      style={{
                        backgroundColor: selectedTag === tag.slug 
                          ? tag.color ? `${tag.color}20` : undefined
                          : tag.color ? `${tag.color}10` : undefined,
                        color: selectedTag === tag.slug 
                          ? tag.color || undefined
                          : tag.color ? `${tag.color}80` : undefined
                      }}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Current Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>
            {searchQuery && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                Search: {searchQuery}
              </span>
            )}
            {selectedCategory && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                Category: {categories.find(c => c.slug === selectedCategory)?.name}
              </span>
            )}
            {selectedTag && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                Tag: {tags.find(t => t.slug === selectedTag)?.name}
              </span>
            )}
          </div>
        )}

        {/* Posts Grid */}
        {initialPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or browse all articles.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Articles
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <a
                  key={page}
                  href={`/blog?page=${page}${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedTag ? `&tag=${selectedTag}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  )}
                >
                  {page}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 