"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function FAQWithCTA() {
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  async function handleFormSubmit(formData: FormData) {
    const res = await fetch("/api/lets-talk", {
      method: "POST",
      body: JSON.stringify({ email: formData.get("email") })
    })
    if (res.ok) {
      console.log("LetsTalk form submitted")
      setIsEmailSubmitted(true)
    }
  }

  useEffect(() => {
    if (isEmailSubmitted) {
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
        setIsEmailSubmitted(false) // Reset the state
      }, 4000)
    }
  }, [isEmailSubmitted])

  const faqs = [
    {
      q: "How do I sign up for the project?",
      a: "You can register directly via our onboarding form. We'll contact you for further steps within 24 hours.",
    },
    {
      q: "What should I prepare before starting?",
      a: "Just your idea and a bit of clarity. We'll handle everything from planning to execution.",
    },
    {
      q: "Does my company need help with marketing?",
      a: "If you're unsure how to promote post-launch, we've got marketing experts ready to help.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 relative">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <div className="absolute inset-0 -z-10">
        {/* Sparkle elements */}
        <div className="absolute top-2 left-2 text-blue-700 text-4xl">✦</div>
        <div className="absolute top-4 right-0 text-blue-700 text-3xl">✦</div>
        <div className="absolute bottom-0 left-0 text-blue-700 text-2xl">✦</div>
        <div className="absolute top-70 right-0 text-blue-700 text-xl">✦</div>
      </div>
        {/* FAQ Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-muted pb-4"
              >
                <AccordionTrigger className="text-lg font-semibold hover:underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold tracking-tight">
            How We Can Help You?
          </h2>
          <p className="text-muted-foreground text-lg">
            Follow our newsletter. We regularly update our latest projects and availability.
          </p>

            <form className="flex items-center gap-2" action={handleFormSubmit}>
              <Input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                className="rounded-full px-5 py-2"
                autoComplete="email"
                required
              />
              <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 transition text-white" type="submit">
                Let&apos;s Talk
              </Button>
            </form>

          <div>
            <a
              href="#"
              className="text-blue-600 hover:underline inline-flex items-center text-sm font-medium"
            >
              More FAQ <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
