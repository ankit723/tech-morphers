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
  tools,
  processSteps
}: {
  features: Feature[]
  tools: string[]
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
          className="relative py-20 md:py-32 bg-gradient-to-r from-red-300 to-orange-200 dark:from-[#FF9A9E] dark:to-[#FAD0C4] text-gray-800 dark:text-white"
        >
          <div className="absolute inset-0 opacity-20"></div>
          <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              User-Centric UI/UX Design Services
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed">
              We create intuitive, engaging, and aesthetically pleasing user interfaces (UI) and user experiences (UX) that enhance user satisfaction, drive adoption, and achieve your business objectives through thoughtful design.
            </p>
            <Link href="/contact" className="inline-block px-8 py-3 rounded-lg bg-white text-red-500 dark:bg-gray-800 dark:text-gray-100 font-semibold text-lg shadow-lg hover:scale-105 transition-transform transform hover:shadow-xl">
              Transform Your User Experience
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
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Our Core UI/UX Design Offerings</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    className="flex items-start p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-red-300 to-orange-200 dark:from-[#FF9A9E] dark:to-[#FAD0C4] mr-4 mt-1 flex items-center justify-center text-gray-700 dark:text-gray-800 font-bold">{i+1}</span>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-2">{feature.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Our Design Process Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}
              className="mb-16 md:mb-20"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-10 text-center">Our Design Thinking Process</h2>
              <div className="relative">
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-red-300 to-orange-200 opacity-50"></div>
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    className={`mb-8 flex md:items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="hidden md:block w-1/2"></div>
                    <div className="md:w-1/2 w-full md:pl-8 pr-2 relative">
                        <div className={`md:hidden absolute top-0 bottom-0 ${index % 2 === 0 ? 'right-full mr-2' : 'left-full ml-2'} w-0.5 bg-gradient-to-b from-red-300 to-orange-200 opacity-50`}></div>
                        <div className={`absolute -top-1.5 ${index % 2 === 0 ? 'md:right-[calc(50%+0.25rem)] md:mr-[-0.625rem]' : 'md:left-[calc(50%-0.25rem)] md:ml-[-0.625rem]'} right-full mr-[0.375rem] md:transform md:translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-red-300 to-orange-200 dark:from-[#FF9A9E] dark:to-[#FAD0C4] ring-4 ring-white dark:ring-[#0D0D1F] shadow-md`}></div>
                        <div className="p-6 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-red-500 dark:text-[#FF9A9E] mb-2">{step.id}. {step.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                   </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Why Invest in Our UI/UX Design Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Why Invest in Our UI/UX Design?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/user-satisfaction.svg" alt="Enhanced User Satisfaction" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-red-500 dark:text-[#FF9A9E] mb-2">Enhanced User Satisfaction</h3>
                    <p className="text-gray-600 dark:text-gray-300">Intuitive and enjoyable designs lead to happier users, increased loyalty, positive word-of-mouth, and reduced churn.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/conversion-rates.svg" alt="Improved Conversion Rates" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-red-500 dark:text-[#FF9A9E] mb-2">Improved Conversion Rates</h3>
                    <p className="text-gray-600 dark:text-gray-300">A seamless and persuasive UX guides users effectively towards desired actions, leading to higher conversion rates and better ROI.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/reduced-costs.svg" alt="Reduced Development Costs" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-red-500 dark:text-[#FF9A9E] mb-2">Reduced Development Costs</h3>
                    <p className="text-gray-600 dark:text-gray-300">Thorough design, prototyping, and user testing upfront minimize costly scope changes and revisions during the development phase.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/brand-identity.svg" alt="Stronger Brand Identity" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-red-500 dark:text-[#FF9A9E] mb-2">Stronger Brand Identity</h3>
                    <p className="text-gray-600 dark:text-gray-300">Consistent, appealing, and memorable design reinforces your brand values, builds recognition, and fosters trust with your audience.</p>
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
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-[#2A1818] dark:to-[#2A2018] rounded-xl shadow-xl"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Featured Design Project</h2>
              <div className="md:flex items-center gap-8">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <Image src="/images/placeholder-project-design.jpg" alt="Featured Design Project Thumbnail" width={500} height={350} className="rounded-lg shadow-lg object-cover w-full" />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Redesign of a SaaS Analytics Dashboard</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    We revamped a complex SaaS dashboard, focusing on data visualization and task efficiency. The redesign led to a 25% increase in user engagement and a significant reduction in support tickets related to usability.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4"><strong>Key Focus:</strong> Information Architecture, Interactive Prototyping, Data Visualization</p>
                  <Link href="/case-study/design-project-name" className="inline-block px-6 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-[#FF9A9E] dark:hover:bg-[#E07A7E] text-white font-medium text-md shadow-md hover:scale-105 transition-transform transform">
                    View Case Study
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Design Tools We Leverage Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Design Tools We Leverage</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {tools.map((tool, i) => (
                  <span key={i} className="px-5 py-2.5 bg-red-100 text-red-700 dark:bg-[#FAD0C4] dark:text-red-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                    {tool}
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
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-6">Ready to Elevate Your User Experience?</h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Let&apos;s collaborate to create designs that not only look stunning but also perform exceptionally, driving user satisfaction and business growth. Contact us for a consultation on your UI/UX design needs.
              </p>
              <Link href="/contact" className="inline-block px-10 py-4 rounded-lg bg-gradient-to-r from-red-400 to-orange-300 dark:from-[#FF9A9E] dark:to-[#FAD0C4] text-white dark:text-gray-800 font-semibold text-lg shadow-lg hover:scale-105 transition-transform transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400">
                Discuss Your Design Project
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