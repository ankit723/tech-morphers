import Image from "next/image"
import Link from "next/link"
import { FaInstagram, FaLinkedin, FaPhoneAlt } from "react-icons/fa"
import { SiGmail } from "react-icons/si"

const socialLinks = [
  { href: "#", icon: FaPhoneAlt, label: "Phone" },
  { href: "#", icon: SiGmail, label: "Gmail" },
  { href: "#", icon: FaLinkedin, label: "LinkedIn" },
  { href: "#", icon: FaInstagram, label: "Instagram" },
]

const Footer = () => {
  return (
    <footer
      className="w-[95%] mx-auto min-h-[400px] bg-[url('/home/Frame.svg')] bg-cover bg-center bg-no-repeat 
      flex flex-col sm:flex-row justify-between items-center rounded-[32px] px-6 py-10 mb-5 text-white relative overflow-hidden"
      aria-label="Footer"
    >
      {/* Center Text */}
      <div className="text-center flex justify-center items-center flex-col mx-auto">
        <h1 className="text-4xl sm:text-6xl lg:text-9xl font-bold mb-4">Tech Morphers</h1>
        <h2 className="mt-5 text-lg md:text-3xl lg:text-4xl font-semibold px-2 bg-blue-700 inline-block">
          Innovate. Inspire. Create
        </h2>
      </div>

      {/* Logo */}
      <div className="absolute bottom-20 sm:bottom-6 left-6 w-16 h-16 sm:w-20 sm:h-20">
        <Image
          src="/home/logo.png"
          alt="Tech Morphers Logo"
          width={80}
          height={80}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Social Links */}
      <nav
        className="flex gap-4 mt-8 sm:mt-0 sm:absolute sm:right-6 sm:bottom-6"
        aria-label="Social Media Links"
      >
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className="w-10 h-10 bg-[url(/home/Rectangle1.png)] rounded-full bg-cover bg-center bg-no-repeat 
              flex items-center justify-center transition hover:scale-110"
          >
            <Icon className="w-5 h-5 text-gray-700" />
          </Link>
        ))}
      </nav>
    </footer>
  )
}

export default Footer
