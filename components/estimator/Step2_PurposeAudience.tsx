'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { CheckCircle, Briefcase, Users, Building, Landmark } from 'lucide-react';

interface StepPurposeAudienceProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const projectPurposes = [
  { id: 'portfolio', label: 'Portfolio/Personal Brand' },
  { id: 'ecommerce', label: 'E-Commerce Store' },
  { id: 'internaltool', label: 'Internal Tool/Dashboard' },
  { id: 'marketplace', label: 'Marketplace Platform' },
  { id: 'saas', label: 'SaaS Application' },
  { id: 'blog', label: 'Blog/Content Platform' },
  { id: 'social', label: 'Social Network/Community' },
  { id: 'educational', label: 'Educational Platform' },
  { id: 'other', label: 'Other' },
];

const targetAudiences = [
  { id: 'individual', label: 'Individual Consumers (B2C)', icon: Users },
  { id: 'business', label: 'Businesses (B2B)', icon: Briefcase },
  { id: 'enterprise', label: 'Enterprise Clients', icon: Building },
  { id: 'government', label: 'Government/Public Sector', icon: Landmark },
];

const StepPurposeAudience: React.FC<StepPurposeAudienceProps> = ({ formData, setFormData, onNext, onPrev }) => {
  const handlePurposeChange = (value: string) => {
    setFormData({ ...formData, projectPurpose: value });
  };

  const handleAudienceChange = (value: string) => {
    setFormData({ ...formData, targetAudience: value });
  };

  const isNextDisabled = !formData.projectPurpose || !formData.targetAudience;

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
          Every project has a soul.
        </h2>
        <p className="text-muted-foreground text-lg">
          Who are we solving this for, and what&apos;s its core purpose?
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="projectPurpose" className="text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1 block">
            What is the primary purpose of this product?
          </Label>
          <Select value={formData.projectPurpose || ''} onValueChange={handlePurposeChange}>
            <SelectTrigger id="projectPurpose" className="w-full bg-background dark:bg-slate-700 border-border dark:border-slate-600 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:ring-primary">
              <SelectValue placeholder="Select a purpose..." />
            </SelectTrigger>
            <SelectContent className="bg-popover dark:bg-slate-800 border-border dark:border-slate-700 text-popover-foreground dark:text-white">
              {projectPurposes.map(purpose => (
                <SelectItem key={purpose.id} value={purpose.id} className="hover:bg-muted focus:bg-muted dark:hover:bg-slate-700 dark:focus:bg-slate-600">
                  {purpose.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="targetAudience" className="text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1 block">
            Who is the primary target audience?
          </Label>
          <Select value={formData.targetAudience || ''} onValueChange={handleAudienceChange}>
            <SelectTrigger id="targetAudience" className="w-full bg-background dark:bg-slate-700 border-border dark:border-slate-600 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:ring-primary">
              <SelectValue placeholder="Select target audience..." />
            </SelectTrigger>
            <SelectContent className="bg-popover dark:bg-slate-800 border-border dark:border-slate-700 text-popover-foreground dark:text-white">
              {targetAudiences.map(audience => (
                <SelectItem key={audience.id} value={audience.id} className="hover:bg-muted focus:bg-muted dark:hover:bg-slate-700 dark:focus:bg-slate-600">
                  <div className="flex items-center">
                    <audience.icon className="w-4 h-4 mr-2 text-muted-foreground dark:text-slate-400" />
                    {audience.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Placeholder for testimonials/quotes based on choices - to be implemented later */}
      {/* {formData.projectPurpose && formData.targetAudience && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-white/5 rounded-lg text-center"
        >
          <p className="text-sm text-slate-300">✨ "This choice helps us tailor the perfect feature set for your [ {formData.projectPurpose} ] targeting [ {formData.targetAudience} ]!" ✨</p>
        </motion.div>
      )} */}


      <div className="flex justify-between mt-10">
        <Button onClick={onPrev} variant="outline" className="border-border hover:bg-muted dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
          Previous
        </Button>
        <Button onClick={onNext} disabled={isNextDisabled} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Next: Features
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default StepPurposeAudience; 