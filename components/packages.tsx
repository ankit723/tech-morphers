'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { CheckIcon, TrendingUpIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import ContactUs from './forms/contactUs';

// User-provided plans data with cumulative features
export const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "₹29,999",
    monthlyEquivalent: "One-time",
    description: "Perfect for early-stage startups or small businesses launching their digital presence.",
    deliveryTime: "7-10 Days",
    action: "Contact Us",
    features: [
      "Responsive Website Or Mobile App (5 pages)",
      "Basic Branding + Logo Design",
      "Contact Form + Social Integration",
      "Hosting + SSL Setup",
      "SEO Ready Setup",
    ],
    addOns: [
      "Blog Setup – ₹2,000",
      "Basic Admin Panel – ₹3,000",
    ],
    support: "15 Days Support",
    bestFor: "Personal Brands, Small Biz",
    isPopular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹79,999",
    monthlyEquivalent: "One-time",
    description: "Scalable solutions for growing startups or small teams needing advanced functionality.",
    deliveryTime: "2-3 Weeks",
    action: "Contact Us",
    features: [
      // Starter features
      "Responsive Website Or Mobile App (5 pages)",
      "Basic Branding + Logo Design",
      "Contact Form + Social Integration",
      "Hosting + SSL Setup",
      "SEO Ready Setup",
      // Growth unique features
      "Custom Web App or Website Or Mobile App (8-12 pages)",
      "Admin Dashboard",
      "Authentication (Clerk/Auth.js)",
      "API Integrations (Mailchimp, Stripe, Notion etc.)",
      "Performance & SEO Optimization",
      "Deployment (Vercel / Netlify / Render)",
    ],
    addOns: [
      "Mobile Responsive Admin – ₹5,000",
      "Multilingual Support – ₹4,000",
      "Blog with CMS – ₹3,000",
    ],
    support: "30 Days Support + Minor Updates",
    bestFor: "Startups, D2C Brands, Consultants",
    isPopular: true,
  },
  {
    id: "pro",
    name: "Pro / SaaS MVP",
    price: "₹99,999",
    monthlyEquivalent: "One-time",
    description: "Full-stack MVP including frontend, backend, and scalable database for SaaS or AI tools.",
    deliveryTime: "4-5 Weeks",
    action: "Contact Us",
    features: [
      // Starter features (via Growth)
      "Responsive Website Or Mobile App (5 pages)",
      "Basic Branding + Logo Design",
      "Contact Form + Social Integration",
      "Hosting + SSL Setup",
      "SEO Ready Setup",
      // Growth unique features (via Growth)
      "Custom Web App or Website Or Mobile App (8-12 pages)",
      "Admin Dashboard",
      "Authentication (Clerk/Auth.js)",
      "API Integrations (Mailchimp, Stripe, Notion etc.)",
      "Performance & SEO Optimization",
      "Deployment (Vercel / Netlify / Render)",
      // Pro unique features
      "SaaS Dashboard with Auth + Roles",
      "Subscription & Payment Integration (Stripe/Razorpay)",
      "Prisma + Supabase/PostgreSQL",
      "CI/CD Setup + Docker Optional",
      "Real-time Features (Socket/Live Updates)",
      "Admin Panel + API Docs",
    ],
    addOns: [
      "AI Integration (OpenAI, Vertex AI) – ₹10,000+",
      "Mobile App with React Native – ₹20,000",
      "Cloud Hosting & Domain Management – ₹5,000",
    ],
    support: "45 Days Support + 3 Revisions",
    bestFor: "SaaS Founders, Internal Tools, AI Startups",
    isPopular: false,
  },
  {
    id: "custom",
    name: "Custom Enterprise",
    price: "Custom Quote",
    monthlyEquivalent: "Depends on Scope",
    description: "Tailored enterprise-level solution with full design, development, and devops stack.",
    deliveryTime: "6–10 Weeks",
    action: "Contact Us",
    features: [
      // Starter features (via Pro)
      "Responsive Website Or Mobile App (5 pages)",
      "Basic Branding + Logo Design",
      "Contact Form + Social Integration",
      "Hosting + SSL Setup",
      "SEO Ready Setup",
      // Growth unique features (via Pro)
      "Custom Web App or Website Or Mobile App (8-12 pages)",
      "Admin Dashboard",
      "Authentication (Clerk/Auth.js)",
      "API Integrations (Mailchimp, Stripe, Notion etc.)",
      "Performance & SEO Optimization",
      "Deployment (Vercel / Netlify / Render)",
      // Pro unique features (via Pro)
      "SaaS Dashboard with Auth + Roles",
      "Subscription & Payment Integration (Stripe/Razorpay)",
      "Prisma + Supabase/PostgreSQL",
      "CI/CD Setup + Docker Optional",
      "Real-time Features (Socket/Live Updates)",
      "Admin Panel + API Docs",
      // Custom Enterprise unique features
      "Dedicated Team Allocation",
      "Discovery + UI/UX + Wireframing",
      "Backend Infra Design & Scalable API",
      "Microservices / Monorepo Setup",
      "Production Monitoring + Analytics",
      "Priority Support + Maintenance Contract",
    ],
    addOns: [
      "AI Workflows",
      "Internal Dashboards",
      "CRM/ERP Integrations",
    ],
    support: "Dedicated SLA-based Support",
    bestFor: "Govt Projects, Large Enterprises, Long-term Ventures",
    isPopular: false,
  },
];

// Generate a master list of all unique features - This will now correctly reflect the cumulative features
let allUniqueFeatures = Array.from(new Set(plans.flatMap(plan => plan.features)));

// Define keys for other comparable rows
const otherComparableRows = [
  { key: 'deliveryTime', label: "Delivery Time" },
  { key: 'support', label: "Support" },
  { key: 'bestFor', label: "Best For" },
  { key: 'action', label: "Action"}
];

// Helper function for plan CTA text
const getPlanCtaText = (planId: string, planName: string) => {
  if (planId === 'custom') return "Contact Us";
  return `Contact Us`;
};

// Helper component for Dialog with Close Confirmation
interface PlanContactDialogProps {
  plan: typeof plans[0];
}

const PlanContactDialog: React.FC<PlanContactDialogProps> = ({ plan }) => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isConfirmCloseOpen, setIsConfirmCloseOpen] = useState(false);

  const handleDialogCloseAttempt = () => {
    // If form had changes, show confirmation, otherwise close directly (simplified for now)
    setIsConfirmCloseOpen(true);
  };

  return (
    <>
      <Dialog open={isContactDialogOpen} onOpenChange={(open) => {
        if (open) {
          setIsContactDialogOpen(true);
        } else {
          // User attempted to close (e.g., Esc key or overlay click)
          handleDialogCloseAttempt();
        }
      }}>
        <DialogTrigger asChild>
          <Button
            variant={plan.isPopular ? "default" : "outline"} 
            className={`w-full font-medium py-3 rounded-md text-sm transition-colors duration-200 dark:text-white ${plan.isPopular ? 'bg-blue-700 hover:bg-blue-800 text-primary-foreground' : 'border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-primary-foreground'}`}>
            {getPlanCtaText(plan.id, plan.name)}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card p-6 shadow-lg rounded-lg sm:max-w-md md:max-w-lg lg:max-w-xl">
           <DialogTitle>
             <p className="text-3xl font-bold text-center mb-2 text-foreground">Get in Touch</p>
             <p className="text-center text-muted-foreground font-light mb-8">
               Let&apos;s discuss your project. Fill out the form below, and we&apos;ll get back to you shortly.
             </p>
           </DialogTitle>
           <ContactUs 
             defaultPackage={plan.id} 
             onFormSubmit={() => {
               setIsContactDialogOpen(false); // Close dialog on successful form submission
             }}
             hideHeader={true}
           />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmCloseOpen} onOpenChange={setIsConfirmCloseOpen}>
        <AlertDialogContent className='mx-auto max-w-sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Close</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close the form? Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmCloseOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsConfirmCloseOpen(false);
              setIsContactDialogOpen(false); // Actually close the main dialog
            }}>Yes, Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const Packages = () => {
  const heroAnimVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 0.3, duration: 0.5, ease: "easeOut" } // Added base delay for after hero
    })
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.4, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen text-foreground py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.section 
        className="text-center mb-16 md:mb-24 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
        variants={heroAnimVariants}
        >
          <motion.h1
          variants={heroAnimVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-foreground"
          >
          Flexible Plans for Every Vision
          </motion.h1>
          <motion.p
          variants={heroAnimVariants}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          Whether you&apos;re launching a new idea or scaling an enterprise, find the perfect package tailored to your needs. Transparent pricing, powerful features, and dedicated support.
          </motion.p>
      </motion.section>

      {/* Package Cards Section */}
      <section className="mb-16 md:mb-24">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="h-full flex flex-col"
              >
                <Card className={`flex flex-col flex-grow bg-card border rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 relative ${plan.isPopular ? 'border-primary ring-2 ring-primary/50' : 'border-border'}`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 mt-2 mr-2 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center z-10">
                      <TrendingUpIcon className="h-3.5 w-3.5 mr-1"/> Popular
                    </div>
                  )}
                  <CardHeader className="p-6">
                    <CardTitle className="text-2xl font-semibold text-card-foreground mb-2">{plan.name}</CardTitle>
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-card-foreground">{plan.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">{plan.monthlyEquivalent}</span>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground min-h-[60px]">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-6 mt-auto bg-muted/20 dark:bg-card border-t border-border/50">
                    <PlanContactDialog plan={plan} />
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={{ visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
        className="max-w-full mx-auto"
      >
         <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 text-foreground">
            Compare Plans & Features
          </h2>
        <div className="overflow-x-auto bg-card rounded-lg shadow-lg border border-border">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="py-4 px-4 md:px-6 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground w-[28%] sticky left-0 bg-card z-20">Feature</TableHead>
                {plans.map(plan => (
                  <TableHead key={plan.id} className={`py-4 px-4 md:px-6 text-center text-sm font-semibold uppercase tracking-wider w-[18%] ${plan.isPopular ? 'text-primary' : 'text-muted-foreground'}`}>
                    {plan.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/50">
              {/* Feature Rows */}
              {allUniqueFeatures.map((feature, featureIndex) => (
                <motion.tr
                  key={feature}
                  custom={featureIndex} 
                  initial="hidden"
                  animate="visible"
                  variants={tableRowVariants}
                  className="hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors duration-150 group"
                >
                  <TableCell className="py-3.5 px-2 md:px-4 font-medium text-sm text-foreground whitespace-normal break-words sticky left-0 bg-card group-hover:bg-muted/50 dark:group-hover:bg-muted/20 z-10">
                    <div className="flex items-center">
                       {feature}
                       {/* <InfoIcon className="h-3.5 w-3.5 text-gray-500 ml-1.5 opacity-50 hover:opacity-100 cursor-help" /> */}
                    </div>
                  </TableCell>
                  {plans.map(plan => (
                    <TableCell key={`${plan.id}-${feature}`} className="py-3.5 px-2 md:px-4 text-center">
                      {plan.features.includes(feature) ? 
                        <CheckIcon className="h-5 w-5 text-primary mx-auto" /> : 
                        <span className="text-muted-foreground">-</span>
                      }
                    </TableCell>
                  ))}
                </motion.tr>
              ))}
              {/* Other Comparable Rows (Delivery, Support, Best For) */}
              {otherComparableRows.map((rowItem, rowIndex) => (
                <motion.tr 
                  key={rowItem.key}
                  custom={allUniqueFeatures.length + rowIndex}
                  initial="hidden"
                  animate="visible"
                  variants={tableRowVariants}
                  className="hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors duration-150 group border-t-2 border-border !mt-2" // Added top border for separation
                 >
                  <TableCell className="py-3.5 px-4 md:px-6 font-semibold text-sm text-foreground whitespace-nowrap sticky left-0 bg-card group-hover:bg-muted/50 dark:group-hover:bg-muted/20 z-10">
                    {rowItem.label}
                  </TableCell>
                  {plans.map(plan => (
                    <TableCell key={`${plan.id}-${rowItem.key}`} className="py-3.5 px-4 md:px-6 text-center text-sm text-muted-foreground">
                      {rowItem.key === 'action' ? (
                        <PlanContactDialog plan={plan} />
                      ) : (
                        (plan as any)[rowItem.key]
                      )}
                    </TableCell>
                  ))}
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-5 text-foreground">Having trouble deciding? Try out our <span className="text-blue-700">Free AI Estimator Tool Now !</span></h1>
          <div className="flex justify-center">
            <Button variant="default" size="lg" className="bg-blue-700 text-white hover:bg-blue-800 px-10 py-5">
              <Link href="/ai-estimator">
                Try Now
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Packages;
