import React from 'react';

const Footer = () => {
  return (
    <>
      {/* Top Footer */}
      <footer className="footer bg-base-200 text-base-content p-10 flex flex-wrap justify-between">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Appointment Booking</a>
          <a className="link link-hover">Prescription Management</a>
          <a className="link link-hover">Medical Reports</a>
          <a className="link link-hover">Billing & Invoicing</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About CureSync</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Careers</a>
          <a className="link link-hover">Blog</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of Use</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Cookie Policy</a>
        </nav>
      </footer>

      {/* Bottom Footer */}
      <footer className="footer items-center px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
        <aside className="items-center grid-flow-col">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="fill-current mr-2"
          >
            <path d="M22.672 15.226l-2.432.811..."></path> {/* Shortened for clarity */}
          </svg>
          <p>
            <strong>CureSync</strong> &copy; {new Date().getFullYear()} – Empowering digital healthcare.
          </p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a href="#" aria-label="Twitter">
            <svg width="24" height="24" fill="currentColor" className="fill-current">
              <path d="M24 4.557c-..." /> {/* Twitter icon */}
            </svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg width="24" height="24" fill="currentColor" className="fill-current">
              <path d="M19.615 3.184..." /> {/* YouTube icon */}
            </svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg width="24" height="24" fill="currentColor" className="fill-current">
              <path d="M9 8h-3v4..." /> {/* Facebook icon */}
            </svg>
          </a>
        </nav>
      </footer>
    </>
  );
};

export default Footer;
