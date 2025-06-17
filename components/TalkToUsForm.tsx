"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Mail, Sparkles } from "lucide-react";

export default function TalkToUsForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/talk-to-us", {
      method: "POST",
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      console.log("TalkToUs form submitted")
      setIsSubmitted(true)
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
        setIsSubmitted(false)
      }, 4000)
    }
    // Handle form submission logic here
    console.log("Form data submitted:", formData);
    // You would typically send this data to a backend or an email service
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-100"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              {/* Success Icon with Animation */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3, type: "spring", damping: 15, stiffness: 300 }}
                className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </motion.div>

              {/* Content */}
              <div className="text-center space-y-4">
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  You&apos;re In! 🎉
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-gray-600 dark:text-gray-300"
                >
                  Your email has been successfully submitted to our newsletter.
                </motion.p>

                {/* Newsletter Benefits */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-900 dark:text-blue-100 text-sm">What to Expect</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-800 dark:text-blue-200">Latest project updates & case studies</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-800 dark:text-blue-200">Exclusive tips & development insights</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-800 dark:text-blue-200">Early access to new services</span>
                    </div>
                  </div>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  Check your inbox for a welcome message!
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid gap-2">
        <Label htmlFor="name" className="">
          Full Name
        </Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
          className=""
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email" className="">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className=""
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone" className="">
          Phone Number <span className="text-gray-500">(Optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(123) 456-7890"
          value={formData.phone}
          onChange={handleChange}
          className=""
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message" className="">
          Your Message
        </Label>
        <Textarea
          id="message"
          placeholder="Tell us about your project or inquiry..."
          value={formData.message}
          onChange={handleChange}
          required
          className=""
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full text-lg py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-md"
      >
        Send Message
      </Button>
    </form>
  );
} 