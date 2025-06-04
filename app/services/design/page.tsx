'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  SiFigma,
  SiAdobexd,
  SiSketch,
  SiInvision,
  SiFramer
} from 'react-icons/si';

const UIUXDesign = () => {
  const features = [
    {
      title: "User Research",
      description: "Understanding your users' needs, behaviors, and pain points.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: "Interface Design",
      description: "Creating beautiful and intuitive user interfaces that delight.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      title: "User Experience",
      description: "Designing seamless interactions and user journeys.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Design Systems",
      description: "Building scalable and consistent design systems.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
  ];

  const tools = [
    { 
      name: "Figma",
      icon: <SiFigma className="w-16 h-16 text-[#F24E1E]" />
    },
    { 
      name: "Adobe XD",
      icon: <SiAdobexd className="w-16 h-16 text-[#FF61F6]" />
    },
    { 
      name: "Sketch",
      icon: <SiSketch className="w-16 h-16 text-[#F7B500]" />
    },
    { 
      name: "InVision",
      icon: <SiInvision className="w-16 h-16 text-[#FF3366]" />
    },
    { 
      name: "Framer",
      icon: <SiFramer className="w-16 h-16 text-[#0055FF]" />
    }
  ];

  const processSteps = [
    {
      title: "Research",
      description: "Understanding users and business requirements through research.",
      number: "01",
    },
    {
      title: "Wireframes",
      description: "Creating low-fidelity layouts and user flows.",
      number: "02",
    },
    {
      title: "Visual Design",
      description: "Developing the visual language and UI components.",
      number: "03",
    },
    {
      title: "Prototyping",
      description: "Building interactive prototypes for testing and validation.",
      number: "04",
    },
    {
      title: "Handoff",
      description: "Preparing design assets and documentation for development.",
      number: "05",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r dark:from-[#0A0A1B] dark:to-[#1A1A35] from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              UI/UX <span className="text-pink-600">Design</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We create beautiful, intuitive, and user-centered digital experiences that drive engagement and satisfaction.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="text-pink-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Design Tools */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Design Tools We Use
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We work with industry-standard tools to deliver exceptional designs.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center group hover:scale-110 transition-transform duration-200"
              >
                <div className="mb-4">
                  {tool.icon}
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-center">
                  {tool.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Design Process */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Design Process
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              A user-centered approach to creating meaningful digital experiences.
            </p>
          </motion.div>

          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-8"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Digital Experience?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let&apos;s collaborate to create designs that not only look stunning but also perform exceptionally, driving user satisfaction and business growth. Contact us for a consultation on your UI/UX design needs.
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Start Your Project
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default UIUXDesign; 