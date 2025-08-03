import React from "react";
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "How CureSync is Revolutionizing Patient Scheduling",
    excerpt:
      "CureSync automates and optimizes the way doctors and patients manage appointments, ensuring no-shows are minimized and time is maximized for care.",
    imageUrl: "https://via.placeholder.com/400x200?text=Scheduling+AI",
    publishedDate: "2025-07-20"
  },
  {
    id: 2,
    title: "5 Benefits of Automating Clinic Appointments with CureSync",
    excerpt:
      "From reducing staff workload to enhancing patient satisfaction, explore the key reasons clinics are adopting CureSync’s smart scheduling system.",
    imageUrl: "https://via.placeholder.com/400x200?text=Clinic+Automation",
    publishedDate: "2025-07-25"
  },
  {
    id: 3,
    title: "Improving Healthcare Efficiency with CureSync",
    excerpt:
      "Learn how CureSync streamlines communication between front desks and patients, making healthcare delivery smoother and faster.",
    imageUrl: "https://via.placeholder.com/400x200?text=Efficiency+Healthcare",
    publishedDate: "2025-07-30"
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
  })
};

// Simple date formatting function
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default function Blog() {
  return (
    <section className="relative mx-10 md:mx-20 py-16 bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-inner overflow-hidden">
      {/* Blob animation background */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
        style={{ transform: "translateX(-50%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-40 left-1/4 w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"
      />
      <div
        aria-hidden="true"
        className="absolute top-60 right-1/3 w-[400px] h-[400px] bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"
      />

      <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">📰 CureSync Blog</h2>

      <div className="grid gap-8 md:grid-cols-3 z-10 relative">
        {blogPosts.map((post, i) => (
          <motion.div
            key={post.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="overflow-hidden rounded-xl mb-4">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-semibold text-blue-700 mb-1 group-hover:underline">
              {post.title}
            </h3>
            <p className="text-gray-400 text-xs mb-3 italic">Published: {formatDate(post.publishedDate)}</p>
            <p className="text-gray-600 mb-6 text-sm">{post.excerpt}</p>
            <button className="text-blue-500 font-medium hover:underline">See details →</button>
          </motion.div>
        ))}
      </div>

      {/* Blob animation keyframes in tailwind.config.js or via inline style (see note below) */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
