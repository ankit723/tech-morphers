import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
    // Get client session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('client-session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const clientId = session.id;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const documentId = params.id;

    // Find the document and verify it belongs to the authenticated client
    const document = await prisma.clientDocument.findFirst({
      where: {
        id: documentId,
        clientId: clientId
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or access denied' },
        { status: 404 }
      );
    }

    // Fetch the file from the URL
    const fileResponse = await fetch(document.fileUrl);
    
    if (!fileResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch document' },
        { status: 500 }
      );
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    
    // Determine content type based on file extension
    const getContentType = (fileName: string) => {
      const ext = fileName.toLowerCase().split('.').pop();
      switch (ext) {
        case 'pdf': return 'application/pdf';
        case 'doc': return 'application/msword';
        case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'jpg': case 'jpeg': return 'image/jpeg';
        case 'png': return 'image/png';
        case 'txt': return 'text/plain';
        default: return 'application/octet-stream';
      }
    };

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': getContentType(document.fileName),
        'Content-Disposition': `attachment; filename="${document.fileName}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
      },
    });

  } catch (error: any) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 