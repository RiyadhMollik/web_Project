import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-black py-12 px-4 md:px-20">
      {/* About Section */}
      <section className="max-w-4xl mx-auto mb-16 animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4 text-center">About CureSync</h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          CureSync is a modern digital healthcare platform designed to simplify
          doctor appointments, medical record management, and patient-doctor
          communication. Our mission is to empower patients, doctors, and
          administrators with secure, efficient, and user-friendly tools for a
          seamless healthcare experience.
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
            <p className="text-gray-600 mb-4">
              We believe in accessible, transparent, and efficient healthcare
              for everyone. CureSync bridges the gap between patients and
              healthcare providers, making it easy to book appointments, manage
              reports, and stay connected.
            </p>
            <h2 className="text-2xl font-semibold mb-2">Our Location</h2>
            <p className="text-gray-600 mb-2">
              123 Health Avenue, MedCity, Country
            </p>
          </div>
          <div className="flex-1 w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="CureSync Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019234567890!2d-122.419415484681!3d37.7749297797596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c5b0e6b1b%3A0x4a0b0b0b0b0b0b0b!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 animate-fade-in-up">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <form className="flex-1 space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full"
              required
            />
            <textarea
              placeholder="Your Message"
              className="textarea textarea-bordered w-full"
              rows={4}
              required
            ></textarea>
            <button type="submit" className="btn btn-primary w-full">
              Send Message
            </button>
          </form>
          <div className="flex-1 flex flex-col justify-center items-center text-center md:text-left">
            <div className="mb-4">
              <div className="font-semibold">Email:</div>
              <a
                href="mailto:info@curesync.com"
                className="text-blue-600 hover:underline"
              >
                info@curesync.com
              </a>
            </div>
            <div className="mb-4">
              <div className="font-semibold">Phone:</div>
              <a
                href="tel:+1234567890"
                className="text-blue-600 hover:underline"
              >
                +1 234 567 890
              </a>
            </div>
            <div>
              <div className="font-semibold">Address:</div>
              <div>123 Health Avenue, MedCity, Country</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
