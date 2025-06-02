'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle, Palette, Sparkles, ShieldCheck, Wand2 } from 'lucide-react'; // Added Wand2 for 'Designer's Help'

interface DesignOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  // Removed styleClasses, will use Tailwind's theme classes directly
}

const designOptions: DesignOption[] = [
  {
    id: 'simple',
    label: 'Simple & Clean',
    description: 'Minimalist, functional, and user-friendly.',
    icon: ShieldCheck,
  },
  {
    id: 'modern',
    label: 'Modern & Premium',
    description: 'Sleek, sophisticated, with high-end aesthetics.',
    icon: Sparkles,
  },
  {
    id: 'creative',
    label: 'Creative & Bold',
    description: 'Unique, artistic, and attention-grabbing.',
    icon: Palette,
  },
  {
    id: 'designer_help',
    label: "I need a designer's help",
    description: 'Get expert assistance for a custom look.',
    icon: Wand2,
  },
];

interface StepDesignPreferenceProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepDesignPreference: React.FC<StepDesignPreferenceProps> = ({ formData, setFormData, onNext, onPrev }) => {
  const selectedPreference = formData.designPreference || '';
  const needsCustomBranding = formData.needsCustomBranding || false;

  const handleSelectPreference = (preferenceId: string) => {
    setFormData({ ...formData, designPreference: preferenceId });
  };

  const handleCustomBrandingChange = (checked: boolean) => {
    setFormData({ ...formData, needsCustomBranding: checked });
  };

  // Helper to get specific ring color based on selection for better visual feedback
  const getRingColor = (optionId: string) => {
    if (selectedPreference !== optionId) return 'ring-transparent'; // Default transparent ring
    switch (optionId) {
      case 'simple': return 'ring-blue-500';
      case 'modern': return 'ring-purple-500';
      case 'creative': return 'ring-pink-500';
      case 'designer_help': return 'ring-green-500';
      default: return 'ring-primary';
    }
  };

  const getHoverBgColor = (optionId: string) => {
    // For dark mode, we use slightly darker shades than default card for better contrast
    const baseHover = "hover:bg-muted/70 dark:hover:bg-slate-700/70";
    if (selectedPreference === optionId) return ""; // No extra hover if selected (already has distinct style)

    switch (optionId) {
      case 'simple': return `${baseHover} hover:border-blue-400 dark:hover:border-blue-600`;
      case 'modern': return `${baseHover} hover:border-purple-400 dark:hover:border-purple-600`;
      case 'creative': return `${baseHover} hover:border-pink-400 dark:hover:border-pink-600`;
      case 'designer_help': return `${baseHover} hover:border-green-400 dark:hover:border-green-600`;
      default: return baseHover;
    }
  }

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
          How sleek are we talking?
        </h2>
        <p className="text-muted-foreground text-lg">
          Choose a design style that resonates with your vision. ✨
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {designOptions.map((option) => (
          <motion.div
            key={option.id}
            onClick={() => handleSelectPreference(option.id)}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:shadow-xl group 
              ${getHoverBgColor(option.id)}
              ${selectedPreference === option.id 
                ? `bg-primary/10 dark:bg-opacity-20 ${getRingColor(option.id)} ring-4 ring-offset-2 ring-offset-background dark:ring-offset-slate-900 shadow-2xl scale-105 border-transparent` 
                : 'bg-card dark:bg-slate-800 border-border dark:border-slate-700'}
            `}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <option.icon className={`w-10 h-10 mb-3 transition-colors duration-200 ${selectedPreference === option.id ? getRingColor(option.id).replace('ring-','text-') : 'text-muted-foreground group-hover:text-primary/80'}`} />
            <h3 className={`text-xl font-semibold mb-1 transition-colors duration-200 ${selectedPreference === option.id ? getRingColor(option.id).replace('ring-','text-') : 'text-foreground group-hover:text-primary/90'}`}>{option.label}</h3>
            <p className={`text-sm transition-colors duration-200 ${selectedPreference === option.id ? getRingColor(option.id).replace('ring-','text-')+'/80' : 'text-muted-foreground group-hover:text-slate-300 dark:group-hover:text-slate-400'}`}>{option.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center space-x-3 p-4 bg-muted/50 dark:bg-slate-800/60 border border-border dark:border-slate-700 rounded-lg">
        <Checkbox 
          id="customBranding" 
          checked={needsCustomBranding}
          onCheckedChange={handleCustomBrandingChange}
          className="border-border dark:border-slate-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <Label htmlFor="customBranding" className="text-sm font-medium text-foreground dark:text-slate-200 cursor-pointer">
          Add Custom Branding Package (Logo, Style Guide, etc.)
        </Label>
      </div>

      <div className="flex justify-between mt-10">
        <Button onClick={onPrev} variant="outline" className="border-border hover:bg-muted dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
          Previous
        </Button>
        <Button onClick={onNext} disabled={!selectedPreference} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Next: Timeline & Budget
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default StepDesignPreference; 