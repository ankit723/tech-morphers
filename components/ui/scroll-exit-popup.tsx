'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { X, Calculator, Clock, Shield } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';

interface TimeBasedPopupProps {
  debug?: boolean;
  intervalSeconds?: number;
}

export function ScrollExitPopup({ debug = false, intervalSeconds = 45 }: TimeBasedPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [countdown, setCountdown] = useState(intervalSeconds);
  const [isActive, setIsActive] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);
  const pathname = usePathname();

  // Debug function
  const debugLog = useCallback((message: string) => {
    if (debug) {
      console.log(`[TimeBasedPopup] ${message}`);
    }
  }, [debug]);

  // Check if current page should show popup
  const shouldShowOnCurrentPage = useCallback(() => {
    if (!pathname) return false;
    
    // Exclude /estimator and /admin/* pages
    if (pathname.startsWith('/estimator') || pathname.startsWith('/admin') || pathname.startsWith('/client') || pathname.startsWith('/login')) {
      debugLog(`Popup disabled on page: ${pathname}`);
      return false;
    }
    
    return true;
  }, [pathname, debugLog]);

  // Set client-side flag and check session
  useEffect(() => {
    setIsClient(true);
    debugLog('Client-side initialized');
    
    // Check if user has seen popup recently
    const checkSession = () => {
      const lastShown = sessionStorage.getItem('popup-last-shown');
      if (lastShown) {
        const minutesSinceShown = (Date.now() - parseInt(lastShown)) / (1000 * 60);
        if (minutesSinceShown < 10) { // Don't show again for 10 minutes
          setHasShownOnce(true);
          debugLog(`Popup shown ${minutesSinceShown.toFixed(1)} minutes ago - suppressed`);
        }
      }
    };
    
    setTimeout(checkSession, 100);
  }, [debugLog]);

  // Exit intent detection
  useEffect(() => {
    if (!isClient || !shouldShowOnCurrentPage() || hasShownOnce || exitIntentTriggered) {
      return;
    }

    let mouseLeaveDelay: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Check if mouse is leaving from the top of the page
      if (e.clientY <= 0) {
        debugLog('Exit intent detected - mouse left from top');
        
        // Add a small delay to avoid false positives
        mouseLeaveDelay = setTimeout(() => {
          if (!hasShownOnce && !exitIntentTriggered) {
            setExitIntentTriggered(true);
            setIsVisible(true);
            setHasShownOnce(true);
            debugLog('Exit intent popup triggered');
            
            // Save to sessionStorage
            sessionStorage.setItem('popup-last-shown', Date.now().toString());
            
            // Track popup impression
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'popup_shown', {
                event_category: 'engagement',
                event_label: 'exit_intent_popup'
              });
            }
          }
        }, 100);
      }
    };

    const handleMouseEnter = () => {
      // Clear the delay if mouse re-enters quickly
      if (mouseLeaveDelay) {
        clearTimeout(mouseLeaveDelay);
      }
    };

    // Add event listeners
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (mouseLeaveDelay) {
        clearTimeout(mouseLeaveDelay);
      }
      debugLog('Exit intent listeners removed');
    };
  }, [isClient, shouldShowOnCurrentPage, hasShownOnce, exitIntentTriggered, debugLog]);

  // Main timer logic
  useEffect(() => {
    if (!isClient || !shouldShowOnCurrentPage() || hasShownOnce) {
      setIsActive(false);
      return;
    }

    setIsActive(true);
    setCountdown(intervalSeconds);
    debugLog(`Timer started - popup will show in ${intervalSeconds} seconds`);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        const newCount = prev - 1;
        
        if (newCount <= 0) {
          // Show popup only once per session
          setIsVisible(true);
          setHasShownOnce(true);
          debugLog('Timer reached zero - showing popup');
          
          // Save to sessionStorage
          sessionStorage.setItem('popup-last-shown', Date.now().toString());
          
          // Track popup impression
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'popup_shown', {
              event_category: 'engagement',
              event_label: 'time_based_popup'
            });
          }
          
          return intervalSeconds; // Reset timer for debug display
        }
        
        return newCount;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      debugLog('Timer cleared');
    };
  }, [isClient, shouldShowOnCurrentPage, hasShownOnce, intervalSeconds, debugLog]);

  const handleClose = () => {
    debugLog('Popup closed by user');
    setIsVisible(false);
    
    // Track popup dismissal
    if (isClient && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'popup_dismissed', {
        event_category: 'engagement',
        event_label: exitIntentTriggered ? 'exit_intent_popup' : 'time_based_popup'
      });
    }
  };

  const handleEstimatorClick = () => {
    debugLog('Estimator button clicked');
    setIsVisible(false);
    
    // Track popup conversion
    if (isClient && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'popup_cta_clicked', {
        event_category: 'conversion',
        event_label: exitIntentTriggered ? 'exit_intent_popup_to_estimator' : 'time_based_popup_to_estimator'
      });
    }
    
    // Navigate to estimator page
    if (isClient) {
      window.location.href = '/estimator';
    }
  };

  // Don't render if not on allowed page
  if (!shouldShowOnCurrentPage()) {
    return debug ? (
      <div className="fixed bottom-4 right-4 z-40 bg-gray-800 text-white p-2 rounded text-xs">
        <div>Popup disabled on this page</div>
        <div>Path: {pathname}</div>
      </div>
    ) : null;
  }

  // Debug panel when popup is not visible
  if (!isVisible && debug) {
    return (
      <div className="fixed bottom-4 right-4 z-40 bg-gray-800 text-white p-2 rounded text-xs max-w-xs">
        <div className="font-bold">Smart Popup Debug</div>
        <div>Timer Active: {isActive ? 'Yes' : 'No'}</div>
        <div>Exit Intent: {exitIntentTriggered ? 'Triggered' : 'Watching'}</div>
        <div>Shown Once: {hasShownOnce ? 'Yes' : 'No'}</div>
        <div>Next popup in: {hasShownOnce ? 'N/A' : `${countdown}s`}</div>
        <div>Page: {pathname}</div>
        <div>Interval: {intervalSeconds}s</div>
        <button 
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 px-2 py-1 rounded text-xs mt-1"
        >
          Test Show
        </button>
        <button 
          onClick={() => {
            setHasShownOnce(false);
            setExitIntentTriggered(false);
            setCountdown(intervalSeconds);
            sessionStorage.removeItem('popup-last-shown');
          }}
          className="bg-red-600 px-2 py-1 rounded text-xs mt-1 ml-1"
        >
          Reset
        </button>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-900 shadow-2xl transform transition-all duration-300 ease-out scale-100">
        <CardContent className="p-6">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close popup"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {exitIntentTriggered ? "Wait! Get Your Free Quote" : "Get Your Custom Quote"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {exitIntentTriggered 
                ? "Before you go, get a pricing estimate tailored for you. Try our 2-minute quote tool — no calls, no spam."
                : "Want a pricing estimate tailored for you? Try our 2-minute quote tool — no calls, no spam."
              }
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Get instant pricing in 2 minutes
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                No calls or spam - just accurate estimates
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Tailored to your specific requirements
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleEstimatorClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
            >
              {exitIntentTriggered ? "Get My Free Quote Now" : "Get My Free Quote"}
            </Button>
            <Button
              onClick={handleClose}
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Maybe Later
            </Button>
          </div>

          {/* Trust indicator */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Join 500+ businesses who got their quotes with us
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 