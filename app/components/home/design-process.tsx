import Image from "next/image";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export default function DesignProcess() {
  const processSteps: ProcessStep[] = [
    {
      number: "01",
      title: "Discovery",
      description:
        "We start by getting to know our clients, their business goals, and the target audience.",
    },
    {
      number: "02",
      title: "Strategy",
      description:
        "We develop a strategy that outlines the design approach, user experience, and key features of the project.",
    },
    {
      number: "03",
      title: "Design",
      description:
        "We work closely with our clients to get feedback and iterate on the design until it meets their needs and vision.",
    },
    {
      number: "04",
      title: "Development",
      description:
        "Once the design is finalized, our development team takes over to build the final product.",
    },
  ];

  return (
    <>
      {/* Design Process Section */}
      <section className="relative bg-blue-600 py-16 px-8 overflow-hidden">
        {/* Side Label */}
        <div className="absolute left-0 top-1/8 transform -translate-y-1/2 bg-black text-white">
          <div className="sm:w-10 sm:h-40 w-5 h-32 flex items-center justify-center">
            <span className="transform -rotate-90 text-sm tracking-widest whitespace-nowrap">
              HOW IT WORKS
            </span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          aria-hidden="true"
        />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
          aria-hidden="true"
        />

        {/* Sparkle Icons */}
        <figure className="absolute w-8 md:top-24 top-24 md:left-20">
          <Image
            src="/home/Star3.png"
            alt="Decorative star"
            width={100}
            height={100}
            className="w-full h-full object-contain"
            priority={false}
          />
        </figure>
        <figure className="absolute right-24 top-5 md:top-40 w-8">
          <Image
            src="/home/Star3.png"
            alt="Decorative star"
            width={100}
            height={100}
            className="w-full h-full object-contain"
            priority={false}
          />
        </figure>

        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <header className="mb-12 max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-wide">
              Our Design Process
            </h2>
            <p className="text-white/90">
              Katalyst Studio follows a collaborative and iterative approach to
              design, with a focus on understanding and meeting the unique needs
              of each client.
            </p>
          </header>

          {/* Process Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {processSteps.map((step) => (
              <article
                key={step.number}
                className="bg-gray-900 rounded-3xl sm:rounded-[48px] w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[520px] p-6 sm:p-8 flex flex-col justify-start gap-4 sm:gap-6 transition-all hover:bg-gray-800 hover:shadow-lg"
              >
                <span className="text-gray-400 text-lg sm:text-xl font-bold font-mono">
                  {step.number}
                </span>
                
                <div className="bg-white rounded-2xl sm:rounded-[32px] flex-1 min-h-[160px] sm:min-h-[240px] flex items-center justify-center">
                  {/* Placeholder for step visual */}
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-white text-xl sm:text-2xl font-bold tracking-tight sm:tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative my-20 max-w-7xl mx-auto px-5">
        <article className="bg-gradient-to-r from-blue-600 to-blue-200 rounded-[32px] p-8 md:p-16 flex flex-col md:flex-row justify-between items-center gap-10">
          {/* Text Content */}
          <header className="text-white text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 leading-tight">
              Start Your Journey
              <br />
              With Us Now
            </h2>
            <button 
              className="bg-black text-white px-8 py-3 sm:px-10 sm:py-4 rounded-full hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-200"
              aria-label="Start your project now"
            >
              Start Now
            </button>
          </header>

          {/* Icon */}
          <figure className="bg-[#E0FF22] rounded-full w-28 h-28 sm:w-44 sm:h-44 md:w-60 md:h-60 flex justify-center items-center">
            <Image
              src="/home/Vector.png"
              alt="Start your journey icon"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </figure>
        </article>

        {/* Decorative Sparkles */}
        <div className="flex justify-between px-4 mt-8" aria-hidden="true">
          <figure className="w-8">
            <Image
              src="/home/Star16.png"
              alt=""
              width={100}
              height={100}
              className="w-full h-full object-contain"
              priority={false}
            />
          </figure>
          <figure className="w-8">
            <Image
              src="/home/Star16.png"
              alt=""
              width={100}
              height={100}
              className="w-full h-full object-contain"
              priority={false}
            />
          </figure>
        </div>
      </section>
    </>
  );
}