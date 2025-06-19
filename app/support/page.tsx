'use client'
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  HelpCircle,
  MessageCircle,
  Book,
  Mail,
  Phone,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Users,
  FileText,
  Video,
  Download,
  ExternalLink,
  Headphones,
  LifeBuoy,
  MessageSquare,
  Bookmark,
  ArrowRight,
  Star,
  ThumbsUp,
  Heart
} from 'lucide-react';

const Support = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const supportChannels = [
    {
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      icon: <MessageCircle className="w-8 h-8" />,
      availability: "24/7 Available",
      responseTime: "< 2 minutes",
      color: "emerald",
      action: "Start Chat",
      popular: true
    },
    {
      title: "Help Documentation",
      description: "Browse our comprehensive knowledge base",
      icon: <Book className="w-8 h-8" />,
      availability: "Always Available",
      responseTime: "Instant",
      color: "teal",
      action: "Browse Docs"
    },
    {
      title: "Email Support",
      description: "Send detailed questions to our support team",
      icon: <Mail className="w-8 h-8" />,
      availability: "Mon-Fri 9AM-6PM",
      responseTime: "< 4 hours",
      color: "green",
      action: "Send Email"
    },
    {
      title: "Video Call Support",
      description: "Schedule a screen-sharing session with experts",
      icon: <Video className="w-8 h-8" />,
      availability: "By Appointment",
      responseTime: "Same Day",
      color: "cyan",
      action: "Schedule Call"
    }
  ];

  const quickHelp = [
    {
      title: "Getting Started Guide",
      description: "Complete setup and onboarding walkthrough",
      icon: <Zap className="w-6 h-6" />,
      type: "guide",
      readTime: "5 min read"
    },
    {
      title: "Account & Billing",
      description: "Manage your account settings and billing",
      icon: <Shield className="w-6 h-6" />,
      type: "guide",
      readTime: "3 min read"
    },
    {
      title: "API Documentation",
      description: "Developer resources and API references",
      icon: <FileText className="w-6 h-6" />,
      type: "docs",
      readTime: "10 min read"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides and tutorials",
      icon: <Video className="w-6 h-6" />,
      type: "video",
      readTime: "Watch"
    },
    {
      title: "Troubleshooting",
      description: "Common issues and their solutions",
      icon: <AlertCircle className="w-6 h-6" />,
      type: "guide",
      readTime: "2 min read"
    },
    {
      title: "Best Practices",
      description: "Tips and tricks for optimal usage",
      icon: <Star className="w-6 h-6" />,
      type: "guide",
      readTime: "7 min read"
    }
  ];

  const faqs = [
    {
      question: "How do I get started with Tech Morphers services?",
      answer: "Getting started is simple! First, contact us through our website or call us directly. We'll schedule a free consultation to understand your needs, provide a detailed proposal, and guide you through our streamlined onboarding process.",
      category: "Getting Started",
      helpful: 24
    },
    {
      question: "What services do you offer and how do you customize them?",
      answer: "We offer comprehensive digital solutions including web development, mobile app development, UI/UX design, and game development. Each service is fully customized based on your specific requirements, industry, target audience, and business goals.",
      category: "Services",
      helpful: 18
    },
    {
      question: "How long does a typical project take from start to finish?",
      answer: "Project timelines vary based on complexity and scope. Simple websites typically take 2-4 weeks, mobile apps 6-12 weeks, and complex enterprise solutions 12-24 weeks. We provide detailed timelines with milestones during our initial consultation.",
      category: "Timeline",
      helpful: 32
    },
    {
      question: "What is your pricing model and payment structure?",
      answer: "We offer flexible pricing including fixed-price projects and time-and-materials arrangements. Our packages start from ₹29,999 for basic projects up to custom enterprise solutions. We typically work with 30% upfront, 40% at milestone, and 30% on completion.",
      category: "Pricing",
      helpful: 15
    },
    {
      question: "Do you provide ongoing support and maintenance after project completion?",
      answer: "Yes! We offer comprehensive support packages including bug fixes, security updates, performance optimization, and feature enhancements. Our support plans range from basic maintenance to full-service ongoing development partnerships.",
      category: "Support",
      helpful: 28
    },
    {
      question: "Can you work with our existing team and integrate with our current systems?",
      answer: "Absolutely! We excel at collaborating with existing teams and integrating with current systems. We can work as an extension of your team, provide consulting services, or handle specific components while ensuring seamless integration.",
      category: "Integration",
      helpful: 21
    },
    {
      question: "What technologies do you work with and do you stay updated with latest trends?",
      answer: "We work with cutting-edge technologies including React, Next.js, Node.js, Python, Flutter, Swift, Unity, and more. Our team continuously updates their skills and we regularly evaluate new technologies to ensure we're using the best tools for each project.",
      category: "Technology",
      helpful: 19
    },
    {
      question: "How do you ensure project quality and handle revisions?",
      answer: "We follow rigorous quality assurance processes including code reviews, automated testing, and user acceptance testing. Each package includes specified revision rounds, and we work iteratively to ensure the final product exceeds your expectations.",
      category: "Quality",
      helpful: 26
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const supportStats = [
    { number: "< 2min", label: "Avg Response Time", icon: <Clock className="w-6 h-6" />, color: "text-emerald-600" },
    { number: "99.9%", label: "Uptime Guarantee", icon: <Shield className="w-6 h-6" />, color: "text-green-600" },
    { number: "24/7", label: "Support Available", icon: <Headphones className="w-6 h-6" />, color: "text-teal-600" },
    { number: "500+", label: "Happy Clients", icon: <Heart className="w-6 h-6" />, color: "text-cyan-600" }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-[#0A1B0F] dark:via-[#0F2A1A] dark:to-[#0A1B0F]">
      {/* Hero Section - Support Focused */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 via-teal-100/50 to-green-100/50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-green-900/20"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-300/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-teal-300/30 rounded-full blur-2xl"></div>
        
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
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium mb-8 shadow-lg"
            >
              <LifeBuoy className="w-4 h-4 mr-2" />
              We're Here to Help You Succeed
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Support Center
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                & Help Desk
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Get the help you need, when you need it. Our comprehensive support system 
              ensures you're never stuck and always moving forward.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for help articles, guides, or common questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-emerald-200 dark:border-emerald-800 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </motion.div>

            {/* Support Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {supportStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/50"
                >
                  <div className={`flex justify-center mb-3 ${stat.color}`}>
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

      {/* Support Channels */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Support Channel
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Multiple ways to get help, each optimized for different types of questions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative text-center rounded-3xl p-8 border transition-all duration-300 hover:shadow-2xl ${
                  channel.popular 
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-xl' 
                    : 'bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {channel.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110 ${
                  channel.popular 
                    ? 'bg-white/20 text-white' 
                    : `bg-${channel.color}-100 dark:bg-${channel.color}-900/30 text-${channel.color}-600`
                }`}>
                  {channel.icon}
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${
                  channel.popular ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {channel.title}
                </h3>
                
                <p className={`mb-6 text-sm ${
                  channel.popular ? 'text-emerald-100' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {channel.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className={`flex items-center justify-center text-sm ${
                    channel.popular ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    <Clock className="w-4 h-4 mr-2" />
                    {channel.availability}
                  </div>
                  <div className={`flex items-center justify-center text-sm font-semibold ${
                    channel.popular ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    <Zap className="w-4 h-4 mr-2" />
                    Response: {channel.responseTime}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    channel.popular
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : `bg-${channel.color}-100 dark:bg-${channel.color}-900/30 text-${channel.color}-700 dark:text-${channel.color}-300 hover:bg-${channel.color}-200 dark:hover:bg-${channel.color}-900/50`
                  }`}
                >
                  {channel.action}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Help Resources */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Help Resources
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find answers instantly with our curated help resources
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickHelp.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-800 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {resource.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    resource.type === 'guide' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    resource.type === 'docs' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {resource.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {resource.readTime}
                  </span>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced FAQ Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find answers to the most common questions about our services
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSearchQuery("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchQuery === "" 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSearchQuery(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  searchQuery === category 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-3xl border border-emerald-200 dark:border-emerald-800 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-start focus:outline-none hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mr-3">
                        {faq.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {faq.helpful} helpful
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {expandedFaq === index ? (
                      <ChevronDown className="w-6 h-6 text-emerald-600 transform transition-transform" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-400 transform transition-transform" />
                    )}
                  </div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedFaq === index ? "auto" : 0,
                    opacity: expandedFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6">
                    <div className="border-l-4 border-emerald-500 pl-6 py-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-r-lg">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Was this helpful?
                        </span>
                        <div className="flex space-x-2">
                          <button className="flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Yes
                          </button>
                          <button className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search terms or browse all categories
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Still Need Help Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-12 text-white"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              Still Need Help?
            </h2>
            
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Our support team is standing by to help you succeed. Get personalized assistance 
              from our experts who know your project inside and out.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Live Chat
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300 flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </motion.button>
            </div>
            
            <div className="flex items-center justify-center mt-8 text-emerald-100">
              <Clock className="w-5 h-5 mr-2" />
              Average response time: Under 2 minutes
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Support; 