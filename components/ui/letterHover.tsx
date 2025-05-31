import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const LetterHover = ({ 
  text, 
  className, 
  initialColor, 
  endColor 
}: {
  text: string, 
  className: string, 
  initialColor: string, 
  endColor: string
}) => {
  // Track which letters are being hovered
  const [hoveredIndices, setHoveredIndices] = useState<number[]>([]);
  
  // Get Tailwind color classes based on the color name
  const getColorClasses = (colorName: string): string => {
    switch (colorName) {
      case 'white': return 'dark:text-white text-white';
      case 'black': return 'dark:text-black text-black';
      case 'red-500': return 'dark:text-red-500 text-red-500';
      case 'blue-700': return 'dark:text-blue-700 text-blue-700';
      case 'primary': return 'text-primary dark:text-primary';
      case 'dark-adaptive': return 'dark:text-white text-black';
      default: return 'dark:text-white text-black';
    }
  };
  
  const handleMouseEnter = (index: number) => {
    setHoveredIndices(prev => [...prev, index]);
  };
  
  const handleMouseLeave = (index: number) => {
    setHoveredIndices(prev => prev.filter(i => i !== index));
  };
  
  return (
    <h1 className={twMerge("flex", className)}>
      {text.split('').map((char, index) => {
        const isHovered = hoveredIndices.includes(index);
        const colorClasses = isHovered ? getColorClasses(endColor) : getColorClasses(initialColor);
        
        return (
          <span
            key={index}
            className={twMerge(
              'transition-colors duration-300',
              colorClasses
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </h1>
  );
};

export default LetterHover;
