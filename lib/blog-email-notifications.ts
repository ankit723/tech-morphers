"use server"

import { prisma } from "@/lib/db"
import { sendEmail } from "@/lib/emailer"
import { BlogNotificationEmail } from "@/components/emails/NotificationEmails"
import type { BlogPostWithRelations } from "@/lib/blog-actions"

// Configuration for email rate limiting
const EMAIL_RATE_CONFIG = {
  BATCH_SIZE: 1, // Process one email at a time to avoid parallel rate limiting
  BATCH_DELAY: 600, // 600ms delay to stay under 2 emails/second (allows buffer)
  MAX_RETRIES: 3, // Maximum number of retries for rate limited emails
  RETRY_BASE_DELAY: 1000, // Base delay for exponential backoff (1 second)
  RESEND_RATE_LIMIT: 2, // Resend allows 2 emails per second
  SAFETY_BUFFER: 100 // Extra buffer in milliseconds
}

// Calculate optimal delay based on rate limits
function calculateOptimalDelay(rateLimit: number, safetyBuffer: number = 100): number {
  return Math.ceil(1000 / rateLimit) + safetyBuffer
}

// Collect all unique email addresses from all database tables
export async function getAllUniqueEmails(): Promise<string[]> {
  try {
    const [
      contactUsEmails,
      estimatorEmails,
      getStartedEmails,
      talkToUsEmails,
      letsTalkEmails,
      contactPageEmails
    ] = await Promise.all([
      // Contact Us emails
      prisma.contactUs.findMany({
        select: { email: true },
        distinct: ['email']
      }),
      // Estimator emails  
      prisma.estimator.findMany({
        select: { email: true },
        distinct: ['email']
      }),
      // Get Started emails
      prisma.getStarted.findMany({
        select: { email: true },
        distinct: ['email']
      }),
      // Talk To Us emails
      prisma.talkToUs.findMany({
        select: { email: true },
        distinct: ['email']
      }),
      // Let's Talk emails (newsletter subscribers)
      prisma.letsTalk.findMany({
        select: { email: true },
        distinct: ['email']
      }),
      // Contact Page emails
      prisma.contactPage.findMany({
        select: { email: true },
        distinct: ['email']
      })
    ])

    // Combine all emails and remove duplicates
    const allEmails = [
      ...contactUsEmails.map(item => item.email),
      ...estimatorEmails.map(item => item.email),
      ...getStartedEmails.map(item => item.email),
      ...talkToUsEmails.map(item => item.email),
      ...letsTalkEmails.map(item => item.email),
      ...contactPageEmails.map(item => item.email)
    ]

    // Remove duplicates and filter out invalid emails
    const uniqueEmails = [...new Set(allEmails)]
      .filter(email => email && isValidEmail(email))
      .map(email => email.toLowerCase().trim())

    console.log(`Found ${uniqueEmails.length} unique email addresses for blog notifications`)
    return uniqueEmails

  } catch (error) {
    console.error("Error collecting unique emails:", error)
    return []
  }
}

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Send blog notification to a single email with retry logic
async function sendBlogNotificationToEmail(
  email: string, 
  blogPost: BlogPostWithRelations,
  retryCount: number = 0,
  maxRetries: number = EMAIL_RATE_CONFIG.MAX_RETRIES
): Promise<{ success: boolean; error?: string }> {
  try {
    const categoryNames = blogPost.categories.map(cat => cat.name)
    
    const emailResult = await sendEmail({
      to: email,
      subject: `📖 New Blog Post: ${blogPost.title}`,
      react: BlogNotificationEmail({
        blogTitle: blogPost.title,
        blogExcerpt: blogPost.excerpt,
        blogSlug: blogPost.slug,
        blogAuthor: blogPost.author,
        blogReadTime: blogPost.readTime,
        blogFeaturedImage: blogPost.featuredImage || undefined,
        blogCategories: categoryNames,
        subscriberEmail: email
      })
    })

    if (emailResult.error) {
      const errorMessage = emailResult.error.message
      
      // Check if it's a rate limit error and retry if we haven't exceeded max retries
      if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * EMAIL_RATE_CONFIG.RETRY_BASE_DELAY // Exponential backoff
          console.log(`Rate limit hit for ${email}, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          return sendBlogNotificationToEmail(email, blogPost, retryCount + 1, maxRetries)
        } else {
          console.error(`Max retries exceeded for ${email} due to rate limiting`)
        }
      }
      
      console.error(`Failed to send blog notification to ${email}:`, emailResult.error)
      return { success: false, error: errorMessage }
    }

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    // Check if it's a rate limit error and retry
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * EMAIL_RATE_CONFIG.RETRY_BASE_DELAY // Exponential backoff
        console.log(`Rate limit exception for ${email}, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
        return sendBlogNotificationToEmail(email, blogPost, retryCount + 1, maxRetries)
      } else {
        console.error(`Max retries exceeded for ${email} due to rate limiting exception`)
      }
    }
    
    console.error(`Error sending blog notification to ${email}:`, error)
    return { success: false, error: errorMessage }
  }
}

// Send blog notifications to all unique emails with rate limiting
export async function sendBlogNotificationsToAllEmails(
  blogPost: BlogPostWithRelations
): Promise<{
  totalEmails: number
  successCount: number
  failureCount: number
  errors: string[]
}> {
  console.log(`Starting blog notification process for: "${blogPost.title}"`)
  
  const allEmails = await getAllUniqueEmails()
  console.log("allEmails", allEmails)
  const totalEmails = allEmails.length

  if (totalEmails === 0) {
    console.log("No emails found to notify")
    return {
      totalEmails: 0,
      successCount: 0,
      failureCount: 0,
      errors: []
    }
  }

  let successCount = 0
  let failureCount = 0
  const errors: string[] = []

  // Use configuration for rate limiting
  const { BATCH_SIZE, MAX_RETRIES } = EMAIL_RATE_CONFIG
  const optimalDelay = calculateOptimalDelay(EMAIL_RATE_CONFIG.RESEND_RATE_LIMIT, EMAIL_RATE_CONFIG.SAFETY_BUFFER)
  
  console.log(`Using optimal delay of ${optimalDelay}ms between emails (rate limit: ${EMAIL_RATE_CONFIG.RESEND_RATE_LIMIT}/second)`)

  for (let i = 0; i < allEmails.length; i += BATCH_SIZE) {
    const batch = allEmails.slice(i, i + BATCH_SIZE)
    console.log(`Processing email ${i + 1}/${allEmails.length}: ${batch[0]}`)

    // Process emails one by one to avoid rate limiting
    for (const email of batch) {
      try {
        const result = await sendBlogNotificationToEmail(email, blogPost, 0, MAX_RETRIES)
        
        if (result.success) {
          successCount++
          console.log(`✓ Successfully sent to ${email}`)
        } else {
          failureCount++
          errors.push(`${email}: ${result.error}`)
          console.error(`✗ Failed to send to ${email}: ${result.error}`)
        }
      } catch (error) {
        failureCount++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`${email}: ${errorMessage}`)
        console.error(`✗ Exception sending to ${email}:`, error)
      }

      // Add delay between each email to respect rate limits
      if (i + 1 < allEmails.length) {
        console.log(`Waiting ${optimalDelay}ms before next email...`)
        await new Promise(resolve => setTimeout(resolve, optimalDelay))
      }
    }
  }

  console.log(`Blog notification process completed:`, {
    totalEmails,
    successCount,
    failureCount,
    errors: errors.slice(0, 5) // Log first 5 errors
  })

  return {
    totalEmails,
    successCount,
    failureCount,
    errors
  }
}

// Optional: Create an email preferences table for unsubscribe functionality
export async function createEmailPreferencesTable() {
  // This would be added to your Prisma schema:
  /*
  model EmailPreferences {
    id                    String   @id @default(uuid())
    email                 String   @unique
    blogNotifications     Boolean  @default(true)
    marketingEmails       Boolean  @default(true)
    productUpdates        Boolean  @default(true)
    unsubscribedAt        DateTime?
    createdAt             DateTime @default(now())
    updatedAt             DateTime @updatedAt
    
    @@index([email])
  }
  */
}

// Test email sending with a small batch to verify rate limiting
export async function testBlogNotificationRateLimit(
  blogPost: BlogPostWithRelations,
  testEmails: string[] = [],
  maxTestEmails: number = 5
): Promise<{
  totalEmails: number
  successCount: number
  failureCount: number
  errors: string[]
  timeTaken: number
}> {
  console.log(`Testing blog notification rate limiting...`)
  
  const startTime = Date.now()
  
  // Use test emails or get a few real emails for testing
  let emailsToTest: string[]
  if (testEmails.length > 0) {
    emailsToTest = testEmails.slice(0, maxTestEmails)
  } else {
    const allEmails = await getAllUniqueEmails()
    emailsToTest = allEmails.slice(0, maxTestEmails)
  }
  
  console.log(`Testing with ${emailsToTest.length} emails:`, emailsToTest)
  
  let successCount = 0
  let failureCount = 0
  const errors: string[] = []
  
  const optimalDelay = calculateOptimalDelay(EMAIL_RATE_CONFIG.RESEND_RATE_LIMIT, EMAIL_RATE_CONFIG.SAFETY_BUFFER)
  console.log(`Using optimal delay of ${optimalDelay}ms between emails`)

  for (let i = 0; i < emailsToTest.length; i++) {
    const email = emailsToTest[i]
    console.log(`Sending test email ${i + 1}/${emailsToTest.length} to ${email}`)
    
    try {
      const result = await sendBlogNotificationToEmail(email, blogPost, 0, EMAIL_RATE_CONFIG.MAX_RETRIES)
      
      if (result.success) {
        successCount++
        console.log(`✓ Successfully sent test email to ${email}`)
      } else {
        failureCount++
        errors.push(`${email}: ${result.error}`)
        console.error(`✗ Failed to send test email to ${email}: ${result.error}`)
      }
    } catch (error) {
      failureCount++
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      errors.push(`${email}: ${errorMessage}`)
      console.error(`✗ Exception sending test email to ${email}:`, error)
    }

    // Add delay between emails (except for the last one)
    if (i + 1 < emailsToTest.length) {
      console.log(`Waiting ${optimalDelay}ms before next test email...`)
      await new Promise(resolve => setTimeout(resolve, optimalDelay))
    }
  }

  const timeTaken = Date.now() - startTime
  
  console.log(`Test completed in ${timeTaken}ms:`, {
    totalEmails: emailsToTest.length,
    successCount,
    failureCount,
    errors: errors.slice(0, 3) // Log first 3 errors
  })

  return {
    totalEmails: emailsToTest.length,
    successCount,
    failureCount,
    errors,
    timeTaken
  }
}

// Send comment notifications to all emails
export async function sendCommentNotificationsToAllEmails(
  postId: string,
  commentId: string
): Promise<{
  totalEmails: number
  successCount: number
  failureCount: number
  errors: string[]
}> {
  console.log(`🗨️ New comment notification for comment: ${commentId}`)
  
  try {
    // Get the blog post
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      include: {
        categories: true,
        tags: true,
      }
    })

    if (!post) {
      return { totalEmails: 0, successCount: 0, failureCount: 0, errors: ["Post not found"] }
    }

    // Transform to BlogPostWithRelations
    const blogPost: BlogPostWithRelations = {
      ...post,
      tags: post.tags || [],
      categories: post.categories || [],
    } as BlogPostWithRelations

    // Use existing email system with catchy subject
    const catchySubjects = [
      `💬 Hot Discussion: "${post.title}" just got a new comment!`,
      `🔥 Trending Now: New comment on "${post.title}"`,
      `⚡ Breaking: Someone just shared their thoughts on "${post.title}"`,
      `🗨️ Join the conversation: New comment on "${post.title}"`,
      `💭 Community Buzz: "${post.title}" sparked a new comment!`
    ]
    
    // Temporarily modify the title to include catchy subject
    const originalTitle = blogPost.title
    blogPost.title = catchySubjects[Math.floor(Math.random() * catchySubjects.length)]

    const result = await sendBlogNotificationsToAllEmails(blogPost)

    // Restore original title
    blogPost.title = originalTitle

    return result

  } catch (error) {
    console.error("Error sending comment notifications:", error)
    return { totalEmails: 0, successCount: 0, failureCount: 0, errors: [error instanceof Error ? error.message : 'Unknown error'] }
  }
}

// Get email notification stats
export async function getBlogNotificationStats(): Promise<{
  totalUniqueEmails: number
  emailsBySource: {
    contactUs: number
    estimator: number
    getStarted: number
    talkToUs: number
    letsTalk: number
    contactPage: number
  }
  rateLimit: {
    emailsPerSecond: number
    optimalDelay: number
    maxRetries: number
  }
}> {
  try {
    const [
      contactUsCount,
      estimatorCount,
      getStartedCount,
      talkToUsCount,
      letsTalkCount,
      contactPageCount,
      allEmails
    ] = await Promise.all([
      prisma.contactUs.findMany({ select: { email: true }, distinct: ['email'] }),
      prisma.estimator.findMany({ select: { email: true }, distinct: ['email'] }),
      prisma.getStarted.findMany({ select: { email: true }, distinct: ['email'] }),
      prisma.talkToUs.findMany({ select: { email: true }, distinct: ['email'] }),
      prisma.letsTalk.findMany({ select: { email: true }, distinct: ['email'] }),
      prisma.contactPage.findMany({ select: { email: true }, distinct: ['email'] }),
      getAllUniqueEmails()
    ])

    return {
      totalUniqueEmails: allEmails.length,
      emailsBySource: {
        contactUs: contactUsCount.length,
        estimator: estimatorCount.length,
        getStarted: getStartedCount.length,
        talkToUs: talkToUsCount.length,
        letsTalk: letsTalkCount.length,
        contactPage: contactPageCount.length
      },
      rateLimit: {
        emailsPerSecond: EMAIL_RATE_CONFIG.RESEND_RATE_LIMIT,
        optimalDelay: calculateOptimalDelay(EMAIL_RATE_CONFIG.RESEND_RATE_LIMIT, EMAIL_RATE_CONFIG.SAFETY_BUFFER),
        maxRetries: EMAIL_RATE_CONFIG.MAX_RETRIES
      }
    }
  } catch (error) {
    console.error("Error getting blog notification stats:", error)
    return {
      totalUniqueEmails: 0,
      emailsBySource: {
        contactUs: 0,
        estimator: 0,
        getStarted: 0,
        talkToUs: 0,
        letsTalk: 0,
        contactPage: 0
      },
      rateLimit: {
        emailsPerSecond: 0,
        optimalDelay: 0,
        maxRetries: 0
      }
    }
  }
}