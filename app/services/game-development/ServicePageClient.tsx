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
          className="relative py-20 md:py-32 bg-gradient-to-r from-green-400 to-blue-300 dark:from-[#00E187] dark:to-[#00A3E0] text-white"
        >
          <div className="absolute inset-0 opacity-20"></div>
          <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Immersive Game Development Services
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed">
              We craft engaging and immersive games that captivate players and bring your unique visions to life. Our expert team utilizes the latest game development tools and technologies across various platforms.
            </p>
            <Link href="/contact" className="inline-block px-8 py-3 rounded-lg bg-white text-green-600 dark:bg-gray-800 dark:text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform transform hover:shadow-xl">
              Level Up Your Game Idea
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
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Our Game Development Capabilities</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    className="flex items-start p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-blue-300 dark:from-[#00E187] dark:to-[#00A3E0] mr-4 mt-1 flex items-center justify-center text-white font-bold">{i+1}</span>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-2">{feature.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Our Game Development Lifecycle Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}
              className="mb-16 md:mb-20"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-10 text-center">Our Game Development Lifecycle</h2>
              <div className="relative">
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-green-400 to-blue-300 opacity-50"></div>
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    className={`mb-8 flex md:items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="hidden md:block w-1/2"></div>
                    <div className="md:w-1/2 w-full md:pl-8 pr-2 relative">
                        <div className={`md:hidden absolute top-0 bottom-0 ${index % 2 === 0 ? 'right-full mr-2' : 'left-full ml-2'} w-0.5 bg-gradient-to-b from-green-400 to-blue-300 opacity-50`}></div>
                        <div className={`absolute -top-1.5 ${index % 2 === 0 ? 'md:right-[calc(50%+0.25rem)] md:mr-[-0.625rem]' : 'md:left-[calc(50%-0.25rem)] md:ml-[-0.625rem]'} right-full mr-[0.375rem] md:transform md:translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-300 dark:from-[#00E187] dark:to-[#00A3E0] ring-4 ring-white dark:ring-[#0D0D1F] shadow-md`}></div>
                        <div className="p-6 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-green-500 dark:text-[#00E187] mb-2">{step.id}. {step.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                   </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Why Develop Your Game With Us Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Why Develop Your Game With Us?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/creative-excellence.svg" alt="Creative Excellence" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-500 dark:text-[#00E187] mb-2">Creative Excellence</h3>
                    <p className="text-gray-600 dark:text-gray-300">Our passion for gaming drives us to create innovative, fun, and memorable game experiences that players will love and share.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/technical-proficiency.svg" alt="Technical Proficiency" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-500 dark:text-[#00E187] mb-2">Technical Proficiency</h3>
                    <p className="text-gray-600 dark:text-gray-300">Deep expertise in leading game engines (Unity, Unreal) and cutting-edge technologies to build robust, optimized, and polished games.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/cross-platform-game.svg" alt="Cross-Platform Reach" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-500 dark:text-[#00E187] mb-2">Cross-Platform Reach</h3>
                    <p className="text-gray-600 dark:text-gray-300">We develop games for PC, consoles (PlayStation, Xbox, Switch), mobile (iOS, Android), and VR/AR, maximizing your games&apos; audience potential.</p>
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-[#0D0D1F] rounded-lg shadow-md flex items-start">
                  <Image src="/icons/collaborative-process-game.svg" alt="Collaborative Process" width={48} height={48} className="mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-500 dark:text-[#00E187] mb-2">Collaborative Process</h3>
                    <p className="text-gray-600 dark:text-gray-300">We believe in transparent communication and work closely with you throughout the development cycle, ensuring your vision is realized at every stage.</p>
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
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-[#102A20] dark:to-[#102030] rounded-xl shadow-xl"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Featured Game Project</h2>
              <div className="md:flex items-center gap-8">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <Image src="/images/placeholder-project-game.jpg" alt="Featured Game Project Thumbnail" width={500} height={350} className="rounded-lg shadow-lg object-cover w-full" />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-3">Chronicles of Aethel: A Fantasy RPG</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    We partnered to create an open-world RPG featuring a rich storyline, dynamic combat system, and stunning visuals. The game received critical acclaim for its immersive world and engaging quests, achieving over 500,000 downloads in its first year.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4"><strong>Key Features:</strong> Open World, Quest System, Character Customization, Multiplayer Co-op</p>
                  <Link href="/case-study/game-project-name" className="inline-block px-6 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 dark:bg-[#00E187] dark:hover:bg-[#00C070] text-white font-medium text-md shadow-md hover:scale-105 transition-transform transform">
                    View Case Study
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Game Development Technologies Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mb-16 md:mb-20 p-6 md:p-8 bg-gray-50 dark:bg-[#12122A] rounded-xl shadow-lg"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Game Development Technologies</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {technologies.map((tech, i) => (
                  <span key={i} className="px-5 py-2.5 bg-green-100 text-green-700 dark:bg-[#00A3E0] dark:text-green-50 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
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
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white mb-6">Ready to Create the Next Hit Game?</h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Partner with our expert game developers to transform your dream game into a reality. Contact us today to discuss your game concept, and let&apos;s build something extraordinary together.
              </p>
              <Link href="/contact" className="inline-block px-10 py-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-300 dark:from-[#00E187] dark:to-[#00A3E0] text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Start Your Game Project
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