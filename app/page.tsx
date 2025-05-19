'use client'
import Navbar from './components/home/navbar'
import Hero from './components/home/hero'
import Services from './components/home/services'
import Numbers from './components/home/numbers'
import OurBrands from './components/home/ourBrands'
const Page = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Numbers />
      <OurBrands />
      <Services />
    </>
  )
}

export default Page