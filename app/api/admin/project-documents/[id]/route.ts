import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const documentId = params.id;
    const { title, description, type } = await request.json();

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    // Check if document exists
    const existingDocument = await prisma.clientDocument.findUnique({
      where: { id: documentId }
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Update the document
    const updatedDocument = await prisma.clientDocument.update({
      where: { id: documentId },
      data: {
        title,
        description: description || null,
        type: type as any
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Document updated successfully',
      document: updatedDocument
    });

  } catch (error: any) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the document first
    const document = await prisma.clientDocument.findUnique({
      where: { id }
    });

    if (!document) {
      return NextResponse.json({ 
        success: false, 
        error: 'Document not found' 
      }, { status: 404 });
    }

    // Delete the file from disk
    if (document.fileUrl.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', document.fileUrl);
      try {
        await unlink(filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete the document record from database
    await prisma.clientDocument.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete document' 
    }, { status: 500 });
  }
} 