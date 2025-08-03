import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCalendar, FaUser, FaClock, FaEye, FaArrowRight } from "react-icons/fa";

const blogPosts = [
  {
    id: 1,
    title: "How CureSync is Revolutionizing Patient Scheduling",
    excerpt:
      "CureSync automates and optimizes the way doctors and patients manage appointments, ensuring no-shows are minimized and time is maximized for care.",
    imageUrl: "https://via.placeholder.com/400x200?text=Scheduling+AI",
    publishedDate: "2025-07-20",
    category: "Healthcare Technology",
    author: "Dr. Sarah Johnson",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "5 Benefits of Automating Clinic Appointments with CureSync",
    excerpt:
      "From reducing staff workload to enhancing patient satisfaction, explore the key reasons clinics are adopting CureSync's smart scheduling system.",
    imageUrl: "https://via.placeholder.com/400x200?text=Clinic+Automation",
    publishedDate: "2025-07-25",
    category: "Clinic Management",
    author: "Dr. Michael Chen",
    readTime: "10 min read"
  },
  {
    id: 3,
    title: "Improving Healthcare Efficiency with CureSync",
    excerpt:
      "Learn how CureSync streamlines communication between front desks and patients, making healthcare delivery smoother and faster.",
    imageUrl: "https://via.placeholder.com/400x200?text=Efficiency+Healthcare",
    publishedDate: "2025-07-30",
    category: "Healthcare Efficiency",
    author: "Dr. Emily Rodriguez",
    readTime: "12 min read"
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

export default function BlogPreview() {
  const navigate = useNavigate();

  const handleSeeDetails = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleViewMore = () => {
    navigate('/blog');
  };

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

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">📰 Latest from Our Blog</h2>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center text-gray-400 text-xs">
                    <FaClock className="mr-1" />
                    {post.readTime}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Meta Information */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FaCalendar className="mr-1" />
                    {formatDate(post.publishedDate)}
                  </div>
                  <div className="flex items-center">
                    <FaUser className="mr-1" />
                    {post.author}
                  </div>
                </div>

                {/* Excerpt */}
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* See Details Button */}
                <button
                  onClick={() => handleSeeDetails(post.id)}
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 group-hover:shadow-md"
                >
                  <FaEye className="mr-2" />
                  See Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={handleViewMore}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center mx-auto"
          >
            View All Articles
            <FaArrowRight className="ml-2" />
          </button>
        </motion.div>
      </div>

      {/* Blob animation keyframes */}
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
} 