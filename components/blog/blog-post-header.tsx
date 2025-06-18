"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Eye, Heart, User, Tag, Folder, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BlogPostWithRelations } from "@/lib/blog-actions"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/blog/share-button"

interface BlogPostHeaderProps {
  post: BlogPostWithRelations
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(date))
  }

  return (
    <header className="relative">
      {/* Hero Image */}
      <div className="relative h-[400px] sm:h-[450px] md:h-[450px] lg:h-[500px] xl:h-[550px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {post.bannerImage && (
          <Image
            src={(post.bannerImage)!}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 md:pb-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-5xl mx-auto"
            >
              {/* Categories */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {post.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
                    style={{
                      backgroundColor: category.color ? `${category.color}30` : "rgba(255, 255, 255, 0.1)"
                    }}
                  >
                    {category.icon && <span className="mr-1">{category.icon}</span>}
                    <Folder className="w-3 h-3 mr-1" />
                    <span className="truncate">{category.name}</span>
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight w-full max-w-7xl break-words hyphens-auto">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-4 sm:mb-6 w-full max-w-3xl leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-4 md:gap-6 text-gray-300 w-full">
                {/* Author */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {post.authorImage ? (
                    <Image
                      src={post.authorImage}
                      alt={post.author}
                      width={32}
                      height={32}
                      className="sm:w-10 sm:h-10 rounded-full border-2 border-white/20 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/20 flex-shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white text-sm sm:text-base truncate">{post.author}</p>
                    {post.authorBio && (
                      <p className="text-xs sm:text-sm text-gray-300 truncate hidden sm:block">
                        {post.authorBio.slice(0, 50)}...
                      </p>
                    )}
                  </div>
                </div>

                {/* Date, Read Time, Views, Likes - Stack on mobile, flex on larger screens */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  {/* Date */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">{formatDate(post.publishedAt!)}</span>
                  </div>

                  {/* Read Time */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">{post.readTime} min</span>
                  </div>

                  {/* Views */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">{post.views.toLocaleString()}</span>
                  </div>

                  {/* Likes */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">{post.likes.toLocaleString()}</span>
                  </div>

                  {/* Comments */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">{post.commentsCount || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 gap-3 sm:gap-0">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 order-2 sm:order-1">
              {/* Show 3 tags on mobile, 5 on larger screens */}
              {post.tags.slice(0, 5).map((tag, index) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                    index >= 3 ? 'hidden sm:inline-flex' : ''
                  }`}
                  style={{
                    backgroundColor: tag.color ? `${tag.color}15` : undefined,
                    color: tag.color || undefined
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-[100px] sm:max-w-none">{tag.name}</span>
                </Link>
              ))}
              {post.tags.length > 5 && (
                <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                  +{post.tags.length - 5} more
                </span>
              )}
              {post.tags.length > 3 && post.tags.length <= 5 && (
                <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
              {/* Comments Button */}
              <Link href={`/blog/${post.slug}/comments`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 flex-1 sm:flex-none"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Comments</span>
                  <span className="sm:hidden">
                    {post.commentsCount === 0 ? "Comment" : `${post.commentsCount}`}
                  </span>
                  {post.commentsCount > 0 && (
                    <span className="hidden sm:inline">({post.commentsCount})</span>
                  )}
                </Button>
              </Link>

              {/* Share Button */}
              <ShareButton
                title={post.title}
                excerpt={post.excerpt}
                className="flex-1 sm:flex-none"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 