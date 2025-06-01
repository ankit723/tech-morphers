import TestimonialsSlider from '@/components/testimonial-slider'
import { Button } from '@/components/ui/button'
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const Testimonials = () => {
  const ref1 = useRef(null)
  const isInView1 = useInView(ref1, { once: true })

  const ref2 = useRef(null)
  const isInView2 = useInView(ref2, { once: true })

  const ref3 = useRef(null)
  const isInView3 = useInView(ref3, { once: true })

  const ref4 = useRef(null)
  const isInView4 = useInView(ref4, { once: true })


  const variants = {
    hiddenLeft: { opacity: 0, x: -100 },
    hiddenRight: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <>
      <TestimonialsSlider />
      <div className='mx-auto'>
        <motion.div
          ref={ref1}
          initial="hiddenLeft"
          animate={isInView1 ? 'visible' : 'hiddenLeft'}
          variants={variants}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-20 justify-center"
        >
          <h1 className='text-7xl font-bold'>Innovate</h1>
          <h1 className='text-6xl font-bold text-green-400'>✦</h1>
          <h1 className='text-7xl font-bold'>Inspire</h1>
          <h1 className='text-6xl font-bold text-green-400'>✦</h1>
          <h1 className='text-7xl font-bold'>Create</h1>
        </motion.div>
        <motion.div
          ref={ref2}
          initial="hiddenRight"
          animate={isInView2 ? 'visible' : 'hiddenRight'}
          variants={variants}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center items-center gap-10 container mx-auto my-10"
        >
          <hr className='w-1/2 border-black dark:border-white border-2' />
          <h1 className='text-6xl font-bold text-green-400'>✦</h1>
          <hr className='w-1/2 border-black dark:border-white border-2' />
        </motion.div>

        <motion.div
          ref={ref3}
          initial="hiddenLeft"
          animate={isInView3 ? 'visible' : 'hiddenLeft'}
          variants={variants}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center items-center gap-10 container mx-auto my-10"
        >
          <p className='text-lg text-center max-w-7xl'>
            At Tech Morphers, we don&apos;t just build software — we engineer digital experiences.
            From idea to execution, we partner with visionary founders and fast-growing businesses to bring powerful, scalable, and beautifully designed products to life. Whether it&apos;s a rapid MVP, a high-performance web app, or a complete digital transformation, we deliver with speed, clarity, and craftsmanship. With a team obsessed with quality, and a process that prioritizes transparency, collaboration, and premium experience, Tech Morphers stands at the intersection of innovation and reliability. We&apos;re not another dev shop — we&apos;re your growth-focused tech partner.
          </p>
        </motion.div>
        <motion.div
          ref={ref4}
          initial="hiddenRight"
          animate={isInView4 ? 'visible' : 'hiddenRight'}
          variants={variants}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center items-center gap-10 container mx-auto my-10"
        >
          <Button variant="default" className='rounded-full bg-blue-700 text-white px-10 py-7'>
            Start Onboarding Process
          </Button>

          <Button variant="outline" className='rounded-full text-blue-700 border-blue-700 px-10 py-7'>
            View An Estimate
          </Button>
        </motion.div>
      </div>
    </>
  )
}

export default Testimonials