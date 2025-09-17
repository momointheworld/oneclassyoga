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
        <div className="relative group w-[30px] h-[30px]" key={method.alt}>
          <Image
            src={method.src}
            alt={method.alt}
            fill
            style={{ objectFit: 'contain' }}
            className="opacity-80"
          />
          {/* Tooltip */}
          <span
            className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 
                       whitespace-nowrap px-2 py-1 text-xs rounded bg-gray-800 
                       text-white opacity-0 group-hover:opacity-100 transition"
          >
            {method.alt}
          </span>
        </div>
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
                className="transition hover:opacity-80"
              >
                <Image
                  key="facebook"
                  src="/images/fb.svg"
                  alt="facebook"
                  width={30}
                  height={30}
                />
              </a>
              <a
                href="https://www.instagram.com/oneclassyoga/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition hover:opacity-80"
              >
                <Image
                  key="instagram"
                  src="/images/ig.svg"
                  alt="instagram"
                  width={30}
                  height={30}
                />
              </a>
              <a
                href="https://www.youtube.com/@oneclassyoga"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="transition hover:opacity-80"
              >
                <Image
                  key="youtube"
                  src="/images/ytb.svg"
                  alt="youtube"
                  width={30}
                  height={30}
                />
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
