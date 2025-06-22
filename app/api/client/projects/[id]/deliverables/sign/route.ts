import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const projectId = params.id
    const { clientSignature, clientId } = await request.json()

    if (!clientSignature || !clientId) {
      return NextResponse.json(
        { error: 'Client signature and client ID are required' },
        { status: 400 }
      )
    }

    // Verify client has access to this project
    const project = await prisma.estimator.findFirst({
      where: {
        id: projectId,
        clientId: clientId
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Update all deliverables for this project to mark as delivered
    await prisma.projectDeliverable.updateMany({
      where: { projectId: projectId, isDelivered: false },
      data: { isDelivered: true, deliveredAt: new Date(), clientSignedAt: new Date() }
    })

    // Get the updated deliverables for response
    const deliverables = await prisma.projectDeliverable.findMany({
      where: { projectId: projectId },
      orderBy: { uploadedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      message: 'Project deliverables signed successfully',
      deliverables: deliverables.map(d => ({
        id: d.id,
        fileName: d.originalName,
        fileUrl: d.fileUrl,
        fileSize: d.fileSize,
        isDelivered: d.isDelivered,
        deliveredAt: d.deliveredAt,
        clientSignedAt: d.clientSignedAt
      }))
    })

  } catch (error: any) {
    console.error('Error signing deliverables:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 