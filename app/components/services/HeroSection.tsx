'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  gradientClass: string
  textColorClass?: string
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaHref,
  gradientClass,
  textColorClass = 'text-white',
}) => (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className={`relative py-24 md:py-40 overflow-hidden ${gradientClass} ${textColorClass}`}
  >
    {/* Glassy overlay */}
    <div className="absolute inset-0 bg-white/10 dark:bg-[#0D0D1F]/30 backdrop-blur-xl z-0" />
    {/* Decorative blurred shapes */}
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/40 to-cyan-300/30 dark:from-[#0123FE]/40 dark:to-[#03A0FF]/30 rounded-full blur-3xl z-0 animate-pulse" />
    <div className="absolute -bottom-32 right-0 w-80 h-80 bg-gradient-to-tr from-pink-400/30 to-purple-300/20 dark:from-[#FF5B94]/30 dark:to-[#8441A4]/20 rounded-full blur-3xl z-0 animate-pulse" />
    <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center relative z-10">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-200 dark:from-[#e0e7ff] dark:via-[#60a5fa] dark:to-[#67e8f9] animate-gradient-x">
        {title}
      </h1>
      <p className="text-xl md:text-2xl mb-10 leading-relaxed font-medium text-white/90 dark:text-blue-100 drop-shadow-lg">
        {subtitle}
      </p>
      <Link href={ctaHref} className="inline-block px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 dark:from-[#0123FE] dark:via-[#03A0FF] dark:to-[#60a5fa] text-white font-bold text-xl shadow-2xl hover:scale-105 transition-transform transform hover:shadow-blue-400/40 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 border-2 border-white/20 dark:border-[#1A1A35]/30 backdrop-blur-md">
        <span className="inline-block animate-gradient-x bg-gradient-to-r from-white via-blue-100 to-cyan-200 dark:from-[#e0e7ff] dark:via-[#60a5fa] dark:to-[#67e8f9] bg-clip-text text-transparent">
          {ctaText}
        </span>
      </Link>
    </div>
  </motion.section>
)

export default HeroSection 