'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface ProcessStep {
  id: number
  title: string
  description: string
}

interface ProcessTimelineProps {
  steps: ProcessStep[]
  gradientClass: string
  title: string
  stepColorClass: string
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ steps, gradientClass, title, stepColorClass }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}
    className="mb-20 p-8 bg-white/10 dark:bg-[#12122A]/60 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 dark:border-[#1A1A35]/30"
  >
    <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-10 text-center tracking-tight drop-shadow-lg">
      {title}
    </h2>
    <div className="relative">
      <div className={`hidden md:block absolute top-0 bottom-0 left-1/2 w-1.5 ${gradientClass} opacity-60 blur-[2px] animate-gradient-x rounded-full shadow-lg`} />
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          className={`mb-10 flex md:items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        >
          <div className="hidden md:block w-1/2"></div>
          <div className="md:w-1/2 w-full md:pl-8 pr-2 relative">
            <div className={`md:hidden absolute top-0 bottom-0 ${index % 2 === 0 ? 'right-full mr-2' : 'left-full ml-2'} w-1.5 ${gradientClass} opacity-60 blur-[2px] animate-gradient-x rounded-full shadow-lg`} />
            <div className={`absolute -top-2 ${index % 2 === 0 ? 'md:right-[calc(50%+0.25rem)] md:mr-[-0.625rem]' : 'md:left-[calc(50%-0.25rem)] md:ml-[-0.625rem]'} right-full mr-[0.375rem] md:transform md:translate-x-1/2 w-7 h-7 rounded-full ${gradientClass} ${stepColorClass} ring-4 ring-white/60 dark:ring-[#0D0D1F]/80 shadow-xl border-2 border-white/30 dark:border-[#1A1A35]/30 animate-pulse`} />
            <div className="p-8 bg-white/70 dark:bg-[#0D0D1F]/80 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-white/30 dark:border-[#1A1A35]/40">
              <h3 className={`text-2xl font-bold mb-2 ${stepColorClass} tracking-tight`}>{step.id}. {step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium">{step.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
)

export default ProcessTimeline 