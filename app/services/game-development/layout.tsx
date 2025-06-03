import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Game Development Services | Tech Morphers',
  description: 'Immersive game development services for PC, mobile, and console. Bring your game ideas to life with Tech Morphers.'
}

export default function GameDevLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white dark:bg-[#0D0D1F]">{children}</div>
} 