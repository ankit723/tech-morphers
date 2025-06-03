import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UI/UX Design Services | Tech Morphers',
  description: 'User-centric UI/UX design services to enhance user experience, engagement, and brand identity. Transform your digital products with Tech Morphers.'
}

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white dark:bg-[#0D0D1F]">{children}</div>
} 