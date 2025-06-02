'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
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
  const [formData, setFormData] = useState({});

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
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  const handleSubmitDetails = () => {
    console.log("Final Form Data:", formData);
    setCurrentStep(finalQuoteStepNumber);
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
        return <StepYourDetails formData={formData} setFormData={updateFormData} onSubmit={handleSubmitDetails} onPrev={prevStep} />;
      case finalQuoteStepNumber:
        return <StepFinalQuote formData={formData} onStartOver={handleStartOver} />;
      default:
        setCurrentStep(1);
        return <StepProjectType formData={formData} setFormData={updateFormData} onNext={nextStep} />;
    }
  };

  const progressPercentage = currentStep <= totalSteps ? (currentStep / totalSteps) * 100 : 100;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="text-center mb-8 md:mb-12 max-w-3xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500"
        >
          Craft Your Dream Project
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          Our intelligent estimator helps you define your vision and get a preliminary quote in minutes. Let&apos;s build something amazing together!
        </motion.p>
      </div>

      <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl bg-card/60 dark:bg-card/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 md:p-10 relative">
        
        {currentStep !== finalQuoteStepNumber && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {currentStep > 1 && (
                <button 
                  onClick={prevStep} 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              )}
              <div className={`text-right text-sm text-muted-foreground ${currentStep === 1 ? 'w-full' : ''}`}>
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <motion.div 
                className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 h-2.5 rounded-full shadow-md"
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
      {/* Enhanced Footer Starts Here */}
      <footer className="w-full max-w-5xl mx-auto text-center py-8 mt-12 md:mt-16 border-t border-border/20 dark:border-slate-700/50">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Tech Morphers AI Estimator</h3>
          <p className="text-sm text-muted-foreground">Helping you shape the future, one estimate at a time.</p>
        </div>
        <div className="flex justify-center space-x-4 mb-4 text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <a href="/packages" className="hover:text-primary transition-colors">Services</a>
          <a href="/contact" className="hover:text-primary transition-colors">Contact Us</a>
          {/* Add more links as needed, e.g., Privacy Policy, Terms */}
        </div>
        <p className="text-xs text-muted-foreground/80 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Tech Morphers. All rights reserved. 
          This quote is an estimate and subject to final review.
        </p>
      </footer>
      {/* Enhanced Footer Ends Here */}
    </div>
  );
};

export default EstimatorPage;