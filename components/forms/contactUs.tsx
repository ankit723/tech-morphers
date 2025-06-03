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
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'; // Added icons

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
        setSubmitMessage(result.message || 'Thank you for your message! We\'ll be in touch soon.');
        if (onFormSubmit) onFormSubmit(formData); // Call callback if provided
        // Do not reset form immediately here if it's in a dialog that might close
        // The onFormSubmit might handle closing the dialog and then the component unmounts.
        // If not in a dialog, or if the dialog remains open, you might want to call resetForm() after a delay.
        setTimeout(resetForm, 3000); // Reset form after 3 seconds on success

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

  return (
    <div className={`max-w-2xl mx-auto ${hideHeader ? 'pt-0' : 'pt-8'}`}> 
      {!hideHeader && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">Get in Touch</h2>
          <p className="text-muted-foreground">
            Let&apos;s discuss your project. Fill out the form below, and we&apos;ll get back to you shortly.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="contact-fullName" className="text-sm font-medium text-muted-foreground">Full Name <span className="text-red-500">*</span></Label>
          <Input 
            id="contact-fullName" 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            placeholder="John Doe" 
            required 
            className="mt-1 bg-background border-border focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact-email" className="text-sm font-medium text-muted-foreground">Email Address <span className="text-red-500">*</span></Label>
              <Input 
                id="contact-email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com" 
                required 
                className="mt-1 bg-background border-border focus:ring-primary focus:border-primary"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="contact-phone" className="text-sm font-medium text-muted-foreground">Phone Number <span className="text-red-500">*</span></Label>
              <Input 
                id="contact-phone" 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="123-456-7890" 
                required 
                className="mt-1 bg-background border-border focus:ring-primary focus:border-primary"
                disabled={isLoading}
              />
            </div>
        </div>

        <div>
          <Label htmlFor="contact-companyName" className="text-sm font-medium text-muted-foreground">Company Name (Optional)</Label>
          <Input 
            id="contact-companyName" 
            type="text" 
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)} 
            placeholder="Your Company Inc."
            className="mt-1 bg-background border-border focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
        </div>

        <div>
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

        <div>
          <Label htmlFor="contact-message" className="text-sm font-medium text-muted-foreground">Project Details / Message <span className="text-red-500">*</span></Label>
          <Textarea 
            id="contact-message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Tell us about your project, requirements, and any questions you have."
            rows={4}
            required
            className="mt-1 bg-background border-border focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading || submitStatus === 'success'} // Disable after successful submission until reset
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base transition-opacity duration-300"
        >
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Send Message'}
        </Button>

        {submitStatus && submitMessage && (
          <div className={`flex items-center text-sm text-center mt-4 p-3 rounded-md border ${submitStatus === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'}`}>
            {submitStatus === 'success' ? <CheckCircle2 className="mr-2 h-5 w-5 shrink-0" /> : <AlertTriangle className="mr-2 h-5 w-5 shrink-0" />}
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactUs;