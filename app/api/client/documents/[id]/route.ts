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
        // Document types
        case 'pdf': return 'application/pdf';
        case 'doc': return 'application/msword';
        case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'xls': return 'application/vnd.ms-excel';
        case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case 'ppt': return 'application/vnd.ms-powerpoint';
        case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        case 'txt': return 'text/plain';
        case 'csv': return 'text/csv';
        case 'rtf': return 'application/rtf';
        
        // Image types
        case 'jpg': case 'jpeg': return 'image/jpeg';
        case 'png': return 'image/png';
        case 'gif': return 'image/gif';
        case 'bmp': return 'image/bmp';
        case 'webp': return 'image/webp';
        case 'svg': return 'image/svg+xml';
        case 'ico': return 'image/x-icon';
        
        // Video types
        case 'mp4': return 'video/mp4';
        case 'webm': return 'video/webm';
        case 'mov': return 'video/quicktime';
        case 'avi': return 'video/x-msvideo';
        case 'mkv': return 'video/x-matroska';
        case 'wmv': return 'video/x-ms-wmv';
        case 'flv': return 'video/x-flv';
        case 'm4v': return 'video/x-m4v';
        case '3gp': return 'video/3gpp';
        
        // Audio types
        case 'mp3': return 'audio/mpeg';
        case 'wav': return 'audio/wav';
        case 'ogg': return 'audio/ogg';
        case 'aac': return 'audio/aac';
        case 'm4a': return 'audio/mp4';
        case 'flac': return 'audio/flac';
        
        // Archive types
        case 'zip': return 'application/zip';
        case 'rar': return 'application/vnd.rar';
        case '7z': return 'application/x-7z-compressed';
        case 'tar': return 'application/x-tar';
        case 'gz': return 'application/gzip';
        
        // Default fallback
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