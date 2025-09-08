import Link from 'next/link';
import Image from 'next/image';

const paymentMethods = [
  { src: '/payments/mastercard.svg', alt: 'Master Card' },
  { src: '/payments/visa.svg', alt: 'Visa Card' },
  { src: '/payments/wechat-pay.svg', alt: 'WeChat Pay' },
  { src: '/payments/unionpay.svg', alt: 'Union Pay' },
  { src: '/payments/alipay.svg', alt: 'Alipay' },
  { src: '/payments/kakao_pay.svg', alt: 'Kakao Pay' },
  { src: '/payments/kr_card.svg', alt: 'KR Card' },
  { src: '/payments/ideal.svg', alt: 'iDEAL' },
  { src: '/payments/giropay.svg', alt: 'GiroPay' },
];

export function PaymentIcons() {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center md:justify-start">
      {paymentMethods.map((method) => (
        <Image
          key={method.alt}
          src={method.src}
          alt={method.alt}
          width={30}
          height={30}
          className="opacity-80"
        />
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 py-10 text-gray-300 text-sm px-2 sm:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Logo + Social */}
          <div className="flex flex-col items-center md:items-start gap-4">
            {/* Logo & Site Name */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <span className="font-semibold text-lg">OneClass Yoga</span>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-6 items-center">
              <a
                href="https://www.facebook.com/oneclassyoga"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-white transition"
              >
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
              <a
                href="https://www.youtube.com/@oneclassyoga"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-white transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a2.986 2.986 0 00-2.104-2.113C19.2 3.5 12 3.5 12 3.5s-7.2 0-9.394.573A2.986 2.986 0 00.502 6.186C0 8.387 0 12 0 12s0 3.613.502 5.814a2.986 2.986 0 002.104 2.113C4.8 20.5 12 20.5 12 20.5s7.2 0 9.394-.573a2.986 2.986 0 002.104-2.113C24 15.613 24 12 24 12s0-3.613-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Navigation */}
          <div className="flex flex-col items-center md:items-end gap-6 w-full">
            {/* Navigation Columns */}
            <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
              {/* Explore */}
              <div className="flex flex-col items-center text-gray-500 md:items-start gap-2">
                <span className="font-semibold text-gray-200 text-lg">
                  Explore
                </span>
                <Link href="/teachers" className="hover:text-white transition">
                  Teachers
                </Link>
                <Link href="/pricing" className="hover:text-white transition">
                  Pricing
                </Link>
                <Link href="/location" className="hover:text-white transition">
                  Location
                </Link>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </div>

              {/* Legal */}
              <div className="flex flex-col text-gray-500 items-center md:items-start gap-2">
                <span className="font-semibold text-gray-200 text-lg">
                  Legal
                </span>
                <Link
                  href="/privacy"
                  className="hover:text-gray-400 transition"
                >
                  Privacy Policy
                </Link>
                <Link href="/tos" className="hover:text-gray-400 transition">
                  Terms of Service
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-gray-400 transition"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col items-center gap-4">
          {/* Payment Icons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-gray-400 text-xs font-medium">
              We accept:
            </span>
            <PaymentIcons />
          </div>

          {/* SSL Note */}
          <p className="text-xs text-gray-500 text-center">
            Secure payments • SSL encrypted
          </p>

          {/* Copyright */}
          <p className="text-gray-400 text-xs text-center">
            © {new Date().getFullYear()} OneClass Yoga. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
