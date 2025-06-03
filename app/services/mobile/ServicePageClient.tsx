'use client'
import React from 'react'
import Link from 'next/link'
import Navbar from '../../components/home/navbar'
import Footer from '../../components/home/footer'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Feature {
  name: string
  description: string
}
interface ProcessStep {
  id: number
  title: string
  description: string
}

export default function ServicePageClient({
  features,
  technologies,
  processSteps
}: {
  features: Feature[]
  technologies: string[]
  processSteps: ProcessStep[]
}) {
  return (
    <div className="bg-white dark:bg-[#0D0D1F]">
      <Navbar />
      <main className='mt-20'>
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative py-20 md:py-32 bg-gradient-to-r from-pink-500 to-purple-500 dark:from-[#FF5B94] dark:to-[#8441A4] text-white"
        >
          <div className="absolute inset-0 opacity-20"></div>
          <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Innovative Mobile App Development
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed">
              We develop native and cross-platform mobile applications that deliver exceptional user experiences, drive engagement, and connect your business with users on the go, wherever they are.
            </p>
            <Link href="/contact" className="inline-block px-8 py-3 rounded-lg bg-white text-pink-600 dark:bg-gray-800 dark:text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform transform hover:shadow-xl">
              Discuss Your App Idea
            </Link>
          </div>
        </motion.section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            {/* Features Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } } }}
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Our Mobile Development Expertise</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    className="flex items-start p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 dark:from-[#FF5B94] dark:to-[#8441A4] mr-4 mt-1 flex items-center justify-center text-white font-bold">{i+1}</span>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-2">{feature.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Our Process Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}
              className="mb-16 md:mb-20"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-10 text-center">Our Mobile App Development Journey</h2>
              <div className="relative">
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-pink-500 to-purple-500 opacity-50"></div>
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    className={`mb-8 flex md:items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="hidden md:block w-1/2"></div>
                    <div className="md:w-1/2 w-full md:pl-8 pr-2 relative">
                        <div className={`md:hidden absolute top-0 bottom-0 ${index % 2 === 0 ? 'right-full mr-2' : 'left-full ml-2'} w-0.5 bg-gradient-to-b from-pink-500 to-purple-500 opacity-50`}></div>
                        <div className={`absolute -top-1.5 ${index % 2 === 0 ? 'md:right-[calc(50%+0.25rem)] md:mr-[-0.625rem]' : 'md:left-[calc(50%-0.25rem)] md:ml-[-0.625rem]'} right-full mr-[0.375rem] md:transform md:translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 dark:from-[#FF5B94] dark:to-[#8441A4] ring-4 ring-white dark:ring-[#0D0D1F] shadow-md`}></div>
                        <div className="p-6 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-pink-600 dark:text-[#FF5B94] mb-2">{step.id}. {step.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                   </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Why Partner With Us Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Why Partner With Us for Mobile Apps?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/performance-driven.svg" alt="Performance-Driven" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-pink-600 dark:text-[#FF5B94] mb-2">Performance-Driven</h3>
                    <p className="text-gray-600 dark:text-gray-300">We focus on creating fast, responsive, and reliable mobile apps that perform flawlessly and provide a smooth user experience on all target devices.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/engaging-ui-mobile.svg" alt="Engaging User Interfaces" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-pink-600 dark:text-[#FF5B94] mb-2">Engaging User Interfaces</h3>
                    <p className="text-gray-600 dark:text-gray-300">Our designs are intuitive, visually appealing, and user-tested, ensuring users love interacting with your app and achieve their goals effortlessly.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/cross-platform-mobile.svg" alt="Cross-Platform Efficiency" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-pink-600 dark:text-[#FF5B94] mb-2">Cross-Platform Efficiency</h3>
                    <p className="text-gray-600 dark:text-gray-300">Reach a wider audience with cost-effective cross-platform solutions using React Native or Flutter, without compromising on quality or native performance.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/full-cycle-dev.svg" alt="Full-Cycle Development" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-pink-600 dark:text-[#FF5B94] mb-2">Full-Cycle Development</h3>
                    <p className="text-gray-600 dark:text-gray-300">From initial ideation and strategic planning to design, development, rigorous testing, app store deployment, and ongoing support, we cover the entire app lifecycle.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Featured Project Snippet Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-[#2A102A] dark:to-[#1A1030] rounded-xl shadow-xl"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Featured Mobile App Project</h2>
              <div className="md:flex items-center gap-8">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <Image src="/images/placeholder-project-mobile.jpg" alt="Featured Mobile App Thumbnail" width={500} height={350} className="rounded-lg shadow-lg object-cover w-full" />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-pink-700 dark:text-pink-400 mb-3">Social Networking App for Niche Communities</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    We built a highly engaging social networking app for iOS and Android, fostering connections within specialized interest groups. The app featured real-time chat, event management, and content sharing, resulting in rapid user adoption.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4"><strong>Key Technologies:</strong> React Native, Firebase, Push Notifications, Cloud Functions</p>
                  <Link href="/case-study/mobile-project-name" className="inline-block px-6 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-700 dark:bg-[#FF5B94] dark:hover:bg-[#E0427A] text-white font-medium text-md shadow-md hover:scale-105 transition-transform transform">
                    View Case Study
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Mobile Technologies We Utilize Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Mobile Technologies We Utilize</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {technologies.map((tech, i) => (
                  <span key={i} className="px-5 py-2.5 bg-pink-100 text-pink-700 dark:bg-[#8441A4] dark:text-pink-100 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Call to Action Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center py-10"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-6">Bring Your App Idea to Life!</h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Have a groundbreaking app idea? Let&apos;s discuss how our mobile development expertise can turn your vision into a successful, engaging, and high-performing mobile application.
              </p>
              <Link href="/contact" className="inline-block px-10 py-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 dark:from-[#FF5B94] dark:to-[#8441A4] text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                Start Your Mobile Project
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <div className="relative mt-[50rem]">
        <Footer />
      </div>
    </div>
  )
} 