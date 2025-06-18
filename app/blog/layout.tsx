import Footer from "../components/home/footer";

import Navbar from "../components/home/navbar";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <Navbar />
        <div className="relative my-20">
            {children}
        </div>
        <div className="relative mt-[60rem]">
            <Footer />
        </div>
    </div>
  )
}