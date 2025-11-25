import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import ContactSection from "@/components/public/Contact";
import Feedback from "@/components/public/Feedback";

export default function Home() {
  return (
    <>
      
      <Hero />
      <About />
      <section className="relative w-full pt-16">
        <img
          src="/herobackgroundimg.svg"
          alt="hero background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/90 to-[#1E1E1E] z-10" />
        <div className="relative z-20">
          <ContactSection />
          <Feedback />
        </div>
      </section>
    </>
  );
}