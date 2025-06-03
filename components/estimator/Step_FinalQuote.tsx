'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MailCheck, RefreshCw, MessageCircle, Info } from 'lucide-react';
import Confetti from 'react-confetti';

interface StepFinalQuoteProps {
  formData: {
    id?: string;
    fullName?: string;
    email?: string;
    // other fields from formData that might be useful, e.g., estimateId if passed
  };
  onStartOver: () => void;
}

const StepFinalQuote: React.FC<StepFinalQuoteProps> = ({ formData, onStartOver }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  // const [isDownloading, setIsDownloading] = useState(false);
  // const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    setShowConfetti(true);
    const confettiTimer = setTimeout(() => setShowConfetti(false), 8000); // Confetti for 8 seconds
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    if (typeof window !== 'undefined') {
      handleResize(); // Initial size
      window.addEventListener('resize', handleResize);
    }

    return () => {
      clearTimeout(confettiTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // const handleDownloadPDF = async () => {
  //   if (!formData.id) {
  //     setDownloadError("Estimator ID is missing. Cannot download PDF.");
  //     console.error("Estimator ID is missing from formData.");
  //     return;
  //   }
  //   setIsDownloading(true);
  //   setDownloadError(null);
  //   try {
  //     const response = await fetch('/api/generate-quotation-pdf', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ estimatorId: formData.id }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.details || `Failed to generate PDF: ${response.statusText}`);
  //     }

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `Quotation-EST-${formData.id.substring(0,8).toUpperCase()}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);

  //   } catch (error: any) {
  //     console.error("Error downloading PDF:", error);
  //     setDownloadError(error.message || "An unexpected error occurred while downloading the PDF.");
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="text-center py-8 md:py-12"
    >
      {showConfetti && windowSize.width > 0 && <Confetti recycle={false} numberOfPieces={350} gravity={0.08} width={windowSize.width} height={windowSize.height} />}
      
      <MailCheck className="w-20 h-20 md:w-24 md:h-24 text-green-500 mx-auto mb-6 md:mb-8" />
      
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 mb-4 md:mb-6">
        Thank You, {formData.fullName || 'Valued User'}!
      </h2>
      
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground dark:text-slate-300 mb-8 max-w-2xl mx-auto">
        Your project details have been successfully submitted. Our AI is now crafting your personalized quotation. 
        It will be delivered to <strong className="text-foreground dark:text-white">{formData.email || 'your email address'}</strong> shortly.
      </p>

      <div className="bg-card/70 dark:bg-slate-800/70 p-6 md:p-8 rounded-xl shadow-lg mb-8 md:mb-10 text-left max-w-xl mx-auto border border-border dark:border-slate-700">
        <div className="flex items-center mb-4">
            <Info className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
            <h3 className="text-xl font-semibold text-foreground dark:text-slate-100">What Happens Next?</h3>
        </div> 
        <ul className="space-y-2 text-sm text-muted-foreground dark:text-slate-300 list-disc list-outside pl-5">
            <li>Our system generates a detailed project proposal and quotation.</li>
            <li>This document will be sent to your email as a PDF. You can also download it below.</li>
            <li>A member of our team may reach out to discuss your project further if needed.</li>
            <li>Keep an eye on your inbox (and spam folder, just in case!).</li>
        </ul>
      </div>

      <div className="space-y-3 md:space-y-0 md:flex md:flex-wrap md:justify-center md:gap-4">
        <Button 
          size="lg" 
          variant="outline" 
          onClick={onStartOver} 
          className="w-full md:w-auto border-primary text-primary hover:bg-primary/10 hover:text-primary dark:border-primary dark:text-primary dark:hover:bg-primary/20"
        >
          <RefreshCw className="mr-2 h-5 w-5" /> Start Another Estimate
        </Button>
        
        <Button 
          size="lg" 
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
          // onClick={() => { /* Potentially link to contact page or open mail client */ }}

        >
          <MessageCircle className="mr-2 h-5 w-5" /> Contact Support
        </Button>
      </div>
      
      {/* {downloadError && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-4">
          Error: {downloadError}
        </p>
      )} */}

      {/* Optional: Add a small note about typical processing time */}
      <p className="text-xs text-muted-foreground dark:text-slate-500 mt-8">
        Most quotations are delivered within 5-10 minutes. For complex projects, it might take a little longer.
      </p>
    </motion.div>
  );
};

export default StepFinalQuote; 