import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-gray-200 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About Section */}
        <div>
          <h3 className="text-3xl font-extrabold mb-3 text-white">CureSync</h3>
          <p className="text-gray-200 leading-relaxed">
            Automating doctor-patient appointments to improve healthcare efficiency and reduce no-shows.
          </p>
          <div className="flex space-x-4 mt-6">
            {/* Social icons */}
            <a href="#" aria-label="Facebook" title="Facebook" className="hover:text-blue-500 transition-colors duration-300">
              {/* Facebook SVG */}
              <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.466.099 2.797.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.764v2.31h3.59l-.467 3.622h-3.123V24h6.116C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" title="Twitter" className="hover:text-blue-400 transition-colors duration-300">
              {/* Twitter SVG */}
              <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M24 4.557a9.94 9.94 0 01-2.828.775 4.932 4.932 0 002.164-2.724 9.86 9.86 0 01-3.127 1.195 4.917 4.917 0 00-8.373 4.482A13.95 13.95 0 011.671 3.15 4.917 4.917 0 003.195 9.72 4.897 4.897 0 012 .855v.061a4.916 4.916 0 003.946 4.81 4.902 4.902 0 01-2.212.084 4.918 4.918 0 004.588 3.414 9.863 9.863 0 01-6.102 2.105c-.397 0-.79-.023-1.175-.068a13.945 13.945 0 007.548 2.213c9.057 0 14.009-7.506 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" title="LinkedIn" className="hover:text-blue-700 transition-colors duration-300">
              {/* LinkedIn SVG */}
              <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.025-3.039-1.852-3.039-1.852 0-2.136 1.446-2.136 2.94v5.668H9.354V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.369-1.852 3.6 0 4.267 2.37 4.267 5.451v6.292zM5.337 7.433c-1.144 0-2.067-.927-2.067-2.07 0-1.144.923-2.07 2.067-2.07 1.144 0 2.07.926 2.07 2.07 0 1.143-.926 2.07-2.07 2.07zm1.777 13.019H3.56V9h3.553v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.204 24 24 23.227 24 22.271V1.729C24 .774 23.204 0 22.225 0z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-indigo-400 transition">Home</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition">Blog</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition">Testimonials</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-white">Contact Us</h4>
          <p className="mb-2">Email: <a href="mailto:support@curesync.com" className="hover:text-indigo-400 transition">support@curesync.com</a></p>
          <p className="mb-2">Phone: <a href="tel:+18001234567" className="hover:text-indigo-400 transition">+1 (800) 123-4567</a></p>
          <p className="text-gray-200">Address: 123 Health St, MedCity, USA</p>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-white">Stay Updated</h4>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              aria-label="Email address"
              className="px-3 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mt-10 border-t border-indigo-700 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} CureSync. All rights reserved.
      </div>
    </footer>
  );
}
