import Image from 'next/image'
import { motion } from 'framer-motion'

const Project = ({
  imgUrl,
  category,
  title,
  description,
  link,
}: {
  imgUrl: string
  category: string
  title: string
  description: string
  link: string
}) => {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="block rounded-2xl overflow-hidden shadow-md bg-[#f4f6f9] hover:shadow-xl transition-all duration-300 p-4 w-[24rem] border border-gray-200 group"
    >
      {/* Image Reveal Section */}
      <div className="relative w-full h-52 rounded-xl overflow-hidden mb-4">
        {/* Hover Image Overlay */}
        <Image
          src={imgUrl}
          alt={`${title} image 2`}
          fill
          className="object-cover absolute top-0 left-0 transition-all duration-500 group-hover:scale-110"
        />
      </div>

      {/* Text Content */}
      <div className="space-y-2 bg-white rounded-xl px-3 py-4">
        <p className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200">
          {category}
        </p>
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </div>
    </motion.a>
  )
}

export default Project
