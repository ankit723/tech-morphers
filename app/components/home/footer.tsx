'use client'
import React, { useRef } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import CtaBlock from '@/components/ctaBlock';

const Footer = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end end"]
    });

    // Animate scale from 0.5 (half size) to 1 (full size)
    const animatedScale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

  return (
    <motion.footer 
        ref={sectionRef} 
        className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8 h-screen overflow-hidden z-100 absolute bottom-0 w-full" // Added overflow-hidden
        style={{
            scale: animatedScale // Use the new scale animation
        }}
    >
      <div className="flex flex-col items-center mt-5 h-full text-center">
        {/* Placeholder for Company Logo */}
        <div className="flex items-center justify-center">
            <div className="text-4xl">
                <Image src="/logo.png" alt="Tech Morphers Logo" width={200} height={200} />
            </div>
            <div className="flex flex-col items-start justify-center">
                <h2 className="text-6xl font-bold">Tech</h2>
                <h2 className="text-6xl font-bold">Morphers</h2>
            </div>
        </div>
        
        {/* Placeholder for Tagline */}
        <p className="mt-10 text-5xl text-gray-300 font-bold">Crafted with code. Delivered as experience.</p>

        <CtaBlock />
        
        <div className="flex space-x-6 mb-8">
          <a href="#" aria-label="Facebook" className="hover:text-gray-400 transition-colors">
            <FaFacebookF size={24} />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-gray-400 transition-colors">
            <FaTwitter size={24} />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-gray-400 transition-colors">
            <FaInstagram size={24} />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-gray-400 transition-colors">
            <FaLinkedinIn size={24} />
          </a>
        </div>
        
        {/* Copyright Notice */}
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Tech Morphers. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;