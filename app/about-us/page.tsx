'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Users, 
  Target, 
  Award, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Globe, 
  Heart, 
  Lightbulb,
  Trophy,
  Code,
  Palette,
  Smartphone,
  Monitor,
  TrendingUp,
  Shield,
  Clock,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react';
import { useState } from 'react';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('story');

  const stats = [
    { number: "500+", label: "Projects Completed", icon: <Trophy className="w-6 h-6" /> },
    { number: "98%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" /> },
    { number: "200+", label: "Happy Clients", icon: <Users className="w-6 h-6" /> },
    { number: "5+", label: "Years Experience", icon: <Clock className="w-6 h-6" /> }
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We stay ahead of the curve by embracing cutting-edge technologies and methodologies to deliver solutions that set new industry standards.",
      icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
      details: ["Latest technology adoption", "Research & development", "Creative problem solving", "Future-ready solutions"]
    },
    {
      title: "Quality Excellence",
      description: "Every line of code, every design element, and every user interaction is crafted with meticulous attention to detail and highest quality standards.",
      icon: <Award className="w-8 h-8 text-blue-600" />,
      details: ["Rigorous testing processes", "Code review standards", "Performance optimization", "Quality assurance"]
    },
    {
      title: "Client Partnership",
      description: "We believe in building long-term partnerships with our clients, working collaboratively to understand their vision and exceed expectations.",
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      details: ["Transparent communication", "Regular updates", "Collaborative approach", "Long-term support"]
    },
    {
      title: "Agile Delivery",
      description: "Our agile development methodology ensures rapid delivery without compromising quality, keeping projects on time and within budget.",
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      details: ["Sprint-based development", "Continuous integration", "Regular feedback loops", "Flexible adaptation"]
    },
    {
      title: "Global Impact",
      description: "From local startups to international enterprises, we create digital solutions that make a meaningful impact across diverse markets and industries.",
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      details: ["International projects", "Cross-cultural expertise", "Scalable solutions", "Market understanding"]
    },
    {
      title: "Security Focus",
      description: "Security isn't an afterthought—it's built into every solution we create, ensuring your data and users are always protected.",
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      details: ["Security-first design", "Data protection", "Compliance standards", "Regular security audits"]
    }
  ];

  const team = [
    {
      name: "Ankit Biswas",
      role: "CEO & Founder",
      bio: "Visionary leader with 8+ years in tech industry. Passionate about transforming businesses through innovative digital solutions.",
      image: "/team/ankit.jpg",
      skills: ["Strategic Planning", "Business Development", "Team Leadership", "Innovation"],
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Priya Sharma",
      role: "Lead UI/UX Designer",
      bio: "Award-winning designer with expertise in creating user-centered designs that drive engagement and conversion.",
      image: "/team/priya.jpg",
      skills: ["UI/UX Design", "User Research", "Prototyping", "Design Systems"],
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Rahul Kumar",
      role: "Technical Architect",
      bio: "Full-stack expert specializing in scalable architectures and modern web technologies. 10+ years of development experience.",
      image: "/team/rahul.jpg",
      skills: ["System Architecture", "Full-Stack Development", "Cloud Solutions", "DevOps"],
      social: {
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Sneha Patel",
      role: "Project Manager",
      bio: "Agile project management expert ensuring smooth delivery and client satisfaction across all projects.",
      image: "/team/sneha.jpg",
      skills: ["Project Management", "Agile Methodology", "Client Relations", "Quality Assurance"],
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Arjun Singh",
      role: "Senior Developer",
      bio: "Passionate developer with expertise in modern frameworks and a keen eye for performance optimization.",
      image: "/team/arjun.jpg",
      skills: ["React/Next.js", "Node.js", "Database Design", "API Development"],
      social: {
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Kavya Reddy",
      role: "Mobile App Developer",
      bio: "Mobile development specialist creating intuitive apps for iOS and Android platforms.",
      image: "/team/kavya.jpg",
      skills: ["React Native", "Flutter", "iOS Development", "Android Development"],
      social: {
        linkedin: "#",
        github: "#"
      }
    }
  ];

  const timeline = [
    {
      year: "2019",
      title: "Company Founded",
      description: "Tech Morphers was born with a vision to transform businesses through innovative digital solutions.",
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      year: "2020",
      title: "First Major Client",
      description: "Successfully delivered our first enterprise-level project, establishing our reputation for quality.",
      icon: <Trophy className="w-6 h-6" />
    },
    {
      year: "2021",
      title: "Team Expansion",
      description: "Grew our team to 10+ talented professionals across design, development, and project management.",
      icon: <Users className="w-6 h-6" />
    },
    {
      year: "2022",
      title: "100+ Projects",
      description: "Reached the milestone of 100 completed projects with 98% client satisfaction rate.",
      icon: <Award className="w-6 h-6" />
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Extended our services internationally, serving clients across multiple continents.",
      icon: <Globe className="w-6 h-6" />
    },
    {
      year: "2024",
      title: "Innovation Lab",
      description: "Launched our innovation lab focusing on AI, blockchain, and emerging technologies.",
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const achievements = [
    {
      title: "Top Development Agency 2023",
      organization: "TechReview Awards",
      icon: <Trophy className="w-8 h-8 text-yellow-500" />
    },
    {
      title: "Best UI/UX Design Team",
      organization: "Design Excellence Awards",
      icon: <Palette className="w-8 h-8 text-purple-500" />
    },
    {
      title: "Client Choice Award",
      organization: "Business Excellence Forum",
      icon: <Heart className="w-8 h-8 text-red-500" />
    },
    {
      title: "Innovation in Technology",
      organization: "Tech Innovation Summit",
      icon: <Lightbulb className="w-8 h-8 text-blue-500" />
    }
  ];

  const services = [
    {
      title: "Web Development",
      description: "Modern, scalable web applications",
      icon: <Monitor className="w-6 h-6" />,
      projects: "200+"
    },
    {
      title: "Mobile Development",
      description: "Native and cross-platform apps",
      icon: <Smartphone className="w-6 h-6" />,
      projects: "150+"
    },
    {
      title: "UI/UX Design",
      description: "User-centered design solutions",
      icon: <Palette className="w-6 h-6" />,
      projects: "300+"
    },
    {
      title: "Digital Strategy",
      description: "Comprehensive digital transformation",
      icon: <TrendingUp className="w-6 h-6" />,
      projects: "100+"
    }
  ];

  const testimonials = [
    {
      name: "David Chen",
      role: "CTO, InnovateHub",
      content: "Tech Morphers transformed our outdated system into a modern, scalable platform. Their technical expertise and project management are exceptional.",
      rating: 5,
      company: "InnovateHub",
      image: "/testimonials/david.jpg"
    },
    {
      name: "Lisa Rodriguez",
      role: "Founder, StartupXYZ",
      content: "From concept to launch, Tech Morphers guided us through every step. Their team's dedication and expertise made our vision a reality.",
      rating: 5,
      company: "StartupXYZ",
      image: "/testimonials/lisa.jpg"
    },
    {
      name: "Michael Thompson",
      role: "Marketing Director, GrowthCo",
      content: "The mobile app they developed exceeded our expectations. User engagement increased by 300% within the first month of launch.",
      rating: 5,
      company: "GrowthCo",
      image: "/testimonials/michael.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-[#0A0A1B] dark:via-[#1A1A35] dark:to-[#0A0A1B] from-gray-50 via-white to-gray-100">
      {/* Enhanced Hero Section */}
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
              <Users className="w-4 h-4 mr-2" />
              About Tech Morphers
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Transforming Ideas Into
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Digital Reality
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              We are a passionate team of developers, designers, and innovators dedicated to creating 
              exceptional digital experiences that drive business growth and user satisfaction.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                Work With Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                Meet Our Team
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

      {/* Company Story Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From a small startup to a leading digital agency, our journey has been driven by passion, innovation, and client success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                Building the Future, One Project at a Time
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Founded in 2019 with a vision to bridge the gap between innovative technology and business needs, 
                Tech Morphers has grown from a small team of passionate developers to a comprehensive digital 
                solutions provider serving clients worldwide.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our journey began when our founder, Ankit Biswas, recognized the need for a development partner 
                that truly understands both technology and business objectives. Today, we're proud to have 
                delivered 500+ successful projects across various industries.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div key={service.title} className="bg-white/70 dark:bg-white/10 rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center mb-2">
                      <div className="text-blue-600 mr-2">{service.icon}</div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{service.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{service.description}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{service.projects} projects</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-4">Our Mission</h4>
                <p className="mb-6 leading-relaxed">
                  To empower businesses with innovative digital solutions that drive growth, 
                  enhance user experiences, and create lasting impact in the digital landscape.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm opacity-90">Projects Delivered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">98%</div>
                    <div className="text-sm opacity-90">Success Rate</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Values Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide every decision we make and every solution we create
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-6 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {value.description}
                </p>
                <ul className="space-y-2">
                  {value.details.map((detail, idx) => (
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

      {/* Timeline Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Key milestones that have shaped our growth and success
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  <div className="lg:w-1/2 lg:pr-8">
                    <div className={`bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                      <div className="text-3xl font-bold text-blue-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white z-10">
                    {item.icon}
                  </div>
                  
                  <div className="lg:w-1/2 lg:pl-8"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Team Section */}
      <div id="team" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The talented individuals who bring our vision to life and drive our success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 p-1">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Awards & Recognition
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Industry recognition for our commitment to excellence and innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="flex justify-center mb-4">
                  {achievement.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {achievement.organization}
                </p>
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
              Real feedback from real clients who've experienced our work
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
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
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
            Ready to Start Your Digital Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let's collaborate to transform your ideas into powerful digital solutions that drive growth and success. 
            Our team is ready to bring your vision to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/contact'}
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/services'}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Explore Our Services
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs; 