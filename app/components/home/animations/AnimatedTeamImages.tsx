'use client'

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const teamImages = [
  "/home/elipse.png",
  "/home/Ellipse96.png",
  "/home/Ellipse97.png",
  "/home/Ellipse98.png",
]

const AnimatedTeamImages = () => {
  const [visibleIndex, setVisibleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % teamImages.length)
    }, 2000) // slowed down for better visual clarity
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative w-20 h-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={teamImages[visibleIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 rounded-full border-2 border-white overflow-hidden"
        >
          <Image
            src={teamImages[visibleIndex]}
            alt={`Team member ${visibleIndex + 1}`}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </motion.div>
      </AnimatePresence>
    </main>
  )
}

export default AnimatedTeamImages
