import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const DOCS_DIRECTORY = path.join(process.cwd(), 'docs');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    const downloadAll = searchParams.get('downloadAll');

    if (downloadAll === 'true') {
      // Download all files as ZIP
      if (!fs.existsSync(DOCS_DIRECTORY)) {
        return new NextResponse('Documents directory not found', { status: 404 });
      }

      const files = fs.readdirSync(DOCS_DIRECTORY);
      
      if (files.length === 0) {
        return new NextResponse('No documents found', { status: 404 });
      }

      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      const chunks: Buffer[] = [];
      
      return new Promise<NextResponse>((resolve, reject) => {
        archive.on('data', (chunk) => {
          chunks.push(chunk);
        });

        archive.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const timestamp = new Date().toISOString().split('T')[0];
          
          resolve(new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': `attachment; filename="TechMorphers-Documents-${timestamp}.zip"`,
              'Content-Length': buffer.length.toString(),
            },
          }));
        });

        archive.on('error', (err) => {
          console.error('Archive error:', err);
          reject(new NextResponse('Failed to create archive', { status: 500 }));
        });

        // Add all files to the archive
        files.forEach(file => {
          const filePath = path.join(DOCS_DIRECTORY, file);
          if (fs.statSync(filePath).isFile()) {
            archive.file(filePath, { name: file });
          }
        });

        archive.finalize();
      });
    } else if (fileName) {
      // Download specific file
      const filePath = path.join(DOCS_DIRECTORY, fileName);
      
      // Security check to prevent directory traversal
      if (!filePath.startsWith(DOCS_DIRECTORY)) {
        return new NextResponse('Forbidden', { status: 403 });
      }

      if (!fs.existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 });
      }

      const fileBuffer = fs.readFileSync(filePath);
      const stats = fs.statSync(filePath);
      
      // Determine content type based on file extension
      const ext = path.extname(fileName).toLowerCase();
      let contentType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          contentType = 'application/pdf';
          break;
        case '.docx':
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.md':
          contentType = 'text/markdown';
          break;
        default:
          contentType = 'application/octet-stream';
      }

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': stats.size.toString(),
        },
      });
    } else {
      // List all documents
      if (!fs.existsSync(DOCS_DIRECTORY)) {
        return NextResponse.json({ documents: [] });
      }

      const files = fs.readdirSync(DOCS_DIRECTORY);
      const documents = files.map(file => {
        const filePath = path.join(DOCS_DIRECTORY, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          size: stats.size,
          lastModified: stats.mtime,
          extension: path.extname(file).toLowerCase(),
        };
      });

      return NextResponse.json({ documents });
    }
  } catch (error) {
    console.error('Error handling documents:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
