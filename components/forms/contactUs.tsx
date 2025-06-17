'use client'

import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { plans } from "@/lib/plansData"; // Import plans to populate the select dropdown
import { Loader2, AlertTriangle, CheckCircle2, Calendar, Phone } from 'lucide-react'; // Added icons

interface ContactUsProps {
  defaultPackage?: string; // e.g., plan.id like "starter", "growth"
  onFormSubmit?: (data: any) => void; // Optional: Callback for when form is submitted
  hideHeader?: boolean; // New prop to control header visibility
}

const ContactUs: React.FC<ContactUsProps> = ({ defaultPackage, onFormSubmit, hideHeader = false }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  // Ensure defaultPackage is one of the plan IDs, otherwise default to the first plan's ID
  const initialPackage = defaultPackage && plans.some(p => p.id === defaultPackage) 
                         ? defaultPackage 
                         : (plans.length > 0 ? plans[0].id : '');
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null); // For specific messages

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setSelectedPackage(initialPackage); // Reset to initial or first plan
    setMessage('');
    setSubmitStatus(null);
    setSubmitMessage(null);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);
    setSubmitMessage(null);

    const formData = {
      fullName,
      email,
      phone,
      companyName,
      selectedPackage, // This is the ID string, e.g., "starter", "growth"
      message,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you for reaching out! Your inquiry has been successfully submitted. Our team will review your requirements and schedule a discovery call within 24 hours to discuss your project in detail.');
        // Don't call onFormSubmit immediately - let user see success screen first
        // The setTimeout below will handle closing the dialog after 4 seconds
        setTimeout(() => {
          if (onFormSubmit) onFormSubmit(formData); // This will close the dialog
        }, 4000); // Keep success message visible for 4 seconds before closing

      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus('error');
      setSubmitMessage('Failed to connect to the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If form is successfully submitted, show success screen
  if (submitStatus === 'success') {
    return (
      <div className={`w-full max-w-2xl mx-auto ${hideHeader ? 'pt-0' : 'pt-8'}`}>
        <div className="text-center space-y-6 p-8">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-foreground">Thank You!</h3>
            <p className="text-lg text-muted-foreground">
              Your inquiry has been successfully submitted.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h4 className="text-xl font-semibold text-blue-900 dark:text-blue-100">What happens next?</h4>
            </div>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">1</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Our team will review your requirements within <strong>24 hours</strong>
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">2</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  We'll schedule a <strong>discovery call</strong> to discuss your project in detail
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">3</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You'll receive a <strong>customized proposal</strong> tailored to your needs
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>Expect a call from +91-9795786303 within 24 hours</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl mx-auto ${hideHeader ? 'pt-0' : 'pt-8'}`}> 
      {!hideHeader && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">Get in Touch</h2>
          <p className="text-muted-foreground">
            Let&apos;s discuss your project. Fill out the form below, and we&apos;ll get back to you shortly.
          </p>
        </div>
      )}

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div className="w-full">
            <Label htmlFor="contact-fullName" className="text-sm font-medium text-muted-foreground">Full Name <span className="text-red-500">*</span></Label>
            <Input 
              id="contact-fullName" 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="John Doe" 
              required 
              className="mt-1 w-full bg-background border-border focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="w-full">
                <Label htmlFor="contact-email" className="text-sm font-medium text-muted-foreground">Email Address <span className="text-red-500">*</span></Label>
                <Input 
                  id="contact-email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="you@example.com" 
                  required 
                  className="mt-1 w-full bg-background border-border focus:ring-primary focus:border-primary"
                  disabled={isLoading}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="contact-phone" className="text-sm font-medium text-muted-foreground">Phone Number <span className="text-red-500">*</span></Label>
                <Input 
                  id="contact-phone" 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="123-456-7890" 
                  required 
                  className="mt-1 w-full bg-background border-border focus:ring-primary focus:border-primary"
                  disabled={isLoading}
                />
              </div>
          </div>

          <div className="w-full">
            <Label htmlFor="contact-companyName" className="text-sm font-medium text-muted-foreground">Company Name (Optional)</Label>
            <Input 
              id="contact-companyName" 
              type="text" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
              placeholder="Your Company Inc."
              className="mt-1 w-full bg-background border-border focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
          </div>

          <div className="w-full">
            <Label htmlFor="contact-selectedPackage" className="text-sm font-medium text-muted-foreground">Service/Package Interested In <span className="text-red-500">*</span></Label>
            <Select value={selectedPackage} onValueChange={setSelectedPackage} required disabled={isLoading}>
              <SelectTrigger id="contact-selectedPackage" className="mt-1 w-full bg-background border-border focus:ring-primary focus:border-primary">
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id} className="hover:bg-muted focus:bg-muted">
                    {plan.name} {plan.price !== "Custom Quote" ? `(${plan.price})` : "(Custom)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label htmlFor="contact-message" className="text-sm font-medium text-muted-foreground">Project Details / Message <span className="text-red-500">*</span></Label>
            <Textarea 
              id="contact-message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Tell us about your project, requirements, and any questions you have."
              rows={4}
              required
              className="mt-1 w-full bg-background border-border focus:ring-primary focus:border-primary resize-none"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base transition-opacity duration-300"
          >
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Send Message'}
          </Button>

          {submitStatus === 'error' && submitMessage && (
            <div className="flex items-center text-sm text-center mt-4 p-3 rounded-md border bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400">
              <AlertTriangle className="mr-2 h-5 w-5 shrink-0" />
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUs;