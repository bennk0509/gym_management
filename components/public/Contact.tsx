"use client"

import { FaFacebookF, FaInstagram, FaFacebookMessenger } from 'react-icons/fa';

export default function ContactSection() {
  return (
    // <section className="relative w-full h-screen pt-16 flex flex-col items-center justify-center">
    //     {/* Background image */}
    //     <img
    //       src="./herobg.svg"
    //       alt="hero background"
    //       className="absolute inset-0 w-full h-full object-cover"
    //     />
      
    //     {/* Gradient overlay */}
    //     <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/90 to-[#1E1E1E]" />
    <section className="w-full pb-20 mb-20 flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center justify-center px-10 text-white gap-5">
            <h1 className="font-branding text-6xl z-50 tracking-widest">VISIT OUR GYM</h1>
            <div className="relative p-10 pl-100 max-w-5xl mx-auto z-10 bg-[#4B4B4B] rounded-r-lg flex flex-col">
                <div className='font-heading tracking-wide text-sm'>
                    <p className="text-yellow-400 mb-2">
                        Address: <span className="text-white font-medium">242 Đ. Vành Đai Trong, Bình Trị Đông B, Bình Tân, Hồ Chí Minh, Vietnam</span>
                    </p>
                    <p className="text-yellow-400 mb-2">
                        Email: <span className="text-white">leduchuyk38@gmail.com</span>
                    </p>
                    <p className="text-yellow-400 mb-6">
                        Contact: <span className="text-white">+84 70 655 7168</span>
                    </p>
                </div>
                <div className='font-branding text-yellow-400 text-4xl gap-2 flex flex-col'>
                    <h1>Our socials: </h1>
                    <div className="flex gap-4 text-2xl mt-3">
                        <a href="" className="bg-white text-[#4B4B4B] p-2 rounded-full hover:bg-[#FFC107] transition">
                        <FaFacebookF />
                        </a>
                        <a href="#" className="bg-white text-[#4B4B4B] p-2 rounded-full hover:bg-[#FFC107] transition">
                        <FaFacebookMessenger />
                        </a>
                        <a href="#" className="bg-white text-[#4B4B4B] p-2 rounded-full hover:bg-[#FFC107] transition">
                        <FaInstagram />
                        </a>
                    </div>
                </div>

                {/* Map Box Overlapping */}
                <div className="absolute -top-20 -left-20 w-[400px] h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.792236406521!2d106.61286727598345!3d10.750489589396725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752d480855748b%3A0xea78df10efc2a92e!2sHT%20Massage%20Therapy!5e0!3m2!1sen!2sca!4v1747278478997!5m2!1sen!2sca" // add real map link
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
                </div>
            </div>
        </div>
    </section>
  );
}
