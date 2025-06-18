// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getBlogPosts, getBlogCategories, getBlogTags } from '@/lib/blog-actions'

const BASE_URL = 'https://www.techmorphers.com'

async function fetchDynamicBlogData() {
  try {
    // Fetch all published blog posts (we'll get all by setting a high limit)
    const blogData = await getBlogPosts(1, 1000) // Get up to 1000 posts
    const categories = await getBlogCategories()
    const tags = await getBlogTags()

    return {
      posts: blogData.posts,
      categories: categories.filter(cat => cat._count.posts > 0), // Only categories with posts
      tags: tags.filter(tag => tag._count.posts > 0) // Only tags with posts
    }
  } catch (error) {
    console.error('Error fetching dynamic blog data for sitemap:', error)
    return {
      posts: [],
      categories: [],
      tags: []
    }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, categories, tags } = await fetchDynamicBlogData()

  // Static routes with proper priorities and frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    // Homepage - Highest priority
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    
    // Main service pages - High priority
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services/web`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services/mobile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services/design`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services/game-development`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Important business pages
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/packages`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/estimator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Content pages
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/case-study`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/content`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },

    // Support and utility pages
    {
      url: `${BASE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },

    // User account pages - Lower priority
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Dynamic blog post routes
  const blogPostRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8, // High priority for individual blog posts
  }))

  // Dynamic blog category routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/blog/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6, // Medium priority for category pages
  }))

  // Dynamic blog tag routes
  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${BASE_URL}/blog/tag/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5, // Lower priority for tag pages
  }))

  // Combine all routes
  const allRoutes = [
    ...staticRoutes,
    ...blogPostRoutes,
    ...categoryRoutes,
    ...tagRoutes,
  ]

  // Sort by priority (descending) for better SEO
  return allRoutes.sort((a, b) => (b.priority || 0) - (a.priority || 0))
}
