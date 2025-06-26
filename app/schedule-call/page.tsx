'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Zap,
  Users,
  Award,
  Globe,
  MessageSquare,
  Target,
  Lightbulb,
  TrendingUp,
  HeadphonesIcon,
  Rocket,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ScheduleCallPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    projectBrief: ''
  });
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  // Generate available dates (next 30 days, excluding weekends)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  // Generate time slots (9 AM to 6 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const availableDates = generateAvailableDates();
  const timeSlots = generateTimeSlots();

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchBookedSlots = async (date: string) => {
    try {
      const response = await fetch(`/api/schedule-call?date=${date}`);
      const data = await response.json();
      
      if (data.success) {
        setBookedSlots(data.bookedSlots.map((slot: any) => slot.time));
      }
    } catch (err) {
      console.error('Error fetching booked slots:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/schedule-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          scheduledDate: new Date(selectedDate).toISOString(),
          scheduledTime: selectedTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Failed to schedule call');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const trustFeatures = [
    { icon: <Shield className="w-5 h-5" />, text: "100% Confidential & Secure" },
    { icon: <Zap className="w-5 h-5" />, text: "30-Min Expert Sessions" },
    { icon: <Users className="w-5 h-5" />, text: "Senior Tech Consultants" },
    { icon: <Award className="w-5 h-5" />, text: "500+ Successful Projects" }
  ];

  const whatYouGet = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Project Strategy Session",
      description: "Deep dive into your project requirements, goals, and technical challenges with our senior consultants."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
      title: "Technical Recommendations",
      description: "Get expert advice on technology stack, architecture, and best practices for your specific use case."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Roadmap & Timeline",
      description: "Receive a detailed project roadmap with realistic timelines and milestone planning."
    },
    {
      icon: <Rocket className="w-8 h-8 text-purple-600" />,
      title: "Custom Proposal",
      description: "Get a tailored proposal with pricing, deliverables, and next steps within 24 hours."
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Schedule Your Call",
      description: "Choose a convenient time slot and tell us about your project",
      icon: <Calendar className="w-6 h-6" />
    },
    {
      number: "02", 
      title: "Strategy Discussion",
      description: "30-minute consultation with our technical experts",
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      number: "03",
      title: "Receive Proposal",
      description: "Get detailed proposal with timeline and pricing within 24 hours",
      icon: <FileText className="w-6 h-6" />
    },
    {
      number: "04",
      title: "Project Kickoff",
      description: "Start building your dream project with our expert team",
      icon: <Rocket className="w-6 h-6" />
    }
  ];

  // Real testimonials from home page
  const testimonials = [
    {
      name: "Mrinmai Sharma",
      role: "CTO of Arbre Creations",
      content: "Working with tech morphers has been an incredible experience. They truly listened to our needs and delivered a stunning design that exceeded our expectations. We couldn't be happier with the product!",
      rating: 5,
      project: "Creative Platform",
      company: "Arbre Creations"
    },
    {
      name: "Aashay Kapoor",
      role: "CEO of Aashay Creations",
      content: "From start to finish, working with Redbird was an amazing experience. They were professional, creative, and went above and beyond. We're thrilled to be working with them again in the future!",
      rating: 5,
      project: "Creative Solutions",
      company: "Creova"
    },
    {
      name: "Anik Adhikari",
      role: "CEO of Iotron",
      content: "A pleasure to work with. They were provided valuable insights that we highly recommend them to any business looking for solutions.",
      rating: 5,
      project: "IoT Platform",
      company: "Iotron"
    },
    {
      name: "Jayesh Shinde",
      role: "CTO of Confetti Media",
      content: "Tech morphers didn't just build our website, rather built the perfect platform using cutting edge technology and providing us with a premium experience.",
      rating: 5,
      project: "Media Platform",
      company: "Confetti Media"
    },
    {
      name: "Ankit Singh",
      role: "CEO of Bharat Care",
      content: "Working with Tech Morphers was like having an internal tech team — minus the overhead. They delivered our MVP in 4 weeks, pixel-perfect and exactly how we envisioned it. The whole experience was smoother than I imagined.",
      rating: 5,
      project: "Healthcare MVP",
      company: "Bharat Care"
    },
    {
      name: "Laksmikant Sahoo",
      role: "Govt. of Odisha",
      content: "Every agency talks about communication — Tech Morphers actually delivers on it. Daily updates, clean handoffs, and a dashboard that made me feel in control at every step.",
      rating: 5,
      project: "Government Portal",
      company: "Odisha Police"
    }
  ];

  const faqs = [
    {
      question: "What happens during the consultation call?",
      answer: "We'll discuss your project requirements, technical challenges, timeline, and budget. Our experts will provide strategic recommendations and answer all your questions about the development process."
    },
    {
      question: "Is the consultation really free?",
      answer: "Yes, absolutely! We believe in providing value upfront. There's no cost for the initial consultation, and you're under no obligation to work with us afterward."
    },
    {
      question: "How long does the call take?",
      answer: "Most calls last 30 minutes, but we're flexible. If you need more time to discuss complex requirements, we're happy to extend the session."
    },
    {
      question: "What should I prepare for the call?",
      answer: "Come with your project ideas, any existing designs or requirements, timeline expectations, and budget range. The more details you can share, the better we can help you."
    },
    {
      question: "When will I receive the proposal?",
      answer: "We'll send you a detailed proposal within 24 hours of our call, including project scope, timeline, pricing, and next steps."
    }
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-2xl border border-green-200 dark:border-green-800"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🎉 Your Call is Scheduled!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Thank you for choosing Tech Morphers! We&apos;ve received your request and will send you a calendar invite with meeting details shortly.
          </p>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">Call Details:</h3>
            <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
              <p><strong>Date:</strong> {selectedDate && formatDate(selectedDate)}</p>
              <p><strong>Time:</strong> {selectedTime && formatTime(selectedTime)}</p>
              <p><strong>Duration:</strong> 30 minutes</p>
              <p><strong>Type:</strong> Video call (Google Meet link will be provided)</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>What&apos;s Next?</strong><br />
              • Check your email for calendar invite<br />
              • Prepare your project requirements<br />
              • Get ready to discuss your vision!
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1 rounded-full py-3"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => window.location.href = '/services'}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full py-3"
            >
              Explore Services
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        
        <div className="max-w-6xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium mb-8">
              <Calendar className="w-5 h-5 mr-2" />
              Free Strategy Consultation • No Commitment Required
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Let&apos;s Discuss Your
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Dream Project
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Book a free 30-minute strategy session with our senior technical consultants. 
              Get expert insights, technical recommendations, and a custom roadmap for your project.
            </p>

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto mb-12">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🚀 What Makes Our Consultation Special?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Senior developers with 5+ years experience
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Custom technical recommendations
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Detailed project roadmap & timeline
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  Free proposal within 24 hours
                </div>
              </div>
            </div>

            {/* Trust Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {trustFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20"
                >
                  <div className="text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* What You'll Get Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What You&apos;ll Get in Your Free Consultation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our expert consultants will provide you with actionable insights and a clear path forward
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatYouGet.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="mb-6 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple 4-step process to turn your ideas into reality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {step.number}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-x-8"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scheduling Form */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-blue-100 text-lg">
                Choose your preferred time and let&apos;s discuss your project
              </p>
            </div>

            <div className="p-8 sm:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Date Selection */}
                <div>
                  <Label className="text-lg font-semibold text-gray-900 dark:text-white mb-4 block">
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Select Date
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableDates.slice(0, 12).map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedDate === date
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-105'
                        }`}
                      >
                        <div className="font-semibold">
                          {new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs opacity-70">
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'short'
                          })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label className="text-lg font-semibold text-gray-900 dark:text-white mb-4 block">
                      <Clock className="w-5 h-5 inline mr-2" />
                      Select Time (30-minute sessions)
                    </Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          disabled={bookedSlots.includes(time)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            bookedSlots.includes(time)
                              ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                              : selectedTime === time
                              ? 'bg-green-600 text-white shadow-lg scale-105'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:scale-105'
                          }`}
                        >
                          {formatTime(time)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Contact Information */}
                {selectedDate && selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Tell Us About Yourself & Your Project
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2 mb-2 font-medium">
                          <User className="w-4 h-4" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete='name'
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="h-12"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 mb-2 font-medium">
                          <Mail className="w-4 h-4" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="h-12"
                          placeholder="john@company.com"
                          autoComplete='email'
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 mb-2 font-medium">
                          <Phone className="w-4 h-4" />
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete='tel'
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="h-12"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="companyName" className="flex items-center gap-2 mb-2 font-medium">
                          <Building2 className="w-4 h-4" />
                          Company Name (Optional)
                        </Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          type="text"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="h-12"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="projectBrief" className="flex items-center gap-2 mb-2 font-medium">
                        <FileText className="w-4 h-4" />
                        Project Brief *
                      </Label>
                      <Textarea
                        id="projectBrief"
                        name="projectBrief"
                        required
                        value={formData.projectBrief}
                        onChange={handleInputChange}
                        rows={5}
                        className="resize-none"
                        placeholder="Tell us about your project... What are you looking to build? What challenges are you facing? What's your timeline and budget range? The more details you provide, the better we can help you!"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Scheduling Your Call...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Schedule My Free Consultation
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      By scheduling this call, you agree to receive communication from Tech Morphers. 
                      We respect your privacy and will never spam you.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
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
              Real feedback from successful consultation calls
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                  &quot;{testimonial.content}&quot;
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
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      {testimonial.company}
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
              Everything you need to know about our consultation process
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    ?
                  </span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed ml-9">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Ideas into Reality?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join 500+ successful projects and let&apos;s build something amazing together. 
              Your dream project is just one consultation away.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Global Reach</h3>
                <p className="text-blue-100 text-sm">Serving clients worldwide</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Award Winning</h3>
                <p className="text-blue-100 text-sm">Recognized excellence</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">24/7 Support</h3>
                <p className="text-blue-100 text-sm">Always here to help</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-blue-600  hover:text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Your Free Call Now
              </Button>
              <Button
                onClick={() => window.location.href = '/services'}
                variant="outline"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Explore Our Services
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCallPage; 