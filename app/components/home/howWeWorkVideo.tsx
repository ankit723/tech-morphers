import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import React, { useRef } from 'react'

const HowWeWorkVideo = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 50%", "end 50%"]
    });

    const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05])

  return (
    <motion.div ref={sectionRef} className='container mx-auto my-20 relative'
        style={{
            scale: headerScale
        }}
    >
        <div className="container mx-auto flex justify-center items-center relative">
            <Image src="/home/playButton.png" alt="How We Work" width={200} height={200} className='absolute right-10 top-5 -translate-y-1/5 active:scale-90 transition-all duration-300'/>
            <div className="bg-gray-200 rounded-4xl p-4 h-[70vh] w-[70vw] flex justify-center items-center">
                <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold'>How We Work</h1>
            </div>
        </div>
    </motion.div>
  )
}

export default HowWeWorkVideo