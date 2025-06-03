import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Development Services | Tech Morphers',
  description: 'Expert web development services including custom web apps, e-commerce, PWAs, and API integration. Elevate your business with modern, scalable web solutions from Tech Morphers.'
}

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white dark:bg-[#0D0D1F]">{children}</div>
} 