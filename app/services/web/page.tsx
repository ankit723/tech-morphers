'use client'
import { motion } from "framer-motion";
import { 
  Code2, 
  ShoppingBag, 
  Smartphone, 
  Webhook, 
  Globe2, 
  Cloud, 
  Figma, 
  GitBranch,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Award,
  Zap,
  Shield,
  Gauge,
  Layers3,
  Database,
  Building
} from 'lucide-react';
import { 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiTypescript, 
  SiMongodb, 
  SiPostgresql,
  SiPython,
  SiDjango,
  SiDocker,
  SiAmazon,
  SiRedis,
  SiGraphql,
  SiTailwindcss,
  SiVuedotjs,
  SiAngular,
  SiFirebase,
  SiKubernetes,
  SiJenkins
} from 'react-icons/si';
import { useState } from 'react';
import { plans } from '@/lib/plansData';

const WebDevelopment = () => {
  const [activeTab, setActiveTab] = useState('features');

  // Filter plans relevant to web development (all plans since they include web development)
  const webPlans = plans.filter(plan => plan.id !== 'custom').concat(plans.find(plan => plan.id === 'custom')!);

  const features = [
    {
      title: "Custom Web Applications",
      description: "Tailored solutions built from the ground up to meet your specific business requirements. We create scalable, maintainable, and user-friendly applications that grow with your business.",
      icon: <Code2 className="w-8 h-8 text-blue-600" />,
      details: ["Full-stack development", "Custom UI/UX design", "API integration", "Database design"]
    },
    {
      title: "E-commerce Solutions",
      description: "Comprehensive online stores with secure payment gateways, inventory management, and analytics. Built for performance and conversion optimization.",
      icon: <ShoppingBag className="w-8 h-8 text-blue-600" />,
      details: ["Payment gateway integration", "Inventory management", "Order tracking", "Analytics dashboard"]
    },
    {
      title: "Progressive Web Apps",
      description: "Fast, reliable, and engaging web applications that work offline and provide native app-like experiences across all devices.",
      icon: <Smartphone className="w-8 h-8 text-blue-600" />,
      details: ["Offline functionality", "Push notifications", "App-like experience", "Cross-platform compatibility"]
    },
    {
      title: "API Development & Integration",
      description: "Robust and scalable RESTful and GraphQL APIs that power your digital ecosystem and enable seamless third-party integrations.",
      icon: <Webhook className="w-8 h-8 text-blue-600" />,
      details: ["RESTful APIs", "GraphQL endpoints", "Third-party integrations", "API documentation"]
    },
    {
      title: "Enterprise Solutions",
      description: "Large-scale web applications designed for enterprise environments with advanced security, scalability, and performance features.",
      icon: <Building className="w-8 h-8 text-blue-600" />,
      details: ["Microservices architecture", "Advanced security", "Load balancing", "Monitoring & logging"]
    },
    {
      title: "Cloud Infrastructure",
      description: "Scalable cloud deployment and infrastructure management using AWS, Google Cloud, and Azure for optimal performance.",
      icon: <Cloud className="w-8 h-8 text-blue-600" />,
      details: ["Auto-scaling", "Load balancing", "CDN integration", "Database optimization"]
    }
  ];

  const technologies = [
    { 
      name: "React",
      icon: <SiReact className="w-16 h-16 text-[#61DAFB]" />,
      category: "Frontend"
    },
    { 
      name: "Next.js",
      icon: <SiNextdotjs className="w-16 h-16 text-black dark:text-white" />,
      category: "Framework"
    },
    { 
      name: "Node.js",
      icon: <SiNodedotjs className="w-16 h-16 text-[#339933]" />,
      category: "Backend"
    },
    { 
      name: "TypeScript",
      icon: <SiTypescript className="w-16 h-16 text-[#3178C6]" />,
      category: "Language"
    },
    { 
      name: "MongoDB",
      icon: <SiMongodb className="w-16 h-16 text-[#47A248]" />,
      category: "Database"
    },
    { 
      name: "PostgreSQL",
      icon: <SiPostgresql className="w-16 h-16 text-[#4169E1]" />,
      category: "Database"
    },
    { 
      name: "Python",
      icon: <SiPython className="w-16 h-16 text-[#3776AB]" />,
      category: "Language"
    },
    { 
      name: "Django",
      icon: <SiDjango className="w-16 h-16 text-[#092E20]" />,
      category: "Framework"
    },
    { 
      name: "Docker",
      icon: <SiDocker className="w-16 h-16 text-[#2496ED]" />,
      category: "DevOps"
    },
    { 
      name: "AWS",
      icon: <SiAmazon className="w-16 h-16 text-[#FF9900]" />,
      category: "Cloud"
    },
    { 
      name: "Redis",
      icon: <SiRedis className="w-16 h-16 text-[#DC382D]" />,
      category: "Database"
    },
    { 
      name: "GraphQL",
      icon: <SiGraphql className="w-16 h-16 text-[#E10098]" />,
      category: "API"
    }
  ];

  const processSteps = [
    {
      title: "Discovery & Planning",
      description: "We conduct thorough research to understand your business goals, target audience, and technical requirements. This phase includes stakeholder interviews, market analysis, and technical architecture planning.",
      number: "01",
      icon: <Globe2 className="w-8 h-8 text-white" />,
      timeline: "1-2 weeks",
      deliverables: ["Project roadmap", "Technical specification", "Wire frames", "Timeline & budget"]
    },
    {
      title: "Design & Prototyping",
      description: "Our designers create intuitive user interfaces and engaging user experiences with interactive prototypes for validation before development begins.",
      number: "02",
      icon: <Figma className="w-8 h-8 text-white" />,
      timeline: "2-3 weeks",
      deliverables: ["UI/UX designs", "Interactive prototypes", "Design system", "User flow diagrams"]
    },
    {
      title: "Development & Implementation",
      description: "We build your application using agile methodologies, ensuring clean, scalable, and maintainable code with regular progress updates.",
      number: "03",
      icon: <Code2 className="w-8 h-8 text-white" />,
      timeline: "4-12 weeks",
      deliverables: ["Frontend development", "Backend APIs", "Database setup", "Third-party integrations"]
    },
    {
      title: "Testing & Quality Assurance",
      description: "Comprehensive testing including unit tests, integration tests, performance testing, and security audits to ensure your application meets the highest standards.",
      number: "04",
      icon: <Shield className="w-8 h-8 text-white" />,
      timeline: "1-2 weeks",
      deliverables: ["Test reports", "Bug fixes", "Performance optimization", "Security audit"]
    },
    {
      title: "Deployment & Launch",
      description: "We handle the entire deployment process, from server setup to production launch, with monitoring and support to ensure smooth operation.",
      number: "05",
      icon: <Cloud className="w-8 h-8 text-white" />,
      timeline: "1 week",
      deliverables: ["Production deployment", "SSL certificates", "Monitoring setup", "Documentation"]
    },
    {
      title: "Maintenance & Support",
      description: "Ongoing support and maintenance to keep your application running smoothly with regular updates, security patches, and feature enhancements.",
      number: "06",
      icon: <GitBranch className="w-8 h-8 text-white" />,
      timeline: "Ongoing",
      deliverables: ["Regular updates", "Security patches", "Performance monitoring", "Technical support"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      content: "The team delivered an exceptional e-commerce platform that exceeded our expectations. Sales increased by 150% in the first quarter after launch.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Michael Chen",
      role: "CTO, InnovateLab",
      content: "Their technical expertise and attention to detail are outstanding. The web application they built scales perfectly with our growing user base.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Emily Rodriguez",
      role: "Founder, GrowthCo",
      content: "Professional, reliable, and innovative. They transformed our business processes with a custom web solution that saves us hours every day.",
      rating: 5,
      image: "/api/placeholder/60/60"
    }
  ];

  const pricingTiers = webPlans.map(plan => ({
    name: plan.name,
    price: plan.price,
    duration: plan.monthlyEquivalent,
    description: plan.description,
    features: plan.features,
    popular: plan.isPopular,
    deliveryTime: plan.deliveryTime,
    support: plan.support,
    bestFor: plan.bestFor,
    addOns: plan.addOns
  }));

  const stats = [
    { number: "200+", label: "Projects Completed", icon: <Award className="w-6 h-6" /> },
    { number: "98%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" /> },
    { number: "50+", label: "Happy Clients", icon: <Users className="w-6 h-6" /> },
    { number: "24/7", label: "Support Available", icon: <Zap className="w-6 h-6" /> }
  ];

  const faqs = [
    {
      question: "How long does it take to develop a web application?",
      answer: "The timeline varies based on complexity, but typically ranges from 6-16 weeks for most projects. We provide detailed timelines during the planning phase."
    },
    {
      question: "Do you provide ongoing maintenance and support?",
      answer: "Yes, we offer comprehensive maintenance packages including security updates, bug fixes, performance optimization, and feature enhancements."
    },
    {
      question: "Can you integrate with existing systems?",
      answer: "Absolutely! We have extensive experience integrating with various third-party systems, APIs, and existing infrastructure."
    },
    {
      question: "What technologies do you recommend?",
      answer: "We recommend technologies based on your specific needs, scalability requirements, and long-term goals. We'll discuss the best options during our consultation."
    },
    {
      question: "Do you provide hosting services?",
      answer: "While we don't provide hosting directly, we help you choose the best hosting solution and can manage the deployment process for you."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-[#0A0A1B] dark:via-[#1A1A35] dark:to-[#0A0A1B] from-gray-50 via-white to-gray-100">
      {/* Hero Section with Enhanced Styling */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-cyan-600/20"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
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
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Professional Web Development Services
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Build Powerful
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Web Applications
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              We create modern, scalable, and secure web applications that drive business growth. 
              From concept to deployment, we deliver exceptional digital experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                View Portfolio
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
                  <div className="flex justify-center mb-2 text-blue-600 dark:text-blue-400">
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
              Comprehensive Web Development Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From simple websites to complex enterprise applications, we deliver solutions that drive results
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
                className="group bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-6 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
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

      {/* Enhanced Technologies Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Cutting-Edge Technologies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We leverage the latest technologies and frameworks to build robust, scalable applications
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group flex flex-col items-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {tech.icon}
                </div>
                <span className="text-gray-900 dark:text-white font-semibold text-center mb-1">
                  {tech.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {tech.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Process Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A proven methodology that ensures successful project delivery on time and within budget
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
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
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
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  {step.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Pricing Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the perfect package for your project needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border ${
                  tier.popular 
                    ? 'border-blue-500 shadow-2xl scale-105' 
                    : 'border-white/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                    {tier.price}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {tier.duration}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    {tier.description}
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      <strong>Delivery:</strong> {tier.deliveryTime}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      <strong>Support:</strong> {tier.support}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      <strong>Best for:</strong> {tier.bestFor}
                    </p>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {tier.addOns && tier.addOns.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Available Add-ons:
                    </h4>
                    <ul className="space-y-2">
                      {tier.addOns.map((addOn, idx) => (
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
                    tier.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
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
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
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
              Don't just take our word for it
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
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
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
      <div className="py-20 px-4 sm:px-6 lg:px-8">
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
              Everything you need to know about our web development services
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
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let's discuss your project and create a web application that drives results. 
            Our team is ready to turn your vision into reality with cutting-edge technology and exceptional design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/contact'}
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Start Your Project Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Schedule Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WebDevelopment; 