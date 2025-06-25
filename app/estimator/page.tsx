'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Users, Award, CheckCircle, Star, Lock, Clock, Zap, TrendingUp } from 'lucide-react';
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
  const [isLoaded, setIsLoaded] = useState(false); // flag to control write sync

  // Load data on first render
  useEffect(() => {
    const storedData = localStorage.getItem('estimatorFormData');
    const storedStep = localStorage.getItem('estimatorCurrentStep');
    

    if (storedData) {
      try {
        setFormData(JSON.parse(storedData));
      } catch (e) {
        console.log("Error in estimator page", e)
        console.error("Invalid JSON in formData:", storedData);
      }
    }

    if (storedStep) {
      setCurrentStep(parseInt(storedStep));
    }

    // allow localStorage writes only after load
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
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      setCurrentStep(finalQuoteStepNumber);
    }
  };

  const prevStep = () => {
    if (currentStep > 1 && currentStep <= finalQuoteStepNumber) {
      if(currentStep === finalQuoteStepNumber) {
        setCurrentStep(totalSteps);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

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
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setFormData({});
    setCurrentStep(1);
  };

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
      <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 relative z-10 border border-white/20">
        
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
    </div>
  );
};

export default EstimatorPage;