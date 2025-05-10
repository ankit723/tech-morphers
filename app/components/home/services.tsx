'use client'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const underlineRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  
  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Register ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    gsap.registerPlugin(ScrollTrigger)
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // GSAP animations
  useEffect(() => {
    // Make sure we're only running this on the client side
    if (typeof window === 'undefined' || 
        !sectionRef.current || 
        !headingRef.current || 
        !cardsRef.current || 
        !textRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    })

    // Animate the heading with a reveal effect
    tl.fromTo(headingRef.current, 
      { 
        y: 50,
        scale: 0.9,
        opacity: 0
      }, 
      { 
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }
    )

    // Add animation for the underline if it exists
    if (underlineRef.current) {
      tl.fromTo(underlineRef.current, 
        { width: '0%' },
        { 
          width: '100%', 
          duration: 0.6,
          ease: 'power2.inOut',
        }
      )
    }

    // Animate the description text
    tl.fromTo(textRef.current,
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      },
      "-=0.3"
    )

    // Animate service cards with staggered appear effect
    const cards = cardsRef.current.querySelectorAll('.service-card')
    
    gsap.set(cards, { y: 100, opacity: 0 })
    
    ScrollTrigger.batch(cards, {
      interval: 0.1,
      batchMax: 4,
      onEnter: batch => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out"
        })
      },
      onLeave: batch => {
        gsap.to(batch, {
          opacity: 0,
          y: -50,
          stagger: 0.1,
          duration: 0.8
        })
      },
      onEnterBack: batch => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8
        })
      },
      onLeaveBack: batch => {
        gsap.to(batch, {
          opacity: 0,
          y: 100,
          stagger: 0.1,
          duration: 0.8
        })
      },
      start: "top 85%",
      end: "bottom 15%"
    })

    // Animate the button with a bounce effect
    const button = sectionRef.current.querySelector('.main-button')
    if (button) {
      gsap.fromTo(button,
        { 
          y: 50,
          opacity: 0,
          scale: 0.8
        },
        { 
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: button,
            start: 'top 90%',
          }
        }
      )
    }
  }, [isClient]) // Added isClient as a dependency

  const services = [
    {
      id: 'web',
      title: 'Web Development',
      description: 'We build modern, responsive websites and web applications using cutting-edge technologies like React, Next.js, and Node.js.',
      icon: '/icons/web.svg',
      color: 'from-blue-600 to-cyan-500 dark:from-[#0123FE] dark:to-[#03A0FF]',
      features: ['Custom Web Apps', 'E-commerce Solutions', 'Progressive Web Apps', 'API Development']
    },
    {
      id: 'mobile',
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android that deliver exceptional user experiences.',
      icon: '/icons/mobile.svg',
      color: 'from-pink-500 to-purple-500 dark:from-[#FF5B94] dark:to-[#8441A4]',
      features: ['iOS & Android Apps', 'React Native', 'Flutter Development', 'App Store Optimization']
    },
    {
      id: 'design',
      title: 'UI/UX Design',
      description: 'User-centered design that enhances user experience and engagement through intuitive interfaces and seamless interactions.',
      icon: '/icons/design.svg',
      color: 'from-red-300 to-orange-200 dark:from-[#FF9A9E] dark:to-[#FAD0C4]',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems']
    },
    {
      id: 'game-development',
      title: 'Game Development',
      description: 'We create engaging and immersive games using the latest game development tools and technologies.',
      icon: '/icons/game.svg',
      color: 'from-green-400 to-blue-300 dark:from-[#00E187] dark:to-[#00A3E0]',
      features: ['Game Design', 'Unity Development', 'Unreal Engine', 'Game Development']
    }
  ]

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-20 relative">
          <h2 
            ref={headingRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-6 inline-block relative"
          >
            Our Services
            <div 
              ref={underlineRef}
              className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-[#0123FE] dark:to-[#03A0FF] rounded-full" 
              style={{ width: isClient ? '0%' : '100%' }}
            />
          </h2>
          <p 
            ref={textRef}
            className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg"
          >
            We offer a comprehensive range of technology solutions to help businesses 
            transform their ideas into digital reality.
          </p>
        </div>

        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="service-card bg-white dark:bg-[#0D0D1F] border border-gray-200 dark:border-[#1A1A35] rounded-2xl overflow-hidden shadow-sm"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${service.color}`}></div>
              <div className="p-6 md:p-8 grid grid-rows-3 h-full">
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-4 rounded-lg bg-gray-100 dark:bg-[#151530] flex items-center justify-center">
                    <Image 
                      src={service.icon} 
                      alt={service.title} 
                      width={24} 
                      height={24}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{service.title}</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} mr-2`}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  className={`mt-8 px-5 py-2.5 rounded-lg bg-gradient-to-r ${service.color} text-white text-sm font-medium w-full`}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <motion.button
            className="main-button px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-[#0123FE] dark:to-[#03A0FF] rounded-xl text-white font-semibold shadow-lg"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0px 10px 30px rgba(37, 99, 235, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            View All Services
          </motion.button>
        </div>
      </div>
    </section>
  )
}

export default Services 