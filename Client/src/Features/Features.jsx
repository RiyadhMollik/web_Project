import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  FaUserMd, 
  FaCalendarCheck, 
  FaChartLine, 
  FaShieldAlt, 
  FaMobileAlt, 
  FaBell,
  FaSearch,
  FaCreditCard,
  FaFileMedical,
  FaComments,
  FaStar,
  FaClock,
  FaMapMarkerAlt
} from "react-icons/fa";

const Features = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const featureCards = [
    {
      icon: <FaUserMd className="text-4xl" />,
      title: "Expert Doctor Network",
      description: "Connect with qualified healthcare professionals across various specialties with verified credentials and extensive experience.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <FaCalendarCheck className="text-4xl" />,
      title: "Smart Appointment Booking",
      description: "Book appointments instantly with real-time availability, automated scheduling, and intelligent time slot recommendations.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Health Analytics Dashboard",
      description: "Track your health journey with comprehensive analytics, appointment history, and personalized health insights.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security, HIPAA compliance, and end-to-end encryption.",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: <FaMobileAlt className="text-4xl" />,
      title: "Mobile-First Experience",
      description: "Access healthcare services anywhere with our responsive mobile app designed for seamless user experience.",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      icon: <FaBell className="text-4xl" />,
      title: "Smart Notifications",
      description: "Stay informed with intelligent reminders for appointments, medication schedules, and important health updates.",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Search & Discover",
      description: "Find the perfect doctor by specialty, location, or availability",
      icon: <FaSearch className="text-2xl" />,
      color: "bg-blue-500"
    },
    {
      step: "02",
      title: "Book Appointment",
      description: "Select your preferred time slot and book instantly",
      icon: <FaCalendarCheck className="text-2xl" />,
      color: "bg-green-500"
    },
    {
      step: "03",
      title: "Secure Payment",
      description: "Complete payment with multiple secure payment options",
      icon: <FaCreditCard className="text-2xl" />,
      color: "bg-purple-500"
    },
    {
      step: "04",
      title: "Get Consultation",
      description: "Attend your appointment and receive quality care",
      icon: <FaUserMd className="text-2xl" />,
      color: "bg-orange-500"
    },
    {
      step: "05",
      title: "Follow-up Care",
      description: "Access medical records and schedule follow-ups",
      icon: <FaFileMedical className="text-2xl" />,
      color: "bg-red-500"
    }
  ];

  const benefits = [
    {
      icon: <FaClock className="text-3xl" />,
      title: "Save Time",
      description: "No more waiting in queues. Book appointments in seconds.",
      color: "text-blue-600"
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl" />,
      title: "Location Flexibility",
      description: "Find doctors near you or book virtual consultations.",
      color: "text-green-600"
    },
    {
      icon: <FaStar className="text-3xl" />,
      title: "Quality Care",
      description: "Verified doctors with excellent patient reviews.",
      color: "text-yellow-600"
    },
    {
      icon: <FaComments className="text-3xl" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs.",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Discover Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Powerful Features
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8"
          >
            Experience healthcare reimagined with cutting-edge technology and user-centric design
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </motion.div>
        </div>
        
        {/* Animated Background Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white/20 rounded-full"
        />
      </motion.div>

      {/* Overview Section */}
      <motion.section
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose CureSync?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built a comprehensive healthcare platform that puts patients first, 
              making quality healthcare accessible, convenient, and secure for everyone.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {featureCards.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`${feature.bgColor} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100`}
              >
                <div className={`${feature.iconColor} mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with CureSync in just 5 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {index < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 z-0"></div>
                )}
                <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 relative z-10`}>
                  {step.step}
                </div>
                <div className="text-gray-400 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-blue-50 to-purple-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Benefits You'll Love
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover why thousands of patients choose CureSync for their healthcare needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300"
              >
                <div className={`${benefit.color} mb-4`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Transform Your Healthcare Experience?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-8 text-blue-100"
          >
            Join thousands of patients who trust CureSync for their healthcare needs
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              Contact Support
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Features; 