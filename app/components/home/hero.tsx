'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Dynamically import Lottie to prevent server-side rendering issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// Note: We'll load the animation directly instead of importing it
// This avoids TypeScript errors with JSON imports

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<any>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [activeService, setActiveService] = useState<string | null>(null)
  const [animationData, setAnimationData] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  
  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Mouse position for parallax effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Parallax transformations based on mouse position
  const parallaxX = useTransform(mouseX, [-500, 500], [15, -15])
  const parallaxY = useTransform(mouseY, [-500, 500], [15, -15])

  // Track mouse position for parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  // Load the Lottie animation
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    fetch('/animations/tech-animation.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error))
  }, [])

  // Register ScrollTrigger plugin
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    gsap.registerPlugin(ScrollTrigger)
    return () => {
      // Clean up ScrollTrigger on component unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Simple appear on scroll animations
  useEffect(() => {
    // Make sure we're only running this on the client side
    if (typeof window === 'undefined' || 
        !containerRef.current || 
        !textRef.current) return
    
    // Animate hero text elements
    const heroText = textRef.current.querySelectorAll('.hero-text')
    gsap.fromTo(
      heroText,
      { y: 100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.2, 
        duration: 1,
        ease: 'power3.out',
      }
    )

    // Animate floating elements
    const floatingElements = containerRef.current.querySelectorAll('.floating-element')
    floatingElements.forEach((element, i) => {
      gsap.fromTo(
        element,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: 0.2 * i,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
          }
        }
      )
    })

    // Animate grid overlay
    const gridOverlay = containerRef.current.querySelector('.grid-overlay')
    if (gridOverlay) {
      gsap.fromTo(
        gridOverlay,
        { opacity: 0 },
        {
          opacity: 0.2,
          duration: 1.5,
          ease: 'power2.inOut'
        }
      )
    }

    // Animate glowing effect
    const glowElements = containerRef.current.querySelectorAll('.glow-element')
    glowElements.forEach((element) => {
      gsap.to(
        element,
        {
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3)',
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        }
      )
    })
  }, [])

  // Services data
  const services = [
    { 
      id: 'web', 
      title: 'Web Development',
      icon: '/icons/web.svg',
      description: 'Modern, responsive websites and web applications built with cutting-edge technologies.'
    },
    { 
      id: 'mobile', 
      title: 'Mobile Apps',
      icon: '/icons/mobile.svg',
      description: 'Native and cross-platform mobile applications for iOS and Android.'
    },
    { 
      id: 'game', 
      title: 'Game Development',
      icon: '/icons/game.svg',
      description: 'Engaging gaming experiences across multiple platforms.'
    },
    { 
      id: 'ui', 
      title: 'UI/UX Design',
      icon: '/icons/design.svg',
      description: 'User-centered design that enhances user experience and engagement.'
    },
    { 
      id: 'saas', 
      title: 'SaaS Solutions',
      icon: '/icons/saas.svg',
      description: 'Ready-to-use software as a service products for various business needs.'
    },
  ]

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(1, 35, 254, 0.4)",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    tap: { scale: 0.95 }
  }
  
  const floatingVariants = {
    animate: (i: number) => ({
      y: [0, -15, 0],
      rotate: [0, i % 2 === 0 ? 5 : -5, 0],
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        ease: "easeInOut",
      }
    })
  }

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden my-20"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background with gradient mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-radial from-blue-500/10 to-transparent dark:from-[#0123FE]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] bg-gradient-radial from-purple-500/10 to-transparent dark:from-[#8441A4]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-gradient-radial from-cyan-500/10 to-transparent dark:from-[#03A0FF]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating elements with appear animation */}
      <motion.div 
        className="absolute top-[20%] left-[10%] w-16 h-16 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-[#0123FE]/20 dark:to-[#03A0FF]/20 rounded-full floating-element"
        custom={1}
        variants={floatingVariants}
        animate="animate"
        style={{ x: useTransform(mouseX, [-500, 500], [8, -8]) }}
      ></motion.div>
      <motion.div 
        className="absolute top-[40%] right-[15%] w-24 h-24 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-[#FF5B94]/20 dark:to-[#8441A4]/20 rounded-full floating-element"
        custom={2}
        variants={floatingVariants}
        animate="animate"
        style={{ x: useTransform(mouseX, [-500, 500], [-20, 20]) }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-[25%] left-[25%] w-20 h-20 bg-gradient-to-r from-green-400/10 to-teal-400/10 dark:from-[#43E97B]/20 dark:to-[#38F9D7]/20 rounded-full floating-element"
        custom={3}
        variants={floatingVariants}
        animate="animate"
        style={{ x: useTransform(mouseX, [-500, 500], [6, -6]) }}
      ></motion.div>
      <motion.div 
        className="absolute top-[30%] left-[30%] w-12 h-12 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 dark:from-[#FFCB46]/20 dark:to-[#FF8A46]/20 rounded-full floating-element"
        custom={4}
        variants={floatingVariants}
        animate="animate"
        style={{ x: useTransform(mouseX, [-500, 500], [5, -5]) }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-[40%] right-[30%] w-14 h-14 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 dark:from-[#675BFF]/20 dark:to-[#4B93FF]/20 rounded-full floating-element"
        custom={5}
        variants={floatingVariants}
        animate="animate"
        style={{ x: useTransform(mouseX, [-500, 500], [-4, 4]) }}
      ></motion.div>

      {/* Grid overlay with animated lines */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-0 grid-overlay"></div>

      {/* Hero content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between pt-10 md:pt-16 lg:pt-20">
        {/* Text content */}
        <div 
          ref={textRef} 
          className="w-full lg:w-1/2 text-gray-800 dark:text-white mb-10 lg:mb-0 text-center lg:text-left"
        >
          <motion.div 
            className="hero-text mb-3 inline-flex items-center rounded-full border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm px-4 py-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 dark:bg-green-500 mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">We are launching something special</span>
          </motion.div>
          
          <h1 className="hero-text text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-none tracking-tight">
            Transforming Ideas Into 
            <span className="relative block mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-[#0123FE] dark:to-[#03A0FF] text-transparent bg-clip-text">
              Digital Reality
              <motion.span 
                className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-[#0123FE] dark:to-[#03A0FF] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
              ></motion.span>
            </span>
          </h1>
          
          <p className="hero-text text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-lg font-medium leading-relaxed">
            Tech Morphers delivers cutting-edge technology solutions that empower businesses to thrive in the digital landscape.
          </p>
          
          <div className="hero-text flex flex-wrap gap-4 justify-center lg:justify-start">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-[#0123FE] dark:to-[#03A0FF] rounded-xl text-white font-semibold shadow-lg relative overflow-hidden group glow-element"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <motion.span 
                  className="ml-2 inline-block"
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </span>
              <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"></span>
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border border-gray-300 dark:border-white/20 bg-gray-100/80 dark:bg-white/5 backdrop-blur-sm rounded-xl text-gray-800 dark:text-white font-semibold hover:bg-gray-200/80 dark:hover:bg-white/10 transition-colors"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              Our Work
            </motion.button>
          </div>

          {/* Service tags */}
          <motion.div 
            className="hero-text mt-12 flex flex-wrap gap-3 justify-center lg:justify-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                className="relative"
                variants={itemVariants}
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                <motion.div 
                  className="px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-white/10 cursor-pointer flex items-center gap-2 shadow-sm"
                  whileHover={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderColor: "rgba(209, 213, 219, 0.8)",
                    y: -5,
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  <Image 
                    src={service.icon} 
                    alt={service.title} 
                    width={20} 
                    height={20} 
                    className="w-5 h-5" 
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{service.title}</span>
                </motion.div>

                {/* Tooltip */}
                <AnimatePresence>
                  {activeService === service.id && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-white/10 backdrop-blur-lg rounded-lg border border-gray-200 dark:border-white/20 w-64 z-20 shadow-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Image 
                            src={service.icon} 
                            alt={service.title} 
                            width={20} 
                            height={20} 
                            className="w-5 h-5" 
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">{service.title}</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{service.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Lottie animation */}
        <motion.div 
          className="w-full lg:w-1/2 h-[400px] md:h-[500px] relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ 
            x: parallaxX,
            y: parallaxY,
            rotateY: useTransform(mouseX, [-500, 500], [2, -2]),
            rotateX: useTransform(mouseY, [-500, 500], [-2, 2]),
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-[#0123FE]/20 dark:to-[#03A0FF]/20 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-[#0123FE]/20 transition-shadow duration-500 transform perspective-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 dark:from-[#0123FE]/30 dark:to-[#03A0FF]/30 blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            
            {isMounted && animationData && (
              <Lottie 
                animationData={animationData} 
                loop={true} 
                autoplay={true}
                lottieRef={lottieRef}
                className="w-full h-full object-cover"
                onMouseEnter={() => {
                  if (lottieRef.current) {
                    lottieRef.current.setSpeed(2);
                  }
                }}
                onMouseLeave={() => {
                  if (lottieRef.current) {
                    lottieRef.current.setSpeed(1);
                  }
                }}
              />
            )}
          </div>
          
          {/* Decorative elements around animation */}
          <div className="absolute top-10 -right-4 w-16 h-16 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 left-10 w-20 h-20 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-24 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-xl"></div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero