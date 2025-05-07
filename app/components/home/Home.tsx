import AnimatedButtons from "./animations/AnimatedButtons"
import AnimatedTeamImages from "./animations/AnimatedTeamImages"
// import NavBar from "./NavBar"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 bg-[url(/home/Group37.png)] bg-cover bg-center" />
      <div className="absolute inset-0 z-0" />

      <div className="relative -mt-3 z-10">
        {/* <NavBar/> */}
        {/* Hero Section */}
        <section className=" px-4 py-16 text-center" aria-labelledby="hero-heading">
          {/* Logo Headline */}
          <div className="flex justify-center md:gap-20 items-center mb-4 text-4xl md:text-5xl  lg:text-7xl font-bold text-white">
            <div className="bg-[url(/home/Group42.png)] p-4 lg:px-8 lg:py-4 rounded-xl">TECH</div>
            <div className="bg-[url(/home/Group2.png)] p-4 lg:px-8 lg:py-4 rounded-xl">Morphers</div>
          </div>

          <h1 id="hero-heading" className="md:text-6xl text-5xl font-medium  text-gray-900 mb-6">
            India-Based Digital Agency
          </h1>
          <p className="max-w-3xl leading-relaxed mx-auto sm:text-xl font-semibold text-gray-800 mb-12">
            Tech Morphers Studio is a dynamic and innovative design agency that brings creative ideas to life.
            We work with a wide range of clients to develop unique and effective branding, web design, and graphic design solutions.
          </p>

          {/* Two-column grid */}
          <div className="flex justify-center md:justify-between flex-col md:flex-row items-center mx-5 text-left py-8">
  {/* Left: Tagline + Image */}
  <div className="flex flex-col">
    <h2 className="text-3xl md:w-[70%] font-bold leading-tight">
      Provide the best service with out of the box ideas
    </h2>
    <AnimatedTeamImages/>
  </div>
  {/* Right: CTA Buttons */}
  <AnimatedButtons/>

</div>
        </section>
      </div>
    </main>
  )
}
