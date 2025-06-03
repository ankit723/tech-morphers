'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface TechnologiesListProps {
  technologies: string[]
  gradientClass: string
  title: string
  chipColorClass: string
}

const TechnologiesList: React.FC<TechnologiesListProps> = ({ technologies, gradientClass, title, chipColorClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className="mb-20 p-8 bg-white/10 dark:bg-[#12122A]/60 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 dark:border-[#1A1A35]/30"
  >
    <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-10 text-center tracking-tight drop-shadow-lg">{title}</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {technologies.map((tech, i) => (
        <span key={i} className={`px-6 py-3 ${chipColorClass} rounded-full text-lg font-semibold shadow-md hover:shadow-blue-400/30 transition-shadow bg-gradient-to-br ${gradientClass} border border-white/30 dark:border-[#1A1A35]/40 backdrop-blur-md hover:scale-105 duration-200`}>
          {tech}
        </span>
      ))}
    </div>
  </motion.div>
)

export default TechnologiesList 