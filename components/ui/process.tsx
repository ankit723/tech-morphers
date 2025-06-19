'use client'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

// Dynamically import Lottie to prevent server-side rendering issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const Process = ({id, title, description, lottie: lottiePath}: {id: string, title: string, description: string, lottie: string}) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(lottiePath);
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Error loading animation:', error);
        setAnimationData(null); // Set to null or some error state
      }
    };

    if (lottiePath) {
      loadAnimation();
    }
  }, [lottiePath]);

  return (
    <div className='flex flex-col justify-center bg-[#2A2A2A] rounded-3xl p-10 gap-5 m-3 max-w-[35rem] w-full'>
        <h1 className='text-4xl font-bold text-gray-200'>{id}</h1>
        {animationData ? (
          <Lottie animationData={animationData} loop={true} className='w-full h-[10rem] object-cover rounded-3xl' />
        ) : (
          // Optional: show a placeholder or loading indicator
          <div className='w-full h-[14rem] bg-gray-700 rounded-3xl flex items-center justify-center'>
            <p className='text-gray-400'>Loading animation...</p>
          </div>
        )}
        <h2 className='text-2xl font-bold text-gray-200 break-words'>{title}</h2>
        <p className='text-sm text-gray-200 w-full break-words leading-relaxed'>{description}</p>
    </div>
  )
}

export default Process