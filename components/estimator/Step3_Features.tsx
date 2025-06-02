'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, LayoutDashboard, CreditCard, MessageSquare, Bot, Link2, Bell, BookOpen, UploadCloud, Zap } from 'lucide-react';

interface Feature {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
}

const availableFeatures: Feature[] = [
  { id: 'auth', label: 'Authentication', icon: Lock },
  { id: 'admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { id: 'payments', label: 'Payment Integration', icon: CreditCard },
  { id: 'chat', label: 'Chat/Live Support', icon: MessageSquare },
  { id: 'ai', label: 'AI Integration', icon: Bot },
  { id: 'api', label: 'API Integration (3rd Party)', icon: Link2 },
  { id: 'notifications', label: 'Notifications (Email/Push)', icon: Bell },
  { id: 'blog', label: 'Blog/Content System', icon: BookOpen },
  { id: 'uploads', label: 'File Uploads & Storage', icon: UploadCloud },
  { id: 'realtime', label: 'Real-Time Updates', icon: Zap },
];

interface StepFeaturesProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepFeatures: React.FC<StepFeaturesProps> = ({ formData, setFormData, onNext, onPrev }) => {
  const selectedFeatures = formData.features || [];

  const toggleFeature = (featureId: string) => {
    const newFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter((id: string) => id !== featureId)
      : [...selectedFeatures, featureId];
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          What powers should your product have?
        </h2>
        <p className="text-muted-foreground text-lg">
          Select all the features you envision. Think big! 🧠
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {availableFeatures.map((feature) => (
          <motion.div
            key={feature.id}
            onClick={() => toggleFeature(feature.id)}
            className={`p-4 border rounded-lg text-center cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 group
              ${selectedFeatures.includes(feature.id) 
                ? 'bg-primary/10 border-primary ring-2 ring-primary shadow-md' 
                : 'bg-card hover:bg-muted/60 dark:bg-slate-800 dark:hover:bg-slate-700/80 border-border dark:border-slate-700'}
            `}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <feature.icon className={`w-8 h-8 mx-auto mb-2 transition-colors duration-200 ${selectedFeatures.includes(feature.id) ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/80'}`} />
            <p className={`text-sm font-medium transition-colors duration-200 ${selectedFeatures.includes(feature.id) ? 'text-primary' : 'text-foreground group-hover:text-primary/90'}`}>{feature.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between mt-10">
        <Button onClick={onPrev} variant="outline" className="border-border hover:bg-muted dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
          Previous
        </Button>
        <Button onClick={onNext} size="lg" disabled={selectedFeatures.length === 0} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Next: Design
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default StepFeatures; 