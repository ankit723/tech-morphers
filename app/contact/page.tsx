'use client'
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  ArrowRight,
  Users,
  Calendar,
  Zap,
  Shield,
  Globe,
  Headphones,
  Star,
  CheckCircle,
  Video,
  Coffee,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Target,
  Rocket,
  Award,
  TrendingUp,
  Building,
  Briefcase
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/contact-page", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        console.log("ContactPage form submitted");
        setShowSuccessMessage(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          projectType: "",
          budget: "",
          timeline: "",
          message: "",
        });
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      title: "Start a Project",
      description: "Ready to build something amazing? Let's discuss your vision",
      icon: <Rocket className="w-8 h-8" />,
      contact: "New Project Inquiry",
      action: "#contact-form",
      color: "orange",
      highlight: true
    },
    {
      title: "Quick Call",
      description: "Schedule a 15-minute discovery call with our team",
      icon: <Phone className="w-8 h-8" />,
      contact: "+91 9795786303",
      action: "tel:+919795786303",
      color: "green"
    },
    {
      title: "Email Direct",
      description: "Send us your requirements and get a response today",
      icon: <Mail className="w-8 h-8" />,
      contact: "hello@techmorphers.com",
      action: "mailto:hello@techmorphers.com",
      color: "blue"
    },
    {
      title: "Visit Office",
      description: "Meet our team in person for detailed discussions",
      icon: <Building className="w-8 h-8" />,
      contact: "Varanasi, India",
      action: "#",
      color: "purple"
    }
  ];

  const businessStats = [
    { number: "2hrs", label: "Response Time", icon: <Zap className="w-6 h-6" />, color: "text-orange-500" },
    { number: "500+", label: "Projects Delivered", icon: <Target className="w-6 h-6" />, color: "text-orange-600" },
    { number: "98%", label: "Success Rate", icon: <Award className="w-6 h-6" />, color: "text-orange-700" },
    { number: "24/7", label: "Available", icon: <Globe className="w-6 h-6" />, color: "text-orange-800" }
  ];

  const reasons = [
    {
      title: "Proven Track Record",
      description: "500+ successful projects across various industries",
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />
    },
    {
      title: "Expert Team",
      description: "Skilled professionals with 5+ years of experience",
      icon: <Users className="w-8 h-8 text-orange-600" />
    },
    {
      title: "Fast Delivery",
      description: "Quick turnaround without compromising quality",
      icon: <Zap className="w-8 h-8 text-orange-600" />
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock support for all your needs",
      icon: <Headphones className="w-8 h-8 text-orange-600" />
    }
  ];

  const projectTypes = [
    "Web Development",
    "Mobile App Development", 
    "UI/UX Design",
    "E-commerce Solution",
    "Custom Software",
    "Digital Marketing",
    "Other"
  ];

  const budgetRanges = [
    "Under ₹50,000",
    "₹50,000 - ₹1,00,000", 
    "₹1,00,000 - ₹2,50,000",
    "₹2,50,000 - ₹5,00,000",
    "Above ₹5,00,000",
    "Let's Discuss"
  ];

  const timelines = [
    "ASAP (Rush Job)",
    "Within 1 month",
    "1-3 months", 
    "3-6 months",
    "6+ months",
    "Flexible"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-[#1A0F0A] dark:via-[#2A1A0F] dark:to-[#1A0F0A]">
      {/* Success Message Modal */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-orange-200 dark:border-orange-800 max-w-md mx-4 shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Project Inquiry Sent!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Thanks for reaching out! We'll get back to you within 2 hours.
                </p>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">What's Next?</h4>
                  <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    <li>• Project analysis & feasibility study</li>
                    <li>• Schedule strategy call</li>
                    <li>• Custom proposal & timeline</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Business Focus */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-amber-100/50 to-yellow-100/50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-300/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-300/30 rounded-full blur-2xl"></div>
        
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
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-medium mb-8 shadow-lg"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Transform Your Business Ideas Into Reality
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Let's Build Your
              <span className="block bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Next Big Project
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              From concept to launch, we're your technology partner. Get expert consultation, 
              transparent pricing, and delivery that exceeds expectations.
            </p>

            {/* Business Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              {businessStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50"
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                Start Your Project
                <Rocket className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = 'tel:+919795786303'}
                className="border-2 border-orange-600 text-orange-600 dark:text-orange-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Quick Call
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We don't just build projects, we build lasting business relationships
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center bg-white dark:bg-gray-800 rounded-3xl p-8 border border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6 p-4 bg-orange-100 dark:bg-orange-900/30 rounded-2xl w-fit mx-auto">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {reason.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Methods - Business Focused */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose how you'd like to begin your project journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`group text-center rounded-3xl p-8 border transition-all duration-300 hover:shadow-xl ${
                  method.highlight 
                    ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white border-orange-500' 
                    : 'bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-800'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  method.highlight 
                    ? 'bg-white/20 text-white' 
                    : `bg-${method.color}-100 dark:bg-${method.color}-900/30 text-${method.color}-600`
                }`}>
                  {method.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${
                  method.highlight ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {method.title}
                </h3>
                <p className={`mb-4 text-sm ${
                  method.highlight ? 'text-orange-100' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {method.description}
                </p>
                <p className={`font-semibold mb-4 ${
                  method.highlight ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {method.contact}
                </p>
                <motion.a
                  href={method.action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    method.highlight
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : `bg-${method.color}-100 dark:bg-${method.color}-900/30 text-${method.color}-700 dark:text-${method.color}-300 hover:bg-${method.color}-200 dark:hover:bg-${method.color}-900/50`
                  }`}
                >
                  {method.highlight ? 'Get Started' : 'Contact'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Contact Form - Redesigned */}
      <div id="contact-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-orange-200 dark:border-orange-800 shadow-xl">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Start Your Project Today
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Share your project details and we'll provide a custom proposal within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Full Name *
                      </Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        placeholder="John Doe"
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-orange-50 dark:bg-gray-700 border border-orange-200 dark:border-orange-700 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Business Email *
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        placeholder="john@company.com"
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-orange-50 dark:bg-gray-700 border border-orange-200 dark:border-orange-700 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Phone Number
                      </Label>
                      <Input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        placeholder="+91 9876543210"
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-orange-50 dark:bg-gray-700 border border-orange-200 dark:border-orange-700 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Company Name
                      </Label>
                      <Input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        placeholder="Your Company"
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-orange-50 dark:bg-gray-700 border border-orange-200 dark:border-orange-700 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="projectType" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Project Type
                      </Label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-orange-50 dark:bg-gray-700 border border-orange-200 dark:border-orange-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500"
                      >
                        <option value="">Select Type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="budget" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Budget Range
                      </Label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-orange-50 dark:bg-gray-700 border border-orange-200 dark:border-orange-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500"
                      >
                        <option value="">Select Budget</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="timeline" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Timeline
                      </Label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-orange-50 dark:bg-gray-700 border border-orange-200 dark:border-orange-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500"
                      >
                        <option value="">Select Timeline</option>
                        {timelines.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Project Details *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      placeholder="Describe your project goals, target audience, key features, and any specific requirements..."
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-orange-50 dark:bg-gray-700 border border-orange-200 dark:border-orange-700 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </div>
                      ) : (
                        <>
                          Send Project Details
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Business Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">
                  Need Immediate Help?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Call Now</p>
                      <p className="text-orange-100">+91 9795786303</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Email Direct</p>
                      <p className="text-orange-100">hello@techmorphers.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Response Time</p>
                      <p className="text-orange-100">Within 2 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-orange-200 dark:border-orange-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Business Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Monday - Friday</span>
                    <span className="font-semibold text-gray-900 dark:text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Saturday</span>
                    <span className="font-semibold text-gray-900 dark:text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Sunday</span>
                    <span className="font-semibold text-gray-900 dark:text-white">Closed</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-orange-200 dark:border-orange-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  {[
                    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, color: "text-blue-600" },
                    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, color: "text-sky-500" },
                    { name: "GitHub", icon: <Github className="w-5 h-5" />, color: "text-gray-700 dark:text-gray-300" },
                    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, color: "text-pink-600" }
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href="#"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${social.color} hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join 500+ businesses that trust us with their digital transformation. 
            Let's discuss how we can help you achieve your goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('name')?.focus()}
              className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              Start Project Above
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'tel:+919795786303'}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300 flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;