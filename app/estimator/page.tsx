'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Users, Award, CheckCircle, Star, Lock, Clock, Zap, TrendingUp, X, Gift, AlertCircle, Heart } from 'lucide-react';
import Link from 'next/link';
import StepProjectType from '@/components/estimator/Step1_ProjectType';
import StepPurposeAudience from '@/components/estimator/Step2_PurposeAudience';
import StepFeatures from '@/components/estimator/Step3_Features';
import StepDesignPreference from '@/components/estimator/Step4_DesignPreference';
import StepTimelineBudget from '@/components/estimator/Step5_TimelineBudget';
import StepAddonsCustom from '@/components/estimator/Step6_AddonsCustom';
import StepYourDetails from '@/components/estimator/Step7_YourDetails';
import StepFinalQuote from '@/components/estimator/Step_FinalQuote';

const totalSteps = 7;
const finalQuoteStepNumber = 8;

const EstimatorPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Exit intent and reminder states
  const [showExitModal, setShowExitModal] = useState(false);
  const [showTimeReminder, setShowTimeReminder] = useState(false);
  const [showProgressReminder, setShowProgressReminder] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasTriedToExit, setHasTriedToExit] = useState(false);
  const [pageStartTime] = useState(Date.now());
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [scrollAttempts, setScrollAttempts] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  console.log("lastInteractionTime", lastInteractionTime);
  console.log('scrollAttempts', scrollAttempts);
  
  // Use useRef for timer to avoid re-renders
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Use refs for current values to avoid dependency issues
  const currentStepRef = useRef(currentStep)
  const hasTriedToExitRef = useRef(hasTriedToExit)
  const isMobileRef = useRef(isMobile)
  
  // Update refs when values change
  useEffect(() => {
    currentStepRef.current = currentStep
  }, [currentStep])
  
  useEffect(() => {
    hasTriedToExitRef.current = hasTriedToExit
  }, [hasTriedToExit])
  
  useEffect(() => {
    isMobileRef.current = isMobile
  }, [isMobile])
  
  // Generate unique session ID for tracking
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Ref for the main form container to manage scrolling
  const formContainerRef = useRef<HTMLDivElement>(null)

  // Track user engagement and form progress
  const getFormCompletionPercentage = () => {
    const totalFields = 7; // Total steps
    const completedFields = currentStep - 1;
    return (completedFields / totalFields) * 100;
  };

  const hasUserData = () => {
    return formData.fullName || formData.email || formData.phone || currentStep > 3;
  };

  const isFormPartiallyFilled = () => {
    return currentStep > 2 || Object.keys(formData).length > 2;
  };

  // Function to track partial submission
  const trackPartialSubmission = useCallback(async () => {
    // Check if form is partially filled directly in callback
    if (!(currentStep > 2 || Object.keys(formData).length > 2)) return;

    try {
      await fetch('/api/estimator/track-partial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          currentStep,
          timeSpent,
          sessionId
        })
      });
      console.log('Partial submission tracked');
    } catch (error) {
      console.error('Failed to track partial submission:', error);
    }
  }, [formData, currentStep, timeSpent, sessionId]);

  // Simple timer functions without problematic dependencies
  const startInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    
    // Only set timer for mobile
    if (isMobileRef.current) {
      inactivityTimerRef.current = setTimeout(() => {
        // Check conditions at the time the timer fires
        if (isFormPartiallyFilled() && currentStepRef.current < finalQuoteStepNumber && !hasTriedToExitRef.current) {
          setShowTimeReminder(true)
        }
      }, 180000) // 3 minutes for mobile users
    }
  }, [isFormPartiallyFilled, finalQuoteStepNumber])

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
  }, [])

  // Mobile-optimized exit intent detection
  useEffect(() => {
    if (!isMobile) {
      // Desktop exit intent (original mouse-based detection)
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !hasTriedToExit && isFormPartiallyFilled() && currentStep < finalQuoteStepNumber) {
          setHasTriedToExit(true)
          setShowExitModal(true)
          trackPartialSubmission()
        }
      }
      document.addEventListener('mouseleave', handleMouseLeave)
      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    } else {
      // Mobile exit intent detection - multiple methods for better reliability
      
      // Method 1: Page visibility change (app switching)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // Immediately track when user switches away (less restrictive conditions)
          if (isFormPartiallyFilled() && !hasTriedToExitRef.current) {
            setHasTriedToExit(true)
            trackPartialSubmission()
          }
        } else {
          // When user returns to the page, show modal if they had tried to exit
          if (hasTriedToExitRef.current && isFormPartiallyFilled() && currentStepRef.current < finalQuoteStepNumber) {
            setTimeout(() => {
              setShowExitModal(true)
            }, 500) // Shorter delay for mobile
          }
        }
      }

      // Method 2: Beforeunload for mobile browsers that support it
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (isFormPartiallyFilled() && !hasTriedToExitRef.current) {
          setHasTriedToExit(true)
          trackPartialSubmission()
          // Some mobile browsers will show this
          e.preventDefault()
          e.returnValue = 'You have unsaved progress. Are you sure you want to leave?'
          return e.returnValue
        }
      }

      // Method 3: Page hide event (more reliable on mobile)
      const handlePageHide = () => {
        if (isFormPartiallyFilled() && !hasTriedToExitRef.current) {
          setHasTriedToExit(true)
          trackPartialSubmission()
        }
      }

      // Method 4: History API (back button detection)
      const handlePopState = () => {
        if (isFormPartiallyFilled() && !hasTriedToExitRef.current) {
          setHasTriedToExit(true)
          setShowExitModal(true)
          trackPartialSubmission()
          // Push a new state to prevent actual navigation
          window.history.pushState(null, '', window.location.href)
        }
      }

      // Method 5: Touch interactions and inactivity
      const handleTouchStart = () => {
        setLastInteractionTime(Date.now())
        startInactivityTimer()
      }

      const handleScroll = () => {
        setLastInteractionTime(Date.now())
        startInactivityTimer()
        
        // Detect if user is trying to scroll away from form
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight
        
        if (scrollTop === 0 || scrollTop + clientHeight >= scrollHeight - 10) {
          setScrollAttempts(prev => {
            const newAttempts = prev + 1
            // More aggressive on mobile - trigger after 2 attempts instead of 3
            if (newAttempts >= 2 && isFormPartiallyFilled() && !hasTriedToExitRef.current) {
              setHasTriedToExit(true)
              setShowExitModal(true)
              trackPartialSubmission()
            }
            return newAttempts
          })
        }
      }

      // Method 6: Focus/blur detection
      const handleFocusOut = () => {
        if (isFormPartiallyFilled() && !hasTriedToExitRef.current) {
          // Set a timer to detect if user is switching apps
          setTimeout(() => {
            if (document.hidden) {
              setHasTriedToExit(true)
              trackPartialSubmission()
            }
          }, 100)
        }
      }

      // Add a history state to detect back button
      window.history.pushState(null, '', window.location.href)

      // Add all mobile event listeners
      document.addEventListener('visibilitychange', handleVisibilityChange)
      document.addEventListener('pagehide', handlePageHide)
      document.addEventListener('touchstart', handleTouchStart, { passive: true })
      document.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('beforeunload', handleBeforeUnload)
      window.addEventListener('popstate', handlePopState)
      window.addEventListener('blur', handleFocusOut)
      
      // Start initial timer
      startInactivityTimer()

      // Simplified mobile exit intent - show modal after 2 minutes if form is partially filled
      const mobileExitTimer = setTimeout(() => {
        if (isFormPartiallyFilled() && !hasTriedToExitRef.current && currentStepRef.current < finalQuoteStepNumber) {
          setShowExitModal(true)
          setHasTriedToExit(true)
          trackPartialSubmission()
        }
      }, 120000) // 2 minutes for mobile users

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        document.removeEventListener('pagehide', handlePageHide)
        document.removeEventListener('touchstart', handleTouchStart)
        document.removeEventListener('scroll', handleScroll)
        window.removeEventListener('beforeunload', handleBeforeUnload)
        window.removeEventListener('popstate', handlePopState)
        window.removeEventListener('blur', handleFocusOut)
        clearInactivityTimer()
        clearTimeout(mobileExitTimer)
      }
    }
  }, [isMobile, isFormPartiallyFilled, trackPartialSubmission, startInactivityTimer, clearInactivityTimer])

  // Separate beforeunload for desktop (keeping original logic)
  useEffect(() => {
    if (!isMobile) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (isFormPartiallyFilled() && currentStep < finalQuoteStepNumber && !formData.id) {
          trackPartialSubmission()
          e.preventDefault()
          e.returnValue = 'You have unsaved progress on your project estimate. Are you sure you want to leave?'
          return e.returnValue
        }
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        clearInactivityTimer()
      }
    }
  }, [isMobile, currentStep, formData, isFormPartiallyFilled, trackPartialSubmission, clearInactivityTimer])

  // Time-based gentle reminders
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - pageStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [pageStartTime]);

  // Show gentle time reminder - mobile optimized timing
  useEffect(() => {
    const reminderTime = isMobile ? 180 : 300 // 3 minutes for mobile, 5 minutes for desktop
    if (timeSpent > reminderTime && currentStep < 4 && !showTimeReminder && !formData.id) {
      setShowTimeReminder(true)
    }
  }, [timeSpent, currentStep, showTimeReminder, formData.id, isMobile])

  // Show progress reminder when user reaches step 4 but hasn't filled contact info
  useEffect(() => {
    if (currentStep >= 4 && !hasUserData() && !showProgressReminder) {
      const delay = isMobile ? 1000 : 2000 // Faster on mobile
      setTimeout(() => setShowProgressReminder(true), delay)
    }
  }, [currentStep, hasUserData, showProgressReminder, isMobile])

  // Auto-track partial submission - mobile optimized timing
  useEffect(() => {
    const autoTrackTime = isMobile ? 300 : 600 // 5 minutes for mobile, 10 minutes for desktop
    if (timeSpent > autoTrackTime && isFormPartiallyFilled() && currentStep < finalQuoteStepNumber && !formData.id) {
      trackPartialSubmission()
    }
  }, [timeSpent, isFormPartiallyFilled, currentStep, formData.id, trackPartialSubmission, isMobile])

  // Load data on first render
  useEffect(() => {
    const storedData = localStorage.getItem('estimatorFormData');
    const storedStep = localStorage.getItem('estimatorCurrentStep');

    if (storedData) {
      try {
        setFormData(JSON.parse(storedData));
      } catch (e) {
        console.log("Error in estimator page", e);
        console.error("Invalid JSON in formData:", storedData);
      }
    }

    if (storedStep) {
      setCurrentStep(parseInt(storedStep));
    }

    setIsLoaded(true);
  }, []);

  // Save data to localStorage only after initial load
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem('estimatorFormData', JSON.stringify(formData));
    localStorage.setItem('estimatorCurrentStep', currentStep.toString());
  }, [formData, currentStep, isLoaded]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === totalSteps) {
      setCurrentStep(finalQuoteStepNumber)
    }
    
    // Scroll form into view on mobile after step change
    if (isMobile && formContainerRef.current) {
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }, 150) // Slightly longer delay to ensure animation completes
    }
  }

  const prevStep = () => {
    if (currentStep > 1 && currentStep <= finalQuoteStepNumber) {
      if(currentStep === finalQuoteStepNumber) {
        setCurrentStep(totalSteps)
      } else {
        setCurrentStep(currentStep - 1)
      }
      
      // Scroll form into view on mobile after step change
      if (isMobile && formContainerRef.current) {
        setTimeout(() => {
          formContainerRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })
        }, 150) // Slightly longer delay to ensure animation completes
      }
    }
  }

  const updateFormData = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setSubmitError(null);
  };
  
  const handleSubmitDetails = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    console.log("Attempting to save Final Form Data:", formData);

    try {
      const response = await fetch('/api/estimator/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to save estimator data.');
      }

      const savedData = await response.json();
      console.log("Saved Estimator Data:", savedData);
      updateFormData(savedData);
      setCurrentStep(finalQuoteStepNumber);

    } catch (error: any) {
      console.error("Error submitting estimator details:", error);
      setSubmitError(error.message || "An unexpected error occurred while saving your details.");
    } finally {
      localStorage.removeItem('estimatorFormData');
      localStorage.removeItem('estimatorCurrentStep');
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setFormData({});
    setCurrentStep(1);
    setShowExitModal(false);
    setShowTimeReminder(false);
    setShowProgressReminder(false);
    setHasTriedToExit(false);
  };

  // Handle gentle nudges
  const handleContinueForm = () => {
    setShowExitModal(false)
    setShowTimeReminder(false)
    setShowProgressReminder(false)
    
    // Scroll form into view on mobile
    if (isMobile && formContainerRef.current) {
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }, 100)
    }
  }

  const handleSkipToContact = () => {
    setCurrentStep(totalSteps) // Go to contact info step
    setShowExitModal(false)
    setShowTimeReminder(false)
    setShowProgressReminder(false)
    
    // Scroll form into view on mobile
    if (isMobile && formContainerRef.current) {
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }, 100)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepProjectType formData={formData} setFormData={updateFormData} onNext={nextStep} />;
      case 2:
        return <StepPurposeAudience formData={formData} setFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <StepFeatures formData={formData} setFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <StepDesignPreference formData={formData} setFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 5:
        return <StepTimelineBudget formData={formData} setFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 6:
        return <StepAddonsCustom formData={formData} setFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 7:
        return <StepYourDetails formData={formData} setFormData={updateFormData} onSubmit={handleSubmitDetails} onPrev={prevStep} isSubmitting={isSubmitting} submitError={submitError} />;
      case finalQuoteStepNumber:
        return <StepFinalQuote formData={formData} onStartOver={handleStartOver} />;
      default:
        setCurrentStep(1);
        return <StepProjectType formData={formData} setFormData={updateFormData} onNext={nextStep} />;
    }
  };

  const progressPercentage = currentStep <= totalSteps ? (currentStep / totalSteps) * 100 : 100;

  // Trust building data
  const trustStats = [
    { number: "500+", label: "Projects Delivered", icon: <Award className="w-5 h-5" /> },
    { number: "98%", label: "Client Satisfaction", icon: <Star className="w-5 h-5" /> },
    { number: "24/7", label: "Support Available", icon: <Clock className="w-5 h-5" /> },
    { number: "5 Min", label: "Quick Estimates", icon: <Zap className="w-5 h-5" /> }
  ];

  const securityFeatures = [
    { title: "Secure Data", description: "Your information is encrypted and protected", icon: <Lock className="w-6 h-6" /> },
    { title: "No Spam", description: "We respect your privacy and won't spam you", icon: <Shield className="w-6 h-6" /> },
    { title: "Expert Team", description: "Reviewed by our experienced developers", icon: <Users className="w-6 h-6" /> },
    { title: "Accurate Quotes", description: "AI-powered estimates with 95% accuracy", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Mrinmai Sharma",
      role: "CTO of Arbre Creations",
      content: "Working with tech morphers has been an incredible experience. They truly listened to our needs and delivered a stunning design that exceeded our expectations. We couldn't be happier with the product!",
      rating: 5
    },
    {
      name: "Aashay Kapoor",
      role: "CEO of Aashay Creations",
      content: "From start to finish, working with Redbird was an amazing experience. They were professional, creative, and went above and beyond. We're thrilled to be working with them again in the future!",
      rating: 5
    },
    {
      name: "Anik Adhikari",
      role: "CEO of Iotron",
      content: "A pleasure to work with. They were provided valuable insights that we highly recommend them to any business looking for solutions.",
      rating: 5
    },
    {
      name: "Jayesh Shinde",
      role: "CTO of Confetti Media",
      content: "Tech morphers didn't just build our website, rather built the perfect platform using cutting edge technology and providing us with a premium experience.",
      rating: 5
    },
    {
      name: "Ankit Singh",
      role: "CEO of Bharat Care",
      content: "Working with Tech Morphers was like having an internal tech team — minus the overhead. They delivered our MVP in 4 weeks, pixel-perfect and exactly how we envisioned it. The whole experience was smoother than I imagined.",
      rating: 5
    },
    {
      name: "Laksmikant Sahoo",
      role: "Govt. of Odisha",
      content: "Every agency talks about communication — Tech Morphers actually delivers on it. Daily updates, clean handoffs, and a dashboard that made me feel in control at every step.",
      rating: 5
    }
  ];

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll form into view when step changes (mobile optimization)
  useEffect(() => {
    if (isMobile && formContainerRef.current) {
      // Small delay to ensure DOM is updated
      const scrollTimeout = setTimeout(() => {
        if (formContainerRef.current) {
          // Scroll to top of form container with smooth behavior
          formContainerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })
          
          // Alternative: Scroll to ensure form is properly centered
          const rect = formContainerRef.current.getBoundingClientRect()
          const isFormOutOfView = rect.top < 0 || rect.top > window.innerHeight * 0.8
          
          if (isFormOutOfView) {
            window.scrollTo({
              top: window.pageYOffset + rect.top - 20, // 20px padding from top
              behavior: 'smooth'
            })
          }
        }
      }, 100) // Small delay to ensure state updates are complete
      
      return () => clearTimeout(scrollTimeout)
    }
  }, [currentStep, isMobile]) // Trigger when step changes on mobile

  // Initial scroll positioning for mobile users
  useEffect(() => {
    if (isMobile && formContainerRef.current) {
      // Wait for initial render to complete
      const initialScrollTimeout = setTimeout(() => {
        if (formContainerRef.current) {
          formContainerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          })
        }
      }, 500) // Longer delay for initial load
      
      return () => clearTimeout(initialScrollTimeout)
    }
  }, [isMobile]) // Only run once when mobile is detected

  // Handle mobile keyboard opening/closing and input focus
  useEffect(() => {
    if (isMobile) {
      const handleResize = () => {
        // Detect if virtual keyboard is likely open (viewport height decreased significantly)
        const isKeyboardOpen = window.innerHeight < window.screen.height * 0.75
        
        if (isKeyboardOpen && formContainerRef.current) {
          // When keyboard opens, ensure active input is visible
          setTimeout(() => {
            const activeElement = document.activeElement
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT')) {
              activeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
              })
            }
          }, 300) // Give keyboard time to fully open
        }
      }

      const handleFocusIn = (e: FocusEvent) => {
        // When user focuses on form input, ensure it's visible
        if (e.target && formContainerRef.current) {
          const target = e.target as HTMLElement
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
            setTimeout(() => {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
              })
            }, 100)
          }
        }
      }

      window.addEventListener('resize', handleResize)
      document.addEventListener('focusin', handleFocusIn)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        document.removeEventListener('focusin', handleFocusIn)
      }
    }
  }, [isMobile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-foreground flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-pink-100/20 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl"></div>

      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium mb-6 shadow-lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          AI-Powered Project Estimator
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
        >
          Craft Your
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dream Project
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
        >
          Our intelligent estimator helps you define your vision and get a preliminary quote in minutes. 
          Let&apos;s build something amazing together!
        </motion.p>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {trustStats.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg"
            >
              <div className="flex justify-center mb-2 text-blue-600 dark:text-blue-400">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.number}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Main Estimator Card */}
      <div 
        ref={formContainerRef}
        className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 relative z-10 border border-white/20"
      >
        
        {currentStep !== finalQuoteStepNumber && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {currentStep > 1 && (
                <button 
                  onClick={prevStep} 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              )}
              <div className={`text-right text-sm text-muted-foreground ${currentStep === 1 ? 'w-full' : ''}`}>
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-3 rounded-full shadow-md"
                style={{ width: `${progressPercentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: currentStep === finalQuoteStepNumber ? 0 : 20, scale: currentStep === finalQuoteStepNumber ? 0.95 : 1 }}
            animate={{ opacity: 1, y: 0, scale: 1}}
            exit={{ opacity: 0, y: currentStep === finalQuoteStepNumber ? 0 : -20, scale: currentStep === finalQuoteStepNumber ? 0.95 : 1}}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Security & Trust Section */}
      {currentStep !== finalQuoteStepNumber && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-4xl mx-auto mt-8 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="flex justify-center mb-3 text-green-600 dark:text-green-400">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Testimonials Section */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-4xl mx-auto mt-12 relative z-10"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Trusted by 200+ Companies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 2).map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  &quot;{testimonial.content}&quot;
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Enhanced Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center py-8 mt-12 md:mt-16 border-t border-gray-200/50 dark:border-gray-700/50 relative z-10">
        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium mb-4">
            <Shield className="w-4 h-4 mr-2" />
            100% Secure & Confidential
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Tech Morphers AI Estimator</h3>
          <p className="text-sm text-muted-foreground">Helping you shape the future, one estimate at a time.</p>
        </div>
        
        <div className="flex justify-center space-x-6 mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Home
          </Link>
          <Link href="/services" className="hover:text-blue-600 transition-colors flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Services
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Contact Us
          </Link>
        </div>
        
        <div className="flex justify-center items-center space-x-4 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Lock className="w-3 h-3 mr-1" />
            SSL Encrypted
          </div>
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            GDPR Compliant
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            ISO Certified
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground/80 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Tech Morphers. All rights reserved. 
          This quote is an estimate and subject to final review.
        </p>
      </footer>

      {/* Exit Intent Modal - Mobile Optimized */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-white/20 ${
                isMobile ? 'p-6 max-w-sm w-full mx-4' : 'p-8 max-w-md w-full'
              }`}
            >
              <div className="text-center">
                <div className="mb-4">
                  <Heart className={`text-red-500 mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} />
                  <h3 className={`font-bold text-gray-900 dark:text-white mb-2 ${
                    isMobile ? 'text-xl' : 'text-2xl'
                  }`}>
                    {isMobile ? "Hey! Don't Go Yet 💔" : "Wait! Don't Leave Yet 💔"}
                  </h3>
                  <p className={`text-gray-600 dark:text-gray-300 mb-6 ${
                    isMobile ? 'text-sm leading-relaxed' : ''
                  }`}>
                    {isMobile 
                      ? "You're building something amazing! 🚀 Don't lose your progress - it would be such a waste!" 
                      : "You've made great progress on your project estimate! It would be a shame to lose all this valuable information."
                    }
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <Gift className="w-6 h-6 text-blue-600 mr-2" />
                    <span className={`font-semibold text-blue-600 ${isMobile ? 'text-sm' : ''}`}>
                      {isMobile ? "🎁 Special Offer" : "Exclusive Benefit"}
                    </span>
                  </div>
                  <p className={`text-gray-700 dark:text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {isMobile 
                      ? "Complete now & get a <strong>FREE 30-min consultation</strong> (worth $150)! 💪"
                      : "Complete your estimate now and get a <strong>FREE 30-minute consultation</strong> worth $150!"
                    }
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleContinueForm}
                    className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg rounded-lg ${
                      isMobile ? 'py-4 px-6 text-base' : 'py-3 px-6'
                    }`}
                  >
                    {isMobile ? "✨ Continue My Estimate" : "Continue My Estimate"}
                  </button>
                  
                  <button
                    onClick={handleSkipToContact}
                    className={`w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-lg ${
                      isMobile ? 'py-4 px-6 text-base' : 'py-3 px-6'
                    }`}
                  >
                    {isMobile ? "⚡ Skip to Contact Info" : "Skip to Contact Details"}
                  </button>
                  
                  <button
                    onClick={() => setShowExitModal(false)}
                    className={`w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${
                      isMobile ? 'py-3 text-sm' : 'py-2 text-sm'
                    }`}
                  >
                    {isMobile ? "Maybe later..." : "I'll complete it later"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time-Based Gentle Reminder - Mobile Optimized */}
      <AnimatePresence>
        {showTimeReminder && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`fixed bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-800 z-40 ${
              isMobile 
                ? 'bottom-4 left-4 right-4 p-4' 
                : 'bottom-6 right-6 p-6 max-w-sm'
            }`}
          >
            <button
              onClick={() => setShowTimeReminder(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className={`flex items-start space-x-3 ${isMobile ? 'pr-6' : ''}`}>
              <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className={`font-semibold text-gray-900 dark:text-white mb-1 ${
                  isMobile ? 'text-base' : ''
                }`}>
                  {isMobile ? "Taking your time? 🤔" : "Need Help? 🤔"}
                </h4>
                <p className={`text-gray-600 dark:text-gray-300 mb-3 ${
                  isMobile ? 'text-sm leading-relaxed' : 'text-sm'
                }`}>
                  {isMobile 
                    ? "No rush! Our estimator helps you think through everything properly. Take your time! 😊"
                    : "Taking your time is perfectly fine! Our estimator is designed to help you think through your project thoroughly."
                  }
                </p>
                <button
                  onClick={handleContinueForm}
                  className={`text-blue-600 dark:text-blue-400 font-medium hover:underline ${
                    isMobile ? 'text-sm' : 'text-sm'
                  }`}
                >
                  {isMobile ? "Continue when ready →" : "Continue at your pace →"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress-Based Reminder - Mobile Optimized */}
      <AnimatePresence>
        {showProgressReminder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-green-200 dark:border-green-800 z-40 ${
              isMobile 
                ? 'top-4 left-4 right-4 p-4'
                : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 max-w-md w-full mx-4'
            }`}
          >
            <button
              onClick={() => setShowProgressReminder(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <CheckCircle className={`text-green-600 mx-auto mb-4 ${
                isMobile ? 'w-10 h-10' : 'w-12 h-12'
              }`} />
              <h4 className={`font-bold text-gray-900 dark:text-white mb-2 ${
                isMobile ? 'text-lg' : 'text-xl'
              }`}>
                {isMobile ? "You're Crushing It! 🎉" : "Great Progress! 🎉"}
              </h4>
              <p className={`text-gray-600 dark:text-gray-300 mb-4 ${
                isMobile ? 'text-sm' : ''
              }`}>
                {isMobile 
                  ? `${Math.round(getFormCompletionPercentage())}% done! Just a few taps to get your quote! 📱`
                  : `You're ${Math.round(getFormCompletionPercentage())}% done! Just a few more steps to get your personalized quote.`
                }
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-3 mb-4">
                <p className={`text-gray-700 dark:text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {isMobile 
                    ? "💡 <strong>Pro tip:</strong> More details = more accurate quote! 🎯"
                    : "💡 <strong>Pro tip:</strong> The more details you provide, the more accurate your estimate will be!"
                  }
                </p>
              </div>
              
              <button
                onClick={handleContinueForm}
                className={`w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 rounded-lg ${
                  isMobile ? 'py-4 px-6 text-base' : 'py-3 px-6'
                }`}
              >
                {isMobile ? "🚀 Get My Quote!" : "Continue to Get My Quote"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EstimatorPage;