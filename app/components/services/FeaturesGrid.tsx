'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface Feature {
  name: string
  description: string
}

interface FeaturesGridProps {
  features: Feature[]
  gradientClass: string
  numberColorClass: string
  title: string
}

const FeaturesGrid: React.FC<FeaturesGridProps> = ({ features, gradientClass, numberColorClass, title }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } } }}
    className="mb-20 p-8 bg-white/10 dark:bg-[#12122A]/60 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 dark:border-[#1A1A35]/30"
  >
    <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-10 text-center tracking-tight drop-shadow-lg">
      {title}
    </h2>
    <div className="grid md:grid-cols-2 gap-10">
      {features.map((feature, i) => (
        <motion.div
          key={i}
          variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          className="flex items-start p-8 bg-white/60 dark:bg-[#0D0D1F]/80 rounded-2xl shadow-lg border border-white/30 dark:border-[#1A1A35]/40 transition-all duration-300 hover:shadow-blue-400/30 hover:scale-[1.03] group relative overflow-hidden"
        >
          {/* Animated gradient border */}
          <div className={`absolute -inset-1 rounded-2xl z-0 pointer-events-none bg-gradient-to-br ${gradientClass} opacity-40 blur-lg animate-gradient-x`} />
          <span className={`flex-shrink-0 w-10 h-10 rounded-full ${gradientClass} ${numberColorClass} mr-6 mt-1 flex items-center justify-center font-extrabold text-lg shadow-lg border-4 border-white/40 dark:border-[#1A1A35]/40 group-hover:scale-110 transition-transform`}>{i+1}</span>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight group-hover:text-blue-700 dark:group-hover:text-cyan-300 transition-colors">
              {feature.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
)

export default FeaturesGrid 