'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface StepYourDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => Promise<void>;
  onPrev: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

const userRoles = [
  { id: 'founder', label: 'Founder/Co-Founder' },
  { id: 'developer', label: 'Developer/Engineer' },
  { id: 'manager', label: 'Product/Project Manager' },
  { id: 'designer', label: 'Designer (UI/UX)' },
  { id: 'student', label: 'Student/Aspiring Entrepreneur' },
  { id: 'investor', label: 'Investor/VC' },
  { id: 'other', label: 'Other' },
];

const StepYourDetails: React.FC<StepYourDetailsProps> = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onPrev, 
  isSubmitting,
  submitError
}) => {
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors(prev => ({...prev, [id]: ''}));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, userRole: value });
     if (errors.userRole) {
      setErrors(prev => ({...prev, userRole: ''}));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }
    if (!formData.userRole) newErrors.userRole = 'Please select your role.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocalSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    await onSubmit();
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
          Almost there! Tell us where to send your quote.
        </h2>
        <p className="text-muted-foreground text-lg">
          We need these details to process your request and send your personalized estimate.
        </p>
      </div>

      <form className="space-y-4 md:space-y-5" onSubmit={(e) => { e.preventDefault(); handleLocalSubmit(); }}>
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-muted-foreground dark:text-slate-300">Full Name <span className="text-red-500">*</span></Label>
          <Input 
            id="fullName" 
            type="text" 
            value={formData.fullName || ''} 
            onChange={handleChange} 
            placeholder="e.g., Ada Lovelace" 
            required 
            className={`mt-1 bg-background dark:bg-slate-700 border-border dark:border-slate-600 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:ring-primary ${errors.fullName ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : ''}`}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.fullName && <p id="fullName-error" className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-muted-foreground dark:text-slate-300">Email Address <span className="text-red-500">*</span></Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email || ''} 
            onChange={handleChange} 
            placeholder="you@example.com" 
            required 
            className={`mt-1 bg-background dark:bg-slate-700 border-border dark:border-slate-600 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:ring-primary ${errors.email ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : ''}`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.email && <p id="email-error" className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.email}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground dark:text-slate-300">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              value={formData.phone || ''} 
              onChange={handleChange} 
              placeholder="+91 12345 67890"
              className={`mt-1 bg-background dark:bg-slate-700 border-border dark:border-slate-600 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:ring-primary ${errors.phone ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : ''}`}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.phone && <p id="phone-error" className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.phone}</p>}
          </div>
           <div>
            <Label htmlFor="companyName" className="text-sm font-medium text-muted-foreground dark:text-slate-300">Company Name (Optional)</Label>
            <Input 
              id="companyName" 
              type="text" 
              value={formData.companyName || ''} 
              onChange={handleChange} 
              placeholder="Your Awesome Corp."
              className="mt-1 bg-background dark:bg-slate-700 border-border dark:border-slate-600 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="userRole" className="text-sm font-medium text-muted-foreground dark:text-slate-300">Your Role <span className="text-red-500">*</span></Label>
          <Select value={formData.userRole || ''} onValueChange={handleRoleChange} disabled={isSubmitting}>
            <SelectTrigger id="userRole" className={`w-full mt-1 bg-background dark:bg-slate-700 border-border dark:border-slate-600 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:ring-primary ${errors.userRole ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : ''}`}>
              <SelectValue placeholder="Select your role..." />
            </SelectTrigger>
            <SelectContent className="bg-popover dark:bg-slate-800 border-border dark:border-slate-700 text-popover-foreground dark:text-white">
              {userRoles.map(role => (
                <SelectItem key={role.id} value={role.id} className="hover:bg-muted focus:bg-muted dark:hover:bg-slate-700 dark:focus:bg-slate-600">
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.userRole && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.userRole}</p>}
        </div>

        {submitError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md flex items-center text-sm text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />
            <p>{submitError}</p>
          </div>
        )}
      </form>

      <div className="flex justify-between mt-10">
        <Button onClick={onPrev} variant="outline" className="border-border hover:bg-muted dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700" disabled={isSubmitting}>
          Previous
        </Button>
        <Button onClick={handleLocalSubmit} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
          ) : (
            <>Submit & Get Quote <CheckCircle className="ml-2 h-5 w-5" /></>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default StepYourDetails; 