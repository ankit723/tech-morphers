import Link from "next/link"
import Image from "next/image"
import { FaPhoneAlt, FaLinkedin, FaInstagram } from "react-icons/fa"
import { SiGmail } from "react-icons/si"

export default function NavBar() {
  return (
    <header className="sticky  top-0 z-50 mx-4 gap-2  flex justify-between items-center">
      {/* Logo */}
      <div className="w-12 h-12 sm:w-16 sm:h-16">
        <Image
          src="/home/logo.png"
          alt="Tech Morphers Logo"
          width={64}
          height={64}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Navigation */}
      <div className="w-full flex items-center justify-center">
        <nav
          aria-label="Main Navigation"
          className="bg-[url(/home/Group12.png)] bg-no-repeat bg-center bg-cover sm:px-6 sm:py-2 p-2 lg:w-[42%] w-full sm:text-xl font-semibold rounded-full"
        >
          <ul className="flex gap-4 justify-center text-gray-800">
            <li><Link href="#" className="text-blue-600 hover:text-blue-800">Home</Link></li>
            <li><Link href="#" className="hover:text-gray-600">Portfolio</Link></li>
            <li><Link href="#" className="hover:text-gray-600">Pricing</Link></li>
            <li><Link href="#" className="hover:text-gray-600">About</Link></li>
          </ul>
        </nav>
      </div>

      {/* Social Media Links */}
      <div className="hidden sm:flex gap-3 p-1" aria-label="Social Media Links">
        <Link
          href="#"
          className="w-10 h-10 bg-[url(/home/Rectangle1.png)] rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
          aria-label="Phone"
        >
          <FaPhoneAlt className="w-5 h-5 text-gray-700" />
        </Link>
        <Link
          href="#"
          className="w-10 h-10 bg-[url(/home/Rectangle1.png)] rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
          aria-label="Gmail"
        >
          <SiGmail className="w-5 h-5 text-gray-700" />
        </Link>
        <Link
          href="#"
          className="w-10 h-10 bg-[url(/home/Rectangle1.png)] rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="w-5 h-5 text-gray-700" />
        </Link>
        <Link
          href="#"
          className="w-10 h-10 bg-[url(/home/Rectangle1.png)] rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
          aria-label="Instagram"
        >
          <FaInstagram className="w-5 h-5 text-gray-700" />
        </Link>
      </div>
    </header>
  )
}
