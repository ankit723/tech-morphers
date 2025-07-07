import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Get client session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('client-session')

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionCookie.value)
    const clientId = session.id

    if (!clientId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project ID is required' 
      }, { status: 400 })
    }

    // Verify that the project belongs to the authenticated client
    const project = await prisma.estimator.findFirst({
      where: {
        id: projectId,
        clientId: clientId
      }
    })

    if (!project) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found or access denied' 
      }, { status: 404 })
    }

    // Fetch documents related to this specific project for this client
    const documents = await prisma.clientDocument.findMany({
      where: {
        estimatorId: projectId,
        clientId: clientId // Extra security check
      },
      orderBy: {
        uploadedAt: 'desc'
      },
      include: {
        estimator: {
          select: {
            id: true,
            projectType: true,
            projectPurpose: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        type: doc.type,
        contentType: doc.contentType,
        uploadedAt: doc.uploadedAt.toISOString(),
        fileUrl: doc.fileUrl,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        uploadedBy: doc.uploadedBy,
        requiresSignature: doc.requiresSignature,
        isSigned: doc.isSigned,
        signedAt: doc.signedAt?.toISOString(),
        invoiceNumber: doc.invoiceNumber,
        invoiceAmount: doc.invoiceAmount ? Number(doc.invoiceAmount) : null,
        currency: doc.currency,
        dueDate: doc.dueDate?.toISOString(),
        paymentStatus: doc.paymentStatus,
        description: doc.description,
        project: doc.estimator
      }))
    })
  } catch (error) {
    console.error('Error fetching client project documents:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch documents' 
    }, { status: 500 })
  }
} 