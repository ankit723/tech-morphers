

// Defines the structure for a pricing plan
export interface Plan {
  id: string;
  name: string;
  price: string;
  monthlyEquivalent: string;
  description: string;
  deliveryTime: string;
  action: string;
  features: string[];
  addOns: string[]; // Or AddOn[] if you want structured add-ons
  support: string;
  bestFor: string;
  isPopular: boolean;
}

export const plans: Plan[] = [
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