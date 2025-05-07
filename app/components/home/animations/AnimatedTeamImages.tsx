'use client'
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
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
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex space-x-4">
      {teamImages.map((src, index) => (
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === visibleIndex ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="w-16 rounded-full border-2 border-white overflow-hidden"
        >
          <Image
            src={src}
            alt={`Team member ${index}`}
            width={80}
            height={80}
            className="object-cover"
          />
        </motion.div>
      ))}
    </div>
  )
}


export default AnimatedTeamImages;