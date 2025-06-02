'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { CheckCircle, CalendarDays, Landmark } from 'lucide-react'; // Replaced Wallet with Landmark for budget icon

interface StepTimelineBudgetProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const deliveryTimelines = [
  { id: '1-2w', label: 'Express: 1–2 Weeks' },
  { id: '3-4w', label: 'Standard: 3–4 Weeks' },
  { id: '1-2m', label: 'Flexible: 1–2 Months' },
  { id: 'custom', label: "Custom Timeline (Let's Discuss)" },
];

const budgetRanges = [
  { id: '20k-50k', label: '₹20,000 – ₹50,000' },
  { id: '50k-1L', label: '₹50,000 – ₹1,00,000' },
  { id: '1Lplus', label: '₹1,00,000+' },
  { id: 'flexible', label: 'Flexible / Custom Quote' },
];

const StepTimelineBudget: React.FC<StepTimelineBudgetProps> = ({ formData, setFormData, onNext, onPrev }) => {
  const handleTimelineChange = (value: string) => {
    setFormData({ ...formData, deliveryTimeline: value });
  };

  const handleBudgetChange = (value: string) => {
    setFormData({ ...formData, budgetRange: value });
  };

  const isNextDisabled = !formData.deliveryTimeline || !formData.budgetRange;
  const showTimelineMessage = formData.deliveryTimeline === '1-2w';

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
          Let's talk time and money, transparently.
        </h2>
        <p className="text-muted-foreground text-lg">
          Your timeline and budget help us plan the best approach. 💸
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="deliveryTimeline" className="text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1 block flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground dark:text-slate-400" /> Ideal Delivery Timeline
          </Label>
          <Select value={formData.deliveryTimeline || ''} onValueChange={handleTimelineChange}>
            <SelectTrigger id="deliveryTimeline" className="w-full bg-background dark:bg-slate-700 border-border dark:border-slate-600 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:ring-primary">
              <SelectValue placeholder="Select a timeline..." />
            </SelectTrigger>
            <SelectContent className="bg-popover dark:bg-slate-800 border-border dark:border-slate-700 text-popover-foreground dark:text-white">
              {deliveryTimelines.map(timeline => (
                <SelectItem key={timeline.id} value={timeline.id} className="hover:bg-muted focus:bg-muted dark:hover:bg-slate-700 dark:focus:bg-slate-600">
                  {timeline.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showTimelineMessage && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs text-amber-500 dark:text-amber-400 mt-1.5 p-2 bg-amber-500/10 dark:bg-amber-400/10 rounded"
            >
              Note: Faster delivery may involve focused sprints and potentially higher costs. We'll optimize for value!
            </motion.p>
          )}
        </div>

        <div>
          <Label htmlFor="budgetRange" className="text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1 block flex items-center">
            <Landmark className="w-4 h-4 mr-2 text-muted-foreground dark:text-slate-400" /> Approximate Budget Range
          </Label>
          <Select value={formData.budgetRange || ''} onValueChange={handleBudgetChange}>
            <SelectTrigger id="budgetRange" className="w-full bg-background dark:bg-slate-700 border-border dark:border-slate-600 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:ring-primary">
              <SelectValue placeholder="Select your budget range..." />
            </SelectTrigger>
            <SelectContent className="bg-popover dark:bg-slate-800 border-border dark:border-slate-700 text-popover-foreground dark:text-white">
              {budgetRanges.map(budget => (
                <SelectItem key={budget.id} value={budget.id} className="hover:bg-muted focus:bg-muted dark:hover:bg-slate-700 dark:focus:bg-slate-600">
                  {budget.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Placeholder for premium fast-lane option - can be shown conditionally */}
      {/* {formData.deliveryTimeline === '1-2w' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-3 bg-primary/10 rounded-lg text-center border border-primary/30"
        >
          <p className="text-sm text-primary">🚀 Consider our Premium Fast-Lane for dedicated resources on tight timelines!</p>
        </motion.div>
      )} */}

      <div className="flex justify-between mt-10">
        <Button onClick={onPrev} variant="outline" className="border-border hover:bg-muted dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
          Previous
        </Button>
        <Button onClick={onNext} disabled={isNextDisabled} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Next: Add-ons
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default StepTimelineBudget; 