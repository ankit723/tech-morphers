// app/sitemap.ts
import { MetadataRoute } from 'next';
import { readdirSync } from 'fs';
import { join } from 'path';

async function fetchDynamicPages() {
  const dynamicPages = [];
  
  const fallbackBlogs = [
    { slug: 'blog/blog-1', updatedAt: new Date(), priority: 0.7, changeFrequency: 'weekly' as const },
    { slug: 'blog/blog-2', updatedAt: new Date(), priority: 0.7, changeFrequency: 'weekly' as const },
    { slug: 'blog/blog-3', updatedAt: new Date(), priority: 0.7, changeFrequency: 'weekly' as const }
  ];
  const fallbackCaseStudies = [
    { slug: 'case-study/case-study-1', updatedAt: new Date(), priority: 0.8, changeFrequency: 'monthly' as const },
    { slug: 'case-study/case-study-2', updatedAt: new Date(), priority: 0.8, changeFrequency: 'monthly' as const },
    { slug: 'case-study/case-study-3', updatedAt: new Date(), priority: 0.8, changeFrequency: 'monthly' as const }
  ];
  dynamicPages.push(...fallbackBlogs, ...fallbackCaseStudies);

  return dynamicPages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicPages = await fetchDynamicPages();

  const dynamicRoutes = dynamicPages.map((page) => ({
    url: `https://www.techmorphers.com/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const staticRoutes = [
    // Homepage - Highest priority
    {
      url: 'https://www.techmorphers.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    
    // Main service pages - High priority
    {
      url: 'https://www.techmorphers.com/services',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.techmorphers.com/services/web',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.techmorphers.com/services/mobile',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.techmorphers.com/services/design',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.techmorphers.com/services/game-development',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },

    // Important business pages
    {
      url: 'https://www.techmorphers.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.techmorphers.com/about-us',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.techmorphers.com/packages',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.techmorphers.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://www.techmorphers.com/estimator',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },

    // Content pages
    {
      url: 'https://www.techmorphers.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: 'https://www.techmorphers.com/case-study',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: 'https://www.techmorphers.com/content',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },

    // Support and utility pages
    {
      url: 'https://www.techmorphers.com/support',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://www.techmorphers.com/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },

    // User account pages - Lower priority
    {
      url: 'https://www.techmorphers.com/login',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: 'https://www.techmorphers.com/register',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  return [...staticRoutes, ...dynamicRoutes] as MetadataRoute.Sitemap;
}
