import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCalendar, FaUser, FaClock, FaEye } from "react-icons/fa";

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
  },
  {
    id: 4,
    title: "The Future of Telemedicine with CureSync",
    excerpt:
      "Discover how CureSync is bridging the gap between traditional healthcare and modern telemedicine solutions.",
    imageUrl: "https://via.placeholder.com/400x200?text=Telemedicine",
    publishedDate: "2025-08-05",
    category: "Telemedicine",
    author: "Dr. James Wilson",
    readTime: "6 min read"
  },
  {
    id: 5,
    title: "Patient Data Security in the Digital Age",
    excerpt:
      "Understanding how CureSync ensures HIPAA compliance and protects sensitive patient information.",
    imageUrl: "https://via.placeholder.com/400x200?text=Data+Security",
    publishedDate: "2025-08-10",
    category: "Security & Compliance",
    author: "Dr. Lisa Thompson",
    readTime: "9 min read"
  },
  {
    id: 6,
    title: "AI-Powered Healthcare: The CureSync Advantage",
    excerpt:
      "Explore how artificial intelligence is transforming healthcare delivery through CureSync's innovative platform.",
    imageUrl: "https://via.placeholder.com/400x200?text=AI+Healthcare",
    publishedDate: "2025-08-15",
    category: "Artificial Intelligence",
    author: "Dr. Robert Kim",
    readTime: "11 min read"
  },
  {
    id: 7,
    title: "Mobile Health Apps: The CureSync Mobile Experience",
    excerpt:
      "How CureSync's mobile application is making healthcare more accessible and convenient for patients on the go.",
    imageUrl: "https://via.placeholder.com/400x200?text=Mobile+Health",
    publishedDate: "2025-08-20",
    category: "Mobile Health",
    author: "Dr. Amanda Davis",
    readTime: "7 min read"
  },
  {
    id: 8,
    title: "Healthcare Analytics: Driving Better Outcomes with Data",
    excerpt:
      "Learn how CureSync's analytics platform helps healthcare providers make data-driven decisions for better patient outcomes.",
    imageUrl: "https://via.placeholder.com/400x200?text=Analytics",
    publishedDate: "2025-08-25",
    category: "Healthcare Analytics",
    author: "Dr. Carlos Martinez",
    readTime: "9 min read"
  },
  {
    id: 9,
    title: "The Role of Machine Learning in Modern Healthcare",
    excerpt:
      "Discover how CureSync leverages machine learning algorithms to predict patient needs and optimize care delivery.",
    imageUrl: "https://via.placeholder.com/400x200?text=Machine+Learning",
    publishedDate: "2025-08-30",
    category: "Machine Learning",
    author: "Dr. Jennifer Lee",
    readTime: "13 min read"
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
  })
};

// Simple date formatting function
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default function Blog() {
  const [visiblePosts, setVisiblePosts] = useState(6);
  const navigate = useNavigate();

  const handleViewMore = () => {
    setVisiblePosts(prev => Math.min(prev + 3, blogPosts.length));
  };

  const handleSeeDetails = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const displayedPosts = blogPosts.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < blogPosts.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            📰 CureSync Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest insights, innovations, and trends in healthcare technology
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {displayedPosts.map((post, i) => (
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
        {hasMorePosts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button
              onClick={handleViewMore}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View More Articles ({blogPosts.length - visiblePosts} remaining)
            </button>
          </motion.div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Stay Updated with CureSync</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the latest healthcare technology insights, tips, and updates delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for line clamping */}
      <style jsx>{`
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
    </div>
  );
}
