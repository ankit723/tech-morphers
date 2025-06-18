"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Eye, Heart, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BlogPostWithRelations } from "@/lib/blog-actions"
import { PlaceholderDemo } from "@/components/ui/placeholder"
import { cn } from "@/lib/utils"

interface BlogCardProps {
  post: BlogPostWithRelations
  variant?: "default" | "featured" | "compact"
  className?: string
}

export function BlogCard({ post, variant = "default", className }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(date))
  }

  const cardVariants = {
    default: "group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700",
    featured: "group relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-blue-200 dark:border-blue-800",
    compact: "group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
  }

  const imageHeight = variant === "featured" ? "h-64" : variant === "compact" ? "h-32" : "h-48"

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(cardVariants[variant], className)}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        {/* Featured Image */}
        <div className={cn("relative overflow-hidden", imageHeight)}>
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <PlaceholderDemo className="w-full h-full">
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No Image</p>
                </div>
              </div>
            </PlaceholderDemo>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {variant === "featured" && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
              Featured
            </div>
          )}
          
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="absolute top-4 right-4 flex flex-wrap gap-1">
              {post.categories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm border"
                  style={{
                    backgroundColor: category.color ? `${category.color}20` : "rgba(255, 255, 255, 0.9)",
                    color: category.color || "#374151",
                    borderColor: category.color ? `${category.color}40` : "rgba(255, 255, 255, 0.2)"
                  }}
                >
                  {category.icon && <span className="mr-1">{category.icon}</span>}
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Information */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.publishedAt!)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{post.views}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className={cn(
            "font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200",
            variant === "featured" ? "text-xl" : variant === "compact" ? "text-base" : "text-lg"
          )}>
            {post.title}
          </h3>

          {/* Excerpt */}
          {variant !== "compact" && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Author & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.authorImage ? (
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">{post.author}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{post.likes}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && variant !== "compact" && (
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}15` : undefined,
                    color: tag.color || undefined
                  }}
                >
                  #{tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  )
} 