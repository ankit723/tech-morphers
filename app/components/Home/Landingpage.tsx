import React from "react";
import Image from "next/image";
import AnimatedTeamImages from "../animate/AnimatedTeamImages";
import AnimatedSocialIcons from "../animate/AnimatedSocialIcons";
import ScrollAnimatedText from "../animate/ScrollAnimatedText";

interface LandingPageProps {
  toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ toggleTheme }) => {
  return (
    <main className="min-h-screen">
      {/* Header */}
<header className="text-4xl md:text-9xl px-4 sm:px-6 py-8 flex  justify-between items-center gap-6">
  <ScrollAnimatedText text="TE" className="whitespace-nowrap" />

  <div className="w-[50%] -mt-10 md:w-[400px] lg:w-[500px] xl:w-[600px] flex-shrink-0">
    <Image
      src="/home/title.svg"
      alt="Team title"
      width={600}
      height={500}
      className="w-full h-auto object-contain"
      priority
    />
  </div>

  <ScrollAnimatedText text="CH" className="whitespace-nowrap" />
</header>

      {/* Main Content Section */}
      <section className="mx-auto  px-6 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Provide the best service with out of the box ideas
          </h2>
          <AnimatedTeamImages />
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative">
            <Image
              src="/home/figure.svg"
              alt="Statue with VR headset"
              width={650}
             height={650}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-8 ">
          <p className="text-base tracking-tight font-semibold">
            We are a passionate team of digital marketing enthusiasts dedicated
            to helping businesses succeed in the digital world. With years of
            experience and a deep understanding of the ever-evolving online
            landscape, we stay at the forefront of industry trends and
            technologies.
          </p>
          <AnimatedSocialIcons toggleTheme={toggleTheme} />
        </div>
      </section>

      {/* Footer */}
      <footer className="lg:absolute lg:-bottom-14 w-full">
  <div className=" flex flex-wrap justify-between items-center gap-4 px-4 sm:px-6 py-4 text-4xl sm:text-6xl md:text-7xl xl:text-9xl">
    <ScrollAnimatedText text="MORPHER" />
    <ScrollAnimatedText text="HERO" />
  </div>
</footer>

    </main>
  );
};

export default LandingPage;
