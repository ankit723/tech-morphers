import Packages from '@/components/packages';
import Navbar from '../components/home/navbar';
import Footer from '../components/home/footer';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Packages',
  description: 'Packages',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Packages',
    description: 'Packages',
    images: '/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Packages',
    description: 'Packages',
    images: '/logo.png',
  },
  alternates: {
    canonical: 'https://www.techmorphers.com/packages',
  },
}

const page = () => {
  return (
    <div>
        <Navbar />
        <div className="container mx-auto relative my-20">
            <Packages />
        </div>
        <div className="relative mt-[60rem]">
            <Footer />
        </div>
    </div>
  );
};

export default page;
