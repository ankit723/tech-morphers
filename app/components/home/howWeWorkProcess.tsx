import Process from '@/components/ui/process'
import React from 'react'
import SmallStar from '@/public/icons/smallStar.svg'
import Image from 'next/image'
import { motion } from 'framer-motion'

const HowWeWorkProcess = () => {
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className='relative my-20 overflow-hidden'>
        <div className='absolute -translate-x-12 bg-gradient-to-b from-blue-700 to-blue-800 h-[350vh] lg:h-[170vh] w-[250rem] -rotate-3 -z-10'></div>
        <div className='absolute top-50 left-20 z-10'>
            <Image src={SmallStar} alt='small star' width={37} height={36} className='w-[37px] h-[36px]' />
        </div>
       
        <div className='absolute top-100 right-40 z-10'>
            <Image src={SmallStar} alt='small star' width={37} height={36} className='w-[37px] h-[36px]' />
        </div>

        <div className='container mx-auto mt-40 text-white'>
            <motion.h1
                className='text-5xl font-bold text-center'
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.2 }}
                variants={variants}
                transition={{ duration: 0.5 }}
            >
                How We Work on Projects
            </motion.h1>
            <motion.p
                className='text-center text-sm text-gray-200 mt-3'
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.2 }}
                variants={variants}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                We follow a structured process to ensure the best possible outcome for our clients. <br /> We are a team of 10+ developers and designers who are dedicated to delivering the best possible experience and outcomes for our clients.
            </motion.p>
        </div>
        <div className="flex justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">

            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 items-center justify-center mt-20 gap-5 container mx-auto'>

                <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.2 }} variants={variants} transition={{ duration: 0.5 }}>
                    <Process id={"01"} title='Agreement Signing' description='We sign an agreement with the client to ensure that the project is completed on time and within budget.' lottie='/animations/agreementLottie.json' />
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.2 }} variants={variants} transition={{ duration: 0.5, delay: 0.1 }}>
                    <Process id={"02"} title='Onboarding' description='We onboard the client to ensure that they understand the process and the expectations.' lottie='/animations/onboardingLottie.json' />
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.2 }} variants={variants} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Process id={"03"} title='Design & Development' description='We design and develop the client&apos;s website to ensure that it is functional and aesthetically pleasing.' lottie='/animations/developmentLottie.json' />
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.2 }} variants={variants} transition={{ duration: 0.5, delay: 0.3 }}>
                    <Process id={"04"} title='Review & Revisions' description='We review the client&apos;s website to ensure that it is functional and aesthetically pleasing.' lottie='/animations/reviewLottie.json' />
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.2 }} variants={variants} transition={{ duration: 0.5, delay: 0.4 }}>
                    <Process id={"05"} title='Deployment' description='We deploy the client&apos;s website to ensure that it is functional and aesthetically pleasing.' lottie='/animations/deployLottie.json' />
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ amount: 0.2 }} variants={variants} transition={{ duration: 0.5, delay: 0.5 }}>
                    <Process id={"06"} title='Maintenance' description='We maintain the client&apos;s website to ensure that it is functional and aesthetically pleasing.' lottie='/animations/maintainLottie.json' />
                </motion.div>
            </div>
        </div>
    </div>
  )
}

export default HowWeWorkProcess