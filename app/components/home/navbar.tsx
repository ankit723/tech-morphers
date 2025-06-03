'use client'
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ui/themeToggle";
import Link from "next/link";

// Helper for sidebar scroll lock
const toggleScrollLock = (lock: boolean) => {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = lock ? 'hidden' : '';
  }
};

const Navbar = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set mounted state on component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect to handle body scroll lock when sidebar is open
  useEffect(() => {
    toggleScrollLock(isSidebarOpen);
    return () => {
      toggleScrollLock(false); // Ensure scroll lock is removed on unmount
    };
  }, [isSidebarOpen]);

  const toggleExpand = (section?: string) => {
    if (section) {
      setActiveSection(section === activeSection ? null : section);
      setIsExpanded(section !== activeSection);
    } else {
      setIsExpanded(!isExpanded);
      setActiveSection(null);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Island variants
  const islandVariants = {
    closed: { 
      width: "650px", 
      height: "70px",
      borderRadius: "40px",
      backgroundColor: "rgba(0, 0, 0)",
      y: 5
    },
    open: { 
      width: "500px", 
      height: "323px", 
      borderRadius: "30px",
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      y: 135
    }
  };

  // Content for different sections
  const renderContent = () => {
    if (!activeSection) return null;
    
    switch (activeSection) {
      case "services":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center mt-14 px-6"
          >
            <h3 className="text-white font-light text-lg mb-6 tracking-wide">Our Services</h3>
            <div className="grid grid-cols-2 gap-4 w-full">
              {[
                { 
                  name: "Web Development", 
                  href: "/services/web",
                  icon: (
                    <motion.div
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 10 }}
                      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6V18H21V6H3Z" stroke="url(#webGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 10L7 12L9 14" stroke="#4FACFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 10L17 12L15 14" stroke="#4FACFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 14L12 10" stroke="#00F2FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <defs>
                          <linearGradient id="webGradient" x1="3" y1="6" x2="21" y2="18" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#4FACFE"/>
                            <stop offset="1" stopColor="#00F2FE"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                },
                { 
                  name: "App Development", 
                  href: "/services/mobile",
                  icon: (
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="5" y="2" width="14" height="20" rx="2" stroke="url(#appGradient)" strokeWidth="2" />
                        <circle cx="12" cy="18" r="1" fill="#FF5B94" />
                        <defs>
                          <linearGradient id="appGradient" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FF5B94"/>
                            <stop offset="1" stopColor="#8441A4"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                },
                { 
                  name: "UI/UX Design", 
                  href: "/services/design",
                  icon: (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, rotate: 180 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="3" stroke="#FFC371" strokeWidth="2" />
                        <circle cx="12" cy="12" r="9" stroke="url(#uiGradient)" strokeWidth="2" strokeDasharray="2 4" />
                        <defs>
                          <linearGradient id="uiGradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FF9A9E"/>
                            <stop offset="1" stopColor="#FAD0C4"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                },
                { 
                  name: "Game Development", 
                  href: "/services/game-development",
                  icon: (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, y: -2 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16V16.5V16Z" stroke="#A18CD1" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 12V8" stroke="#A18CD1" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="9" stroke="url(#consultingGradient)" strokeWidth="2" />
                        <defs>
                          <linearGradient id="consultingGradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#A18CD1"/>
                            <stop offset="1" stopColor="#FBC2EB"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                }
              ].map((item) => (
                <motion.div
                  key={item.name}
                  className="bg-black/40 rounded-md p-4 flex items-center cursor-pointer border border-white/10"
                  whileHover={{ 
                    y: -2,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.1 } 
                  }}
                >
                  <Link href={item.href} className="flex items-center">
                    <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3 backdrop-blur-sm">
                      {item.icon}
                    </div>
                    <span className="text-white text-sm font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="flex items-center justify-center cursor-pointer rounded-full bg-white text-black px-5 py-2.5 text-sm hover:bg-opacity-90 transition-all text-center font-bold my-2"
              onClick={() => router.push("/contact")}
            >
              Explore more
            </motion.div>
          </motion.div>
        );
      case "products":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center mt-14 px-6"
          >
            <h3 className="text-white font-light text-lg mb-6 tracking-wide">Our Products</h3>
            <div className="grid grid-cols-2 gap-4 w-full">
              {[
                { 
                  name: "TechFlow CRM", 
                  icon: (
                    <motion.div
                      animate={{ 
                        rotateY: [0, 180, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, rotateX: 180 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7L12 12L7 7" stroke="#43E97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="url(#crmGradient)" strokeWidth="2" />
                        <defs>
                          <linearGradient id="crmGradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#43E97B"/>
                            <stop offset="1" stopColor="#38F9D7"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                },
                { 
                  name: "DataViz Pro", 
                  icon: (
                    <motion.div
                      animate={{ 
                        height: ["100%", "30%", "80%", "50%", "100%"],
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, rotateZ: 10 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 20V4" stroke="#30CFD0" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4 20L4 4" stroke="#30CFD0" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4 16H7V20H4V16Z" stroke="#330867" strokeWidth="2" fill="#30CFD0" fillOpacity="0.3" />
                        <path d="M10 12H13V20H10V12Z" stroke="#330867" strokeWidth="2" fill="#30CFD0" fillOpacity="0.5" />
                        <path d="M16 8H19V20H16V8Z" stroke="#330867" strokeWidth="2" fill="#30CFD0" fillOpacity="0.7" />
                        <defs>
                          <linearGradient id="dataGradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#30CFD0"/>
                            <stop offset="1" stopColor="#330867"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                },
                { 
                  name: "SecureGate", 
                  icon: (
                    <motion.div
                      animate={{ 
                        scale: [1, 0.8, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, y: -2 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 11V7C4 4.79086 5.79086 3 8 3H16C18.2091 3 20 4.79086 20 7V11" stroke="url(#secureGradient)" strokeWidth="2" strokeLinecap="round" />
                        <rect x="2" y="11" width="20" height="10" rx="2" stroke="url(#secureGradient)" strokeWidth="2" />
                        <circle cx="12" cy="16" r="2" stroke="#F9D423" strokeWidth="2" fill="#F9D423" fillOpacity="0.3" />
                        <defs>
                          <linearGradient id="secureGradient" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F9D423"/>
                            <stop offset="1" stopColor="#FF4E50"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                },
                { 
                  name: "CloudSync", 
                  icon: (
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                      }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, rotateY: 180 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 15C4.79086 15 3 13.2091 3 11C3 8.79086 4.79086 7 7 7C7.03315 7 7.06622 7.00032 7.09922 7.00097C7.5261 4.69233 9.54465 3 12 3C14.4553 3 16.4739 4.69233 16.9008 7.00097C16.9338 7.00032 16.9669 7 17 7C19.2091 7 21 8.79086 21 11C21 13.2091 19.2091 15 17 15" stroke="url(#cloudGradient)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 15V21M12 21L9 18M12 21L15 18" stroke="#6A82FB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                          <linearGradient id="cloudGradient" x1="3" y1="3" x2="21" y2="15" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#6A82FB"/>
                            <stop offset="1" stopColor="#FC5C7D"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                }
              ].map((item) => (
                <motion.div
                  key={item.name}
                  className="bg-black/40 rounded-md p-4 flex items-center cursor-pointer border border-white/10"
                  whileHover={{ 
                    y: -2,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.1 } 
                  }}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3 backdrop-blur-sm">
                    {item.icon}
                  </div>
                  <span className="text-white text-sm font-medium">{item.name}</span>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="flex items-center justify-center cursor-pointer rounded-full bg-white text-black px-5 py-2.5 text-sm hover:bg-opacity-90 transition-all text-center font-bold my-2"
              onClick={() => router.push("/contact")}
            >
              Explore more
            </motion.div>
          </motion.div>
        );
      case "resources":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center mt-14"
          >
            <h3 className="text-white font-light text-lg mb-6">Resources</h3>
            <div className="grid grid-cols-2 gap-3 w-full px-6">
              {[
                { 
                  name: "Case Studies", 
                  icon: (
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="url(#caseGradient)" strokeWidth="2" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="caseGradient" x1="3" y1="3" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FBDA61"/>
                            <stop offset="1" stopColor="#FF5ACD"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                },
                { 
                  name: "Blog Articles", 
                  icon: (
                    <motion.div
                      animate={{ 
                        x: [-2, 2, -2],
                      }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, y: -2 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="url(#blogGradient)" strokeWidth="2" />
                        <path d="M7 7H17" stroke="#00C9FF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M7 12H17" stroke="#00C9FF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M7 17H13" stroke="#00C9FF" strokeWidth="2" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="blogGradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#00C9FF"/>
                            <stop offset="1" stopColor="#92FE9D"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                },
                { 
                  name: "Documentation", 
                  icon: (
                    <motion.div
                      animate={{ 
                        rotateZ: [0, 10, -10, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, rotateZ: 20 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="url(#docGradient)" strokeWidth="2" />
                        <path d="M7 7H17" stroke="#E100FF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M7 11H17" stroke="#E100FF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M7 15H17" stroke="#E100FF" strokeWidth="2" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="docGradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#7F00FF"/>
                            <stop offset="1" stopColor="#E100FF"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                },
                { 
                  name: "Tutorials", 
                  icon: (
                    <motion.div
                      animate={{ 
                        y: [0, -3, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-white text-sm"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L12 20" stroke="url(#tutorialGradient)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M18 8L18 16" stroke="#FFCC70" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6 8L6 16" stroke="#FFCC70" strokeWidth="2" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="tutorialGradient" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#C850C0"/>
                            <stop offset="1" stopColor="#FFCC70"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )
                }
              ].map((item) => (
                <motion.div
                  key={item.name}
                  className="bg-black/40 rounded-md p-4 flex items-center cursor-pointer border border-white/10"
                  whileHover={{ 
                    y: -2,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.1 } 
                  }}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3 backdrop-blur-sm">
                    {item.icon}
                  </div>
                  <span className="text-white text-sm font-medium">{item.name}</span>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="flex items-center justify-center cursor-pointer rounded-full bg-white text-black px-5 py-2.5 text-sm hover:bg-opacity-90 transition-all text-center font-bold my-2"
              onClick={() => router.push("/contact")}
            >
              Explore more
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  return (
    <motion.nav 
      className="fixed left-0 right-0 top-0 flex justify-between items-center py-4 px-6 sm:px-10 z-40 bg-gradient-to-r dark:from-[#0A0A1B] dark:to-[#1A1A35] from-white to-white"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverEnd={() => {
        if(isExpanded) {
          toggleExpand();
        }
      }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <motion.div 
          className="relative w-10 h-10 md:w-14 md:h-14 mr-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/">
            <Image src="/logo.png" alt="Tech Morphers" fill className="object-contain" />
          </Link>
        </motion.div>
        <Link href="/" className="flex items-center font-bold">
          <motion.div 
            className="relative h-10 w-16 md:h-12 md:w-24 mr-0.5"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Image src="/home/Group42.png" alt="Tech" fill className="" />
            <span className="absolute inset-0 flex items-center justify-center text-white text-sm tracking-wider">TECH</span>
          </motion.div>
          <motion.div 
            className="relative h-10 w-24 md:h-12 md:w-32"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Image src="/home/Group2.png" alt="Morphers" fill className="" />
            <span className="absolute inset-0 flex items-center justify-center text-white text-sm tracking-wider">MORPHERS</span>
          </motion.div>
        </Link>
      </div>

      {/* Dynamic Island Container - Hidden on small screens */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden xl:block">
        {/* Dynamic Island */}
        <motion.div 
          className="relative border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-50"
          variants={islandVariants}
          initial="closed"
          animate={isExpanded ? "open" : "closed"}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            duration: 0.4
          }}
        >
          {/* Island Navigation Bar */}
          <div className="absolute top-0 left-0 right-0 h-[70px] flex items-center justify-center z-10">
            <div className="w-full flex justify-between items-center px-4">
              <div className="flex space-x-12">
                <motion.button 
                  className="text-white/80 text-sm font-medium tracking-wider relative px-3 py-1.5 rounded-md focus:outline-none"
                  whileHover={{ color: "#ffffff", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "100px", }}
                  animate={{ 
                    color: activeSection === "services" ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                    backgroundColor: activeSection === "services" ? "rgba(255, 255, 255, 0.05)" : "transparent"
                  }}
                  onClick={() => toggleExpand("services")}
                >
                  SERVICES
                </motion.button>
                
                <motion.button 
                  className="text-white/80 text-sm font-medium tracking-wider relative px-3 py-1.5 rounded-md focus:outline-none"
                  whileHover={{ color: "#ffffff", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "100px", }}
                  animate={{ 
                    color: activeSection === "products" ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                    backgroundColor: activeSection === "products" ? "rgba(255, 255, 255, 0.05)" : "transparent"
                  }}
                  onClick={() => router.push("/about-us")}
                >
                  ABOUT US
                  
                </motion.button>
                
                <motion.button 
                  className="text-white/80 text-sm font-medium tracking-wider relative px-3 py-1.5 rounded-md focus:outline-none"
                  whileHover={{ color: "#ffffff", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "100px", }}
                  animate={{ 
                    color: activeSection === "resources" ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                    backgroundColor: activeSection === "resources" ? "rgba(255, 255, 255, 0.05)" : "transparent"
                  }}
                  onClick={() => toggleExpand("resources")}
                >
                  RESOURCES
                </motion.button>
              </div>
              
              {!isExpanded && (
                <motion.button 
                  className="flex items-center justify-center cursor-pointer rounded-full bg-white text-black px-5 py-3.5 text-sm hover:bg-opacity-90 transition-all text-center font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => router.push("/contact")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Bring dream to life!
                </motion.button>
              )}
            </div>
          </div>

          {/* Island Content */}
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
          
          {/* Close button when expanded */}
          {isExpanded && (
            <motion.button 
              className="absolute z-50 top-3 right-3 w-6 h-6 flex items-center justify-center cursor-pointer text-white/70 hover:text-white focus:outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => toggleExpand()}
            >
              ✕
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Right side elements - Hidden on small screens */}
      <div className="hidden 2xl:flex items-center space-x-6">
        {[
          { label: "Contact", path: "/contact" },
          { label: "Support", path: "/support" },
          { label: "Login", path: "/login" }
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="relative group bg-[#0123FE] rounded-2xl px-4 py-3 text-white shadow-md hover:shadow-lg focus:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer outline-none"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            role="button"
            tabIndex={0}
            onClick={() => router.push(item.path)}
          >
            <motion.span
              className="text-xs sm:text-sm tracking-wider font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label.toUpperCase()}
            </motion.span>
          </motion.div>
        ))}
        <ModeToggle />
      </div>

      {/* Hamburger Menu - Visible on small screens */}
      <div className="2xl:hidden flex items-center">
        <ModeToggle /> 
        <button
          onClick={toggleSidebar}
          className="ml-4 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-lg z-50 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Menu</h2>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col space-y-4">
                {[
                  { label: "Services", section: "services" },
                  { label: "Products", section: "products" },
                  { label: "Resources", section: "resources" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      // For now, just close sidebar. Later, this could scroll to sections or navigate.
                      // toggleExpand(item.section); // This was for the dynamic island, might need different logic for sidebar
                      console.log(`Navigate to ${item.label}`);
                      toggleSidebar();
                    }}
                    className="text-left py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                
                <hr className="my-4 border-gray-200 dark:border-gray-700" />

                {[
                  { label: "Contact", path: "/contact" },
                  { label: "Support", path: "/support" },
                  { label: "Login", path: "/login" }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      router.push(item.path);
                      toggleSidebar();
                    }}
                    className="text-left py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                
                <div className="mt-auto pt-6">
                  {/* <ModeToggle /> Moved outside for better placement on mobile nav header */}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;