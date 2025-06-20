'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  FileText, 
  Calculator, 
  Zap, 
  CheckCircle,
  Target,
  Palette,
  Code2,
  Rocket
} from 'lucide-react';

interface EstimatorLoaderProps {
  isVisible: boolean;
  userName?: string;
}

const loadingMessages = [
  {
    icon: Brain,
    text: "Our AI is reading your requirements...",
    subtext: "Understanding your unique project needs",
    duration: 2500
  },
  {
    icon: Target,
    text: "Analyzing your target audience and goals...",
    subtext: "Tailoring solutions for maximum impact",
    duration: 2500
  },
  {
    icon: Palette,
    text: "Evaluating design preferences and features...",
    subtext: "Creating a personalized visual experience",
    duration: 2500
  },
  {
    icon: Calculator,
    text: "Calculating accurate project costs...",
    subtext: "Ensuring transparent and fair pricing",
    duration: 2500
  },
  {
    icon: Code2,
    text: "Estimating development timeline...",
    subtext: "Planning the perfect delivery schedule",
    duration: 2500
  },
  {
    icon: FileText,
    text: "Generating your personalized quotation...",
    subtext: "Creating a detailed project proposal",
    duration: 2500
  },
  {
    icon: Rocket,
    text: "Preparing to send your quote...",
    subtext: "Almost ready to transform your vision!",
    duration: 2000
  }
];

const EstimatorLoader: React.FC<EstimatorLoaderProps> = ({ isVisible, userName }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentMessageIndex(0);
      setProgress(0);
      return;
    }

    const totalDuration = loadingMessages.reduce((sum, msg) => sum + msg.duration, 0);
    let elapsedTime = 0;
    let messageIndex = 0;
    let accumulatedDuration = 0;
    console.log(accumulatedDuration)

    // Progress timer that runs continuously
    const progressTimer = setInterval(() => {
      elapsedTime += 50;
      const newProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setProgress(newProgress);
    }, 50);

    // Message timer that cycles through messages
    const cycleMessages = () => {
      if (messageIndex < loadingMessages.length - 1) {
        accumulatedDuration += loadingMessages[messageIndex].duration;
        
        setTimeout(() => {
          messageIndex++;
          setCurrentMessageIndex(messageIndex);
          cycleMessages();
        }, loadingMessages[messageIndex].duration);
      }
    };

    // Start cycling messages
    cycleMessages();

    return () => {
      clearInterval(progressTimer);
    };
  }, [isVisible]); // Only depend on isVisible, not currentMessageIndex

  if (!isVisible) return null;

  const currentMessage = loadingMessages[currentMessageIndex];
  const IconComponent = currentMessage.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center"
    >
      <div className="max-w-lg mx-auto px-6 py-8 text-center">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/3 to-purple-500/3 blur-3xl" />
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Animated Icon */}
          <motion.div
            key={currentMessageIndex}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mb-6"
          >
            <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
              <IconComponent className="w-10 h-10 text-white" />
              
              {/* Animated Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-blue-300/50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Sparkle Effects */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Personalized Greeting */}
          {userName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <p className="text-lg text-muted-foreground">
                Hold tight, <span className="font-semibold text-foreground">{userName}</span>! ✨
              </p>
            </motion.div>
          )}

          {/* Animated Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {currentMessage.text}
              </h3>
              <p className="text-muted-foreground text-lg">
                {currentMessage.subtext}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-sm"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Floating Elements */}
          <div className="flex justify-center space-x-4 mb-4">
            {[Calculator, FileText, Zap].map((Icon, index) => (
              <motion.div
                key={index}
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.4,
                  ease: "easeInOut"
                }}
                className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30"
              >
                <Icon className="w-4 h-4 text-primary" />
              </motion.div>
            ))}
          </div>

          {/* Final Stage Indicator */}
          {currentMessageIndex >= loadingMessages.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="mt-4"
            >
              <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 dark:bg-green-900/20 rounded-full px-4 py-2 border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Almost done!</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EstimatorLoader; 