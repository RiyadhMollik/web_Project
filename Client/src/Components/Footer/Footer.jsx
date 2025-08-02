import React from 'react';

const Footer = () => {
  return (
    <>
      {/* Top Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-10 flex flex-wrap justify-between">
        <nav className="mb-8 md:mb-0">
          <h6 className="text-lg font-bold mb-4">Services</h6>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200 mb-2">Appointment Booking</a>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200 mb-2">Prescription Management</a>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200 mb-2">Medical Reports</a>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200">Billing & Invoicing</a>
        </nav>
        <nav className="mb-8 md:mb-0">
          <h6 className="text-lg font-bold mb-4">Company</h6>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200 mb-2">About CureSync</a>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200 mb-2">Contact</a>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200 mb-2">Careers</a>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200">Blog</a>
        </nav>
        <nav>
          <h6 className="text-lg font-bold mb-4">Legal</h6>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200 mb-2">Terms of Use</a>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200 mb-2">Privacy Policy</a>
          <a className="block text-sm hover:text-blue-200 transition-colors duration-200">Cookie Policy</a>
        </nav>
      </footer>

      {/* Bottom Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 text-white px-10 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <aside className="flex items-center mb-4 md:mb-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-2"
            >
              <path d="M22.672 15.226l-2.432.811.841 2.515c.033.1.031.208-.006.312-.088.244-.302.427-.57.513l-2.3.862.85-2.506c.05-.148.027-.306-.062-.44l-2.43-.811 2.43-.811c.089-.134.112-.292.062-.44l-.85-2.506 2.3.862c.268.086.482.269.57.513.037.104.039.212.006.312l-.841 2.515zm-3.662-2.934l-.84 2.515 2.43.811-2.43.811.84 2.515-2.3-.862c-.268-.086-.482-.269-.57-.513-.037-.104-.039-.212-.006-.312l.841-2.515-.841-2.515c-.033-.1-.031-.208.006-.312.088-.244.302-.427.57-.513l2.3.862zm-3.662 1.094l-.841 2.515 2.43.811-2.43.811.841 2.515-2.3-.862c-.268-.086-.482-.269-.57-.513-.037-.104-.039-.212-.006-.312l.841-2.515-.841-2.515c-.033-.1-.031-.208.006-.312.088-.244.302-.427.57-.513l2.3.862z" />
            </svg>
            <p className="text-sm">
              <strong>CureSync</strong> &copy; {new Date().getFullYear()} – Empowering digital healthcare.
            </p>
          </aside>
          <nav className="flex gap-4">
            <a href="#" aria-label="Twitter" className="hover:text-blue-200 transition-colors duration-200">
              <svg width="24" height="24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-blue-200 transition-colors duration-200">
              <svg width="24" height="24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-blue-200 transition-colors duration-200">
              <svg width="24" height="24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
};

export default Footer;