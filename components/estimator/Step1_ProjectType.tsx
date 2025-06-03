'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Laptop, Smartphone, Layers, Cpu, HelpCircle } from 'lucide-react';

interface ProjectTypeOption {
  id: string;
  label: string;
  icon: React.ElementType;
}

const projectTypes: ProjectTypeOption[] = [
  { id: 'website', label: 'Website', icon: Laptop },
  { id: 'webapp', label: 'Web App', icon: Layers },
  { id: 'mobileapp', label: 'Mobile App', icon: Smartphone },
  { id: 'saas', label: 'SaaS Product', icon: Cpu },
  { id: 'ai', label: 'AI Tool', icon: Cpu }, // Consider a more specific AI icon if available
  { id: 'notsure', label: 'Not sure yet', icon: HelpCircle },
];

interface StepProjectTypeProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
}

const StepProjectType: React.FC<StepProjectTypeProps> = ({ formData, setFormData, onNext }) => {
  const selectedType = formData.projectType || '';

  const handleSelect = (typeId: string) => {
    setFormData({ ...formData, projectType: typeId });
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
          Let&apos;s start with the basics.
        </h2>
        <p className="text-muted-foreground text-lg">
          What type of product are we building together?
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
        {projectTypes.map((type) => (
          <motion.button
            key={type.id}
            onClick={() => handleSelect(type.id)}
            className={`p-6 border rounded-lg text-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary
              ${selectedType === type.id 
                ? 'bg-primary/10 border-primary ring-2 ring-primary shadow-lg' 
                : 'bg-card hover:bg-muted/50 dark:bg-slate-800 dark:hover:bg-slate-700 border-border dark:border-slate-700'}
            `}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <type.icon className={`w-10 h-10 mx-auto mb-3 transition-colors duration-200 ${selectedType === type.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/80'}`} />
            <p className={`font-semibold transition-colors duration-200 ${selectedType === type.id ? 'text-primary' : 'text-foreground group-hover:text-primary/90'}`}>{type.label}</p>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-end mt-10">
        <Button onClick={onNext} disabled={!selectedType} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Next: Purpose & Audience
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default StepProjectType; 