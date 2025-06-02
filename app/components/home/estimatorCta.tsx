import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const EstimatorCta = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center']
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.05])

  return (
    <motion.div 
      ref={sectionRef}
      className="container mx-auto mt-40 p-4"
      style={{ scale:scale }}
    >
        <div className="w-full flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-600 p-8 md:p-12 rounded-3xl shadow-2xl">
            <div className="flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0 md:mr-8 animate-fadeInLeft">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">Confused About The Budget?</h1>
                <p className="text-blue-100 text-lg lg:text-xl">Try Our Free AI Estimator Tool!</p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg px-14 py-7 text-lg rounded-lg mt-10 cursor-pointer font-bold">
                    <Link href="/estimator">
                        Try It Out
                    </Link>
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center text-center animate-fadeInRight">
              <video src="/home/growth.mp4" autoPlay muted loop className="w-60 h-60 object-cover rounded-3xl" />
            </div>
        </div>
    </motion.div>
  )
}

export default EstimatorCta