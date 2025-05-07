import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface CTABannerProps {
  title?: string
  buttonText?: string
  buttonLink?: string
}

export default function CTABanner({
  title = "Ready to work with us?",
  buttonText = "Get Started",
  buttonLink = "#",
}: CTABannerProps) {
  return (
    <>
      {/* TRUST NUMBER NOT WORDS */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="px-4 max-w-[1400px] mx-auto">
        <h2 className="text-center text-6xl md:text-8xl lg:text-[150px] font-semibold mb-24 tracking-tighter leading-none">
            <div className="text-left ml-1 group">
              <span className="text-black group-hover:text-[#2442ff]">TRUST </span>
              <span className="text-[#2442ff] group-hover:text-black">NUMBER</span>
            </div>
            <div className="text-right mr-32 group">
              <span className="text-[#2442ff] group-hover:text-black">NOT</span>
              <span className="text-black group-hover:text-[#2442ff]">WORDS</span>
            </div>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            <Stat value="52K+" label="Customers" />
            <Stat value="115+" label="Region Across AWS, Azure And Google Cloud" />
            <Stat value="175k+" label="Developers Join Every Month" />
            <Stat value="#1" label="Modern Used Morden Database" />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full px-4 py-8">
        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#0a2088] via-[#1e3ad4] to-[#2442ff] px-8 py-12 md:px-16">
          {/* Gradient Background Overlays */}
          <div className="absolute inset-0 bg-[#0a2088] opacity-40 rounded-full scale-150 translate-x-1/2 -translate-y-1/4 blur-3xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-[#2442ff] opacity-30 rounded-full scale-150 -translate-x-1/3 translate-y-1/4 blur-2xl pointer-events-none"></div>

          {/* CTA Content */}
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">{title}</h2>
            <Link
              href={buttonLink}
              className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-full flex items-center gap-2 transition-all text-lg"
            >
              {buttonText}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className=" ">
        <div className=" ">
          <h2 className="text-4xl text-center sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.95] ">
            <div className="text-[#2442ff] hover:text-black transition-colors duration-300 block">WE CREATE BRAND</div>
            <div className="hover:text-[#2442ff] text-black transition-colors duration-300 block">THAT PEOPLE WANT

            </div>
            <div className="text-black hover:text-[#2442ff] transition-colors duration-300 block">TALK ABOUT</div>
          </h2>
        </div>
      </section>
      <div className=" mt-10">
        <Image
          src="/home/sc.png"
          alt="Tech Morphers Logo"
          width={1000}
          height={1000}
          className="w-full"
        />
      </div>
      
    </>
  )
}

interface StatProps {
  value: string
  label: string
}

function Stat({ value, label }: StatProps) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-[#2442ff] text-5xl md:text-6xl font-semibold">{value}</span>
      <span className="text-black mt-2 text-2xl leading-tight font-semibold">{label}</span>
    </div>
  )
}
