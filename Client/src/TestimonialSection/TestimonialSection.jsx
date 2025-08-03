import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Dr. Emily Carter",
    quote:
      "CureSync has completely transformed the way my clinic handles appointments. Our patients love the convenience!",
    imageUrl: "https://via.placeholder.com/100?text=Dr+E"
  },
  {
    id: 2,
    name: "Michael Johnson, Clinic Manager",
    quote:
      "We’ve reduced no-shows by 40% since switching to CureSync. It's intuitive, efficient, and reliable.",
    imageUrl: "https://via.placeholder.com/100?text=MJ"
  },
  {
    id: 3,
    name: "Sarah Lee, Patient",
    quote:
      "Booking appointments with CureSync is so easy. I get reminders and can reschedule without calling in!",
    imageUrl: "https://via.placeholder.com/100?text=SL"
  }
];

const slideVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 }
};

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative mx-20 py-20 px-6 overflow-hidden rounded-2xl shadow-xl mt-16 bg-gradient-to-b from-blue-100 to-white">
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-16 -right-16 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"
        animate={{ x: [0, -30, 20, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900 relative z-10">
        ❤️ What Our Users Say
      </h2>

      <div className="relative w-full max-w-4xl mx-auto z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonials[current].id}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <img
              src={testimonials[current].imageUrl}
              alt={testimonials[current].name}
              className="w-24 h-24 mx-auto rounded-full mb-6 border-4 border-blue-100 object-cover"
            />
            <p className="text-gray-700 italic mb-4 leading-relaxed max-w-xl mx-auto">
              “{testimonials[current].quote}”
            </p>
            <p className="font-bold text-blue-600 text-lg">
              {testimonials[current].name}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
