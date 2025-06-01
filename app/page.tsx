'use client'
import Navbar from './components/home/navbar'
import Hero from './components/home/hero'
import Services from './components/home/services'
import Numbers from './components/home/numbers'
import OurBrands from './components/home/ourBrands'
import HowWeWorkVideo from './components/home/howWeWorkVideo'
import HowWeWorkProcess from './components/home/howWeWorkProcess'
import EstimatorCta from './components/home/estimatorCta'
import Testimonials from './components/home/testimonials'
import Footer from './components/home/footer'
import FAQWithCTA from './components/home/faq'
import OurProjects from './components/home/ourProjects'

const Page = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Numbers />
      <OurBrands />
      <HowWeWorkVideo />
      <HowWeWorkProcess />
      <EstimatorCta />
      <Services />
      <OurProjects />
      <FAQWithCTA />
      <Testimonials />
      <div className="relative mt-[65rem]">
        <Footer />
      </div>
    </>
  )
}

export default Page