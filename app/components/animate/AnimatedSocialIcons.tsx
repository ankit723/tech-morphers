'use client'
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LuPhone } from "react-icons/lu"
import { FaInstagram, FaLinkedin } from "react-icons/fa"
import { SiGmail } from "react-icons/si"
import { HiOutlineLightBulb } from "react-icons/hi"

interface AnimatedSocialProps {
  toggleTheme: () => void
}

const AnimatedSocialIcons: React.FC<AnimatedSocialProps> = ({ toggleTheme }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const icons = [
    {
      type: "link",
      icon: <LuPhone className="w-5 h-5" />,
      href: "#",
    },
    {
      type: "link",
      icon: <FaInstagram className="w-5 h-5 " />,
      href: "#",
    },
    {
      type: "link",
      icon: <SiGmail className="w-5 h-5 " />,
      href: "#",
    },
    {
      type: "link",
      icon: <FaLinkedin className="w-5 h-5" />,
      href: "#",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % icons.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [icons.length])

  return (
    <div className="flex space-x-1 rounded-full">
      {icons.map((item, i) => {
        const isActive = i === activeIndex
        const bgColor = isActive ? "bg-blue-500" : "bg-white"
        const commonClasses = `w-10 h-10 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-colors duration-500 ${bgColor}`

        return (
          <motion.div key={i} className="rounded-full" animate={{ backgroundColor: isActive ? "#3B82F6" : "#ffffff" }}>
            <Link href={item.href} className={commonClasses}>
              {item.icon}
              <span className="sr-only">Icon</span>
            </Link>
          </motion.div>
        )
      })}
     <button
            onClick={toggleTheme}
            className="w-10 h-10 sm:w-18 sm:h-18 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Toggle theme"
          >
            <HiOutlineLightBulb className="w-12 h-12" />
          </button>
    </div>
  )
}

export default AnimatedSocialIcons;
