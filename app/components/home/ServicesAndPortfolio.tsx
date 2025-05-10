"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PortfolioItem {
  id: number
  logo: string
  stats: {
    primary: { value: string; label: string }
    secondary: { value: string; label: string }
  }
  testimonial?: string
  caseStudyLink?: string
  tags: string[]
}

export default function ServicesAndPortfolio() {
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0)

  const services = Array(10).fill("UI/UX Design")

  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      logo: "/home/Toyota.png",
      stats: {
        primary: {
          value: "99.99 %",
          label: "Availability for customers",
        },
        secondary: {
          value: "9M+",
          label: "Vehicles serviced",
        },
      },
      testimonial:
        "We use MongoDB as the core database for our services, so any new innovative idea or new service we build, we automatically say, 'We're going to use MongoDB as the core platform,' knowing that it's going to give us the reliability and the scalability that we're going to need.",
      caseStudyLink: "#",
      tags: ["UX Research", "Wireframe", "Visual Design"],
    },
    // Add more portfolio items as needed
  ]

  const nextPortfolio = () => {
    setCurrentPortfolioIndex((prev) => (prev + 1) % portfolioItems.length)
  }

  const prevPortfolio = () => {
    setCurrentPortfolioIndex((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length)
  }

  const currentPortfolio = portfolioItems[currentPortfolioIndex]

  return (
    <main className="w-full mx-auto px-4 py-12">
      {/* Services Section */}
      <section className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Decorative stars */}
        <figure className="absolute w-7 left-4 sm:left-8 md:left-1/3 top-1/3 sm:top-1/2 transform -translate-y-1/2">
          <Image
            src="/home/Star16.png"
            alt=""
            width={100}
            height={100}
            className="w-full h-full object-contain"
            aria-hidden="true"
            priority={false}
          />
        </figure>
        <figure className="absolute w-7 left-4 sm:right-8 md:right-10 bottom-4 sm:bottom-8 md:bottom-10">
          <Image
            src="/home/Star16.png"
            alt=""
            width={100}
            height={100}
            className="w-full h-full object-contain"
            aria-hidden="true"
            priority={false}
          />
        </figure>
        <figure className="absolute w-7 right-4 sm:right-8 md:right-10 bottom-4 sm:bottom-8 md:bottom-10">
          <Image
            src="/home/Star16.png"
            alt=""
            width={100}
            height={100}
            className="w-full h-full object-contain"
            aria-hidden="true"
            priority={false}
          />
        </figure>

        {/* Main content */}
        <div className="relative max-w-7xl mx-auto w-full">
          {/* Heading */}
          <header className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl text-center font-bold">
              <span className="text-blue-600 hover:text-black transition-colors duration-300 block">WE PROVIDE WIDE</span>
              <span className="text-black hover:text-blue-600 transition-colors duration-300 block">RANGE OF SERVICES</span>
            </h2>
          </header>

          {/* Services grid and empty box */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6">
            <ul className="grid font-semibold text-lg sm:text-xl md:text-2xl p-4 sm:p-5 flex-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              {services.map((service, index) => (
                <li key={index}>
                  <button
                    className="group flex items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-blue-600 transition-all duration-300 w-full sm:w-[250px] md:w-[300px] hover:w-full sm:hover:w-[300px] md:hover:w-[350px]"
                    aria-label={`Learn more about ${service}`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="font-bold group-hover:text-white">{index + 1}</span>
                      <span className="group-hover:text-white">{service}</span>
                    </div>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xl sm:text-2xl">→</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {/* Empty box */}
            <div className="w-full lg:w-1/3 h-64 sm:h-80 md:h-96 border-2 border-blue-600 rounded-lg mx-auto md:ml-auto hover:bg-blue-50 transition-colors duration-300" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="relative mb-20">
        {/* Decorative stars */}
        <figure className="absolute -bottom-7 sm:bottom-0 w-7 text-blue-600">
          <Image
            src="/home/Star16.png"
            alt=""
            width={100}
            height={100}
            className="w-full h-full object-contain"
            aria-hidden="true"
            priority={false}
          />
        </figure>
        <figure className="absolute right-0 w-7 -bottom-7 sm:bottom-0 text-blue-600">
          <Image
            src="/home/Star16.png"
            alt=""
            width={100}
            height={100}
            className="w-full h-full object-contain"
            aria-hidden="true"
            priority={false}
          />
        </figure>

        {/* Heading */}
        <header className="mb-16 text-center">
          <h2 className="text-5xl sm:text-6xl md:text-9xl font-bold">
            <span className="text-blue-600 hover:text-black transition-colors duration-300 block">OUR RECENT</span>
            <span className="text-black hover:text-blue-600 transition-colors duration-300 block">WORK & PORTFOLIO</span>
          </h2>
        </header>

        <div className="flex flex-col justify-center md:flex-row gap-6 relative items-center">
          <button
            onClick={prevPortfolio}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center z-10 bg-white shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Previous portfolio item"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Stats Card */}
          <article className="flex flex-col justify-between border-2 border-blue-600 rounded-lg p-6 w-full md:w-1/3 flex-1 min-h-[300px]">
            <div className="flex justify-center mb-6">
              <Image
                src={currentPortfolio.logo}
                alt={`${currentPortfolio.id} company logo`}
                width={150}
                height={64}
                className="h-16 object-contain"
                priority
              />
            </div>
            <div className="flex justify-around mt-6">
              <div className="text-center">
                <p className="text-4xl font-light text-green-500">
                  {currentPortfolio.stats.primary.value}
                </p>
                <p className="text-sm text-gray-700">
                  {currentPortfolio.stats.primary.label}
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-light text-green-500">
                  {currentPortfolio.stats.secondary.value}
                </p>
                <p className="text-sm text-gray-700">
                  {currentPortfolio.stats.secondary.label}
                </p>
              </div>
            </div>
          </article>

          {/* Testimonial Card */}
          <article className="hidden md:flex border-2 border-blue-600 rounded-lg p-6 w-full md:w-1/3 flex-1 min-h-[300px] flex-col justify-between">
            <blockquote className="text-lg leading-relaxed text-gray-800">
              &quot;{currentPortfolio.testimonial}&quot;
            </blockquote>
            <div className="mt-4 flex justify-end">
              <a
                href={currentPortfolio.caseStudyLink}
                className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-label="Read case study"
              >
                Read Case Study
              </a>
            </div>
          </article>

          <button
            onClick={nextPortfolio}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center z-10 shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Next portfolio item"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Tags */}
        <ul className="flex flex-wrap gap-3 justify-center mt-8">
          {currentPortfolio.tags.map((tag, index) => (
            <li key={index}>
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
                {tag}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}