"use client"

import { useState, useEffect, useRef } from "react"

interface CardCarouselProps {
  cards?: {
    id: number | string
    title: string
    description: string
    image?: string
    tag?: string
  }[]
}


const cardData = [
  {
    id: 1,
    title: "Mountain Retreat",
    description: "Peaceful getaway in the mountains with stunning views.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Nature",
  },
  {
    id: 2,
    title: "Beach Paradise",
    description: "Relax on white sandy beaches with crystal clear water.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Travel",
  },
  {
    id: 3,
    title: "City Adventure",
    description: "Explore the vibrant streets and culture of metropolitan life.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Urban",
  },
  {
    id: 4,
    title: "Forest Camping",
    description: "Connect with nature in dense, lush forest environments.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Outdoor",
  },
  {
    id: 5,
    title: "Desert Safari",
    description: "Experience the beauty and silence of vast desert landscapes.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Adventure",
  },
  {
    id: 6,
    title: "Island Hopping",
    description: "Discover hidden gems across beautiful tropical islands.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Exotic",
  },
  {
    id: 7,
    title: "Countryside Retreat",
    description: "Slow down and enjoy the simple pleasures of rural life.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Relaxation",
  },
  {
    id: 8,
    title: "Ski Resort",
    description: "Hit the slopes at premium winter destinations worldwide.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Winter",
  },
  {
    id: 9,
    title: "Historical Tour",
    description: "Step back in time with guided tours of ancient landmarks.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Cultural",
  },
  {
    id: 10,
    title: "Culinary Journey",
    description: "Taste your way through regional specialties and flavors.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Food",
  },
  {
    id: 11,
    title: "Wildlife Safari",
    description: "Observe exotic animals in their natural habitats.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Nature",
  },
  {
    id: 12,
    title: "Wellness Retreat",
    description: "Rejuvenate your mind and body at premium spa resorts.",
    image: "/placeholder.svg?height=400&width=600",
    tag: "Health",
  },
]

export default function CardCarousel({ cards = cardData }: CardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoSlideInterval] = useState(5000)
  const [cardsPerView, setCardsPerView] = useState(4)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate total slides based on current cardsPerView
  const totalSlides = Math.ceil(cards.length / cardsPerView)

  // Handle responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(4) // lg screens
      } else if (window.innerWidth >= 768) {
        setCardsPerView(3) // md screens
      } else {
        setCardsPerView(2) // small screens
      }
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-scroll with uniform forward and reverse motion
  useEffect(() => {
    if (autoSlideInterval === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // If we're at the end, reverse direction
        if (prevIndex >= totalSlides - 1) {
          setDirection(-1)
          return prevIndex - 1
        }
        // If we're at the start, reverse direction
        else if (prevIndex <= 0) {
          setDirection(1)
          return prevIndex + 1
        }
        // Otherwise continue in current direction
        else {
          return prevIndex + direction
        }
      })
    }, autoSlideInterval)

    return () => clearInterval(interval)
  }, [totalSlides, autoSlideInterval, direction])

  return (
    <main className="flex  flex-col items-center justify-center p-8">
      <div className="relative w-full max-w-6xl mx-auto px-4 overflow-hidden mb-8">
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div 
              key={slideIndex} 
              className="flex-shrink-0 w-full px-2"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cards.slice(slideIndex * cardsPerView, (slideIndex + 1) * cardsPerView).map((card) => (
                  <div
                    key={card.id}
                    className="bg-gray-200 border-4 border-blue-600 rounded-lg h-48"
                  >
                    {/* Optional: Add card content here */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}