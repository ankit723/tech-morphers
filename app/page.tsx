'use client'
import Navbar from './components/home/navbar'
import Hero from './components/home/hero'
import Services from './components/home/services'
import Numbers from './components/home/numbers'

const Page = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Numbers />
      <Services />
    </>
  )
}

export default Page