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

// Helper function to calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get current month data
    const [
      contactUs,
      estimator,
      getStarted,
      talkToUs,
      letsTalk,
      contactPage,
    ] = await Promise.all([
      prisma.contactUs.findMany({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.estimator.findMany({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.getStarted.findMany({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.talkToUs.findMany({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.letsTalk.findMany({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.contactPage.findMany({ where: { createdAt: { gte: startOfMonth } } }),
    ])

    // Get previous month data for comparison
    const [
      prevContactUs,
      prevEstimator,
      prevGetStarted,
      prevTalkToUs,
      prevLetsTalk,
      prevContactPage,
    ] = await Promise.all([
      prisma.contactUs.findMany({ 
        where: { 
          createdAt: { 
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonth
          } 
        } 
      }),
      prisma.estimator.findMany({ 
        where: { 
          createdAt: { 
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonth
          } 
        } 
      }),
      prisma.getStarted.findMany({ 
        where: { 
          createdAt: { 
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonth
          } 
        } 
      }),
      prisma.talkToUs.findMany({ 
        where: { 
          createdAt: { 
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonth
          } 
        } 
      }),
      prisma.letsTalk.findMany({ 
        where: { 
          createdAt: { 
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonth
          } 
        } 
      }),
      prisma.contactPage.findMany({ 
        where: { 
          createdAt: { 
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonth
          } 
        } 
      }),
    ])

    // Get all-time data for totals
    const [
      allContactUs,
      allEstimator,
      allGetStarted,
      allTalkToUs,
      allLetsTalk,
      allContactPage,
    ] = await Promise.all([
      prisma.contactUs.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.estimator.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.getStarted.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.talkToUs.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.letsTalk.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.contactPage.findMany({ orderBy: { createdAt: 'desc' } }),
    ])

    // Calculate package distribution
    const packageDistribution = allContactUs.reduce((acc, contact) => {
      const packageName = contact.selectedPackage
      acc[packageName] = (acc[packageName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Calculate top services from getStarted
    const serviceCount = allGetStarted.reduce((acc, entry) => {
      const service = entry.service
      acc[service] = (acc[service] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topServices = Object.entries(serviceCount)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Create recent activities (last 20 items across all forms)
    const recentActivities = [
      ...allContactUs.slice(0, 5).map(item => ({
        id: item.id,
        type: 'contact' as const,
        name: item.name,
        time: item.createdAt.toISOString(),
        status: 'new' as const,
        details: `Package: ${item.selectedPackage}`
      })),
      ...allEstimator.slice(0, 5).map(item => ({
        id: item.id,
        type: 'estimator' as const,
        name: item.fullName,
        time: item.createdAt.toISOString(),
        status: 'new' as const,
        details: item.projectType || 'Project estimation'
      })),
      ...allGetStarted.slice(0, 5).map(item => ({
        id: item.id,
        type: 'getstarted' as const,
        name: item.name,
        time: item.createdAt.toISOString(),
        status: 'new' as const,
        details: `Service: ${item.service}`
      })),
      ...allTalkToUs.slice(0, 3).map(item => ({
        id: item.id,
        type: 'talktous' as const,
        name: item.name,
        time: item.createdAt.toISOString(),
        status: 'new' as const,
        details: item.message.substring(0, 50) + '...'
      })),
      ...allLetsTalk.slice(0, 2).map(item => ({
        id: item.id,
        type: 'letstalk' as const,
        name: item.email,
        time: item.createdAt.toISOString(),
        status: 'new' as const,
        details: 'Newsletter subscription'
      })),
      ...allContactPage.slice(0, 3).map(item => ({
        id: item.id,
        type: 'contactpage' as const,
        name: item.name,
        time: item.createdAt.toISOString(),
        status: 'new' as const,
        details: item.message.substring(0, 50) + '...'
      }))
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 20)

    return {
      contactInquiries: allContactUs.length,
      estimatorRequests: allEstimator.length,
      getStartedForms: allGetStarted.length,
      talkToUsForms: allTalkToUs.length,
      letsTalkSubscriptions: allLetsTalk.length,
      contactPageForms: allContactPage.length,
      totalLeads: allContactUs.length + allEstimator.length + allGetStarted.length + allTalkToUs.length + allContactPage.length,
      recentActivities,
      packageDistribution,
      topServices,
      monthlyTrends: {
        contactUs: {
          current: contactUs.length,
          previous: prevContactUs.length,
          change: calculatePercentageChange(contactUs.length, prevContactUs.length)
        },
        estimator: {
          current: estimator.length,
          previous: prevEstimator.length,
          change: calculatePercentageChange(estimator.length, prevEstimator.length)
        },
        getStarted: {
          current: getStarted.length,
          previous: prevGetStarted.length,
          change: calculatePercentageChange(getStarted.length, prevGetStarted.length)
        },
        talkToUs: {
          current: talkToUs.length,
          previous: prevTalkToUs.length,
          change: calculatePercentageChange(talkToUs.length, prevTalkToUs.length)
        },
        letsTalk: {
          current: letsTalk.length,
          previous: prevLetsTalk.length,
          change: calculatePercentageChange(letsTalk.length, prevLetsTalk.length)
        },
        contactPage: {
          current: contactPage.length,
          previous: prevContactPage.length,
          change: calculatePercentageChange(contactPage.length, prevContactPage.length)
        }
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    // Return default stats in case of error
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
      where: {
        customRequests: {
        not: {
            contains: 'PARTIAL SUBMISSION'
          }
        }
      },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
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

// Get all clients
export async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        companyName: true,
        systemPassword: true,
        hasChangedPassword: true,
        createdAt: true,
        lastLoginAt: true,
        estimators: {
          select: {
            id: true,
            projectType: true,
            fullName: true,
            email: true,
            phone: true,
            companyName: true,
            projectPurpose: true,
            budgetRange: true,
            deliveryTimeline: true,
            customRequests: true,
            createdAt: true
          }
        },
        documents: {
          select: {
            id: true,
            title: true,
            type: true,
            uploadedAt: true,
            fileUrl: true,
            fileName: true,
            fileSize: true,
            uploadedBy: true,
            requiresSignature: true,
            isSigned: true,
            signedAt: true,
            invoiceNumber: true,
            invoiceAmount: true,
            currency: true,
            dueDate: true,
            paymentStatus: true,
            paymentProof: true,
            verifiedAt: true,
            verifiedBy: true,
            paidAt: true
          }
        }
      }
    })

    // Convert Decimal values to numbers for client components
    return clients.map(client => ({
      ...client,
      documents: client.documents.map(doc => ({
        ...doc,
        invoiceAmount: doc.invoiceAmount ? Number(doc.invoiceAmount) : null
      }))
    }))
  } catch (error) {
    console.error('Error fetching clients:', error)
    return []
  }
} 