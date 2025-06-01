"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FAQWithCTA() {
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
      a: "If you're unsure how to promote post-launch, we’ve got marketing experts ready to help.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 relative">
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

          <form className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="Enter Your Email"
              className="rounded-full px-5 py-2"
            />
            <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 transition text-white">
              Let’s Talk
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
