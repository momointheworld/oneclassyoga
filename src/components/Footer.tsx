import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 py-10  text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
          {/* Navigation Links */}
          <nav className="flex flex-nowrap gap-6 text-center md:text-left items-center overflow-x-auto">
            <Link href="/teachers" className="hover:text-white transition">
              Teachers
            </Link>
            <Link href="/pricing" className="hover:text-white transition">
              Pricing
            </Link>

            <Link
              href="/privacy"
              className="hover:text-gray-400 transition text-gray-600 "
            >
              Privacy Policy
            </Link>
            <Link
              href="/tos"
              className="hover:text-gray-400 transition text-gray-600 "
            >
              Terms of Service
            </Link>
          </nav>

          {/* Social Media */}
          <div className="flex space-x-6 items-center">
            <a
              href="https://www.facebook.com/oneclassyoga"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition"
            >
              {/* Facebook SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.876v-6.987h-2.54v-2.89h2.54v-2.203c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.466h-1.26c-1.243 0-1.63.772-1.63 1.562v1.87h2.773l-.443 2.89h-2.33v6.987C18.344 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/oneclassyoga/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition"
            >
              {/* Instagram SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right text-sm mt-4 md:mt-0">
            <p>
              © {new Date().getFullYear()} OneClass Yoga. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
