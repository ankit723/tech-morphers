import Navbar from "../components/home/navbar";
import Footer from "../components/home/footer";

export default function ScheduleCallLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D1F]">
        <Navbar />
        {children}
        <div className="relative mt-[70rem]">
            <Footer />
        </div>
    </div>
  )
}