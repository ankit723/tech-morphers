"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

interface Testimonial {
  id: number
  name: string
  position: string
  company: string
  avatar: string
  quote: string
}

export default function FAQAndTestimonialsSection() {
  // FAQ State
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [email, setEmail] = useState("")

  // Testimonial State
  const [currentIndex, setCurrentIndex] = useState(1)

  const faqItems: FAQItem[] = [
    {
      question: "How do I sign up for the project?",
      answer: "You can sign up for the project by filling out the form on our website or by contacting our team directly through email or phone. We'll guide you through the process and answer any questions you might have.",
    },
    {
      question: "What should I prepare before starting?",
      answer: "Before starting, it's helpful to have a clear idea of your project goals, timeline, and budget. Any existing brand guidelines, content, or specific requirements will also be useful for our team to understand your needs better.",
    },
    {
      question: "Does my company need marketing advice?",
      answer: "Our team offers comprehensive marketing consultation services. We can assess your current marketing strategy and provide tailored advice to help your company reach its target audience more effectively.",
    },
  ]

  const testimonials: Testimonial[] = [
    {
      id: 0,
      name: "Previous Client",
      position: "CEO",
      company: "Previous Company",
      avatar: "/placeholder.svg",
      quote: "A pleasure to work with. They provided valuable insights and design solutions. We highly recommend them for design solutions.",
    },
    {
      id: 1,
      name: "Alan Baker",
      position: "CEO",
      company: "Redbird Company",
      avatar: "/placeholder.svg",
      quote: "Working with Tech Morphers has been an incredible experience. They truly listened to our needs and delivered a stunning design that exceeded our expectations. We couldn't be happier with the final product!",
    },
    {
      id: 2,
      name: "Theresa Webb",
      position: "CEO",
      company: "Redbird Company",
      avatar: "/placeholder.svg",
      quote: "From start to finish, working with Kai was an amazing experience. They were professional, responsive, and within budget. We're thrilled with the results and look forward to working with them again in the future.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email submitted:", email)
    setEmail("")
    // Add actual newsletter signup logic here
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]
  const prevTestimonial1 = testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length]
  const nextTestimonial1 = testimonials[(currentIndex + 1) % testimonials.length]

  return (
    <main className="w-full">
      {/* FAQ and Newsletter Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 relative">
        {/* Decorative stars */}
        <figure className="absolute w-7 bottom-0 left-0">
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
        <figure className="absolute w-7 bottom-0 right-0 text-blue-600">
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

        {/* FAQ Section */}
        <article className="w-full md:w-1/2">
          <h2 className="sr-only">Frequently Asked Questions</h2>
          <ul className="space-y-6">
            {faqItems.map((item, index) => (
              <li key={index} className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
                <button 
                  className="w-full flex justify-between items-center text-left gap-4"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={expandedIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-xl font-medium">{item.question}</h3>
                  <Plus className={`h-6 w-6 text-blue-600 flex-shrink-0 transition-transform ${expandedIndex === index ? 'rotate-45' : ''}`} />
                </button>
                <div 
                  id={`faq-answer-${index}`}
                  className={`mt-4 text-gray-600 overflow-hidden transition-all duration-300 ${expandedIndex === index ? 'max-h-96' : 'max-h-0'}`}
                >
                  <p>{item.answer}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        {/* Newsletter Section */}
        <article className="w-full md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">How We Can Help You?</h2>
          <p className="text-gray-500 mb-8">
            Follow our newsletter. We will regularly update our latest project and availability.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <label htmlFor="newsletter-email" className="sr-only">Enter your email</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter Your Email"
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Let&apos;s Talk
            </button>
          </form>

          <div className="mt-8">
            <a 
              href="#" 
              className="text-blue-600 flex items-center font-medium hover:text-blue-800 transition-colors"
              aria-label="View more frequently asked questions"
            >
              More FAQ <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </article>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-blue-600 py-20 relative overflow-hidden">
        {/* Vertical "TESTIMONIALS" text */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white">
          <div className="sm:w-10 sm:h-40 w-5 h-32 flex items-center justify-center">
            <span className="transform -rotate-90 text-sm tracking-widest whitespace-nowrap">TESTIMONIALS</span>
          </div>
        </div>

        {/* Decorative stars */}
        <figure className="absolute w-7 top-16 left-40 text-white opacity-80">
          <Image
            src="/home/Star3.png"
            alt=""
            width={100}
            height={100}
            className="w-full h-full object-contain"
            aria-hidden="true"
            priority={false}
          />
        </figure>
        <figure className="absolute w-7 top-1/3 right-1/4 text-white opacity-80">
          <Image
            src="/home/Star3.png"
            alt=""
            width={100}
            height={100}
            className="w-full h-full object-contain"
            aria-hidden="true"
            priority={false}
          />
        </figure>
        <figure className="absolute w-7 bottom-20 left-1/4 text-white opacity-80">
          <Image
            src="/home/Star3.png"
            alt=""
            width={100}
            height={100}
            className="w-full h-full object-contain"
            aria-hidden="true"
            priority={false}
          />
        </figure>

        <div className="mx-auto px-4 max-w-7xl">
          {/* Heading */}
          <header className="text-center mb-6">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold">
              <span className="text-black block">Testimonials that</span>
              <span className="text-white block">Speak to Our Results</span>
            </h2>
          </header>

          {/* Description */}
          <p className="text-white text-center mx-auto mb-16 text-base sm:text-lg max-w-3xl">
            Read through our testimonials to see why our clients love working with us and how we can help you achieve your business goals through creative and effective design.
          </p>

          {/* Testimonials carousel */}
          <div className="relative flex justify-center items-stretch gap-4 sm:gap-6 mb-16">
            {/* Previous testimonial (partially visible) */}
            <article className="hidden lg:block w-1/5 bg-blue-700 rounded-lg p-4 sm:p-6 opacity-70 text-white">
              <div className="text-4xl sm:text-6xl font-serif text-left mb-4" aria-hidden="true">&quot;</div>
              <blockquote className="italic text-sm sm:text-lg">
                <p>{prevTestimonial1.quote}</p>
              </blockquote>
            </article>

            {/* Current testimonial */}
            <article className="w-full sm:w-11/12 md:w-3/4 lg:w-1/2 bg-gray-900 rounded-lg p-6 sm:p-8 text-white max-w-2xl">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-300 mr-4">
                  <Image
                    src={currentTestimonial.avatar}
                    alt={`Portrait of ${currentTestimonial.name}`}
                    width={64}
                    height={64}
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg sm:text-xl">{currentTestimonial.name}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {currentTestimonial.position} of {currentTestimonial.company}
                  </p>
                </div>
                <div className="ml-auto text-4xl sm:text-6xl font-serif" aria-hidden="true">&quot;</div>
              </div>
              <blockquote>
                <p className="text-base sm:text-lg leading-relaxed">{currentTestimonial.quote}</p>
              </blockquote>
            </article>

            {/* Next testimonial (partially visible) */}
            <article className="hidden lg:block w-1/5 bg-blue-700 rounded-lg p-4 sm:p-6 opacity-70 text-white">
              <div className="text-4xl sm:text-6xl font-serif text-left mb-4" aria-hidden="true">&quot;</div>
              <blockquote className="italic text-sm sm:text-lg">
                <p>{nextTestimonial1.quote}</p>
              </blockquote>
            </article>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Wave shape at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-white"
          style={{
            borderTopLeftRadius: "100% 100%",
            borderTopRightRadius: "100% 100%",
            transform: "scaleX(1.5)",
          }}
          aria-hidden="true"
        ></div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-8 flex flex-wrap items-center justify-center gap-4">
            <span>INNOVATE</span>
            <figure className="w-7">
              <Image
                src="/home/Star7.png"
                alt=""
                width={100}
                height={100}
                className="w-full h-full object-contain"
                aria-hidden="true"
                priority={false}
              />
            </figure>
            <span>INSPIRE</span>
            <figure className="w-7">
              <Image
                src="/home/Star7.png"
                alt=""
                width={100}
                height={100}
                className="w-full h-full object-contain"
                aria-hidden="true"
                priority={false}
              />
            </figure>
            <span>CREATE</span>
          </h2>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-7">
            <div className="flex w-full items-center justify-center gap-5">
              <div className="w-[40%] h-px p-0.5 bg-black"></div>
              <figure className="w-7">
                <Image
                  src="/home/Star6.png"
                  alt=""
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                  aria-hidden="true"
                  priority={false}
                />
              </figure>
              <div className="w-[40%] h-px p-0.5 bg-black"></div>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Finding the right talent for your business can be a daunting task. Let Tech Morphers hiring agency take the guesswork out of the process and help you find the perfect fit for your team.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="#"
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              aria-label="Hire our team"
            >
              Hire Us
            </a>
            <a
              href="#"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              aria-label="Book a consultation"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}