'use client'
import { motion } from "framer-motion";
import { 
  SiFigma,
  SiAdobexd,
  SiSketch,
  SiInvision,
  SiFramer,
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiCanva,
  SiBlender
} from 'react-icons/si';
import { 
  CheckCircle, 
  ArrowRight, 
  Palette, 
  Eye, 
  Users, 
  Zap, 
  Star, 
  Target,
  Layers,
  Smartphone,
  Monitor,
  Globe,
  PenTool,
  Search,
  TrendingUp
} from 'lucide-react';
import { plans } from '@/lib/plansData';

const UIUXDesign = () => {

  const features = [
    {
      title: "User Research & Analysis",
      description: "Deep dive into user behavior, needs, and pain points through comprehensive research methodologies including user interviews, surveys, and analytics analysis.",
      icon: <Search className="w-8 h-8 text-pink-600" />,
      details: ["User interviews", "Surveys & questionnaires", "Analytics analysis", "Competitive research"]
    },
    {
      title: "UI/UX Design & Prototyping",
      description: "Creating intuitive and visually stunning interfaces with interactive prototypes that bring your vision to life before development begins.",
      icon: <Palette className="w-8 h-8 text-pink-600" />,
      details: ["Wireframing", "High-fidelity designs", "Interactive prototypes", "Design systems"]
    },
    {
      title: "Brand Identity & Visual Design",
      description: "Comprehensive brand identity creation including logos, color palettes, typography, and visual guidelines that reflect your brand's personality.",
      icon: <PenTool className="w-8 h-8 text-pink-600" />,
      details: ["Logo design", "Brand guidelines", "Color systems", "Typography selection"]
    },
    {
      title: "Responsive Design Solutions",
      description: "Designs that work flawlessly across all devices and screen sizes, ensuring consistent user experience from mobile to desktop.",
      icon: <Smartphone className="w-8 h-8 text-pink-600" />,
      details: ["Mobile-first design", "Tablet optimization", "Desktop layouts", "Cross-browser compatibility"]
    },
    {
      title: "Design Systems & Style Guides",
      description: "Scalable design systems that maintain consistency across your entire product ecosystem with comprehensive component libraries.",
      icon: <Layers className="w-8 h-8 text-pink-600" />,
      details: ["Component libraries", "Style guides", "Design tokens", "Pattern libraries"]
    },
    {
      title: "Usability Testing & Optimization",
      description: "Continuous improvement through user testing, A/B testing, and data-driven design decisions to maximize user satisfaction and conversion.",
      icon: <TrendingUp className="w-8 h-8 text-pink-600" />,
      details: ["User testing", "A/B testing", "Conversion optimization", "Performance analysis"]
    }
  ];

  const tools = [
    { 
      name: "Figma",
      icon: <SiFigma className="w-16 h-16 text-[#F24E1E]" />,
      category: "Design"
    },
    { 
      name: "Adobe XD",
      icon: <SiAdobexd className="w-16 h-16 text-[#FF61F6]" />,
      category: "Design"
    },
    { 
      name: "Sketch",
      icon: <SiSketch className="w-16 h-16 text-[#F7B500]" />,
      category: "Design"
    },
    { 
      name: "InVision",
      icon: <SiInvision className="w-16 h-16 text-[#FF3366]" />,
      category: "Prototype"
    },
    { 
      name: "Framer",
      icon: <SiFramer className="w-16 h-16 text-[#0055FF]" />,
      category: "Prototype"
    },
    { 
      name: "Illustrator",
      icon: <SiAdobeillustrator className="w-16 h-16 text-[#FF9A00]" />,
      category: "Graphics"
    },
    { 
      name: "Photoshop",
      icon: <SiAdobephotoshop className="w-16 h-16 text-[#31A8FF]" />,
      category: "Graphics"
    },
    { 
      name: "Canva",
      icon: <SiCanva className="w-16 h-16 text-[#00C4CC]" />,
      category: "Graphics"
    },
    { 
      name: "Blender",
      icon: <SiBlender className="w-16 h-16 text-[#F5792A]" />,
      category: "3D"
    }
  ];

  const processSteps = [
    {
      title: "Discovery & Research",
      description: "We start by understanding your business goals, target audience, and market landscape through comprehensive research and stakeholder interviews.",
      number: "01",
      icon: <Search className="w-8 h-8 text-white" />,
      timeline: "1-2 weeks",
      deliverables: ["User research report", "Competitive analysis", "Project requirements", "Design brief"]
    },
    {
      title: "Strategy & Planning",
      description: "Develop a comprehensive design strategy including user personas, journey maps, and information architecture that guides the entire design process.",
      number: "02",
      icon: <Target className="w-8 h-8 text-white" />,
      timeline: "1 week",
      deliverables: ["User personas", "User journey maps", "Information architecture", "Design strategy"]
    },
    {
      title: "Wireframing & Prototyping",
      description: "Create low-fidelity wireframes and interactive prototypes to validate concepts and user flows before moving to high-fidelity designs.",
      number: "03",
      icon: <Layers className="w-8 h-8 text-white" />,
      timeline: "1-2 weeks",
      deliverables: ["Wireframes", "User flow diagrams", "Interactive prototypes", "Concept validation"]
    },
    {
      title: "Visual Design & Branding",
      description: "Develop the visual identity including color schemes, typography, iconography, and create high-fidelity designs that align with your brand.",
      number: "04",
      icon: <Palette className="w-8 h-8 text-white" />,
      timeline: "2-3 weeks",
      deliverables: ["Visual designs", "Brand guidelines", "Design system", "Asset library"]
    },
    {
      title: "Testing & Refinement",
      description: "Conduct usability testing with real users to identify pain points and iterate on the design to ensure optimal user experience.",
      number: "05",
      icon: <Eye className="w-8 h-8 text-white" />,
      timeline: "1-2 weeks",
      deliverables: ["Usability test results", "Design iterations", "Final designs", "Testing reports"]
    },
    {
      title: "Handoff & Support",
      description: "Prepare comprehensive design documentation and assets for development team, with ongoing support during implementation.",
      number: "06",
      icon: <ArrowRight className="w-8 h-8 text-white" />,
      timeline: "Ongoing",
      deliverables: ["Design specifications", "Asset exports", "Developer handoff", "Implementation support"]
    }
  ];

  const designTypes = [
    {
      title: "Web Design",
      description: "Modern, responsive websites that engage users and drive conversions.",
      icon: <Globe className="w-6 h-6" />,
      examples: ["Landing pages", "E-commerce sites", "Corporate websites", "Portfolio sites"]
    },
    {
      title: "Mobile App Design",
      description: "Intuitive mobile app interfaces optimized for touch interactions.",
      icon: <Smartphone className="w-6 h-6" />,
      examples: ["iOS apps", "Android apps", "Progressive web apps", "Hybrid apps"]
    },
    {
      title: "Dashboard Design",
      description: "Data-rich interfaces that make complex information accessible and actionable.",
      icon: <Monitor className="w-6 h-6" />,
      examples: ["Admin dashboards", "Analytics platforms", "SaaS interfaces", "Business intelligence"]
    },
    {
      title: "Brand Identity",
      description: "Complete brand identity systems that communicate your brand's values.",
      icon: <PenTool className="w-6 h-6" />,
      examples: ["Logo design", "Brand guidelines", "Marketing materials", "Visual identity"]
    }
  ];

  const testimonials = [
    {
      name: "Jennifer Walsh",
      role: "CEO, TechFlow Solutions",
      content: "The design team transformed our outdated interface into a modern, user-friendly platform. Our user engagement increased by 180% and customer satisfaction scores improved dramatically.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Robert Kim",
      role: "Product Manager, InnovateCorp",
      content: "Their user research insights were invaluable. The redesigned app interface reduced our support tickets by 60% because users can now find what they need intuitively.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Maria Santos",
      role: "Founder, CreativeSpace",
      content: "The brand identity they created perfectly captures our company's vision. The design system has been instrumental in maintaining consistency across all our digital touchpoints.",
      rating: 5,
      image: "/api/placeholder/60/60"
    }
  ];

  // Adapt plans for design services
  const designPlans = [
    {
      ...plans[0], // Starter
      name: "Design Starter",
      description: "Perfect for small businesses needing essential design work",
      price: "₹15,000",
      deliveryTime: "5-7 Days",
      bestFor: "Small Businesses, Startups",
      features: [
        "Logo Design + Basic Branding",
        "Up to 5 page designs",
        "Basic UI/UX wireframes",
        "Mobile responsive design",
        "Design system basics",
        "2 revision rounds"
      ]
    },
    {
      ...plans[1], // Growth - Most Popular
      name: "Design Professional",
      description: "Comprehensive design solutions for growing businesses",
      deliveryTime: "1-2 Weeks",
      bestFor: "Growing Businesses, Apps",
      features: [
        "Complete brand identity",
        "UI/UX design for web/mobile",
        "Interactive prototypes",
        "Comprehensive design system",
        "User research & personas",
        "Advanced animations",
        "Unlimited revisions",
        "Design handoff documentation"
      ]
    },
    {
      ...plans[2], // Pro
      name: "Design Enterprise",
      description: "Full-scale design solutions for complex projects",
      price: "₹1,50,000+",
      deliveryTime: "3-4 Weeks",
      bestFor: "Large Companies, Complex Projects",
      features: [
        "Complete brand strategy",
        "Multi-platform design system",
        "Advanced user research",
        "A/B testing designs",
        "Accessibility compliance",
        "Design team collaboration",
        "Ongoing design support",
        "Brand guidelines documentation"
      ]
    }
  ];

  const stats = [
    { number: "300+", label: "Designs Delivered", icon: <Palette className="w-6 h-6" /> },
    { number: "98%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" /> },
    { number: "150+", label: "Happy Clients", icon: <Users className="w-6 h-6" /> },
    { number: "24/7", label: "Design Support", icon: <Zap className="w-6 h-6" /> }
  ];

  const faqs = [
    {
      question: "What's included in your design process?",
      answer: "Our comprehensive design process includes user research, wireframing, visual design, prototyping, user testing, and developer handoff. We ensure every step is collaborative and transparent."
    },
    {
      question: "How long does a typical design project take?",
      answer: "Project timelines vary based on scope and complexity. Simple projects take 1-2 weeks, while comprehensive design systems can take 4-6 weeks. We provide detailed timelines during our initial consultation."
    },
    {
      question: "Do you provide design systems and style guides?",
      answer: "Yes! We create comprehensive design systems including component libraries, style guides, and design tokens to ensure consistency across your entire product ecosystem."
    },
    {
      question: "Can you work with our existing brand guidelines?",
      answer: "Absolutely! We can work within your existing brand guidelines or help evolve them. We're experienced in both creating new brand identities and enhancing existing ones."
    },
    {
      question: "Do you offer ongoing design support after project completion?",
      answer: "Yes, we offer various support packages including design updates, new feature designs, and consultation services to help your product evolve over time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-[#0A0A1B] dark:via-[#1A1A35] dark:to-[#0A0A1B] from-gray-50 via-white to-gray-100">
      {/* Enhanced Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-rose-600/10 dark:from-pink-600/20 dark:via-purple-600/20 dark:to-rose-600/20"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-sm font-medium mb-6"
            >
              <Palette className="w-4 h-4 mr-2" />
              Professional UI/UX Design Services
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Create Beautiful
              <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                User Experiences
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              We design intuitive, engaging, and conversion-focused digital experiences that users love. 
              From research to final design, we create solutions that drive business success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                Start Your Design Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                View Design Portfolio
              </motion.button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2 text-pink-600 dark:text-pink-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Comprehensive Design Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From user research to final implementation, we provide end-to-end design solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-6 p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Design Types Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Types of Design We Create
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Specialized expertise across various design disciplines and platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {designTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4 text-pink-600">
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {type.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {type.description}
                </p>
                <ul className="space-y-1">
                  {type.examples.map((example, idx) => (
                    <li key={idx} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                      {example}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Technologies Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Design Tools & Technologies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We use industry-leading design tools to create exceptional digital experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group flex flex-col items-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-300"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <span className="text-gray-900 dark:text-white font-semibold text-center mb-1">
                  {tool.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {tool.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Process Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Design Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A user-centered approach that ensures every design decision is backed by research and testing
            </p>
          </motion.div>

          <div className="space-y-12">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="lg:w-1/2">
                  <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center mb-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {step.number}
                </div>
                <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                        </h3>
                        <p className="text-pink-600 dark:text-pink-400 font-medium">
                          Timeline: {step.timeline}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Key Deliverables:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {step.deliverables.map((deliverable, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {deliverable}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Design Service Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the perfect design package for your project needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {designPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border ${
                  plan.name === "Design Professional"
                    ? 'border-pink-500 shadow-2xl scale-105' 
                    : 'border-white/20'
                }`}
              >
                {plan.name === "Design Professional" && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                    {plan.price}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {plan.monthlyEquivalent}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    {plan.description}
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-pink-600 dark:text-pink-400">
                      <strong>Delivery:</strong> {plan.deliveryTime}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      <strong>Support:</strong> {plan.support}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      <strong>Best for:</strong> {plan.bestFor}
                    </p>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.addOns && plan.addOns.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Available Add-ons:
                    </h4>
                    <ul className="space-y-2">
                      {plan.addOns.map((addOn, idx) => (
                        <li key={idx} className="text-sm text-gray-500 dark:text-gray-400">
                          • {addOn}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    plan.name === "Design Professional"
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real results from real design projects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about our design services
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Digital Experience?
          </h2>
          <p className="text-xl text-pink-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let&apos;s collaborate to create designs that not only look stunning but also perform exceptionally, 
            driving user satisfaction and business growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/contact'}
              className="bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Start Your Design Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-pink-600 transition-all duration-300"
            >
              Schedule Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UIUXDesign; 