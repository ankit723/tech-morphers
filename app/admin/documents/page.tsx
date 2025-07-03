'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  File, 
  Clock,
  HardDrive,
  Folder,
  DownloadCloud
} from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  name: string;
  size: number;
  lastModified: string;
  extension: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getFileIcon = (extension: string) => {
  switch (extension) {
    case '.pdf':
      return <FileText className="h-6 w-6 text-red-500" />;
    case '.docx':
      return <File className="h-6 w-6 text-blue-500" />;
    case '.md':
      return <FileText className="h-6 w-6 text-green-500" />;
    default:
      return <File className="h-6 w-6 text-gray-500" />;
  }
};

const getFileBadgeColor = (extension: string) => {
  switch (extension) {
    case '.pdf':
      return 'bg-red-100 text-red-800 border-red-200';
    case '.docx':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case '.md':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [downloadingAll, setDownloadingAll] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/documents');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (fileName: string) => {
    try {
      setDownloadingFiles(prev => new Set(prev).add(fileName));
      
      const response = await fetch(`/api/admin/documents?file=${encodeURIComponent(fileName)}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Downloaded ${fileName}`);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error(`Failed to download ${fileName}`);
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileName);
        return newSet;
      });
    }
  };

  const downloadAllDocuments = async () => {
    try {
      setDownloadingAll(true);
      
      const response = await fetch('/api/admin/documents?downloadAll=true');
      
      if (!response.ok) {
        throw new Error('Bulk download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      const timestamp = new Date().toISOString().split('T')[0];
      a.download = `TechMorphers-Documents-${timestamp}.zip`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Downloaded all documents as ZIP file`);
    } catch (error) {
      console.error('Error downloading all documents:', error);
      toast.error('Failed to download all documents');
    } finally {
      setDownloadingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

      return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Folder className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Documents Library</h1>
              <p className="text-muted-foreground">
                Access and download company documents, contracts, and guides
              </p>
            </div>
          </div>
          
          {documents.length > 0 && (
            <Button
              onClick={downloadAllDocuments}
              disabled={downloadingAll}
              size="lg"
              className="flex items-center gap-2"
            >
              {downloadingAll ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating ZIP...
                </>
              ) : (
                <>
                  <DownloadCloud className="h-5 w-5" />
                  Download All ({documents.length})
                </>
              )}
            </Button>
          )}
        </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Documents Found</h3>
            <p className="text-muted-foreground text-center">
              There are no documents available in the library at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getFileIcon(doc.extension)}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-medium truncate" title={doc.name}>
                        {doc.name.replace(doc.extension, '')}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`text-xs mt-1 ${getFileBadgeColor(doc.extension)}`}
                      >
                        {doc.extension.toUpperCase().slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HardDrive className="h-4 w-4" />
                    <span>{formatFileSize(doc.size)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(doc.lastModified)}</span>
                  </div>
                  
                  <Button
                    onClick={() => downloadDocument(doc.name)}
                    disabled={downloadingFiles.has(doc.name)}
                    className="w-full"
                    size="sm"
                  >
                    {downloadingFiles.has(doc.name) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

              <div className="mt-8 text-center text-sm text-muted-foreground space-y-1">
          <p>Total documents: {documents.length}</p>
          <p>
            Total size: {formatFileSize(documents.reduce((acc, doc) => acc + doc.size, 0))}
          </p>
          {documents.length > 1 && (
            <p className="text-xs">
              💡 Use &quot;Download All&quot; to get all documents in a single ZIP file
            </p>
          )}
        </div>
    </div>
  );
}