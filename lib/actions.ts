"use server"

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type DashboardStats = {
  contactInquiries: number
  estimatorRequests: number
  getStartedForms: number
  talkToUsForms: number
  letsTalkSubscriptions: number
  contactPageForms: number
  totalLeads: number
  recentActivities: Array<{
    id: string
    type: 'contact' | 'estimator' | 'getstarted' | 'talktous' | 'letstalk' | 'contactpage'
    name: string
    time: string
    status: 'new' | 'pending' | 'completed'
    details?: string
  }>
  packageDistribution: Record<string, number>
  topServices: Array<{ service: string; count: number }>
  monthlyTrends: {
    contactUs: { current: number; previous: number; change: number }
    estimator: { current: number; previous: number; change: number }
    getStarted: { current: number; previous: number; change: number }
    talkToUs: { current: number; previous: number; change: number }
    letsTalk: { current: number; previous: number; change: number }
    contactPage: { current: number; previous: number; change: number }
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get current date and previous month for comparison
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get total counts for each model
    const [
      contactInquiries,
      estimatorRequests,
      getStartedForms,
      talkToUsForms,
      letsTalkSubscriptions,
      contactPageForms
    ] = await Promise.all([
      prisma.contactUs.count(),
      prisma.estimator.count(),
      prisma.getStarted.count(),
      prisma.talkToUs.count(),
      prisma.letsTalk.count(),
      prisma.contactPage.count()
    ])

    // Get current month counts
    const [
      contactCurrentMonth,
      estimatorCurrentMonth,
      getStartedCurrentMonth,
      talkToUsCurrentMonth,
      letsTalkCurrentMonth,
      contactPageCurrentMonth
    ] = await Promise.all([
      prisma.contactUs.count({
        where: { createdAt: { gte: currentMonthStart } }
      }),
      prisma.estimator.count({
        where: { createdAt: { gte: currentMonthStart } }
      }),
      prisma.getStarted.count({
        where: { createdAt: { gte: currentMonthStart } }
      }),
      prisma.talkToUs.count({
        where: { createdAt: { gte: currentMonthStart } }
      }),
      prisma.letsTalk.count({
        where: { createdAt: { gte: currentMonthStart } }
      }),
      prisma.contactPage.count({
        where: { createdAt: { gte: currentMonthStart } }
      })
    ])

    // Get previous month counts
    const [
      contactPreviousMonth,
      estimatorPreviousMonth,
      getStartedPreviousMonth,
      talkToUsPreviousMonth,
      letsTalkPreviousMonth,
      contactPagePreviousMonth
    ] = await Promise.all([
      prisma.contactUs.count({
        where: { 
          createdAt: { 
            gte: previousMonthStart,
            lte: previousMonthEnd
          }
        }
      }),
      prisma.estimator.count({
        where: { 
          createdAt: { 
            gte: previousMonthStart,
            lte: previousMonthEnd
          }
        }
      }),
      prisma.getStarted.count({
        where: { 
          createdAt: { 
            gte: previousMonthStart,
            lte: previousMonthEnd
          }
        }
      }),
      prisma.talkToUs.count({
        where: { 
          createdAt: { 
            gte: previousMonthStart,
            lte: previousMonthEnd
          }
        }
      }),
      prisma.letsTalk.count({
        where: { 
          createdAt: { 
            gte: previousMonthStart,
            lte: previousMonthEnd
          }
        }
      }),
      prisma.contactPage.count({
        where: { 
          createdAt: { 
            gte: previousMonthStart,
            lte: previousMonthEnd
          }
        }
      })
    ])

    const totalLeads = contactInquiries + estimatorRequests + getStartedForms + talkToUsForms + letsTalkSubscriptions + contactPageForms

    // Get recent activities from all tables
    const [
      recentContacts,
      recentEstimators,
      recentGetStarted,
      recentTalkToUs,
      recentLetsTalk,
      recentContactPage
    ] = await Promise.all([
      prisma.contactUs.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          companyName: true,
          selectedPackage: true,
          createdAt: true
        }
      }),
      prisma.estimator.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          companyName: true,
          projectType: true,
          budgetRange: true,
          createdAt: true
        }
      }),
      prisma.getStarted.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          companyName: true,
          service: true,
          budget: true,
          createdAt: true
        }
      }),
      prisma.talkToUs.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          companyName: true,
          createdAt: true
        }
      }),
      prisma.letsTalk.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          createdAt: true
        }
      }),
      prisma.contactPage.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true
        }
      })
    ])

    // Format recent activities
    const recentActivities = [
      ...recentContacts.map(item => ({
        id: item.id,
        type: 'contact' as const,
        name: `${item.name}${item.companyName ? ` from ${item.companyName}` : ''}`,
        time: formatTimeAgo(item.createdAt),
        status: 'new' as const,
        details: `Package: ${item.selectedPackage}`
      })),
      ...recentEstimators.map(item => ({
        id: item.id,
        type: 'estimator' as const,
        name: `${item.fullName}${item.projectType ? ` - ${item.projectType}` : ''}${item.companyName ? ` (${item.companyName})` : ''}`,
        time: formatTimeAgo(item.createdAt),
        status: 'pending' as const,
        details: item.budgetRange ? `Budget: ${item.budgetRange}` : undefined
      })),
      ...recentGetStarted.map(item => ({
        id: item.id,
        type: 'getstarted' as const,
        name: `${item.name} - ${item.service}${item.companyName ? ` (${item.companyName})` : ''}`,
        time: formatTimeAgo(item.createdAt),
        status: 'new' as const,
        details: item.budget ? `Budget: ${item.budget}` : undefined
      })),
      ...recentTalkToUs.map(item => ({
        id: item.id,
        type: 'talktous' as const,
        name: `${item.name}${item.companyName ? ` from ${item.companyName}` : ''}`,
        time: formatTimeAgo(item.createdAt),
        status: 'new' as const
      })),
      ...recentLetsTalk.map(item => ({
        id: item.id,
        type: 'letstalk' as const,
        name: `Newsletter subscription: ${item.email}`,
        time: formatTimeAgo(item.createdAt),
        status: 'completed' as const,
        details: `Email subscription`
      })),
      ...recentContactPage.map(item => ({
        id: item.id,
        type: 'contactpage' as const,
        name: `${item.name} (${item.email})`,
        time: formatTimeAgo(item.createdAt),
        status: 'new' as const,
        details: item.phone ? `Phone: ${item.phone}` : undefined
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 20)

    // Get package distribution from ContactUs
    const packageDistribution = await prisma.contactUs.groupBy({
      by: ['selectedPackage'],
      _count: {
        selectedPackage: true
      }
    })

    const packageStats = packageDistribution.reduce((acc, item) => {
      acc[item.selectedPackage] = item._count.selectedPackage
      return acc
    }, {} as Record<string, number>)

    // Get top services from GetStarted
    const serviceDistribution = await prisma.getStarted.groupBy({
      by: ['service'],
      _count: {
        service: true
      },
      orderBy: {
        _count: {
          service: 'desc'
        }
      },
      take: 5
    })

    const topServices = serviceDistribution.map(item => ({
      service: item.service,
      count: item._count.service
    }))

    // Calculate monthly trends
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    const monthlyTrends = {
      contactUs: {
        current: contactCurrentMonth,
        previous: contactPreviousMonth,
        change: calculateChange(contactCurrentMonth, contactPreviousMonth)
      },
      estimator: {
        current: estimatorCurrentMonth,
        previous: estimatorPreviousMonth,
        change: calculateChange(estimatorCurrentMonth, estimatorPreviousMonth)
      },
      getStarted: {
        current: getStartedCurrentMonth,
        previous: getStartedPreviousMonth,
        change: calculateChange(getStartedCurrentMonth, getStartedPreviousMonth)
      },
      talkToUs: {
        current: talkToUsCurrentMonth,
        previous: talkToUsPreviousMonth,
        change: calculateChange(talkToUsCurrentMonth, talkToUsPreviousMonth)
      },
      letsTalk: {
        current: letsTalkCurrentMonth,
        previous: letsTalkPreviousMonth,
        change: calculateChange(letsTalkCurrentMonth, letsTalkPreviousMonth)
      },
      contactPage: {
        current: contactPageCurrentMonth,
        previous: contactPagePreviousMonth,
        change: calculateChange(contactPageCurrentMonth, contactPagePreviousMonth)
      }
    }

    return {
      contactInquiries,
      estimatorRequests,
      getStartedForms,
      talkToUsForms,
      letsTalkSubscriptions,
      contactPageForms,
      totalLeads,
      recentActivities,
      packageDistribution: packageStats,
      topServices,
      monthlyTrends
    }

  } catch (error) {
    console.error('Dashboard stats error:', error)
    // Return default/empty data in case of error
    return {
      contactInquiries: 0,
      estimatorRequests: 0,
      getStartedForms: 0,
      talkToUsForms: 0,
      letsTalkSubscriptions: 0,
      contactPageForms: 0,
      totalLeads: 0,
      recentActivities: [],
      packageDistribution: {},
      topServices: [],
      monthlyTrends: {
        contactUs: { current: 0, previous: 0, change: 0 },
        estimator: { current: 0, previous: 0, change: 0 },
        getStarted: { current: 0, previous: 0, change: 0 },
        talkToUs: { current: 0, previous: 0, change: 0 },
        letsTalk: { current: 0, previous: 0, change: 0 },
        contactPage: { current: 0, previous: 0, change: 0 }
      }
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Additional server actions for individual data retrieval

export async function getContactUsEntries() {
  try {
    return await prisma.contactUs.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  } catch (error) {
    console.error('Error fetching ContactUs entries:', error)
    return []
  }
}

export async function getEstimatorEntries() {
  try {
    return await prisma.estimator.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  } catch (error) {
    console.error('Error fetching Estimator entries:', error)
    return []
  }
}

export async function getGetStartedEntries() {
  try {
    return await prisma.getStarted.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  } catch (error) {
    console.error('Error fetching GetStarted entries:', error)
    return []
  }
}

export async function getTalkToUsEntries() {
  try {
    return await prisma.talkToUs.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  } catch (error) {
    console.error('Error fetching TalkToUs entries:', error)
    return []
  }
}

export async function getLetsTalkEntries() {
  try {
    return await prisma.letsTalk.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  } catch (error) {
    console.error('Error fetching LetsTalk entries:', error)
    return []
  }
}

export async function getContactPageEntries() {
  try {
    return await prisma.contactPage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  } catch (error) {
    console.error('Error fetching ContactPage entries:', error)
    return []
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  } else {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }
} 