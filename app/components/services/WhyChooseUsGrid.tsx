'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface WhyItem {
  icon: string
  iconAlt: string
  title: string
  description: string
}

interface WhyChooseUsGridProps {
  items: WhyItem[]
  gradientClass: string
  title: string
  iconColorClass: string
  titleColorClass: string
}

const WhyChooseUsGrid: React.FC<WhyChooseUsGridProps> = ({ items, gradientClass, title, iconColorClass, titleColorClass }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}
    className="mb-20 p-8 bg-white/10 dark:bg-[#12122A]/60 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 dark:border-[#1A1A35]/30"
  >
    <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-10 text-center tracking-tight drop-shadow-lg">{title}</h2>
    <div className="grid md:grid-cols-2 gap-10">
      {items.map((item, i) => (
        <div key={i} className="p-8 bg-white/70 dark:bg-[#0D0D1F]/80 rounded-2xl shadow-lg flex items-start border border-white/30 dark:border-[#1A1A35]/40 group hover:shadow-blue-400/30 hover:scale-[1.03] transition-all duration-300 relative overflow-hidden">
          {/* Animated gradient icon background */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-6 bg-gradient-to-br ${gradientClass} ${iconColorClass} shadow-lg border-4 border-white/40 dark:border-[#1A1A35]/40 group-hover:scale-110 transition-transform animate-gradient-x`}>
            <Image src={item.icon} alt={item.iconAlt} width={36} height={36} className="" />
          </div>
          <div>
            <h3 className={`text-2xl font-bold mb-2 ${titleColorClass} tracking-tight group-hover:text-blue-700 dark:group-hover:text-cyan-300 transition-colors`}>{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
)

export default WhyChooseUsGrid 