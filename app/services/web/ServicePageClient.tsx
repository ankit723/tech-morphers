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
          className="relative py-20 md:py-32 bg-gradient-to-r from-blue-800 to-blue-700 dark:from-[#0123FE] dark:to-[#03A0FF] text-white"
        >
          <div className="absolute inset-0 opacity-20"></div>
          <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Expert Web Development Services
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed">
              We craft modern, responsive, and high-performing websites and web applications. Our solutions are tailored to elevate your brand, engage your audience, and drive business growth using cutting-edge technologies.
            </p>
            <Link href="/contact" className="inline-block px-8 py-3 rounded-lg bg-white text-blue-600 dark:bg-gray-800 dark:text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform transform hover:shadow-xl">
              Start Your Web Project
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
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Our Web Development Features</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    className="flex items-start p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-[#0123FE] dark:to-[#03A0FF] mr-4 mt-1 flex items-center justify-center text-white font-bold">{i+1}</span>
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
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-10 text-center">Our Web Development Process</h2>
              <div className="relative">
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500 opacity-50"></div>
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    className={`mb-8 flex md:items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="hidden md:block w-1/2"></div>
                    <div className="md:w-1/2 w-full md:pl-8 pr-2 relative">
                        <div className={`md:hidden absolute top-0 bottom-0 ${index % 2 === 0 ? 'right-full mr-2' : 'left-full ml-2'} w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500 opacity-50`}></div>
                        <div className={`absolute -top-1.5 ${index % 2 === 0 ? 'md:right-[calc(50%+0.25rem)] md:mr-[-0.625rem]' : 'md:left-[calc(50%-0.25rem)] md:ml-[-0.625rem]'} right-full mr-[0.375rem] md:transform md:translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-[#0123FE] dark:to-[#03A0FF] ring-4 ring-white dark:ring-[#0D0D1F] shadow-md`}></div>
                        <div className="p-6 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-blue-600 dark:text-[#03A0FF] mb-2">{step.id}. {step.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                   </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Why Choose Us Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Why Choose Us for Web Development?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/innovative.svg" alt="Innovative Solutions" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-[#03A0FF] mb-2">Innovative Solutions</h3>
                    <p className="text-gray-600 dark:text-gray-300">We stay ahead of the curve, leveraging the latest trends and technologies to deliver future-proof web solutions that give you a competitive edge.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/user-centric.svg" alt="User-Centric Design" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-[#03A0FF] mb-2">User-Centric Design</h3>
                    <p className="text-gray-600 dark:text-gray-300">Our designs prioritize user experience, ensuring intuitive navigation, engaging interfaces, and seamless interactions that convert visitors into loyal customers.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/scalable.svg" alt="Scalable Architecture" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-[#03A0FF] mb-2">Scalable Architecture</h3>
                    <p className="text-gray-600 dark:text-gray-300">We build applications with robust and flexible architectures that can grow with your business, handling increased traffic and evolving functional needs effortlessly.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/support.svg" alt="Dedicated Support" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-[#03A0FF] mb-2">Dedicated Support</h3>
                    <p className="text-gray-600 dark:text-gray-300">Our commitment extends beyond launch. We offer ongoing support, maintenance, and strategic advice to ensure your long-term success and digital growth.</p>
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
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-[#101830] dark:to-[#102A30] rounded-xl shadow-xl"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Featured Web Project</h2>
              <div className="md:flex items-center gap-8">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <Image src="/images/placeholder-project-web.jpg" alt="Featured Web Project Thumbnail" width={500} height={350} className="rounded-lg shadow-lg object-cover w-full" />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-3">E-commerce Platform for a Growing Retailer</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    We developed a high-performance e-commerce website that boosted sales by 40% and improved customer engagement through a streamlined user experience and personalized features. The platform integrated advanced analytics and inventory management.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4"><strong>Key Technologies:</strong> Next.js, Stripe, Algolia Search, AWS</p>
                  <Link href="/case-study/project-name" className="inline-block px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-[#0123FE] dark:hover:bg-[#001CB3] text-white font-medium text-md shadow-md hover:scale-105 transition-transform transform">
                    View Case Study
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Technologies We Master Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Technologies We Master</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {technologies.map((tech, i) => (
                  <span key={i} className="px-5 py-2.5 bg-blue-100 text-blue-700 dark:bg-[#0123FE] dark:text-blue-100 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
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
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-6">Ready to Build Your Vision?</h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Let&apos;s transform your ideas into powerful web solutions. Get in touch today for a free consultation and let&apos;s discuss how we can help you achieve your digital goals and create an impactful online presence.
              </p>
              <Link href="/contact" className="inline-block px-10 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-[#0123FE] dark:to-[#03A0FF] text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Get a Free Quote
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