// // components/ScrollAnimatedText.tsx
// 'use client'
// import { useScroll, useTransform, useSpring } from 'framer-motion'
// import { motion } from 'framer-motion'

// interface ScrollAnimatedTextProps {
//   text: string
//   className?: string
// }

// const ScrollAnimatedText: React.FC<ScrollAnimatedTextProps> = ({ text, className = '' }) => {
//   const { scrollY } = useScroll()
//   const yRange = useTransform(scrollY, [0, 300], [-30, 100])
//   const ySmooth = useSpring(yRange, {
//     stiffness: 100,
//     damping: 20,
//     mass: 0.5,
//   })

//   return (
//     <motion.div
//       className={`font-bold ${className}`}
//       style={{ y: ySmooth }}
//     >
//       {text}
//     </motion.div>
//   )
// }

// export default ScrollAnimatedText

'use client'
import { useEffect, useState } from 'react'
import { useScroll, useTransform, useSpring } from 'framer-motion'
import { motion } from 'framer-motion'

interface ScrollAnimatedTextProps {
  text: string
  className?: string
}

const ScrollAnimatedText: React.FC<ScrollAnimatedTextProps> = ({ text, className = '' }) => {
  const { scrollY } = useScroll()

  const [range, setRange] = useState<[number, number]>([-30, 100])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      if (width < 1024) {
        setRange([-10, 20]) // small screens
      } else {
        setRange([-30, 70]) // large screens
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const yRange = useTransform(scrollY, [0, 300], range)
  const ySmooth = useSpring(yRange, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  })

  return (
    <motion.div
      className={`font-bold ${className}`}
      style={{ y: ySmooth }}
    >
      {text}
    </motion.div>
  )
}

export default ScrollAnimatedText
