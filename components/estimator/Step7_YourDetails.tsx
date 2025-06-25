'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import EstimatorLoader from './EstimatorLoader';
import Image from 'next/image';

interface StepYourDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => Promise<void>;
  onPrev: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

// const userRoles = [
//   { id: 'founder', label: 'Founder/Co-Founder' },
//   { id: 'developer', label: 'Developer/Engineer' },
//   { id: 'manager', label: 'Product/Project Manager' },
//   { id: 'designer', label: 'Designer (UI/UX)' },
//   { id: 'student', label: 'Student/Aspiring Entrepreneur' },
//   { id: 'investor', label: 'Investor/VC' },
//   { id: 'other', label: 'Other' },
// ];

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

  // const handleRoleChange = (value: string) => {
  //   setFormData({ ...formData, userRole: value });
  //    if (errors.userRole) {
  //     setErrors(prev => ({...prev, userRole: ''}));
  //   }
  // };

  const fakeNames = [
    "test", "testing", "tester", "test user", "abc", "xyz", "asdf", "qwerty",
    "user", "guest", "name", "username", "demo", "temp", "no name", "none",
    "n/a", "not sure", "something", "someone", "random", "aaa", "bbb", "ccc",
    "abc abc", "example", "sample", "dummy", "user user", "user123", "a", "b", "c"
  ];
  
  const fakeEmails = [
    "test@test.com", "test123@test.com", "demo@demo.com", "abc@abc.com", "hello@gmail.com","hello@hello.com",
    "hello@yahoo.com", "hello@outlook.com", "hello@aol.com", "hello@live.com", "hello@msn.com", "hello@yahoo.com", "hello@outlook.com", "hello@aol.com", "hello@live.com", "hello@msn.com",
    "user@user.com", "user123@user.com", "asdf@asdf.com", "qwerty@qwerty.com", "hi@hi.com", "hi@hotmail.com", "hi@yahoo.com", "hi@outlook.com", "hi@aol.com", "hi@live.com", "hi@msn.com", "hi@yahoo.com", "hi@outlook.com", "hi@aol.com", "hi@live.com", "hi@msn.com",
    "temp@email.com", "fake@email.com", "noreply@noreply.com", "none@none.com",
    "a@a.com", "b@b.com", "sample@sample.com", "example@example.com",
    "123@123.com", "xxx@xxx.com", "abc123@mail.com", "noemail@noemail.com"
  ];
  
  const fakePhoneNumbers = [
    "1234567890", "0000000000", "1111111111", "2222222222", "3333333333",
    "4444444444", "5555555555", "6666666666", "7777777777", "8888888888",
    "9999999999", "1231231231", "9876543210", "1010101010", "1231231234", "1122334455"
  ];
  
  const disposableDomains = [
    "mailinator.com", "10minutemail.com", "tempmail.com", "yopmail.com",
    "getnada.com", "sharklasers.com", "guerrillamail.com", "trashmail.com",
    "fakeinbox.com", "maildrop.cc", "dispostable.com", "throwawaymail.com",
    "mailnesia.com", "mintemail.com", "spamgourmet.com", "emailondeck.com",
    "incognitomail.org", "mail-temp.com", "moakt.com"
  ];
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
  
    // Check name
    const fullName = formData.fullName?.trim().toLowerCase();
    if (!fullName) {
      newErrors.fullName = 'Full name is required.';
    } else if (fakeNames.includes(fullName)) {
      newErrors.fullName = 'Please enter a valid name.';
    }
  
    // Check email
    const email = formData.email?.trim().toLowerCase();
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid.';
    } else {
      const domain = email.split('@')[1];
      if (fakeEmails.includes(email) || disposableDomains.includes(domain)) {
        newErrors.email = 'Please use a valid business or personal email.';
      }
    }
  
    // Check phone number
    const phone = formData.phone?.trim();
    if (phone) {
      if (!/^[6-9]\d{9}$/.test(phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number.';
      } else if (fakePhoneNumbers.includes(phone)) {
        newErrors.phone = 'Please enter a real phone number.';
      }
    }
  
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
    <>
      {/* Beautiful Animated Loader */}
      <AnimatePresence>
        <EstimatorLoader 
          isVisible={isSubmitting} 
          userName={formData.fullName} 
        />
      </AnimatePresence>

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
          
          <div className="">
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
                required
              />
              {errors.phone && <p id="phone-error" className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.phone}</p>}
            </div>
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
    </>
  );
};

export default StepYourDetails; 