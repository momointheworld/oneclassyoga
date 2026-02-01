import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';

const paymentMethods = [
  { src: '/payments/mastercard.svg', alt: 'Master Card' },
  { src: '/payments/visa.svg', alt: 'Visa Card' },
  { src: '/payments/wechat-pay.svg', alt: 'WeChat Pay' },
  { src: '/payments/unionpay.svg', alt: 'Union Pay' },
  { src: '/payments/alipay.svg', alt: 'Alipay' },
  { src: '/payments/kakao_pay.svg', alt: 'Kakao Pay' },
  { src: '/payments/kr_card.svg', alt: 'KR Card' },
  { src: '/payments/ideal.svg', alt: 'iDEAL' },
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

export async function Footer() {
  // Use getLocale() and getTranslations() for Server Components
  const locale = await getLocale();
  const t = await getTranslations('Home.Footer');

  return (
    <footer className="bg-gray-900 py-10 text-gray-300 text-sm px-2 sm:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Logo + Social */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <Image
                  src="/images/oneclass-logo-gray.svg"
                  alt="OneClass Yoga"
                  width={50}
                  height={50}
                  priority
                />
              </div>
              <span className="font-semibold text-lg text-white">
                OneClass Yoga
              </span>
            </div>

            <div className="flex space-x-6 items-center">
              {[
                {
                  id: 'fb',
                  url: 'https://www.facebook.com/oneclassyoga',
                  img: '/images/fb.svg',
                },
                {
                  id: 'ig',
                  url: 'https://www.instagram.com/oneclassyoga/',
                  img: '/images/ig.svg',
                },
                {
                  id: 'yt',
                  url: 'https://www.youtube.com/@oneclassyoga',
                  img: '/images/ytb.svg',
                },
              ].map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:opacity-70"
                >
                  <Image
                    src={social.img}
                    alt={social.id}
                    width={30}
                    height={30}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Navigation */}
          <div className="flex flex-col items-center md:items-end gap-6 w-full">
            <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
              {/* Explore */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <span className="font-semibold text-gray-200 text-lg">
                  {t('explore.title')}
                </span>
                <Link
                  href={`/${locale}/programs`}
                  className="text-gray-500 hover:text-white transition"
                >
                  {t('explore.programs')}
                </Link>
                <Link
                  href={`/${locale}/teachers`}
                  className="text-gray-500 hover:text-white transition"
                >
                  {t('explore.teachers')}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="text-gray-500 hover:text-white transition"
                >
                  {t('explore.about')}
                </Link>
                <Link
                  href={`/${locale}/location`}
                  className="text-gray-500 hover:text-white transition"
                >
                  {t('explore.location')}
                </Link>
              </div>

              {/* Legal */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <span className="font-semibold text-gray-200 text-lg">
                  {t('legal.title')}
                </span>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-gray-500 hover:text-white transition"
                >
                  {t('legal.privacy')}
                </Link>
                <Link
                  href={`/${locale}/tos`}
                  className="text-gray-500 hover:text-white transition"
                >
                  {t('legal.tos')}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="text-gray-500 hover:text-white transition"
                >
                  {t('legal.contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-gray-500 text-xs font-medium">
              {t('payments.accept')}
            </span>
            <PaymentIcons />
          </div>

          <p className="text-xs text-gray-600 text-center">
            {t('payments.secure')}
          </p>

          <p className="text-gray-500 text-xs text-center">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
