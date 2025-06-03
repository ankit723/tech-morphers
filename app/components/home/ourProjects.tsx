import Project from '@/components/project'
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import LetterHover from '@/components/ui/letterHover';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const OurProjects = () => {
    const projects = [
        {
            imgUrl: "/portfolio/merchlandScreen.png",
            category: "Web Development",
            title: "Merchland",
            description: "Merchland is a platform for creating and managing your own merch store. It allows you to create a store, add products, and manage your store.",
            link: "https://demo.merchland.com"
        },
        {
            imgUrl: "/portfolio/consoleflareScreen.png",
            category: "Web Development",
            title: "Consoleflare",
            description: "Consoleflare is a platform for studying and learning data science and machine learning. It allows you to stream live and recorded classes.",
            link: "https://consoleflare.com"
        },
        {
            imgUrl: "/portfolio/animooxScreen.png",
            category: "Web Development",
            title: "Animoox",
            description: "Animoox is a platform for downloading lottie animations.",
            link: "https://animoox.vercel.app"
        },
        {
            imgUrl: "/portfolio/stettoScreen2.png",
            category: "Web Development",
            title: "Stetto Posts",
            description: "Stetto Posts is a platform for creating and managing your own social media posts. It allows you to create a post, add products, and manage your post.",
            link: "https://stetto.live"
        },
        {
            imgUrl: "/portfolio/leadfumeScreen.png",
            category: "Web Development",
            title: "Leadfume",
            description: "Leadfume is a platform where businesses can find there leads and customers. Which will help the business to grow and expand.",
            link: "https://leadfume.com"
        },
        {
            imgUrl: "/portfolio/stettoScreen2.png",
            category: "Web Development",
            title: "Stetto Posts",
            description: "Stetto Posts is a platform for creating and managing your own social media posts. It allows you to create a post, add products, and manage your post.",
            link: "https://stetto.live"
        },
        {
            imgUrl: "/portfolio/realtorScreen.png",
            category: "Web Development",
            title: "Realtor Guide",
            description: "Realtor Guide is a platform for showcasing the properties and services of a realtor. Which will help the realtor to grow and expand.",
            link: "https://ankit723.github.io/realtor_big_estate/"
        },
    ]
    const firstRowRef = useRef<HTMLDivElement>(null);
    const secondRowRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
      // Register ScrollTrigger plugin
      useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        
        // Animate the headline text
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "center center",
                toggleActions: "play none none reverse"
            }
        })
        
        // Safely animate children of row refs
        if (firstRowRef.current) {
            tl.from(Array.from(firstRowRef.current.children), {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out"
            })
        }
        
        if (secondRowRef.current) {
            tl.from(Array.from(secondRowRef.current.children), {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.4")
        }
        
        // Animate scroll indicator
        if (scrollRef.current) {
            gsap.to(scrollRef.current, {
                y: 10,
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: "sine.inOut"
            })
        }
        
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [])
    
    return (
        <div className="relative mb-20 -mt-10" ref={sectionRef}>
            <div className="container mx-auto">
                <div ref={firstRowRef} className="flex gap-10 justify-center">
                    <LetterHover 
                        text="OUR" 
                        initialColor="blue-700" 
                        endColor="dark-adaptive" 
                        className="text-[2.3rem] md:text-[8rem] font-semibold" 
                    />
                    <LetterHover 
                        text="RECENT" 
                        initialColor="blue-700" 
                        endColor="dark-adaptive" 
                        className="text-[2.3rem] md:text-[8rem] font-semibold" 
                    />
                </div>

                <div ref={secondRowRef} className="flex gap-10 md:gap-20 justify-center md:-mt-10">
                    <LetterHover 
                        text="PROJECTS" 
                        initialColor="dark-adaptive" 
                        endColor="blue-700" 
                        className="text-[2.4rem] md:text-[8rem] font-semibold" 
                    />
                    <LetterHover 
                        text="&" 
                        initialColor="dark-adaptive" 
                        endColor="blue-700" 
                        className="text-[2.4rem] md:text-[8rem] font-semibold" 
                    />
                    <LetterHover 
                        text="PRODUCTS" 
                        initialColor="dark-adaptive" 
                        endColor="blue-700" 
                        className="text-[2.4rem] md:text-[8rem] font-semibold" 
                    />
                </div>
            </div>
        
            <div className=" flex items-center justify-center gap-10">
                <Swiper
                    modules={[Autoplay, FreeMode]}
                    loop={true}
                    speed={2000}
                    freeMode={false}
                    spaceBetween={30}
                    slidesPerView="auto"
                    autoplay={{ delay: 1, disableOnInteraction: false }}
                    grabCursor={true}
                    allowTouchMove={false}
                    className="mySwiper"
                >
                    {projects.map((project, index) => (
                        <SwiperSlide key={index} className="!w-[24rem]" >
                            <Project imgUrl={project.imgUrl} category={project.category} title={project.title} description={project.description} link={project.link} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* Left Gradient Overlay */}
                <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-50 pointer-events-none" />

                {/* Right Gradient Overlay */}
                <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-50 pointer-events-none" />
            </div>
        </div>
    )
}

export default OurProjects