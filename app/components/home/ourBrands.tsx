'use client'
import LetterHover from "@/components/ui/letterHover"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, X } from "lucide-react"

const categories = ["All", "Finance", "Tech", "Creative", "Design", "Media", "Health", "Government"]

const companies = [
    {
        name: "Arthalab",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Finance",
        description: "Financial analysis platform for businesses"
    },
    {
        name: "Mudslide Creations",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Creative",
        description: "Creative agency for digital content"
    },
    {
        name: "Arbre Creations",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Design",
        description: "Professional design services"
    },
    {
        name: "FinAnalyz Technologies",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Finance",
        description: "AI-powered financial solutions"
    },
    {
        name: "Reflense",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Tech",
        description: "Software development and consulting"
    },
    {
        name: "Creova",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Creative",
        description: "Digital branding and marketing"
    },
    {
        name: "Pixel's and Grid's",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Design",
        description: "UI/UX design for web and mobile"
    },
    {
        name: "Iotron",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Tech",
        description: "IoT solutions for smart businesses"
    },
    {
        name: "Salzelift",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Health",
        description: "Digital health and wellness platform"
    },
    {
        name: "Confetti Media",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Media",
        description: "Social media management and strategy"
    },
    {
        name: 'Bharat Care',
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Health",
        description: "Digital health and wellness platform"
    },
    {
        name: "Odisha Police",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Government",
        description: "Digital transformation for law enforcement"
    },
    {
        name: "HS Webtech",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Tech",
        description: "Web development and consulting"
    },
    {
        name: "Hireasy",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Tech",
        description: "Web development and consulting"
    },
    {
        name: "Dilute IT",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Tech",
        description: "Web development and consulting"
    },
    {
        name: "Atomic House",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Tech",
        description: "Web development and consulting"
    },
    {
        name: "Symbiont",
        image: "/home/ourBrands.png",
        logo: "/home/ourBrands.png",
        category: "Tech",
        description: "Web development and consulting"
    },
]

const rowSizes = [4, 5, 4, 3];

function splitIntoRows(array: typeof companies, sizes: typeof rowSizes) {
  let start = 0;
  return sizes.map(size => {
    const row = array.slice(start, start + size);
    start += size;
    return row;
  });
}

const rows = splitIntoRows(companies, rowSizes);


const OurBrands = () => {
    const firstRowRef = useRef<HTMLDivElement>(null)
    const secondRowRef = useRef<HTMLDivElement>(null)
    const thirdRowRef = useRef<HTMLDivElement>(null)
    const brandsContainerRef = useRef<HTMLDivElement>(null)
    const brandsRef = useRef<HTMLDivElement[]>([])
    const sectionRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [activeCategory, setActiveCategory] = useState<string>("All")
    const [selectedCompany, setSelectedCompany] = useState<typeof companies[0] | null>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    
    // Scroll-based animations
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    })
    
    const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

    // Track cursor position for hover effects
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        
        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    // Filter companies based on active category
    const filteredCompanies = activeCategory === "All" 
        ? companies 
        : companies.filter(company => company.category === activeCategory)

    // Register ScrollTrigger plugin
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        
        // Animate the headline text
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "center center",
                toggleActions: "play none none reverse"
            }
        })
        
        // Safely animate children of row refs
        if (firstRowRef.current) {
            tl.from(Array.from(firstRowRef.current.children), {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out"
            })
        }
        
        if (secondRowRef.current) {
            tl.from(Array.from(secondRowRef.current.children), {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.4")
        }
        
        if (thirdRowRef.current) {
            tl.from(Array.from(thirdRowRef.current.children), {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.4")
        }
        
        // Animate scroll indicator
        if (scrollRef.current) {
            gsap.to(scrollRef.current, {
                y: 10,
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: "sine.inOut"
            })
        }
        
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [])

    // Add brand cards to refs
    const addToRefs = (el: HTMLDivElement) => {
        if (el && !brandsRef.current.includes(el)) {
            brandsRef.current.push(el)
        }
    }

    return (
        <div className="cursor-default relative overflow-hidden" ref={sectionRef}>

            {/* Header section with parallax */}
            <motion.div 
                ref={headerRef}
                className="container relative z-10 mx-auto flex flex-col justify-center px-4 md:px-6 py-10"
                style={{
                    scale: headerScale,
                }}
            >
                <div className="container mx-auto">
                    <div ref={firstRowRef} className="flex gap-10 justify-center">
                        <LetterHover 
                            text="WE" 
                            initialColor="blue-700" 
                            endColor="dark-adaptive" 
                            className="text-[2.3rem] md:text-[8rem] font-semibold" 
                        />
                        <LetterHover 
                            text="CREATE" 
                            initialColor="blue-700" 
                            endColor="dark-adaptive" 
                            className="text-[2.3rem] md:text-[8rem] font-semibold" 
                        />
                        <LetterHover 
                            text="BRANDS" 
                            initialColor="blue-700" 
                            endColor="dark-adaptive" 
                            className="text-[2.3rem] md:text-[8rem] font-semibold" 
                        />
                    </div>

                    <div ref={secondRowRef} className="flex gap-10 md:gap-20 justify-center md:-mt-10">
                        <LetterHover 
                            text="THAT" 
                            initialColor="dark-adaptive" 
                            endColor="blue-700" 
                            className="text-[2.4rem] md:text-[8rem] font-semibold" 
                        />
                        <LetterHover 
                            text="PEOPLE" 
                            initialColor="dark-adaptive" 
                            endColor="blue-700" 
                            className="text-[2.4rem] md:text-[8rem] font-semibold" 
                        />
                        <LetterHover 
                            text="LOVE" 
                            initialColor="dark-adaptive" 
                            endColor="blue-700" 
                            className="text-[2.4rem] md:text-[8rem] font-semibold" 
                        />
                    </div>

                    <div ref={thirdRowRef} className="flex gap-10 md:gap-20 justify-center  md:-mt-10">
                        <LetterHover 
                            text="TALKING" 
                            initialColor="dark-adaptive" 
                            endColor="blue-700" 
                            className="text-[2.4rem] md:text-[8rem] font-semibold" 
                        />
                        <LetterHover 
                            text="ABOUT" 
                            initialColor="dark-adaptive" 
                            endColor="blue-700" 
                            className="text-[2.4rem] md:text-[8rem] font-semibold" 
                        />
                    </div>
                </div>
            </motion.div>
            
            {/* Companies Section with Gradient Background */}
            <div className="relative overflow-hidden" ref={brandsContainerRef}>
                {/* Blue gradient background similar to the reference image */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-700 to-blue-900"></div>

                <div className="absolute top-80">
                    <Image src="/icons/Planet.svg" alt="Globe" width={100} height={100} className="w-full h-full z-10" />
                </div>

                <div className="absolute top-0 right-0">
                    <Image src="/icons/circle.svg" alt="Globe" width={100} height={100} className="w-full h-full z-10" />
                </div>

                <div className="absolute top-0 right-0">
                    <Image src="/icons/circle2.svg" alt="Globe" width={100} height={100} className="w-full h-full z-10" />
                </div>

                <div className="absolute top-0 right-0">
                    <Image src="/icons/circle3.svg" alt="Globe" width={100} height={100} className="w-full h-full z-10" />
                </div>
               
                
                {/* Wave design at bottom similar to reference image */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                        <path fill="#ffffff" fillOpacity="1" d="M0,288L60,272C120,256,240,224,360,213.3C480,203,600,213,720,229.3C840,245,960,267,1080,266.7C1200,267,1320,245,1380,234.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                    </svg>
                </div>
                
                <div className="relative py-10 pb-60 px-4">
                    <div className="container mx-auto">
                        {/* Section heading similar to reference image */}
                        <motion.div 
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                                Our Clients <span className="inline-block ml-1">+</span>
                            </h2>
                        </motion.div>
                        
                        {/* Category filters with enhanced animations */}
                        <motion.div 
                            className="flex flex-wrap justify-center gap-3 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ 
                                opacity: 1, 
                                y: 0,
                                transition: {
                                    duration: 0.8,
                                    when: "beforeChildren",
                                    staggerChildren: 0.1,
                                    type: "spring",
                                    bounce: 0.3
                                }
                            }}
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {categories.map((category) => (
                                <motion.button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                        activeCategory === category 
                                        ? 'bg-white text-blue-700 shadow-md' 
                                        : 'bg-blue-600 text-white hover:bg-blue-400 backdrop-blur-sm'
                                    }`}
                                    variants={{
                                        hidden: { opacity: 0, y: 15, scale: 0.95 },
                                        visible: { 
                                            opacity: 1, 
                                            y: 0, 
                                            scale: 1,
                                            transition: {
                                                type: "spring", 
                                                stiffness: 300,
                                                damping: 20
                                            }
                                        }
                                    }}
                                    whileHover={{ 
                                        scale: 1.07,
                                        boxShadow: "0 6px 15px rgba(0,0,0,0.12)",
                                        transition: {
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 15
                                        }
                                    }}
                                    whileTap={{ scale: 0.94 }}
                                    layout
                                >
                                    {category}
                                </motion.button>
                            ))}
                        </motion.div>
                        
                        {/* Company logos in staggered rows using the rows array */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center"
                            >
                                {activeCategory === "All" ? (
                                    // When showing all companies, use the staggered rows layout
                                    <>
                                        {rows.map((rowCompanies, rowIndex) => (
                                            <motion.div 
                                                key={`row-${rowIndex}`}
                                                className={`flex flex-wrap justify-center gap-4 md:gap-6 mb-6 ${
                                                    rowIndex % 2 === 1 ? 'md:ml-8' : 'md:mr-8'
                                                }`}
                                                initial={{ opacity: 0, y: 40 }}
                                                whileInView={{ 
                                                    opacity: 1, 
                                                    y: 0,
                                                    transition: { 
                                                        duration: 0.6, 
                                                        delay: rowIndex * 0.15,
                                                        type: "spring",
                                                        stiffness: 90,
                                                        damping: 15
                                                    }
                                                }}
                                                viewport={{ once: true, margin: "-80px" }}
                                            >
                                                {rowCompanies.map((company, index) => (
                                                    <motion.div
                                                        key={company.name}
                                                        ref={addToRefs}
                                                        className="w-28 h-14 sm:w-32 sm:h-16 md:w-40 md:h-16 bg-cream-100 rounded-full flex items-center justify-center px-4 cursor-pointer relative overflow-hidden"
                                                        style={{ backgroundColor: "rgb(248, 240, 227)" }}
                                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                        whileInView={{ 
                                                            opacity: 1, 
                                                            scale: 1, 
                                                            y: 0,
                                                            transition: { 
                                                                duration: 0.5,
                                                                delay: index * 0.05 + (rowIndex * 0.15),
                                                                type: "spring",
                                                                stiffness: 120,
                                                                damping: 18,
                                                                bounce: 0.3
                                                            }
                                                        }}
                                                        viewport={{ once: true, margin: "-40px" }}
                                                        onClick={() => setSelectedCompany(company)}
                                                        whileHover={{ 
                                                            scale: 1.06,
                                                            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                                                            y: -3
                                                        }}
                                                        whileTap={{ scale: 0.96 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 350,
                                                            damping: 20
                                                        }}
                                                    >
                                                        {/* Company logo */}
                                                        <motion.div
                                                            className="relative h-10 w-full flex items-center justify-center text-center font-bold text-gray-800"
                                                            whileHover={{ 
                                                                color: "#3B82F6",
                                                                transition: { duration: 0.15 }
                                                            }}
                                                        >
                                                            {company.name}
                                                        </motion.div>
                                                        
                                                        {/* Enhanced hover info with reveal animation */}
                                                        <motion.div 
                                                            className="absolute inset-0 bg-blue-600 bg-opacity-90 flex items-center justify-center opacity-0"
                                                            whileHover={{ 
                                                                opacity: 1,
                                                                transition: { duration: 0.25 }
                                                            }}
                                                            initial={false}
                                                        >
                                                            <motion.span 
                                                                className="text-white text-xs font-medium"
                                                                initial={{ y: 8, opacity: 0 }}
                                                                animate={ { y: 0, opacity: 1 } }
                                                                transition={{ duration: 0.2, delay: 0.05 }}
                                                            >
                                                                {company.category}
                                                            </motion.span>
                                                        </motion.div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        ))}
                                    </>
                                ) : (
                                    // When filtering by category, use a simple grid layout with staggered animations
                                    <motion.div 
                                        className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl mx-auto"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            show: {
                                                opacity: 1,
                                                transition: {
                                                    staggerChildren: 0.06,
                                                    delayChildren: 0.05
                                                }
                                            }
                                        }}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {filteredCompanies.map((company) => (
                                            <motion.div
                                                key={company.name}
                                                ref={addToRefs}
                                                className="w-28 h-14 sm:w-32 sm:h-16 md:w-40 md:h-16 bg-cream-100 rounded-full flex items-center justify-center px-4 cursor-pointer relative overflow-hidden"
                                                style={{ backgroundColor: "rgb(248, 240, 227)" }}
                                                variants={{
                                                    hidden: { opacity: 0, scale: 0.85, y: 40 },
                                                    show: { 
                                                        opacity: 1, 
                                                        scale: 1, 
                                                        y: 0,
                                                        transition: {
                                                            type: "spring",
                                                            stiffness: 110,
                                                            damping: 18,
                                                            duration: 0.5
                                                        }
                                                    }
                                                }}
                                                onClick={() => setSelectedCompany(company)}
                                                whileHover={{ 
                                                    scale: 1.06,
                                                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                                                    y: -3
                                                }}
                                                whileTap={{ scale: 0.96 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 350,
                                                    damping: 20
                                                }}
                                            >
                                                {/* Company logo */}
                                                <motion.div
                                                    className="relative h-10 w-full flex items-center justify-center text-center font-medium text-gray-800"
                                                    whileHover={{ 
                                                        color: "#3B82F6",
                                                        transition: { duration: 0.15 }
                                                    }}
                                                >
                                                    {company.name}
                                                </motion.div>
                                                
                                                {/* Enhanced hover info with reveal animation */}
                                                <motion.div 
                                                    className="absolute inset-0 bg-blue-600 bg-opacity-90 flex items-center justify-center opacity-0"
                                                    whileHover={{ 
                                                        opacity: 1,
                                                        transition: { duration: 0.25 }
                                                    }}
                                                    initial={false}
                                                >
                                                    <motion.span 
                                                        className="text-white text-xs font-medium"
                                                        initial={{ y: 8, opacity: 0 }}
                                                        animate={ { y: 0, opacity: 1 } }
                                                        transition={{ duration: 0.2, delay: 0.05 }}
                                                    >
                                                        {company.category}
                                                    </motion.span>
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                                
                                {/* Empty state when no companies match filter */}
                                {filteredCompanies.length === 0 && (
                                    <motion.div 
                                        className="flex flex-col items-center justify-center py-12 text-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ 
                                            opacity: 1, 
                                            y: 0,
                                            transition: { 
                                                duration: 0.6,
                                                type: "spring",
                                                bounce: 0.3
                                            }
                                        }}
                                    >
                                        <motion.div 
                                            className="w-16 h-16 mb-4 text-white/50"
                                            initial={{ scale: 0.8, rotate: -8 }}
                                            animate={{ 
                                                scale: 1, 
                                                rotate: 0,
                                                transition: { 
                                                    duration: 0.7,
                                                    type: "spring",
                                                    stiffness: 120
                                                }
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </motion.div>
                                        <motion.h3 
                                            className="text-lg font-medium text-white mb-2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ 
                                                opacity: 1, 
                                                y: 0,
                                                transition: { 
                                                    duration: 0.4,
                                                    delay: 0.3
                                                }
                                            }}
                                        >
                                            No clients found
                                        </motion.h3>
                                        <motion.p 
                                            className="text-blue-100/80 max-w-md"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ 
                                                opacity: 1, 
                                                y: 0,
                                                transition: { 
                                                    duration: 0.4,
                                                    delay: 0.5
                                                }
                                            }}
                                        >
                                            We couldn&apos;t find any clients in the &quot;{activeCategory}&quot; category. 
                                            Try selecting a different category.
                                        </motion.p>
                                        <motion.button
                                            className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-full text-sm font-medium"
                                            onClick={() => setActiveCategory("All")}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ 
                                                opacity: 1, 
                                                y: 0,
                                                transition: { 
                                                    duration: 0.4,
                                                    delay: 0.7
                                                }
                                            }}
                                            whileHover={{ 
                                                scale: 1.05, 
                                                boxShadow: "0 5px 15px rgba(255,255,255,0.2)" 
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            View all clients
                                        </motion.button>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
            {/* Enhanced company detail modal with improved UX */}
            <AnimatePresence>
                {selectedCompany && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg overflow-y-auto"
                        onClick={() => setSelectedCompany(null)}
                    >
                        <motion.div 
                            className=" dark:bg-gray-900 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal header with enhanced 3D parallax effect */}
                            <div className="relative h-40 bg-blue-800 overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 w-full h-full"
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1 }}
                                    style={{
                                        x: mousePosition.x / 30,
                                        y: mousePosition.y / 30,
                                        transition: "transform 0.3s ease-out"
                                    }}
                                >
                                </motion.div>
                                
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/70"></div>
                                {/* Enhanced close button */}
                                <motion.button 
                                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors border border-white/30 z-10"
                                    onClick={() => setSelectedCompany(null)}
                                    whileHover={{ scale: 1.1, rotate: 90, boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)" }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                                
                                {/* Improved company info overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 backdrop-blur-sm bg-gradient-to-t from-blue-900/80 to-transparent">
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <motion.div 
                                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white/90 p-2 sm:p-3 shadow-lg border-2 border-white/70"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3, type: "spring" }}
                                            whileHover={{ rotate: 5, scale: 1.05 }}
                                        >
                                            <Image 
                                                src={selectedCompany.logo} 
                                                alt={`${selectedCompany.name} logo`} 
                                                width={80} 
                                                height={80}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </motion.div>
                                        <div>
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <motion.h2 
                                                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
                                                    animate={{ 
                                                        textShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 10px rgba(255,255,255,0.5)", "0 0 0px rgba(255,255,255,0)"]
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    {selectedCompany.name}
                                                </motion.h2>
                                            </motion.div>
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <motion.span 
                                                    className="inline-block px-4 py-1.5 bg-blue-600/50 backdrop-blur-sm text-blue-100 text-sm font-medium rounded-full mt-2 border border-blue-400/30"
                                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(37, 99, 235, 0.6)" }}
                                                >
                                                    {selectedCompany.category}
                                                </motion.span>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Enhanced modal content */}
                            <div className="p-8 md:p-10 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">About the Project</h3>
                                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                        <p className="leading-relaxed text-sm sm:text-base">
                                            {selectedCompany.description}
                                        </p>
                                        <p className="leading-relaxed text-sm sm:text-base">
                                            We partnered with {selectedCompany.name} to develop a complete brand identity and digital 
                                            strategy that helped them connect with their audience and achieve significant growth in 
                                            their market segment.
                                        </p>
                                    </div>
                                </motion.div>
                                
                                {/* Enhanced project details with hover effects */}
                                <motion.div 
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <motion.div 
                                        className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700"
                                        whileHover={{ 
                                            y: -5, 
                                            backgroundColor: "#EFF6FF",
                                            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)"
                                        }}
                                    >
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Timeline</h4>
                                        <p className="text-gray-900 dark:text-white font-semibold">6 Months</p>
                                    </motion.div>
                                    <motion.div 
                                        className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700"
                                        whileHover={{ 
                                            y: -5, 
                                            backgroundColor: "#EFF6FF",
                                            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)"
                                        }}
                                    >
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Services</h4>
                                        <p className="text-gray-900 dark:text-white font-semibold">Branding, Web Development</p>
                                    </motion.div>
                                    <motion.div 
                                        className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700"
                                        whileHover={{ 
                                            y: -5, 
                                            backgroundColor: "#EFF6FF",
                                            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)"
                                        }}
                                    >
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Year</h4>
                                        <p className="text-gray-900 dark:text-white font-semibold">2023</p>
                                    </motion.div>
                                </motion.div>
                                
                                {/* Enhanced tags with animations */}
                                <motion.div 
                                    className="flex flex-wrap gap-2 mb-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    {["Web Design", "UI/UX", "Branding", "Strategy"].map((tag, index) => (
                                        <motion.span 
                                            key={tag}
                                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800"
                                            whileHover={{ 
                                                scale: 1.05, 
                                                backgroundColor: "#DBEAFE",
                                                boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
                                            }}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.8 + (index * 0.1) }}
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </motion.div>
                                
                                {/* Enhanced project gallery with hover effects */}
                                <motion.div 
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    {[1, 2, 3].map((_, index) => (
                                        <motion.div 
                                            key={index}
                                            className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden group"
                                            whileHover={{ 
                                                scale: 1.05,
                                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
                                            }}
                                        >
                                            <Image 
                                                src={selectedCompany.image} 
                                                alt={`${selectedCompany.name} project image ${index + 1}`}
                                                width={300}
                                                height={200}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {/* Overlay on hover */}
                                            <motion.div 
                                                className="absolute inset-0 bg-blue-600/0 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors duration-300 backdrop-blur-[2px] opacity-0 group-hover:opacity-100"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                        <polyline points="15 3 21 3 21 9"></polyline>
                                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                                    </svg>
                                                </motion.div>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                                
                                {/* Enhanced action buttons */}
                                <motion.div 
                                    className="flex flex-wrap gap-4 justify-end"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                >
                                    <motion.button 
                                        className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm sm:text-base"
                                        onClick={() => setSelectedCompany(null)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Close
                                    </motion.button>
                                    <motion.button 
                                        className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/30 transition-colors flex items-center gap-2 group text-sm sm:text-base"
                                        whileHover={{ 
                                            scale: 1.05,
                                            boxShadow: "0 15px 25px -5px rgba(37, 99, 235, 0.4)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>Visit Website</span>
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </motion.span>
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default OurBrands