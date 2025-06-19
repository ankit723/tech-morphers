'use client'
import { motion } from "framer-motion";
import { 
  SiUnity,
  SiUnrealengine,
  SiGodotengine,
  SiBlender,
  SiAutodesk,
  SiAdobephotoshop,
  SiJavascript,
  SiPython,
  SiSteam,
  SiPlaystation,
  SiNintendoswitch,
  SiAndroid,
  SiApple
} from 'react-icons/si';
import {
  Gamepad2,
  Zap,
  Shield,
  Users,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Code2,
  Palette,
  Volume2,
  Cpu,
  Globe,
  Smartphone,
  Monitor,
  Trophy,
  Target,
  Rocket,
  Settings,
  Eye,
  Layers,
  Play,
  Download,
  TrendingUp,
  PaintBucket
} from 'lucide-react';
import { useState } from 'react';
import { plans } from '@/lib/plansData';

const GameDevelopment = () => {
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      title: "2D & 3D Game Development",
      description: "Creating immersive gaming experiences from simple 2D indie games to complex 3D AAA titles using industry-leading game engines and cutting-edge technology.",
      icon: <Gamepad2 className="w-8 h-8 text-green-600" />,
      details: ["Unity 3D development", "Unreal Engine expertise", "2D sprite-based games", "3D modeling and animation"]
    },
    {
      title: "Cross-Platform Game Development",
      description: "Develop once, deploy everywhere. We create games that run seamlessly across PC, console, mobile, and web platforms with optimal performance.",
      icon: <Monitor className="w-8 h-8 text-green-600" />,
      details: ["PC (Windows, Mac, Linux)", "Console (PlayStation, Xbox, Switch)", "Mobile (iOS, Android)", "Web browsers"]
    },
    {
      title: "Multiplayer & Networking",
      description: "Real-time multiplayer experiences with robust networking solutions, matchmaking systems, and cloud-based backend infrastructure.",
      icon: <Users className="w-8 h-8 text-green-600" />,
      details: ["Real-time multiplayer", "Turn-based multiplayer", "Matchmaking systems", "Cloud infrastructure"]
    },
    {
      title: "Game Art & Animation",
      description: "Stunning visual assets including character design, environment art, UI/UX design, and smooth animations that bring your game world to life.",
      icon: <Palette className="w-8 h-8 text-green-600" />,
      details: ["Character design", "Environment art", "UI/UX design", "Animation systems"]
    },
    {
      title: "Game Audio & Sound Design",
      description: "Immersive audio experiences with original music composition, sound effects, voice acting, and dynamic audio systems.",
      icon: <Volume2 className="w-8 h-8 text-green-600" />,
      details: ["Music composition", "Sound effects", "Voice acting", "Audio implementation"]
    },
    {
      title: "Game Optimization & Performance",
      description: "Ensuring your game runs smoothly across all target platforms with advanced optimization techniques and performance profiling.",
      icon: <Cpu className="w-8 h-8 text-green-600" />,
      details: ["Performance optimization", "Memory management", "Platform-specific optimization", "Load time reduction"]
    }
  ];

  const gameTypes = [
    {
      title: "Action Games",
      description: "Fast-paced games with combat, platforming, and real-time challenges.",
      icon: <Zap className="w-6 h-6" />,
      examples: ["First-person shooters", "Fighting games", "Platformers", "Beat 'em ups"]
    },
    {
      title: "Adventure Games",
      description: "Story-driven experiences with exploration and puzzle-solving elements.",
      icon: <Eye className="w-6 h-6" />,
      examples: ["Point-and-click adventures", "Action-adventures", "Visual novels", "Interactive fiction"]
    },
    {
      title: "Strategy Games",
      description: "Tactical gameplay requiring planning, resource management, and strategic thinking.",
      icon: <Target className="w-6 h-6" />,
      examples: ["Real-time strategy", "Turn-based strategy", "Tower defense", "4X games"]
    },
    {
      title: "Puzzle Games",
      description: "Brain-teasing challenges that test logic, pattern recognition, and problem-solving.",
      icon: <Layers className="w-6 h-6" />,
      examples: ["Match-3 games", "Physics puzzles", "Logic puzzles", "Word games"]
    },
    {
      title: "Educational Games",
      description: "Learning-focused games that make education engaging and interactive.",
      icon: <Trophy className="w-6 h-6" />,
      examples: ["Language learning", "Math games", "Science simulations", "Skill training"]
    },
    {
      title: "Simulation Games",
      description: "Virtual worlds that simulate real-world activities and systems.",
      icon: <Settings className="w-6 h-6" />,
      examples: ["City builders", "Life simulation", "Vehicle simulation", "Business simulation"]
    }
  ];

  const technologies = [
    { 
      name: "Unity",
      icon: <SiUnity className="w-16 h-16 text-[#000000] dark:text-white" />,
      category: "Engine"
    },
    { 
      name: "Unreal Engine",
      icon: <SiUnrealengine className="w-16 h-16 text-[#000000] dark:text-white" />,
      category: "Engine"
    },
    { 
      name: "Godot",
      icon: <SiGodotengine className="w-16 h-16 text-[#478CBF]" />,
      category: "Engine"
    },
    { 
      name: "C#",
      icon: <Code2 className="w-16 h-16 text-[#239120]" />,
      category: "Language"
    },
    { 
      name: "C++",
      icon: <Code2 className="w-16 h-16 text-[#00599C]" />,
      category: "Language"
    },
    { 
      name: "JavaScript",
      icon: <SiJavascript className="w-16 h-16 text-[#F7DF1E]" />,
      category: "Language"
    },
    { 
      name: "Blender",
      icon: <SiBlender className="w-16 h-16 text-[#F5792A]" />,
      category: "Art"
    },
    { 
      name: "Maya",
      icon: <SiAutodesk className="w-16 h-16 text-[#000000] dark:text-white" />,
      category: "Art"
    },
    { 
      name: "Photoshop",
      icon: <SiAdobephotoshop className="w-16 h-16 text-[#31A8FF]" />,
      category: "Art"
    },
    { 
      name: "Steam",
      icon: <SiSteam className="w-16 h-16 text-[#000000] dark:text-white" />,
      category: "Platform"
    },
    { 
      name: "PlayStation",
      icon: <SiPlaystation className="w-16 h-16 text-[#003791]" />,
      category: "Platform"
    },
    { 
      name: "Xbox",
      icon: <Monitor className="w-16 h-16 text-[#107C10]" />,
      category: "Platform"
    }
  ];

  const processSteps = [
    {
      title: "Concept & Game Design",
      description: "We collaborate with you to develop the core game concept, mechanics, storyline, and create comprehensive game design documents that serve as the blueprint for development.",
      number: "01",
      icon: <Target className="w-8 h-8 text-white" />,
      timeline: "2-3 weeks",
      deliverables: ["Game design document", "Core mechanics", "Art style guide", "Technical specifications"]
    },
    {
      title: "Pre-Production & Prototyping",
      description: "Creating playable prototypes to test core mechanics, validate gameplay concepts, and establish the technical foundation for full development.",
      number: "02",
      icon: <Play className="w-8 h-8 text-white" />,
      timeline: "3-4 weeks",
      deliverables: ["Playable prototype", "Art pipeline", "Technical proof of concept", "Revised design documents"]
    },
    {
      title: "Production & Development",
      description: "Full-scale game development including programming, art creation, level design, and system implementation using agile development methodologies.",
      number: "03",
      icon: <Code2 className="w-8 h-8 text-white" />,
      timeline: "3-12 months",
      deliverables: ["Game programming", "Art assets", "Level design", "Audio implementation"]
    },
    {
      title: "Testing & Quality Assurance",
      description: "Comprehensive testing across all target platforms including gameplay testing, performance optimization, bug fixing, and platform certification.",
      number: "04",
      icon: <Shield className="w-8 h-8 text-white" />,
      timeline: "4-8 weeks",
      deliverables: ["QA testing", "Bug fixes", "Performance optimization", "Platform certification"]
    },
    {
      title: "Launch & Marketing",
      description: "Strategic game launch including store page optimization, marketing materials, press releases, and community engagement to maximize visibility.",
      number: "05",
      icon: <Rocket className="w-8 h-8 text-white" />,
      timeline: "2-4 weeks",
      deliverables: ["Store page setup", "Marketing materials", "Launch strategy", "Community management"]
    },
    {
      title: "Post-Launch Support",
      description: "Ongoing support including updates, patches, DLC development, community management, and analytics monitoring to ensure long-term success.",
      number: "06",
      icon: <Settings className="w-8 h-8 text-white" />,
      timeline: "Ongoing",
      deliverables: ["Regular updates", "Bug fixes", "DLC content", "Analytics monitoring"]
    }
  ];

  const testimonials = [
    {
      name: "Jake Williams",
      role: "Indie Game Developer",
      content: "The team brought my vision to life perfectly. My puzzle game has reached over 100K downloads on Steam and the gameplay mechanics are exactly what I envisioned.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Sandra Chen",
      role: "CEO, MobileGames Studio",
      content: "Their expertise in mobile game optimization is incredible. Our action game runs smoothly on all devices and has maintained a 4.8-star rating on app stores.",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      name: "Marcus Johnson",
      role: "Educational Content Director",
      content: "The educational game they developed has revolutionized how our students learn. Engagement rates increased by 300% compared to traditional methods.",
      rating: 5,
      image: "/api/placeholder/60/60"
    }
  ];

  // For game development, we'll create specialized pricing based on the plans but adapted for games
  // Since the plans are more general, we'll use them as a base but adapt the descriptions and features
  const gamePlans = [
    {
      ...plans[0], // Starter
      name: "Indie Game",
      description: "Perfect for indie developers and small game projects",
      price: "₹50,000", // Adjusted for game development complexity
      deliveryTime: "4-8 Weeks",
      bestFor: "Indie Developers, Simple Games",
      features: [
        "2D or simple 3D game development",
        "Single platform (PC or Mobile)",
        "Basic gameplay mechanics",
        "Simple UI/UX design",
        "Basic audio integration",
        "Game testing & debugging"
      ]
    },
    {
      ...plans[1], // Growth - Most Popular
      name: "Professional Game",
      description: "Feature-rich games with advanced mechanics and multi-platform support",
      deliveryTime: "8-16 Weeks",
      bestFor: "Commercial Games, Studios",
      features: [
        "Advanced 3D game development",
        "Multi-platform deployment",
        "Complex gameplay systems",
        "Professional UI/UX design",
        "Advanced audio & music",
        "Multiplayer capabilities",
        "Performance optimization",
        "App store submission"
      ]
    },
    {
      ...plans[2], // Pro
      name: "AAA Game Development",
      description: "High-end game development with cutting-edge features",
      price: "₹2,50,000+",
      deliveryTime: "16-32 Weeks",
      bestFor: "AAA Studios, Large Projects",
      features: [
        "Cutting-edge 3D graphics",
        "All major platforms",
        "Advanced AI systems",
        "Professional audio production",
        "Complex multiplayer systems",
        "Advanced physics & animation",
        "Console certification",
        "Full marketing support"
      ]
    },
    {
      ...plans[3], // Custom Enterprise
      name: "Custom Game Project",
      description: "Fully customized game development for unique requirements"
    }
  ];

  const stats = [
    { number: "50+", label: "Games Developed", icon: <Gamepad2 className="w-6 h-6" /> },
    { number: "5M+", label: "Total Downloads", icon: <Download className="w-6 h-6" /> },
    { number: "95%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" /> },
    { number: "8", label: "Platforms Supported", icon: <Monitor className="w-6 h-6" /> }
  ];

  const faqs = [
    {
      question: "How long does it take to develop a game?",
      answer: "Development time varies greatly depending on the scope and complexity. Simple 2D games can take 3-6 months, while complex 3D games may take 1-3 years. We provide detailed timelines during the planning phase."
    },
    {
      question: "Which game engine do you recommend?",
      answer: "We choose the best engine based on your game's requirements. Unity is great for indie and mobile games, Unreal Engine excels for high-end 3D games, and Godot is perfect for smaller projects with custom needs."
    },
    {
      question: "Can you help with game publishing and marketing?",
      answer: "Yes! We assist with store page optimization, marketing materials, press releases, and can connect you with publishers. We also provide guidance on platform-specific requirements."
    },
    {
      question: "Do you provide post-launch support?",
      answer: "Absolutely. We offer ongoing support including bug fixes, updates, DLC development, and community management to ensure your game's long-term success."
    },
    {
      question: "Can you work with my existing game concept?",
      answer: "Yes, we can work with your existing game design documents, prototypes, or even partially developed games. We adapt our process to fit your current stage of development."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-[#0A0A1B] dark:via-[#1A1A35] dark:to-[#0A0A1B] from-gray-50 via-white to-gray-100">
      {/* Hero Section with Enhanced Styling */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10 dark:from-green-600/20 dark:via-emerald-600/20 dark:to-teal-600/20"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl"></div>
        
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
              className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium mb-6"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Professional Game Development Studio
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Create Epic
              <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Gaming Experiences
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              From indie gems to AAA blockbusters, we create immersive games that captivate players 
              and deliver unforgettable experiences across all platforms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                Start Your Game Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                View Game Portfolio
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
                  <div className="flex justify-center mb-2 text-green-600 dark:text-green-400">
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
              Comprehensive Game Development Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From concept to launch, we provide end-to-end game development solutions
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
                className="group bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
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

      {/* Game Types Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Types of Games We Create
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Expertise across all gaming genres and platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gameTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 text-green-600">
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
              Game Development Technologies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We use industry-leading tools and engines to create amazing games
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
                className="group flex flex-col items-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300"
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
              Our Game Development Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A systematic approach to creating successful games that players love
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
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {step.number}
                </div>
                <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                        </h3>
                        <p className="text-green-600 dark:text-green-400 font-medium">
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
                  <div className="w-32 h-32 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
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
              Game Development Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Flexible pricing options for games of all sizes and budgets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gamePlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl p-8 border ${
                  plan.name === "Professional Game"
                    ? 'border-green-500 shadow-2xl scale-105'
                    : 'border-white/20'
                }`}
              >
                {plan.name === "Professional Game" && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
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
                    {plan.deliveryTime}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    {plan.description}
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      <strong>Support:</strong> {plan.support}
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
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
                    plan.name === "Professional Game"
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg'
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
              Success Stories from Game Creators
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real results from real game development projects
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
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
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
              Everything you need to know about game development
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
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Your Game?
          </h2>
          <p className="text-xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let's bring your game idea to life. Our expert team is ready to create 
            an engaging gaming experience that players will love and remember.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/contact'}
              className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Start Your Game Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Schedule Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameDevelopment; 