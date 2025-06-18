'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ExternalLink, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PdfViewerProps {
  estimatorId: string;
  className?: string;
}

interface EstimatorPdfData {
  estimatorId: string;
  fullName: string;
  email: string;
  pdfUrl: string | null;
  createdAt: string;
  hasPdf: boolean;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ estimatorId, className = '' }) => {
  const [pdfData, setPdfData] = useState<EstimatorPdfData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/estimator/pdf?id=${estimatorId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch PDF data');
        }

        const data = await response.json();
        setPdfData(data);
      } catch (err) {
        console.error('Error fetching PDF data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (estimatorId) {
      fetchPdfData();
    }
  }, [estimatorId]);

  const handleDownload = async () => {
    if (!pdfData?.pdfUrl) return;

    try {
      // Open PDF in new tab for viewing/downloading
      window.open(pdfData.pdfUrl, '_blank');
    } catch (err) {
      console.error('Error opening PDF:', err);
    }
  };

  const handleShare = async () => {
    if (!pdfData?.pdfUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Project Quotation - Tech Morphers',
          text: `Check out this project quotation for ${pdfData.fullName}`,
          url: pdfData.pdfUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(pdfData.pdfUrl);
        alert('PDF URL copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing PDF:', err);
      // Fallback: show URL
      alert(`PDF URL: ${pdfData.pdfUrl}`);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading PDF information...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!pdfData) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No data found for this estimator.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Project Quotation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Name:</strong> {pdfData.fullName}</p>
          <p><strong>Email:</strong> {pdfData.email}</p>
          <p><strong>Created:</strong> {new Date(pdfData.createdAt).toLocaleDateString()}</p>
          <p><strong>Reference ID:</strong> {pdfData.estimatorId.substring(0, 8).toUpperCase()}</p>
        </div>

        {pdfData.hasPdf && pdfData.pdfUrl ? (
          <div className="space-y-3">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Your quotation PDF is ready and stored securely in the cloud.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleDownload}
                className="flex items-center gap-2"
                variant="default"
              >
                <ExternalLink className="h-4 w-4" />
                View PDF
              </Button>
              
              <Button 
                onClick={handleShare}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Share
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Direct link: <a href={pdfData.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{pdfData.pdfUrl}</a></p>
            </div>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              PDF quotation is not available. It may still be processing or there was an error during generation.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfViewer; 