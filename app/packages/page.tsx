import Packages from '@/components/packages';
import Navbar from '../components/home/navbar';
import Footer from '../components/home/footer';

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
