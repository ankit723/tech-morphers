"use server"

import { prisma } from "@/lib/db"
import { BlogStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { generateSlug } from "@/lib/utils"
import { sendBlogNotificationsToAllEmails } from "@/lib/blog-email-notifications"

export type BlogPostWithRelations = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any
  featuredImage: string | null
  bannerImage: string | null
  author: string
  authorImage: string | null
  authorBio: string | null
  status: BlogStatus
  publishedAt: Date | null
  readTime: number
  views: number
  likes: number
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string[]
  canonicalUrl: string | null
  ogImage: string | null
  ogDescription: string | null
  categories: Array<{
    id: string
    name: string
    slug: string
    color: string | null
    icon: string | null
  }>
  tags: Array<{
    id: string
    name: string
    slug: string
    color: string | null
  }>
  createdAt: Date
  updatedAt: Date
}

// Get all published blog posts with pagination
export async function getBlogPosts(
  page: number = 1, 
  limit: number = 12,
  categorySlug?: string,
  tagSlug?: string,
  searchQuery?: string
): Promise<{
  posts: BlogPostWithRelations[]
  totalPosts: number
  totalPages: number
  currentPage: number
}> {
  const skip = (page - 1) * limit

  const where: any = {
    status: "PUBLISHED",
    publishedAt: {
      lte: new Date()
    }
  }

  if (categorySlug) {
    where.categories = {
      some: {
        slug: categorySlug
      }
    }
  }

  if (tagSlug) {
    where.tags = {
      some: {
        slug: tagSlug
      }
    }
  }

  if (searchQuery) {
    where.OR = [
      {
        title: {
          contains: searchQuery,
          mode: "insensitive"
        }
      },
      {
        excerpt: {
          contains: searchQuery,
          mode: "insensitive"
        }
      },
      {
        metaKeywords: {
          has: searchQuery.toLowerCase()
        }
      }
    ]
  }

  const [posts, totalPosts] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        }
      },
      orderBy: {
        publishedAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.blogPost.count({ where })
  ])

  return {
    posts: posts as BlogPostWithRelations[],
    totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
    currentPage: page
  }
}

// Get a single blog post by slug
export async function getBlogPost(slug: string, trackView: boolean = true): Promise<BlogPostWithRelations | null> {
  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
      status: "PUBLISHED"
    },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          icon: true
        }
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true
        }
      }
    }
  })

  // Smart view tracking: Always increment but with better logic
  if (post && trackView) {
    // Increment view count
    // Note: In a production app, you might want to:
    // 1. Use headers to check for unique visitors (X-Forwarded-For, User-Agent)
    // 2. Implement session-based tracking
    // 3. Rate limit per IP (1 view per hour max)
    // 4. Filter out known bots/crawlers
    // For now, we increment but you can control with trackView parameter
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    })
  }

  return post as BlogPostWithRelations | null
}

// Get related posts
export async function getRelatedPosts(
  postId: string, 
  categoryIds: string[], 
  limit: number = 3
): Promise<BlogPostWithRelations[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      AND: [
        {
          id: {
            not: postId
          }
        },
        {
          status: "PUBLISHED"
        },
        {
          publishedAt: {
            lte: new Date()
          }
        },
        {
          categories: {
            some: {
              id: {
                in: categoryIds
              }
            }
          }
        }
      ]
    },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          icon: true
        }
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true
        }
      }
    },
    orderBy: {
      publishedAt: "desc"
    },
    take: limit
  })

  return posts as BlogPostWithRelations[]
}

// Get featured/popular posts
export async function getFeaturedPosts(limit: number = 6): Promise<BlogPostWithRelations[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date()
      }
    },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          icon: true
        }
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true
        }
      }
    },
    orderBy: [
      { views: "desc" },
      { likes: "desc" },
      { publishedAt: "desc" }
    ],
    take: limit
  })

  return posts as BlogPostWithRelations[]
}

// Get all categories
export async function getBlogCategories() {
  return await prisma.blogCategory.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: "PUBLISHED"
            }
          }
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  })
}

// Get all tags
export async function getBlogTags() {
  return await prisma.blogTag.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: "PUBLISHED"
            }
          }
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  })
}

// Like a blog post
export async function likeBlogPost(postId: string) {
  try {
    await prisma.blogPost.update({
      where: { id: postId },
      data: { likes: { increment: 1 } }
    })
    revalidatePath("/blog")
    return { success: true }
  } catch (error) {
    console.error("Error liking post:", error)
    return { success: false }
  }
}

// Helper function to get or create category by name
export async function getOrCreateCategory(name: string) {
  const slug = generateSlug(name)
  
  let category = await prisma.blogCategory.findUnique({
    where: { slug }
  })

  if (!category) {
    category = await prisma.blogCategory.create({
      data: {
        name,
        slug,
        color: '#3B82F6' // Default blue color
      }
    })
  }

  return category
}

// Helper function to get or create tag by name
export async function getOrCreateTag(name: string) {
  const slug = generateSlug(name)
  
  let tag = await prisma.blogTag.findUnique({
    where: { slug }
  })

  if (!tag) {
    tag = await prisma.blogTag.create({
      data: {
        name,
        slug,
        color: '#10B981' // Default green color
      }
    })
  }

  return tag
}

// Updated createBlogPost function to handle string arrays for categories and tags
export async function createBlogPost(data: {
  title: string
  slug: string
  excerpt: string
  content: any
  featuredImage?: string | null
  bannerImage?: string | null
  author: string
  authorImage?: string | null
  authorBio?: string | null
  status: BlogStatus
  publishedAt?: Date | null
  readTime?: number
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string[]
  canonicalUrl?: string | null
  ogImage?: string | null
  ogDescription?: string | null
  categories?: string[]
  tags?: string[]
}) {
  try {
    // Calculate read time if not provided
    const readTime = data.readTime || await calculateReadTimeAsync(data.content)

    // Handle categories - get or create them
    const categoryIds: string[] = []
    if (data.categories && data.categories.length > 0) {
      for (const categoryName of data.categories) {
        const category = await getOrCreateCategory(categoryName)
        categoryIds.push(category.id)
      }
    }

    // Handle tags - get or create them
    const tagIds: string[] = []
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tag = await getOrCreateTag(tagName)
        tagIds.push(tag.id)
      }
    }

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        bannerImage: data.bannerImage,
        author: data.author,
        authorImage: data.authorImage,
        authorBio: data.authorBio,
        status: data.status,
        publishedAt: data.publishedAt,
        readTime,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords || [],
        canonicalUrl: data.canonicalUrl,
        ogImage: data.ogImage,
        ogDescription: data.ogDescription,
        categories: {
          connect: categoryIds.map(id => ({ id }))
        },
        tags: {
          connect: tagIds.map(id => ({ id }))
        }
      }
    })

    revalidatePath("/blog")
    revalidatePath("/admin/blogs")
    revalidateSitemap()

    // Send email notifications only if the blog post is published
    if (data.status === "PUBLISHED") {
      // Fetch the complete blog post with relations for email notifications
      const completePost = await prisma.blogPost.findUnique({
        where: { id: post.id },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
              icon: true
            }
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          }
        }
      })

      if (completePost) {
        // Send email notifications in the background (don't await to avoid slowing down the response)
        sendBlogNotificationsToAllEmails(completePost as BlogPostWithRelations)
          .then((result) => {
            console.log(`Blog notification results for "${completePost.title}":`, result)
          })
          .catch((error) => {
            console.error(`Error sending blog notifications for "${completePost.title}":`, error)
          })
      }
    }

    return { success: true, post }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return { success: false, error: "Failed to create blog post" }
  }
}

// Calculate read time from content (async version for server actions)
export async function calculateReadTimeAsync(content: any): Promise<number> {
  let wordCount = 0
  
  if (typeof content === 'string') {
    // Strip HTML tags and count words
    const textContent = content.replace(/<[^>]*>/g, '').trim()
    wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length
  } else if (Array.isArray(content)) {
    content.forEach((block: any) => {
      if (block.type === 'paragraph' || block.type === 'heading') {
        wordCount += block.children?.reduce((acc: number, child: any) => {
          return acc + (child.text?.split(/\s+/).length || 0)
        }, 0) || 0
      } else if (block.type === 'code') {
        // Count code blocks as fewer words for reading time
        wordCount += Math.ceil((block.code?.split(/\s+/).length || 0) / 3)
      }
    })
  }

  // Average reading speed is 200-250 words per minute
  return Math.max(1, Math.ceil(wordCount / 225))
}

// Helper function to revalidate sitemap when content changes
function revalidateSitemap() {
  try {
    revalidatePath("/sitemap.xml")
  } catch (error) {
    console.error("Error revalidating sitemap:", error)
  }
}

// ===== ADMIN-SPECIFIC FUNCTIONS =====

// Get all blog posts for admin with filtering and pagination
export async function getAdminBlogPosts(
  page: number = 1,
  limit: number = 10,
  status?: BlogStatus,
  searchQuery?: string,
  categorySlug?: string,
  sortBy: 'createdAt' | 'updatedAt' | 'publishedAt' | 'views' | 'likes' = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{
  posts: BlogPostWithRelations[]
  totalPosts: number
  totalPages: number
  currentPage: number
  stats: {
    total: number
    published: number
    draft: number
    scheduled: number
    archived: number
  }
}> {
  const skip = (page - 1) * limit

  const where: any = {}

  if (status) {
    where.status = status
  }

  if (categorySlug) {
    where.categories = {
      some: {
        slug: categorySlug
      }
    }
  }

  if (searchQuery) {
    where.OR = [
      {
        title: {
          contains: searchQuery,
          mode: "insensitive"
        }
      },
      {
        excerpt: {
          contains: searchQuery,
          mode: "insensitive"
        }
      },
      {
        author: {
          contains: searchQuery,
          mode: "insensitive"
        }
      },
      {
        metaKeywords: {
          has: searchQuery.toLowerCase()
        }
      }
    ]
  }

  const orderBy: any = {}
  orderBy[sortBy] = sortOrder

  const [posts, totalPosts, stats] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    }),
    prisma.blogPost.count({ where }),
    // Get statistics
    prisma.blogPost.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    }).then(async (results) => {
      const statsMap = results.reduce((acc, item) => {
        acc[item.status.toLowerCase()] = item._count.status
        return acc
      }, {} as any)

      return {
        total: await prisma.blogPost.count(),
        published: statsMap.published || 0,
        draft: statsMap.draft || 0,
        scheduled: statsMap.scheduled || 0,
        archived: statsMap.archived || 0
      }
    })
  ])

  return {
    posts: posts as BlogPostWithRelations[],
    totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
    currentPage: page,
    stats
  }
}

// Get a single blog post for admin (any status)
export async function getAdminBlogPost(id: string): Promise<BlogPostWithRelations | null> {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          icon: true
        }
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true
        }
      }
    }
  })

  return post as BlogPostWithRelations | null
}

// Update blog post
export async function updateBlogPost(
  id: string,
  data: Partial<{
    title: string
    slug: string
    excerpt: string
    content: any
    featuredImage: string | null
    bannerImage: string | null
    author: string
    authorImage: string | null
    authorBio: string | null
    status: BlogStatus
    publishedAt: Date | null
    readTime: number
    metaTitle: string | null
    metaDescription: string | null
    metaKeywords: string[]
    canonicalUrl: string | null
    ogImage: string | null
    ogDescription: string | null
    categories: string[]
    tags: string[]
  }>
) {
  try {
    // Handle categories - get or create them
    const categoryIds: string[] = []
    if (data.categories && data.categories.length > 0) {
      for (const categoryName of data.categories) {
        const category = await getOrCreateCategory(categoryName)
        categoryIds.push(category.id)
      }
    }

    // Handle tags - get or create them
    const tagIds: string[] = []
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tag = await getOrCreateTag(tagName)
        tagIds.push(tag.id)
      }
    }

    // Calculate read time if content is being updated
    let readTime = data.readTime
    if (data.content && !readTime) {
      readTime = await calculateReadTimeAsync(data.content)
    }

    const updateData: any = {
      ...data,
      readTime
    }

    // Remove categories and tags from updateData as they need special handling
    delete updateData.categories
    delete updateData.tags

    // Handle categories and tags relationships
    if (data.categories !== undefined) {
      updateData.categories = {
        set: categoryIds.map(id => ({ id }))
      }
    }

    if (data.tags !== undefined) {
      updateData.tags = {
        set: tagIds.map(id => ({ id }))
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData
    })

    revalidatePath("/blog")
    revalidatePath("/admin/blogs")
    revalidateSitemap()

    // Send email notifications only if the blog post is published
    // Check if status was changed to PUBLISHED or if it's already published and content was updated
    if (data.status === "PUBLISHED" || (post.status === "PUBLISHED" && (data.content || data.title || data.excerpt))) {
      // Fetch the complete blog post with relations for email notifications
      const completePost = await prisma.blogPost.findUnique({
        where: { id },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
              icon: true
            }
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          }
        }
      })

      if (completePost) {
        // Send email notifications in the background (don't await to avoid slowing down the response)
        sendBlogNotificationsToAllEmails(completePost as BlogPostWithRelations)
          .then((result) => {
            console.log(`Blog notification results for "${completePost.title}":`, result)
          })
          .catch((error) => {
            console.error(`Error sending blog notifications for "${completePost.title}":`, error)
          })
      }
    }

    return { success: true, post }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return { success: false, error: "Failed to update blog post" }
  }
}

// Delete blog post
export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id }
    })

    revalidatePath("/blog")
    revalidatePath("/admin/blogs")
    revalidateSitemap()
    return { success: true }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, error: "Failed to delete blog post" }
  }
}

// Bulk update blog posts
export async function bulkUpdateBlogPosts(
  ids: string[],
  data: {
    status?: BlogStatus
    publishedAt?: Date | null
  }
) {
  try {
    await prisma.blogPost.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data
    })

    revalidatePath("/blog")
    revalidatePath("/admin/blogs")
    revalidateSitemap()
    return { success: true }
  } catch (error) {
    console.error("Error bulk updating blog posts:", error)
    return { success: false, error: "Failed to update blog posts" }
  }
}

// Get admin dashboard blog statistics
export async function getBlogStatistics() {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      scheduledPosts,
      archivedPosts,
      totalViews,
      totalLikes,
      recentPosts,
      popularPosts,
      categoriesWithCounts,
      tagsWithCounts
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.blogPost.count({ where: { status: 'DRAFT' } }),
      prisma.blogPost.count({ where: { status: 'SCHEDULED' } }),
      prisma.blogPost.count({ where: { status: 'ARCHIVED' } }),
      prisma.blogPost.aggregate({
        _sum: { views: true }
      }),
      prisma.blogPost.aggregate({
        _sum: { likes: true }
      }),
      prisma.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          author: true
        }
      }),
      prisma.blogPost.findMany({
        take: 5,
        orderBy: [
          { views: 'desc' },
          { likes: 'desc' }
        ],
        select: {
          id: true,
          title: true,
          views: true,
          likes: true,
          author: true
        }
      }),
      prisma.blogCategory.findMany({
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 10
      }),
      prisma.blogTag.findMany({
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: 10
      })
    ])

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      scheduledPosts,
      archivedPosts,
      totalViews: totalViews._sum.views || 0,
      totalLikes: totalLikes._sum.likes || 0,
      recentPosts,
      popularPosts,
      categoriesWithCounts,
      tagsWithCounts
    }
  } catch (error) {
    console.error("Error getting blog statistics:", error)
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      scheduledPosts: 0,
      archivedPosts: 0,
      totalViews: 0,
      totalLikes: 0,
      recentPosts: [],
      popularPosts: [],
      categoriesWithCounts: [],
      tagsWithCounts: []
    }
  }
}

// Reset view count for a blog post (useful for testing)
export async function resetBlogPostViews(id: string, newViewCount: number = 0) {
  try {
    await prisma.blogPost.update({
      where: { id },
      data: { views: newViewCount }
    })
    revalidatePath("/blog")
    revalidatePath("/admin/blogs")
    return { success: true }
  } catch (error) {
    console.error("Error resetting blog post views:", error)
    return { success: false, error: "Failed to reset views" }
  }
}

// Bulk reset view counts for multiple posts
export async function bulkResetBlogPostViews(ids: string[], newViewCount: number = 0) {
  try {
    await prisma.blogPost.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: { views: newViewCount }
    })
    revalidatePath("/blog")
    revalidatePath("/admin/blogs")
    return { success: true }
  } catch (error) {
    console.error("Error bulk resetting blog post views:", error)
    return { success: false, error: "Failed to reset views" }
  }
}

// Get a single blog post by slug WITHOUT incrementing views (for admin/preview)
export async function getBlogPostPreview(slug: string): Promise<BlogPostWithRelations | null> {
  return getBlogPost(slug, false) // trackView = false
}

// Get a single blog post by ID WITHOUT incrementing views (for admin)
export async function getBlogPostById(id: string, trackView: boolean = false): Promise<BlogPostWithRelations | null> {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          icon: true
        }
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true
        }
      }
    }
  })

  // Only increment views if explicitly requested
  if (post && trackView && post.status === "PUBLISHED") {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    })
  }

  return post as BlogPostWithRelations | null
} 