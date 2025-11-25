"use client"
import { ReactTyped } from "react-typed";


const Hero  = () => {
    return (
        <section className="relative h-screen w-full pt-16">
        {/* Background image */}
        <img
          src="/herobackgroundimg.svg"
          alt="hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1E1E]/1 to-[#1E1E1E]/100" />
      
        {/* Nội dung Hero */}
        <div className="relative z-10 h-full flex flex-col justify-center items-start text-white px-16 gap-5">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-branding font-bold leading-tight">
            Start a better shape of <span className="text-[#FFC107]">you!</span>
        </h1>

            <h2 className="text-2xl md:text-4xl font-branding text-white mb-4">
                We lead with quality in
                <span>
                    <ReactTyped className="pl-2 text-[#FFC107] tracking-wide"
                                strings={[
                                    "PRIVATE GYM",
                                    "MASSAGE",
                                    "FITNESS COATCHING",
                                ]}
                                typeSpeed={40}
                                backSpeed={50}
                                loop
                                showCursor={false}
                            />
                </span>
            </h2>
            <a href="#about">
                <button className="bg-[#FFC107] text-[#1E1E1E] px-6 py-3 rounded-full font-heading font-semibold hover:bg-white transition">
                        Learn More
                </button>
            </a>
            
        </div>

      </section>
    )
}

export default Hero;