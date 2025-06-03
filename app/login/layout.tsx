import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Tech Morphers',
  description: 'Login to your account',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Login | Tech Morphers',
    description: 'Login to your account',
    images: '/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login | Tech Morphers',
    description: 'Login to your account',
    images: '/logo.png',
  },
  alternates: {
    canonical: 'https://www.techmorphers.com/login',
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}