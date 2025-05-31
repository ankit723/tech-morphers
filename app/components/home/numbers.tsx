'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion , useScroll, useTransform} from 'framer-motion'
import LetterHover from '@/components/ui/letterHover'
import Link from 'next/link'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Only register ScrollTrigger plugin on the client side
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Numbers = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const firstRowRef = useRef<HTMLDivElement>(null)
    const secondRowRef = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)
    const statItemsRef = useRef<HTMLDivElement[]>([])

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    })

    const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
    
    useEffect(() => {
        // Ensure refs are available
        if (!sectionRef.current || !firstRowRef.current || !secondRowRef.current) return
        
        const ctx = gsap.context(() => {
            // Main section fade in
            gsap.fromTo(sectionRef.current,
                { opacity: 0 },
                { 
                    opacity: 1, 
                    duration: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            )
            
            // First row animation with staggered children
            if (firstRowRef.current && firstRowRef.current.children.length > 0) {
                gsap.fromTo(firstRowRef.current.children,
                    { x: -100, opacity: 0 },
                    { 
                        x: 0,
                        opacity: 1, 
                        duration: 1.2,
                        stagger: 0.2,
                        scrollTrigger: {
                            trigger: firstRowRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                )
            }
            
            // Second row animation with staggered children
            if (secondRowRef.current && secondRowRef.current.children.length > 0) {
                gsap.fromTo(secondRowRef.current.children,
                    { x: 100, opacity: 0 },
                    { 
                        x: 0,
                        opacity: 1, 
                        duration: 1.2,
                        stagger: 0.2,
                        scrollTrigger: {
                            trigger: secondRowRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                )
            }
            
            // Parallax scroll effect for both rows
            gsap.to(firstRowRef.current, {
                y: (i, el) => -el.offsetHeight * 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            })
            
            gsap.to(secondRowRef.current, {
                y: (i, el) => -el.offsetHeight * 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            })

            // CTA section animation
            if (ctaRef.current) {
                gsap.fromTo(
                    ctaRef.current,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: ctaRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                )

                // Button hover effect
                const button = ctaRef.current.querySelector('.cta-button')
                if (button) {
                    button.addEventListener('mouseenter', () => {
                        gsap.to(button, {
                            scale: 1.05,
                            duration: 0.3
                        })
                    })
                    
                    button.addEventListener('mouseleave', () => {
                        gsap.to(button, {
                            scale: 1,
                            duration: 0.3
                        })
                    })
                }
            }
        })
        
        // Cleanup function
        return () => ctx.revert()
    }, [])

    useEffect(() => {
        // Ensure refs are available and we're on the client side
        if (typeof window === 'undefined' || 
            !sectionRef.current || 
            !firstRowRef.current || 
            !secondRowRef.current) return
        
        const statsCtx = gsap.context(() => {
            // Set up counter animation for each stat number when it comes into view
            if (statItemsRef.current && statItemsRef.current.length > 0) {
                statItemsRef.current.forEach((statItem) => {
                    const numberElement = statItem.querySelector('.stat-number');
                    const targetValue = numberElement?.getAttribute('data-value') || '0';
                    
                    // Extract the numeric part and the suffix
                    const match = targetValue.match(/^([0-9.]+)(.*)$/);
                    if (!match) return;
                    
                    const numericValue = parseFloat(match[1]);
                    const suffix = match[2] || '';
                    
                    // Animate only the numeric part and append the suffix
                    gsap.fromTo(
                        numberElement,
                        { textContent: '0' },
                        {
                            textContent: numericValue,
                            duration: 2.5,
                            ease: 'power1.inOut',
                            snap: { textContent: 1 },
                            scrollTrigger: {
                                trigger: statItem,
                                start: 'top 80%',
                                toggleActions: 'play none none reset'
                            },
                            onUpdate: function() {
                                // Add the suffix back during the animation
                                if (numberElement) {
                                    numberElement.textContent = Math.floor(this.targets()[0].textContent) + suffix;
                                }
                            }
                        }
                    );
                });
            }
            
            // Fade in the stat items with stagger
            gsap.fromTo(
                statItemsRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reset'
                    }
                }
            );
        });
        
        return () => statsCtx.revert();
    }, []);
    
    // Function to collect refs for the stat items
    const setStatItemRef = (el: HTMLDivElement | null, index: number) => {
        if (el) {
            statItemsRef.current[index] = el;
        }
    };
    
    return (
        <section ref={sectionRef} className="overflow-hidden flex flex-col gap-28 mt-0 md:-mt-14">
            <motion.div 
                style={{ scale: headerScale }}
                className="container mx-auto cursor-default"
            >
                <div ref={firstRowRef} className="container mx-auto flex gap-5 md:gap-10 justify-center xl:justify-start ">
                    <LetterHover 
                        text="TRUST" 
                        initialColor="dark-adaptive" 
                        endColor="blue-700" 
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold" 
                    />
                    <LetterHover 
                        text="NUMBERS" 
                        initialColor="blue-700" 
                        endColor="dark-adaptive" 
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold" 
                    />
                </div>
                <div ref={secondRowRef} className="flex gap-5 md:gap-10 justify-center xl:justify-end mt-3 md:-mt-3">
                    <LetterHover 
                        text="NOT" 
                        initialColor="blue-700" 
                        endColor="dark-adaptive" 
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold" 
                    />
                    <LetterHover 
                        text="WORDS" 
                        initialColor="dark-adaptive" 
                        endColor="blue-700" 
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold" 
                    />
                </div>
            </motion.div>

            {/* Stats section - appears as user scrolls */}
            <div ref={statsRef} className="container mx-auto relative z-10">
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-8 md:gap-12 px-4 md:px-8">
                {[
                    { 
                        value: '52K+', 
                        label: 'Average development hours saved per enterprise client annually' 
                    },
                    { 
                        value: '115+', 
                        label: 'Critical security vulnerabilities prevented in production deployments' 
                    },
                    { 
                        value: '175k+', 
                        label: 'API requests handled per second during peak traffic' 
                    },
                    { 
                        value: '99.9%', 
                        label: 'Uptime maintained across our global infrastructure' 
                    },
                ].map((stat, index) => (
                    <div 
                        key={index}
                        ref={(el) => setStatItemRef(el, index)}
                        className=" flex flex-col items-start"
                    >
                        <h3 
                            data-value={stat.value}
                            className="stat-number text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-bold text-blue-700 dark:text-blue-700 mb-2"
                        >
                            {stat.value}
                        </h3>
                        <p className="text-left text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-200">
                            {stat.label}
                        </p>
                    </div>
                ))}
                </div>
            </div>

            {/* Ready to work with us section */}
            <div className="w-full mx-auto px-4 md:px-8">
            
                <div 
                    ref={ctaRef}
                    className="bg-blue-950 py-14 md:py-20 relative overflow-hidden px-4 md:px-8 rounded-4xl"
                >
                    {/* Background elements */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute w-96 h-96 transform rotate-12 bg-primary z-10 -top-18 -left-20"></div>
                        <div className="absolute w-96 h-96 rounded-full bg-blue-500  bottom-10 right-10"></div>
                    </div>
                    
                    <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 md:mb-0 text-center md:text-left">
                            Ready to work with us ?
                        </h2>
                        
                        <Link 
                            href="/contact" 
                            className="cta-button bg-black hover:bg-black/90 text-white font-medium py-3 px-6 sm:py-4 sm:px-8 rounded-full flex items-center justify-center transition-all text-sm sm:text-base"
                        >
                            Get Started
                            <svg 
                                className="ml-2 w-6 h-6" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                >
                                </path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Numbers