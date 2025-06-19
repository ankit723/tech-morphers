'use client'
import { motion } from "framer-motion";
import { 
  SiSwift,
  SiKotlin,
  SiReact,
  SiFlutter,
  SiFirebase,
  SiAmazon,
  SiGooglecloud,
  SiApple,
  SiAndroid,
  SiXcode,
  SiAndroidstudio,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiGithub
} from 'react-icons/si';
import {
  Smartphone,
  Tablet,
  Monitor,
  Zap,
  Shield,
  Users,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Code2,
  Globe,
  Cloud,
  Lightbulb,
  Rocket,
  Settings,
  Download,
  Share2,
  Bell,
  Search,
  Database,
  Lock,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { plans } from '@/lib/plansData';

const AppDevelopment = () => {
  const [activeTab, setActiveTab] = useState('features');

  // Filter plans relevant to mobile development (all plans since they include mobile development)
  const mobilePlans = plans.filter(plan => plan.id !== 'custom').concat(plans.find(plan => plan.id === 'custom')!);

  const features = [
    {
      title: "Native iOS & Android Apps",
      description: "High-performance native applications built with Swift and Kotlin, offering the best user experience and device-specific features integration.",
      icon: <Smartphone className="w-8 h-8 text-purple-600" />,
      details: ["Swift for iOS development", "Kotlin for Android development", "Platform-specific UI components", "Native performance optimization"]
    },
    {
      title: "Cross-Platform Development",
      description: "Cost-effective solutions using React Native and Flutter that work seamlessly across iOS and Android platforms with shared codebase.",
      icon: <Tablet className="w-8 h-8 text-purple-600" />,
      details: ["React Native development", "Flutter framework", "Shared business logic", "Platform-specific customizations"]
    },
    {
      title: "Progressive Web Apps (PWA)",
      description: "Web applications that provide native app-like experiences with offline capabilities, push notifications, and home screen installation.",
      icon: <Monitor className="w-8 h-8 text-purple-600" />,
      details: ["Offline functionality", "Push notifications", "App shell architecture", "Service worker implementation"]
    },
    {
      title: "Enterprise Mobile Solutions",
      description: "Scalable mobile applications for enterprises with advanced security, integration capabilities, and device management features.",
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      details: ["Enterprise security", "MDM integration", "Backend connectivity", "Scalable architecture"]
    },
    {
      title: "App Store Optimization",
      description: "Complete app store presence with optimized listings, keyword research, and marketing strategies to maximize app visibility and downloads.",
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      details: ["App store optimization", "Keyword research", "Marketing strategy", "Analytics tracking"]
    },
    {
      title: "Maintenance & Support",
      description: "Comprehensive ongoing support including regular updates, bug fixes, performance optimization, and new feature development.",
      icon: <Settings className="w-8 h-8 text-purple-600" />,
      details: ["Regular updates", "Bug fixes", "Performance monitoring", "Feature enhancements"]
    }
  ];

  const technologies = [
    { 
      name: "Swift",
      icon: <SiSwift className="w-16 h-16 text-[#F05138]" />,
      category: "iOS"
    },
    { 
      name: "Kotlin",
      icon: <SiKotlin className="w-16 h-16 text-[#7F52FF]" />,
      category: "Android"
    },
    { 
      name: "React Native",
      icon: <SiReact className="w-16 h-16 text-[#61DAFB]" />,
      category: "Cross-Platform"
    },
    { 
      name: "Flutter",
      icon: <SiFlutter className="w-16 h-16 text-[#02569B]" />,
      category: "Cross-Platform"
    },
    { 
      name: "Firebase",
      icon: <SiFirebase className="w-16 h-16 text-[#FFCA28]" />,
      category: "Backend"
    },
    { 
      name: "AWS",
      icon: <SiAmazon className="w-16 h-16 text-[#FF9900]" />,
      category: "Cloud"
    },
    { 
      name: "Google Cloud",
      icon: <SiGooglecloud className="w-16 h-16 text-[#4285F4]" />,
      category: "Cloud"
    },
    { 
      name: "Xcode",
      icon: <SiXcode className="w-16 h-16 text-[#007ACC]" />,
      category: "IDE"
    },
    { 
      name: "Android Studio",
      icon: <SiAndroidstudio className="w-16 h-16 text-[#3DDC84]" />,
      category: "IDE"
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
      name: "Docker",
      icon: <SiDocker className="w-16 h-16 text-[#2496ED]" />,
      category: "DevOps"
    }
  ];

  const processSteps = [
    {
      title: "Strategy & Planning",
      description: "We conduct comprehensive market research, define target audience, analyze competitors, and create a detailed app strategy that aligns with your business goals.",
      number: "01",
      icon: <Lightbulb className="w-8 h-8 text-white" />,
      timeline: "1-2 weeks",
      deliverables: ["Market research report", "User personas", "Competitive analysis", "App strategy document"]
    },
    {
      title: "UX/UI Design",
      description: "Our design team creates intuitive user interfaces and engaging user experiences with wireframes, prototypes, and high-fidelity designs.",
      number: "02",
      icon: <Search className="w-8 h-8 text-white" />,
      timeline: "2-3 weeks",
      deliverables: ["Wireframes", "UI/UX designs", "Interactive prototypes", "Design system"]
    },
    {
      title: "Development & Implementation",
      description: "We develop your app using agile methodologies with regular sprint reviews, ensuring clean, efficient, and scalable code architecture.",
      number: "03",
      icon: <Code2 className="w-8 h-8 text-white" />,
      timeline: "6-16 weeks",
      deliverables: ["App development", "Backend APIs", "Database setup", "Third-party integrations"]
    },
    {
      title: "Testing & Quality Assurance",
      description: "Comprehensive testing across multiple devices and platforms including functional testing, performance testing, and security audits.",
      number: "04",
      icon: <Shield className="w-8 h-8 text-white" />,
      timeline: "2-3 weeks",
      deliverables: ["Test reports", "Bug fixes", "Performance optimization", "Security testing"]
    },
    {
      title: "App Store Submission",
      description: "We handle the complete app store submission process including metadata optimization, screenshots, and compliance with platform guidelines.",
      number: "05",
      icon: <Rocket className="w-8 h-8 text-white" />,
      timeline: "1-2 weeks",
      deliverables: ["App store submission", "Metadata optimization", "App store assets", "Launch strategy"]
    },
    {
      title: "Launch & Support",
      description: "Post-launch support including monitoring, analytics setup, user feedback analysis, and ongoing maintenance with regular updates.",
      number: "06",
      icon: <Settings className="w-8 h-8 text-white" />,
      timeline: "Ongoing",
      deliverables: ["Launch monitoring", "Analytics setup", "User support", "Regular updates"]
    }
  ];

  const appTypes = [
    {
      title: "E-commerce Apps",
      description: "Mobile shopping experiences with secure payments, inventory management, and customer engagement features.",
      icon: <Download className="w-6 h-6" />,
      features: ["Product catalogs", "Secure payments", "Order tracking", "Push notifications"]
    },
    {
      title: "Social Media Apps",
      description: "Social networking platforms with real-time messaging, media sharing, and community features.",
      icon: <Share2 className="w-6 h-6" />,
      features: ["Real-time chat", "Media sharing", "Social feeds", "User profiles"]
    },
    {
      title: "Healthcare Apps",
      description: "HIPAA-compliant healthcare solutions for patient management, telemedicine, and health monitoring.",
      icon: <Bell className="w-6 h-6" />,
      features: ["Patient records", "Appointment scheduling", "Telemedicine", "Health tracking"]
    },
    {
      title: "FinTech Apps",
      description: "Financial applications with advanced security, transaction processing, and regulatory compliance.",
      icon: <Lock className="w-6 h-6" />,
      features: ["Secure transactions", "Account management", "Investment tracking", "Compliance features"]
    }
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "CEO, RetailTech Solutions",
      content: "Our e-commerce app developed by this team has been a game-changer. We've seen a 200% increase in mobile sales within the first three months of launch.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Maria Garcia",
      role: "CTO, HealthCare Plus",
      content: "The healthcare app they built for us is not only HIPAA compliant but also incredibly user-friendly. Our patients love the seamless experience.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "David Kim",
      role: "Founder, SocialConnect",
      content: "The team delivered a robust social media platform that handles thousands of concurrent users flawlessly. Their expertise in real-time features is outstanding.",
      rating: 5,
      image: "/api/placeholder/60/60"
    }
  ];

  const pricingTiers = mobilePlans.map(plan => ({
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
    { number: "150+", label: "Apps Developed", icon: <Smartphone className="w-6 h-6" /> },
    { number: "95%", label: "App Store Approval Rate", icon: <Award className="w-6 h-6" /> },
    { number: "1M+", label: "Total Downloads", icon: <Download className="w-6 h-6" /> },
    { number: "24/7", label: "Support Available", icon: <Zap className="w-6 h-6" /> }
  ];

  const faqs = [
    {
      question: "How long does it take to develop a mobile app?",
      answer: "Development time varies based on complexity, but typically ranges from 3-6 months for standard apps. We provide detailed timelines during the planning phase based on your specific requirements."
    },
    {
      question: "Should I choose native or cross-platform development?",
      answer: "It depends on your needs. Native apps offer better performance and platform-specific features, while cross-platform apps are more cost-effective and faster to market. We'll help you choose the best approach."
    },
    {
      question: "Do you help with app store submission?",
      answer: "Yes, we handle the complete app store submission process including metadata optimization, screenshots, and ensuring compliance with Apple App Store and Google Play Store guidelines."
    },
    {
      question: "What happens after the app is launched?",
      answer: "We provide ongoing support including bug fixes, performance monitoring, user feedback analysis, and regular updates to keep your app current with the latest OS versions."
    },
    {
      question: "Can you integrate with existing systems?",
      answer: "Absolutely! We have extensive experience integrating mobile apps with existing web applications, databases, APIs, and third-party services."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-[#0A0A1B] dark:via-[#1A1A35] dark:to-[#0A0A1B] from-gray-50 via-white to-gray-100">
      {/* Hero Section with Enhanced Styling */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 dark:from-purple-600/20 dark:via-pink-600/20 dark:to-blue-600/20"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl"></div>
        
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
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm font-medium mb-6"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Professional Mobile App Development
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Build Amazing
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Mobile Apps
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Transform your ideas into powerful mobile applications. We create native and cross-platform apps 
              that engage users and drive business growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                Start Your App Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                View App Portfolio
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
                  <div className="flex justify-center mb-2 text-purple-600 dark:text-purple-400">
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
              Comprehensive Mobile App Development Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From concept to app store, we deliver mobile solutions that exceed expectations
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
                className="group bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-6 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
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

      {/* App Types Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Types of Apps We Build
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Specialized expertise across various industries and app categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {appTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {type.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {type.description}
                </p>
                <ul className="space-y-1">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                      {feature}
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
              Cutting-Edge Mobile Technologies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We use the latest frameworks and tools to build high-performance mobile applications
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
                className="group flex flex-col items-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
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
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our App Development Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A proven methodology that ensures successful app launches and user satisfaction
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
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {step.number}
                </div>
                <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                        </h3>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">
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
                  <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Pricing Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Transparent App Development Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the perfect package for your mobile app project
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
                    ? 'border-purple-500 shadow-2xl scale-105' 
                    : 'border-white/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
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
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      <strong>Delivery:</strong> {tier.deliveryTime}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      <strong>Support:</strong> {tier.support}
                    </p>
                    <p className="text-sm text-pink-600 dark:text-pink-400">
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
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
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
              Success Stories from Our Clients
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real results from real mobile app projects
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
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
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
              Everything you need to know about mobile app development
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
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Mobile App?
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let's transform your app idea into a reality. Our expert team is ready to create 
            a mobile application that engages users and drives business success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/contact'}
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Start Your App Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              Schedule Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppDevelopment; 