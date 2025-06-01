import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export default function CtaBlock() {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-xl p-10 md:p-16 my-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Let&apos;s Build Something Game-Changing Together
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          At Tech Morphers, we don&apos;t just code — we co-create premium digital experiences that fuel your growth.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-md cursor-pointer">
            Get a Free Estimate <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="bg-transparent text-lg px-8 py-6 rounded-xl border-white text-white hover:bg-white hover:text-black cursor-pointer">
            Talk to Us <Phone className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
