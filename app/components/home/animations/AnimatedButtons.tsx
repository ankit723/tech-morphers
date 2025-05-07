'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';

const AnimatedButtons: React.FC = () => {
  useEffect(() => {
    // Only run this on the client side
    const styles = `
      @keyframes expandShrink {
        0% {
          width: 0%;
          opacity: 1;
        }
        50% {
          width: 100%;
          opacity: 1;
        }
        100% {
          width: 0%;
          opacity: 1;
        }
      }
      .animated-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: #2563eb;
        animation: expandShrink 2s infinite linear;
        z-index: 0;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Cleanup on component unmount
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="grid grid-cols-2 gap-6 p-5">
      {["PLACE ORDER", "DASHBOARD", "LOGIN", "SIGN UP"].map((label) => (
        <Link
          key={label}
          href="#"
          className="animated-button relative border-2 border-black flex items-center justify-center rounded-xl py-3 px-6 text-center font-semibold text-sm bg-white overflow-hidden"
        >
          <span className="relative z-10">{label}</span>
        </Link>
      ))}
    </div>
  );
};

export default AnimatedButtons;