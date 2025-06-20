'use client'
import { useState } from 'react';
import Link from 'next/link';
import { 
  Code, 
  Palette, 
  Smartphone, 
  Gamepad2, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Award, 
  Zap,
  Globe,
  TrendingUp,
  Shield,
  Clock,
  Search,
  PenTool,
  Rocket,
  Settings,
  BarChart3,
  Headphones,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../components/home/navbar';
import Footer from '../components/home/footer';

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const services = [
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Custom web applications and websites built with modern technologies for optimal performance and user experience.',
      icon: <Code className="w-12 h-12 text-blue-600" />,
      category: 'development',
      color: 'blue',
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      features: [
        'Responsive Web Design',
        'Full-Stack Development',
        'E-commerce Solutions',
        'Progressive Web Apps',
        'API Development',
        'Database Integration'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
      pricing: 'Starting from ₹29,999',
      deliveryTime: '1-4 weeks',
      projects: '200+',
      href: '/services/web'
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX Design',
      description: 'User-centered design solutions that create intuitive, engaging, and conversion-focused digital experiences.',
      icon: <Palette className="w-12 h-12 text-pink-600" />,
      category: 'design',
      color: 'pink',
      gradient: 'from-pink-600 to-purple-600',
      bgGradient: 'from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20',
      features: [
        'User Research & Analysis',
        'Wireframing & Prototyping',
        'Visual Design',
        'Design Systems',
        'Usability Testing',
        'Brand Identity'
      ],
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision'],
      pricing: 'Starting from ₹15,000',
      deliveryTime: '1-3 weeks',
      projects: '300+',
      href: '/services/design'
    },
    {
      id: 'mobile-development',
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications that deliver exceptional user experiences across all devices.',
      icon: <Smartphone className="w-12 h-12 text-purple-600" />,
      category: 'development',
      color: 'purple',
      gradient: 'from-purple-600 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      features: [
        'iOS & Android Apps',
        'Cross-Platform Development',
        'App Store Optimization',
        'Push Notifications',
        'Offline Functionality',
        'App Analytics'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'App Store Connect'],
      pricing: 'Starting from ₹79,999',
      deliveryTime: '2-6 weeks',
      projects: '150+',
      href: '/services/mobile'
    },
    {
      id: 'game-development',
      title: 'Game Development',
      description: 'Engaging and immersive games for multiple platforms with stunning graphics and smooth gameplay.',
      icon: <Gamepad2 className="w-12 h-12 text-green-600" />,
      category: 'development',
      color: 'green',
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      features: [
        '2D & 3D Game Development',
        'Multiplayer Games',
        'Game Art & Animation',
        'Cross-Platform Games',
        'Game Testing & QA',
        'App Store Publishing'
      ],
      technologies: ['Unity', 'Unreal Engine', 'Blender', 'C#', 'JavaScript', 'Photon'],
      pricing: 'Starting from ₹50,000',
      deliveryTime: '4-12 weeks',
      projects: '50+',
      href: '/services/game-development'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', icon: <Globe className="w-5 h-5" /> },
    { id: 'development', name: 'Development', icon: <Code className="w-5 h-5" /> },
    { id: 'design', name: 'Design', icon: <Palette className="w-5 h-5" /> }
  ];

  const stats = [
    { number: '500+', label: 'Projects Completed', icon: <Award className="w-6 h-6" /> },
    { number: '98%', label: 'Client Satisfaction', icon: <Star className="w-6 h-6" /> },
    { number: '200+', label: 'Happy Clients', icon: <Users className="w-6 h-6" /> },
    { number: '24/7', label: 'Support Available', icon: <Headphones className="w-6 h-6" /> }
  ];

  const whyChooseUs = [
    {
      title: 'Expert Team',
      description: 'Skilled professionals with years of experience in cutting-edge technologies',
      icon: <Users className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Quality Assurance',
      description: 'Rigorous testing and quality control to ensure flawless delivery',
      icon: <Shield className="w-8 h-8 text-green-600" />
    },
    {
      title: 'On-Time Delivery',
      description: 'Committed to meeting deadlines without compromising on quality',
      icon: <Clock className="w-8 h-8 text-orange-600" />
    },
    {
      title: 'Ongoing Support',
      description: '24/7 support and maintenance to keep your projects running smoothly',
      icon: <Headphones className="w-8 h-8 text-purple-600" />
    },
    {
      title: 'Scalable Solutions',
      description: 'Future-proof solutions that grow with your business needs',
      icon: <TrendingUp className="w-8 h-8 text-indigo-600" />
    },
    {
      title: 'Competitive Pricing',
      description: 'Transparent, competitive pricing with no hidden costs',
      icon: <BarChart3 className="w-8 h-8 text-pink-600" />
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We understand your requirements, goals, and create a detailed project roadmap.',
      icon: <Search className="w-6 h-6" />
    },
    {
      step: '02',
      title: 'Design & Prototyping',
      description: 'Create wireframes, mockups, and interactive prototypes for your approval.',
      icon: <PenTool className="w-6 h-6" />
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'Build your solution with clean code, rigorous testing, and quality assurance.',
      icon: <Settings className="w-6 h-6" />
    },
    {
      step: '04',
      title: 'Launch & Support',
      description: 'Deploy your project and provide ongoing support and maintenance.',
      icon: <Rocket className="w-6 h-6" />
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content: 'Tech Morphers delivered an exceptional web application that exceeded our expectations. Their attention to detail and commitment to quality is outstanding.',
      rating: 5,
      service: 'Web Development'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager, InnovateCorp',
      content: 'The mobile app they developed for us has been a game-changer. User engagement increased by 200% since launch. Highly recommended!',
      rating: 5,
      service: 'Mobile Development'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Creative Director, DesignHub',
      content: 'Their UI/UX design work transformed our brand identity. The new design system has improved our workflow significantly.',
      rating: 5,
      service: 'UI/UX Design'
    }
  ];

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-[#0A0A1B] dark:via-[#1A1A35] dark:to-[#0A0A1B]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300/30 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium mb-8 shadow-lg animate-scale-in">
              <Zap className="w-4 h-4 mr-2" />
              Complete Digital Solutions for Your Business
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Our
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              From web development to mobile apps, UI/UX design to game development - 
              we provide comprehensive digital solutions to transform your ideas into reality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Services
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/contact'}
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                Get Free Consultation
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-shadow duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex justify-center mb-3 text-blue-600 dark:text-blue-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                className={`group relative bg-gradient-to-br ${service.bgGradient} rounded-3xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 bg-white/80 dark:bg-gray-800/80 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {service.projects} Projects
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {service.deliveryTime}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Key Features:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Technologies:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white/60 dark:bg-gray-800/60 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-full border border-white/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/20">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Starting from</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {service.pricing}
                      </div>
                    </div>
                    <Link href={service.href}>
                      <Button className={`bg-gradient-to-r ${service.gradient} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Tech Morphers?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We combine expertise, innovation, and dedication to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={item.title}
                className="text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl w-fit mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A streamlined approach that ensures quality delivery from concept to launch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div
                key={step.step}
                className="relative text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative">
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6 shadow-lg">
                    {step.step}
                  </div>
                  
                  {/* Connecting Line */}
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 transform translate-x-8"></div>
                  )}
                </div>

                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-4 text-blue-600 dark:text-blue-400">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real feedback from real clients who&apos;ve experienced our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {testimonial.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let&apos;s discuss your ideas and transform them into powerful digital solutions 
              that drive your business forward.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = '/contact'}
                className="bg-white text-blue-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/about-us'}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              >
                Learn About Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div className="relative mt-[70rem]">
      <Footer />
    </div>
    </>
  );
};

export default ServicesPage; 