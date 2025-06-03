"use client"

import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import Image from "next/image"

interface Testimonial {
  id: number
  name: string
  title: string
  company: string
  content: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mrinmai Sharma",
    title: "CTO of Arbre Creations",
    company: "Arbre Creations",
    content:
      "Working with tech morphers has been an incredible experience. They truly listened to our needs and delivered a stunning design that exceeded our expectations. We couldn't be happier with the product!",
    avatar: "/company-logo/arbre.jpeg",
  },
  {
    id: 2,
    name: "Aashay Kapoor",
    title: "CEO of Aashay Creations",
    company: "Creova",
    content:
      "From start to finish, working with Redbird was an amazing experience. They were professional, creative, and went above and beyond. We're thrilled to be working with them again in the future!",
    avatar: "/company-logo/creova.svg",
  },
  {
    id: 3,
    name: "Anik Adhikari",
    title: "CEO of Iotron",
    company: "Iotron",
    content:
      "A pleasure to work with. They were provided valuable insights that we highly recommend them to any business looking for solutions.",
    avatar: "/company-logo/iotron.jpeg",
  },
  {
    id: 4,
    name: "Jayesh Shinde",
    title: "CTO of Confetti Media",
    company: "Confetti Media",
    content:
      "Tech morphers didn't just build our website, rather built the perfect platform using cutting edge technology and providing us with a premium experience.",
    avatar: "/company-logo/confetti.png",
  },
  {
    id: 5,
    name: "Ankit Singh",
    title: "CEO of Bharat Care",
    company: "Bharat Care",
    content:
      "Working with Tech Morphers was like having an internal tech team — minus the overhead. They delivered our MVP in 4 weeks, pixel-perfect and exactly how we envisioned it. The whole experience was smoother than I imagined.",
    avatar: "/company-logo/bharatcare.jpeg",
  },
  {
    id: 6,
    name: "Laksmikant Sahoo",
    title: "Govt. of Odisha",
    company: "Odisha Police",
    content:
      "Every agency talks about communication — Tech Morphers actually delivers on it. Daily updates, clean handoffs, and a dashboard that made me feel in control at every step.",
    avatar: "/company-logo/odisha.png",
  },
  {
    id: 7,
    name: "Chiranjit Singha",
    title: "CEO of Salzelift Solutions",
    company: "Salzelift Solutions",
    content:
      "We started with a one-month project. It's been 11 months now, and they're practically our extended tech team. Their consistency and obsession with quality is why we keep coming back.",
    avatar: "/company-logo/salzelift.jpeg",
  },
]

export default function TestimonialsSlider() {
  const swiperRef = useRef<any>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animationVariants}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
        <div className='absolute -translate-x-12 bg-gradient-to-b from-blue-700 to-blue-800 h-[350vh] lg:h-[75vh] w-[250rem] -rotate-3 -z-10'></div>
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Sparkle elements */}
        <div className="absolute top-20 left-32 text-white text-2xl">✦</div>
        <div className="absolute top-40 right-40 text-white text-xl">✦</div>
        <div className="absolute bottom-32 left-20 text-white text-lg">✦</div>
        <div className="absolute top-60 right-20 text-white text-sm">✦</div>
      </div>

      {/* Vertical text */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
        <span className="text-white text-sm font-medium tracking-[0.2em] whitespace-nowrap">TESTIMONIALS</span>
      </div>

      <div className="container mx-auto px-8 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              <span className="text-black">Testimonials</span> that
              <br />
              Speak to Our Results
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Read through our testimonials to see why our clients love working with us and how we can help you achieve
              your business goals through creative and effective design.
            </p>
          </div>

          {/* Testimonials Slider */}
          <div className="relative">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              className="pb-10"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-[#2A2A2A] backdrop-blur-sm rounded-2xl p-8 h-full min-h-[300px] flex flex-col">
                    {/* Quote icon */}
                    <div className="flex justify-between mb-4">
                        {/* Author */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                                <Image
                                    src={testimonial.avatar || "/placeholder.svg"}
                                    alt={testimonial.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
                                <p className="text-gray-400 text-xs">{testimonial.title}</p>
                            </div>
                        </div>
                        <div className="text-gray-500 text-4xl leading-none">
                            <Image src="/icons/quotes.svg" alt="quotes" width={37} height={33} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 mb-6">
                      <p className="text-gray-100 leading-relaxed text-sm">{testimonial.content}</p>
                    </div>

                    
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => swiperRef.current?.swiper?.slidePrev()}
                className="w-12 h-12 rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => swiperRef.current?.swiper?.slideNext()}
                className="w-12 h-12 rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
