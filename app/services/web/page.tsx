'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Code2, 
  ShoppingBag, 
  Smartphone, 
  Webhook, 
  Globe2, 
  Cloud, 
  Figma, 
  GitBranch,
  Boxes,
  FileCode2,
  Server,
  FileType,
  Database,
  TableProperties,
  Binary,
  Frame,
  Dock,
  CloudCog,
  Cpu,
  Hexagon,
  Paintbrush,
  Layers,
  CircleSlash2,
  Flame,
  Container,
  Settings2
} from 'lucide-react';
import { 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiTypescript, 
  SiMongodb, 
  SiPostgresql,
  SiPython,
  SiDjango,
  SiDocker,
  SiAmazon,
  SiRedis,
  SiGraphql,
  SiTailwindcss,
  SiVuedotjs,
  SiAngular,
  SiFirebase,
  SiKubernetes,
  SiJenkins
} from 'react-icons/si';

const WebDevelopment = () => {
  const features = [
    {
      title: "Custom Web Applications",
      description: "Tailored solutions built from the ground up to meet your specific business needs.",
      icon: <Code2 className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "E-commerce Solutions",
      description: "Powerful online stores with secure payment gateways and inventory management.",
      icon: <ShoppingBag className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Progressive Web Apps",
      description: "Fast, reliable, and engaging web applications that work offline.",
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "API Development",
      description: "Robust and scalable APIs that power your digital ecosystem.",
      icon: <Webhook className="w-6 h-6 text-blue-600" />,
    },
  ];

  const technologies = [
    { 
      name: "React",
      icon: <SiReact className="w-16 h-16 text-[#61DAFB]" />
    },
    { 
      name: "Next.js",
      icon: <SiNextdotjs className="w-16 h-16 text-black dark:text-white" />
    },
    { 
      name: "Node.js",
      icon: <SiNodedotjs className="w-16 h-16 text-[#339933]" />
    },
    { 
      name: "TypeScript",
      icon: <SiTypescript className="w-16 h-16 text-[#3178C6]" />
    },
    { 
      name: "MongoDB",
      icon: <SiMongodb className="w-16 h-16 text-[#47A248]" />
    },
    { 
      name: "PostgreSQL",
      icon: <SiPostgresql className="w-16 h-16 text-[#4169E1]" />
    },
    { 
      name: "Python",
      icon: <SiPython className="w-16 h-16 text-[#3776AB]" />
    },
    { 
      name: "Django",
      icon: <SiDjango className="w-16 h-16 text-[#092E20]" />
    },
    { 
      name: "Docker",
      icon: <SiDocker className="w-16 h-16 text-[#2496ED]" />
    },
    { 
      name: "AWS",
      icon: <SiAmazon className="w-16 h-16 text-[#FF9900]" />
    },
    { 
      name: "Redis",
      icon: <SiRedis className="w-16 h-16 text-[#DC382D]" />
    },
    { 
      name: "GraphQL",
      icon: <SiGraphql className="w-16 h-16 text-[#E10098]" />
    },
    { 
      name: "Tailwind CSS",
      icon: <SiTailwindcss className="w-16 h-16 text-[#06B6D4]" />
    },
    { 
      name: "Vue.js",
      icon: <SiVuedotjs className="w-16 h-16 text-[#4FC08D]" />
    },
    { 
      name: "Angular",
      icon: <SiAngular className="w-16 h-16 text-[#DD0031]" />
    },
    { 
      name: "Firebase",
      icon: <SiFirebase className="w-16 h-16 text-[#FFCA28]" />
    },
    { 
      name: "Kubernetes",
      icon: <SiKubernetes className="w-16 h-16 text-[#326CE5]" />
    },
    { 
      name: "Jenkins",
      icon: <SiJenkins className="w-16 h-16 text-[#D24939]" />
    }
  ];

  const processSteps = [
    {
      title: "Discovery",
      description: "We analyze your requirements and create a detailed project roadmap.",
      number: "01",
      icon: <Globe2 className="w-6 h-6 text-white" />
    },
    {
      title: "Design",
      description: "Our designers create wireframes and visual designs for your approval.",
      number: "02",
      icon: <Figma className="w-6 h-6 text-white" />
    },
    {
      title: "Development",
      description: "We build your application using the latest technologies and best practices.",
      number: "03",
      icon: <Code2 className="w-6 h-6 text-white" />
    },
    {
      title: "Testing",
      description: "Rigorous testing ensures your application is bug-free and performs well.",
      number: "04",
      icon: <GitBranch className="w-6 h-6 text-white" />
    },
    {
      title: "Deployment",
      description: "We deploy your application and provide ongoing support and maintenance.",
      number: "05",
      icon: <Cloud className="w-6 h-6 text-white" />
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
              Web Development <span className="text-blue-600">Services</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We build modern, scalable, and secure web applications that help businesses grow and succeed in the digital world.
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
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Technologies */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Technologies We Use
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We work with the latest and most powerful technologies to deliver exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center group hover:scale-110 transition-transform duration-200"
              >
                <div className="mb-4">
                  {tech.icon}
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-center">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Development Process */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Development Process
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              A structured approach to delivering high-quality web solutions.
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
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  {step.icon}
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
            Ready to Start Your Web Project?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let&apos;s transform your ideas into powerful web solutions. Get in touch today for a free consultation and let&apos;s discuss how we can help you achieve your digital goals and create an impactful online presence.
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default WebDevelopment; 