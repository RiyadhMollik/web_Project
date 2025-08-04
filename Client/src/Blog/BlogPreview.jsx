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
    imageUrl: "data:image/jpeg;base64,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",
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
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPmAzmEMjJDAVJds0vN9n9qMoUi_EhK7J80g&s",
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
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF2ePYVDViuQCuX5ifCqHXFDikJTkyYTKOmA&s",
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