"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { TiStar } from "react-icons/ti";

// ✅ Define the testimonial type
type Testimonial = {
  id: number;
  name: string;
  feedback: string;
  rating: number; // 1–5 scale
};

const TerSet = [
    {
      "id": 1,
      "name": "Sophia Lee",
      "feedback": "Amazing experience! Trainers are so friendly and professional.",
      "rating": 5
    },
    {
      "id": 2,
      "name": "Daniel Kim",
      "feedback": "Love the flexibility in scheduling and the modern gym equipment.",
      "rating": 4
    },
    {
    "id": 3,
    "name": "Daniel Kim",
    "feedback": "Love the flexibility in scheduling and the modern gym equipment.",
    "rating": 4
    },
    {
    "id": 4,
    "name": "Daniel Kim",
    "feedback": "Love the flexibility in scheduling and the modern gym equipment.",
    "rating": 4
    },
    {
    "id": 5,
    "name": "Daniel Kim",
    "feedback": "Love the flexibility in scheduling and the modern gym equipment.",
    "rating": 4
    },
    {
    "id": 6,
    "name": "Daniel Kim",
    "feedback": "Love the flexibility in scheduling and the modern gym equipment.",
    "rating": 4
    }
]


const Feedback: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TerSet);

  useEffect(() => {
    fetch("/testimonials.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load testimonials");
        return response.json();
      })
      .then((data: Testimonial[]) => setTestimonials(data))
      .catch((error) => console.error("Error loading testimonials:", error));
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        staggerChildren: 0.15,
      },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="p-10 bg-black text-white"
    >
      <motion.h2
        className="text-3xl text-center mb-10 font-bebas tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        What Our Customers Say
      </motion.h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="max-w-6xl mx-auto pb-16"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <motion.div
              variants={card}
              className="p-6 bg-[#2B2B2B] rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col items-center text-center"
            >
              <motion.div
                className="w-14 h-14 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-3"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-xl font-bold text-yellow-400">
                  {testimonial.name[0]}
                </span>
              </motion.div>

              <h3 className="text-lg font-semibold text-white font-poppins">
                {testimonial.name}
              </h3>
              <p className="text-gray-300 mt-3 text-sm leading-relaxed line-clamp-4">
                {testimonial.feedback}
              </p>

              <div className="mt-3 flex flex-row justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <TiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

export default Feedback;
