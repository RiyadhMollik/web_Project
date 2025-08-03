import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCalendar, FaUser, FaClock, FaShare } from "react-icons/fa";

// Extended blog data with full content
const blogPosts = [
  {
    id: 1,
    title: "How CureSync is Revolutionizing Patient Scheduling",
    excerpt: "CureSync automates and optimizes the way doctors and patients manage appointments, ensuring no-shows are minimized and time is maximized for care.",
    content: `
      <p class="mb-6 text-lg leading-relaxed">
        In today's fast-paced healthcare environment, efficient patient scheduling is more critical than ever. 
        Traditional appointment booking systems often lead to missed appointments, administrative overhead, 
        and frustrated patients. CureSync is changing this landscape with its innovative approach to healthcare scheduling.
      </p>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">The Problem with Traditional Scheduling</h3>
      <p class="mb-6 text-lg leading-relaxed">
        Conventional appointment systems rely heavily on manual processes that are prone to errors and inefficiencies. 
        Patients often face long wait times on phone calls, limited availability during business hours, 
        and difficulty in rescheduling appointments. For healthcare providers, this translates to:
      </p>
      <ul class="list-disc list-inside mb-6 space-y-2 text-lg">
        <li>High no-show rates affecting revenue and resource utilization</li>
        <li>Administrative staff spending hours on phone calls and manual scheduling</li>
        <li>Difficulty in managing patient flow and optimizing doctor schedules</li>
        <li>Limited ability to provide real-time availability updates</li>
      </ul>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">CureSync's Revolutionary Solution</h3>
      <p class="mb-6 text-lg leading-relaxed">
        CureSync addresses these challenges through a comprehensive digital platform that leverages 
        artificial intelligence and machine learning to optimize the entire appointment booking process. 
        Our system provides:
      </p>
      <ul class="list-disc list-inside mb-6 space-y-2 text-lg">
        <li><strong>24/7 Availability:</strong> Patients can book appointments anytime, anywhere</li>
        <li><strong>Smart Scheduling:</strong> AI-powered algorithms optimize doctor schedules</li>
        <li><strong>Automated Reminders:</strong> Reduce no-shows with intelligent notification systems</li>
        <li><strong>Real-time Updates:</strong> Instant availability and schedule changes</li>
        <li><strong>Integration Capabilities:</strong> Seamless integration with existing healthcare systems</li>
      </ul>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">Key Benefits for Healthcare Providers</h3>
      <p class="mb-6 text-lg leading-relaxed">
        Healthcare providers using CureSync have reported significant improvements in their operations:
      </p>
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="bg-blue-50 p-6 rounded-lg">
          <h4 class="font-bold text-blue-700 mb-2">Reduced No-Shows</h4>
          <p class="text-gray-700">Up to 40% reduction in missed appointments through automated reminders and easy rescheduling.</p>
        </div>
        <div class="bg-green-50 p-6 rounded-lg">
          <h4 class="font-bold text-green-700 mb-2">Increased Efficiency</h4>
          <p class="text-gray-700">Administrative staff can focus on patient care instead of manual scheduling tasks.</p>
        </div>
        <div class="bg-purple-50 p-6 rounded-lg">
          <h4 class="font-bold text-purple-700 mb-2">Better Patient Satisfaction</h4>
          <p class="text-gray-700">Patients appreciate the convenience and flexibility of online booking.</p>
        </div>
        <div class="bg-orange-50 p-6 rounded-lg">
          <h4 class="font-bold text-orange-700 mb-2">Optimized Schedules</h4>
          <p class="text-gray-700">AI algorithms ensure optimal utilization of doctor time and resources.</p>
        </div>
      </div>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">The Future of Healthcare Scheduling</h3>
      <p class="mb-6 text-lg leading-relaxed">
        As healthcare continues to evolve, the importance of efficient, patient-centric scheduling systems 
        will only grow. CureSync is at the forefront of this transformation, continuously innovating 
        to provide the best possible experience for both healthcare providers and patients.
      </p>
      
      <p class="text-lg leading-relaxed">
        The future of healthcare scheduling is here, and it's powered by CureSync. 
        Join thousands of healthcare providers who have already transformed their 
        appointment booking process and are reaping the benefits of improved efficiency, 
        reduced costs, and enhanced patient satisfaction.
      </p>
    `,
    imageUrl: "https://via.placeholder.com/800x400?text=Scheduling+AI",
    publishedDate: "2025-07-20",
    author: "Dr. Sarah Johnson",
    readTime: "8 min read",
    category: "Healthcare Technology"
  },
  {
    id: 2,
    title: "5 Benefits of Automating Clinic Appointments with CureSync",
    excerpt: "From reducing staff workload to enhancing patient satisfaction, explore the key reasons clinics are adopting CureSync's smart scheduling system.",
    content: `
      <p class="mb-6 text-lg leading-relaxed">
        The healthcare industry is undergoing a digital transformation, and clinic appointment automation 
        is at the heart of this change. CureSync's automated scheduling system is helping clinics 
        across the country streamline their operations and improve patient care delivery.
      </p>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">1. Reduced Administrative Burden</h3>
      <p class="mb-6 text-lg leading-relaxed">
        One of the most significant benefits of automating clinic appointments is the dramatic reduction 
        in administrative workload. Traditional appointment booking requires dedicated staff to:
      </p>
      <ul class="list-disc list-inside mb-6 space-y-2 text-lg">
        <li>Answer phone calls during business hours</li>
        <li>Manually enter appointment details into systems</li>
        <li>Handle rescheduling requests and cancellations</li>
        <li>Send reminder calls and messages</li>
        <li>Manage waiting lists and emergency appointments</li>
      </ul>
      <p class="mb-6 text-lg leading-relaxed">
        With CureSync, these tasks are automated, allowing staff to focus on patient care and 
        other critical responsibilities. This can result in up to 70% reduction in administrative overhead.
      </p>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">2. Enhanced Patient Experience</h3>
      <p class="mb-6 text-lg leading-relaxed">
        Modern patients expect convenience and flexibility in their healthcare interactions. 
        CureSync's automated system provides:
      </p>
      <ul class="list-disc list-inside mb-6 space-y-2 text-lg">
        <li>24/7 appointment booking availability</li>
        <li>Instant confirmation and reminders</li>
        <li>Easy rescheduling without phone calls</li>
        <li>Digital health forms and pre-appointment instructions</li>
        <li>Integration with patient portals and mobile apps</li>
      </ul>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">3. Improved Schedule Optimization</h3>
      <p class="mb-6 text-lg leading-relaxed">
        CureSync's AI-powered scheduling algorithms analyze patterns and optimize clinic schedules for:
      </p>
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="bg-blue-50 p-6 rounded-lg">
          <h4 class="font-bold text-blue-700 mb-2">Peak Efficiency</h4>
          <p class="text-gray-700">Maximize doctor utilization and minimize idle time.</p>
        </div>
        <div class="bg-green-50 p-6 rounded-lg">
          <h4 class="font-bold text-green-700 mb-2">Patient Flow</h4>
          <p class="text-gray-700">Reduce wait times and improve patient satisfaction.</p>
        </div>
        <div class="bg-purple-50 p-6 rounded-lg">
          <h4 class="font-bold text-purple-700 mb-2">Resource Management</h4>
          <p class="text-gray-700">Better allocation of rooms, equipment, and staff.</p>
        </div>
        <div class="bg-orange-50 p-6 rounded-lg">
          <h4 class="font-bold text-orange-700 mb-2">Emergency Slots</h4>
          <p class="text-gray-700">Reserve time for urgent care and emergency appointments.</p>
        </div>
      </div>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">4. Cost Reduction and Revenue Optimization</h3>
      <p class="mb-6 text-lg leading-relaxed">
        Automated appointment systems directly impact the bottom line through:
      </p>
      <ul class="list-disc list-inside mb-6 space-y-2 text-lg">
        <li>Reduced no-show rates (up to 40% improvement)</li>
        <li>Lower administrative costs</li>
        <li>Increased appointment capacity</li>
        <li>Better resource utilization</li>
        <li>Reduced phone system and staffing costs</li>
      </ul>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">5. Data-Driven Insights and Analytics</h3>
      <p class="mb-6 text-lg leading-relaxed">
        CureSync provides comprehensive analytics that help clinics make informed decisions:
      </p>
      <ul class="list-disc list-inside mb-6 space-y-2 text-lg">
        <li>Appointment booking patterns and trends</li>
        <li>No-show analysis and prediction</li>
        <li>Patient satisfaction metrics</li>
        <li>Staff productivity and utilization reports</li>
        <li>Revenue optimization recommendations</li>
      </ul>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">Implementation and Success Stories</h3>
      <p class="mb-6 text-lg leading-relaxed">
        Clinics implementing CureSync typically see results within the first 30 days. 
        Our implementation process is designed to be smooth and minimally disruptive to existing operations.
      </p>
      
      <p class="text-lg leading-relaxed">
        The benefits of automating clinic appointments with CureSync extend far beyond 
        simple convenience. It's about transforming the way healthcare is delivered, 
        making it more efficient, patient-centered, and sustainable for the future.
      </p>
    `,
    imageUrl: "https://via.placeholder.com/800x400?text=Clinic+Automation",
    publishedDate: "2025-07-25",
    author: "Dr. Michael Chen",
    readTime: "10 min read",
    category: "Clinic Management"
  },
  {
    id: 3,
    title: "Improving Healthcare Efficiency with CureSync",
    excerpt: "Learn how CureSync streamlines communication between front desks and patients, making healthcare delivery smoother and faster.",
    content: `
      <p class="mb-6 text-lg leading-relaxed">
        Healthcare efficiency is not just about speed—it's about delivering the right care, 
        at the right time, with the right resources. CureSync is revolutionizing healthcare 
        efficiency by addressing the communication gaps that often slow down care delivery.
      </p>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">The Communication Challenge in Healthcare</h3>
      <p class="mb-6 text-lg leading-relaxed">
        Traditional healthcare communication relies heavily on phone calls, paper forms, 
        and manual processes that create bottlenecks and delays. These inefficiencies affect:
      </p>
      <ul class="list-disc list-inside mb-6 space-y-2 text-lg">
        <li>Patient wait times and satisfaction</li>
        <li>Staff productivity and job satisfaction</li>
        <li>Resource utilization and cost management</li>
        <li>Care coordination and outcomes</li>
        <li>Emergency response and urgent care delivery</li>
      </ul>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">CureSync's Integrated Communication Platform</h3>
      <p class="mb-6 text-lg leading-relaxed">
        CureSync addresses these challenges through a comprehensive communication platform that connects 
        all stakeholders in the healthcare delivery process:
      </p>
      
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="bg-blue-50 p-6 rounded-lg text-center">
          <div class="text-4xl mb-4">👥</div>
          <h4 class="font-bold text-blue-700 mb-2">Patient Portal</h4>
          <p class="text-gray-700">Secure access to appointments, medical records, and communication with providers.</p>
        </div>
        <div class="bg-green-50 p-6 rounded-lg text-center">
          <div class="text-4xl mb-4">🏥</div>
          <h4 class="font-bold text-green-700 mb-2">Provider Dashboard</h4>
          <p class="text-gray-700">Comprehensive view of patient schedules, communications, and care coordination.</p>
        </div>
        <div class="bg-purple-50 p-6 rounded-lg text-center">
          <div class="text-4xl mb-4">📱</div>
          <h4 class="font-bold text-purple-700 mb-2">Mobile Integration</h4>
          <p class="text-gray-700">Real-time notifications and updates across all devices and platforms.</p>
        </div>
      </div>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">Key Efficiency Improvements</h3>
      
      <h4 class="text-xl font-bold text-gray-800 mb-3">1. Automated Patient Communication</h4>
      <p class="mb-6 text-lg leading-relaxed">
        CureSync automates routine communications such as appointment reminders, 
        pre-visit instructions, and follow-up care plans. This reduces manual workload 
        and ensures consistent, timely communication with patients.
      </p>
      
      <h4 class="text-xl font-bold text-gray-800 mb-3">2. Real-Time Schedule Management</h4>
      <p class="mb-6 text-lg leading-relaxed">
        Dynamic scheduling allows for real-time updates and adjustments, 
        reducing cancellations and optimizing resource allocation. 
        Emergency appointments can be seamlessly integrated without disrupting existing schedules.
      </p>
      
      <h4 class="text-xl font-bold text-gray-800 mb-3">3. Integrated Care Coordination</h4>
      <p class="mb-6 text-lg leading-relaxed">
        CureSync facilitates communication between different healthcare providers, 
        ensuring seamless care transitions and reducing the risk of medical errors 
        or missed follow-ups.
      </p>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">Measurable Impact on Healthcare Delivery</h3>
      <p class="mb-6 text-lg leading-relaxed">
        Healthcare facilities using CureSync have reported significant improvements:
      </p>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <h4 class="font-bold text-xl mb-2">50% Reduction</h4>
          <p>In patient wait times and administrative delays</p>
        </div>
        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <h4 class="font-bold text-xl mb-2">30% Increase</h4>
          <p>In staff productivity and satisfaction</p>
        </div>
        <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <h4 class="font-bold text-xl mb-2">25% Improvement</h4>
          <p>In patient satisfaction scores</p>
        </div>
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <h4 class="font-bold text-xl mb-2">40% Decrease</h4>
          <p>In communication-related errors</p>
        </div>
      </div>
      
      <h3 class="text-2xl font-bold text-blue-700 mb-4">Future of Healthcare Efficiency</h3>
      <p class="mb-6 text-lg leading-relaxed">
        As healthcare continues to evolve, the importance of efficient communication 
        and coordination will only grow. CureSync is committed to staying at the 
        forefront of healthcare technology, continuously innovating to provide 
        the most efficient and effective solutions for healthcare delivery.
      </p>
      
      <p class="text-lg leading-relaxed">
        The future of healthcare efficiency is here, and it's powered by CureSync. 
        Join the growing number of healthcare providers who are transforming 
        their operations and improving patient outcomes through better communication 
        and coordination.
      </p>
    `,
    imageUrl: "https://via.placeholder.com/800x400?text=Efficiency+Healthcare",
    publishedDate: "2025-07-30",
    author: "Dr. Emily Rodriguez",
    readTime: "12 min read",
    category: "Healthcare Efficiency"
  }
];

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find(p => p.id === parseInt(id));
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Blog
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
                <div className="flex items-center">
                  <FaCalendar className="mr-1" />
                  {new Date(post.publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center">
                  <FaUser className="mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  {post.readTime}
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Article Body */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Share this article:</span>
                  <button className="text-blue-600 hover:text-blue-700 transition-colors">
                    <FaShare className="text-xl" />
                  </button>
                </div>
                <button
                  onClick={() => navigate('/blog')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Blog
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogDetail; 