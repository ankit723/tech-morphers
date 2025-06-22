import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { uploadFileToGCS } from '@/lib/googleCloudStorage'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const projectId = params.id

    // Check if project exists and get payment information
    const project = await prisma.estimator.findUnique({
      where: { id: projectId },
      include: {
        documents: {
          where: {
            type: 'INVOICE',
            paymentStatus: {
              in: ['VERIFIED', 'PAID']
            }
          },
          select: {
            invoiceAmount: true,
            paymentStatus: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if project has a cost defined
    if (!project.projectCost) {
      return NextResponse.json(
        { 
          error: 'Project cost must be defined before uploading deliverables. Please set the project cost first.' 
        },
        { status: 400 }
      )
    }

    // Calculate total paid amount
    const totalPaid = project.documents.reduce((sum, doc) => {
      if (doc.invoiceAmount && (doc.paymentStatus === 'PAID' || doc.paymentStatus === 'VERIFIED')) {
        return sum + Number(doc.invoiceAmount);
      }
      return sum;
    }, 0);

    const projectCost = Number(project.projectCost)

    // Check if project is fully paid
    if (totalPaid < projectCost) {
      const remainingAmount = projectCost - totalPaid
      return NextResponse.json(
        { 
          error: `Cannot upload deliverables. Project cost (${project.currency || 'USD'} ${projectCost.toFixed(2)}) is not fully paid. Remaining amount: ${project.currency || 'USD'} ${remainingAmount.toFixed(2)}` 
        },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const uploadedBy = formData.get('uploadedBy') as string

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    if (!uploadedBy) {
      return NextResponse.json(
        { error: 'Uploader information is required' },
        { status: 400 }
      )
    }

    const uploadResults = []
    const failedUploads = []

    for (const file of files) {
      // Validate file type (only zip files allowed)
      if (!file.name.toLowerCase().endsWith('.zip')) {
        failedUploads.push({
          fileName: file.name,
          error: 'Only ZIP files are allowed'
        })
        continue
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const timestamp = Date.now()
        const fileName = `${timestamp}-${file.name}`

        // Upload to Google Cloud Storage
        const uploadResult = await uploadFileToGCS(
          buffer,
          fileName,
          `project-deliverables/${projectId}/`,
          'application/zip'
        )

        if (uploadResult.success && uploadResult.url) {
          // Save file info to database
          const deliverable = await prisma.projectDeliverable.create({
            data: {
              projectId,
              fileName: uploadResult.fileName || fileName,
              originalName: file.name,
              fileUrl: uploadResult.url,
              fileSize: buffer.length,
              uploadedBy
            }
          })

          uploadResults.push({
            id: deliverable.id,
            fileName: file.name,
            url: uploadResult.url,
            size: buffer.length
          })
        } else {
          failedUploads.push({
            fileName: file.name,
            error: uploadResult.error || 'Upload failed'
          })
        }
      } catch (error) {
        console.error('Error processing file:', file.name, error)
        failedUploads.push({
          fileName: file.name,
          error: 'Processing failed'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `${uploadResults.length} files uploaded successfully`,
      uploadedFiles: uploadResults,
      failedUploads: failedUploads.length > 0 ? failedUploads : undefined
    })

  } catch (error: any) {
    console.error('Error uploading deliverables:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const projectId = params.id

    // Get all deliverables for this project
    const deliverables = await prisma.projectDeliverable.findMany({
      where: { projectId },
      orderBy: { uploadedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      deliverables: deliverables.map(d => ({
        id: d.id,
        fileName: d.originalName,
        fileUrl: d.fileUrl,
        fileSize: d.fileSize,
        uploadedBy: d.uploadedBy,
        uploadedAt: d.uploadedAt,
        isDelivered: d.isDelivered,
        deliveredAt: d.deliveredAt,
        clientSignedAt: d.clientSignedAt
      }))
    })

  } catch (error: any) {
    console.error('Error fetching deliverables:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 