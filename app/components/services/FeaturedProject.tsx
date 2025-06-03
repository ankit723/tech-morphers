'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface FeaturedProjectProps {
  imageSrc: string
  projectTitle: string
  description: string
  techList: string
  ctaText: string
  ctaHref: string
  gradientClass: string
  titleColorClass: string
}

const FeaturedProject: React.FC<FeaturedProjectProps> = ({
  imageSrc,
  projectTitle,
  description,
  techList,
  ctaText,
  ctaHref,
  gradientClass,
  titleColorClass
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className={`mb-20 p-8 ${gradientClass} rounded-3xl shadow-2xl border-2 border-white/30 dark:border-[#1A1A35]/30 backdrop-blur-xl relative overflow-hidden`}
  >
    {/* Animated gradient border overlay */}
    <div className={`absolute -inset-1 rounded-3xl z-0 pointer-events-none bg-gradient-to-br ${gradientClass} opacity-30 blur-lg animate-gradient-x`} />
    <h2 className={`text-4xl font-extrabold text-gray-800 dark:text-white mb-10 text-center ${titleColorClass} tracking-tight drop-shadow-lg`}>Featured Project</h2>
    <div className="md:flex items-center gap-10 relative z-10">
      <div className="md:w-1/2 mb-6 md:mb-0">
        <Image src={imageSrc} alt="Featured Project Thumbnail" width={500} height={350} className="rounded-2xl shadow-xl object-cover w-full border-4 border-white/30 dark:border-[#1A1A35]/30" />
      </div>
      <div className="md:w-1/2">
        <h3 className={`text-2xl font-bold mb-4 ${titleColorClass} tracking-tight`}>{projectTitle}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed font-medium">{description}</p>
        <p className="text-md text-gray-500 dark:text-gray-400 mb-6"><strong>Key Technologies:</strong> {techList}</p>
        <Link href={ctaHref} className="inline-block px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 dark:from-[#0123FE] dark:via-[#03A0FF] dark:to-[#60a5fa] text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform transform hover:shadow-blue-400/40 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 border-2 border-white/20 dark:border-[#1A1A35]/30 backdrop-blur-md">
          {ctaText}
        </Link>
      </div>
    </div>
  </motion.div>
)

export default FeaturedProject 