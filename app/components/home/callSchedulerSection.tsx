'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Users, 
  Target,
  Lightbulb,
  Star,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallSchedulerSection = () => {
  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      text: "100% Free Consultation"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: "30-Minute Expert Session"
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Senior Tech Consultants"
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: "Custom Project Roadmap"
    }
  ];

  const benefits = [
    {
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
      title: "Strategic Insights",
      description: "Get expert technical recommendations tailored to your project"
    },
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Clear Roadmap",
      description: "Receive a detailed timeline and milestone planning"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-green-500" />,
      title: "Free Proposal",
      description: "Get a custom proposal within 24 hours after the call"
    }
  ];

  const testimonialQuotes = [
    {
      text: "Working with tech morphers has been an incredible experience. They truly listened to our needs and delivered a stunning design that exceeded our expectations.",
      author: "Mrinmai Sharma, CTO of Arbre Creations"
    },
    {
      text: "Working with Tech Morphers was like having an internal tech team — minus the overhead. They delivered our MVP in 4 weeks, pixel-perfect and exactly how we envisioned it.",
      author: "Ankit Singh, CEO of Bharat Care"
    },
    {
      text: "Every agency talks about communication — Tech Morphers actually delivers on it. Daily updates, clean handoffs, and a dashboard that made me feel in control at every step.",
      author: "Laksmikant Sahoo, Govt. of Odisha"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium mb-8">
            <Calendar className="w-5 h-5 mr-2" />
            Free Strategy Consultation Available
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Ready to Turn Your Ideas into
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Reality?
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Book a free 30-minute strategy session with our senior technical consultants. 
            Get expert insights, project roadmap, and a custom proposal.
          </p>

          {/* Trust Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 shadow-sm"
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                What You&apos;ll Get in Your Free Call:
              </h3>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800 dark:text-green-300">
                    No Commitment Required
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400">
                  This is a genuine consultation to help you succeed, whether you work with us or not.
                </p>
              </div>
            </div>

            {/* Quick Testimonials */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                What Our Clients Say:
              </h4>
              {testimonialQuotes.map((quote, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
                    &quot;{quote.text}&quot;
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    — {quote.author}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Call to Action */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 border border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4">
                    Schedule Your Free Call Now
                  </h3>
                  
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Join 500+ successful projects. Get expert guidance and turn your ideas into reality.
                  </p>
                </div>

                {/* Process Steps */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span className="text-blue-100">Choose your preferred time slot</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span className="text-blue-100">Join our 30-minute video call</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span className="text-blue-100">Receive your custom proposal</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-xs text-blue-200">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-xs text-blue-200">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">24h</div>
                    <div className="text-xs text-blue-200">Response</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={() => window.location.href = '/schedule-call'}
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule My Free Call
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/services'}
                    variant="outline"
                    className="w-full border-2 border-white/30 text-white hover:bg-white/10 py-4 rounded-xl transition-all duration-300"
                  >
                    View Our Services First
                  </Button>
                </div>

                <p className="text-xs text-blue-200 text-center mt-4">
                  No spam, no commitment. Just valuable insights for your project.
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-2xl">🎯</span>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-xl">💡</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">30</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
              <div className="text-xs text-gray-500">Free Consultation</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">24h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response</div>
              <div className="text-xs text-gray-500">Custom Proposal</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">5+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
              <div className="text-xs text-gray-500">Expert Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">0%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Commitment</div>
              <div className="text-xs text-gray-500">No Obligations</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallSchedulerSection; 