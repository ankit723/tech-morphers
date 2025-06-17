'use client'
import { motion } from "framer-motion";
import Image from "next/image";

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-blue-600">Tech Morphers</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We are a team of passionate developers, designers, and innovators dedicated to transforming ideas into powerful digital solutions.
          </p>
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Innovation",
                description: "We push boundaries and embrace new technologies to deliver cutting-edge solutions.",
                icon: "🚀",
              },
              {
                title: "Quality",
                description: "We maintain the highest standards in every project we undertake.",
                icon: "⭐",
              },
              {
                title: "Collaboration",
                description: "We work closely with our clients to ensure their vision becomes reality.",
                icon: "🤝",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Team
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet the talented individuals who make Tech Morphers possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "John Doe",
                role: "CEO & Founder",
                image: "/team/placeholder.jpg",
              },
              {
                name: "Jane Smith",
                role: "Lead Designer",
                image: "/team/placeholder.jpg",
              },
              {
                name: "Mike Johnson",
                role: "Tech Lead",
                image: "/team/placeholder.jpg",
              },
              {
                name: "Sarah Williams",
                role: "Project Manager",
                image: "/team/placeholder.jpg",
              },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to start your project?
          </h2>
          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get in Touch
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs; 