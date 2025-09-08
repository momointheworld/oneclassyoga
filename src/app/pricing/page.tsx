// app/pricing/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { Badge } from '@/components/ui/badge';
import { packages } from '@/lib/packages';

export const metadata = {
  title: 'Yoga Pricing in Chiang Mai | Private Classes & Bundles',
  description:
    'Explore flexible yoga pricing in Chiang Mai. Book single sessions, share a class with a friend, or choose from class bundles for better value. Transparent rates, no hidden fees.',
  openGraph: {
    title: 'Yoga Pricing in Chiang Mai | Private Classes & Bundles',
    description:
      'Flexible and transparent yoga pricing in Chiang Mai. Choose single sessions, share a class with a friend, or get more value with class bundles tailored to your needs.',
    url: 'https://oneclass.yoga/pricing',
    siteName: 'OneClass Yoga',
    images: [
      {
        url: 'https://oneclass.yoga/images/logos/pricing-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yoga Pricing in Chiang Mai',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yoga Pricing in Chiang Mai | Private Classes & Bundles',
    description:
      'Flexible yoga pricing in Chiang Mai. Book single sessions, share a class with a friend, or choose from bundles for better value. Transparent rates, no hidden fees.',
    images: ['https://oneclass.yoga/images/logos/pricing-og-image.png'],
  },
};

export const revalidate = 60;

export default function PricingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Private Yoga Classes in Chiang Mai',
    description:
      'Flexible yoga classes in Chiang Mai. Book a private 1-on-1 session, share with a friend, or purchase a bundle of classes. Transparent pricing, no hidden fees.',
    brand: {
      '@type': 'Organization',
      name: 'OneClass Yoga',
      url: 'https://oneclass.yoga',
    },
    offers: [
      // Single session
      {
        '@type': 'Offer',
        name: 'Private 1-on-1 Yoga Session (1.5 hours)',
        priceCurrency: 'THB',
        price: '3500',
        url: 'https://oneclass.yoga/pricing',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Private 1-on-1 Yoga Session with Friend (1.5 hours)',
        priceCurrency: 'THB',
        price: '4300', // 3500 + 800
        url: 'https://oneclass.yoga/pricing',
        availability: 'https://schema.org/InStock',
      },

      // 3-class bundle
      {
        '@type': 'Offer',
        name: '3-Class Bundle (1.5 hours per session)',
        priceCurrency: 'THB',
        price: '7000',
        url: 'https://oneclass.yoga/pricing',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: '3-Class Bundle with Friend (1.5 hours per session)',
        priceCurrency: 'THB',
        price: '9400', // 7000 + 2400
        url: 'https://oneclass.yoga/pricing',
        availability: 'https://schema.org/InStock',
      },

      // 6-class bundle
      {
        '@type': 'Offer',
        name: '6-Class Bundle (1.5 hours per session)',
        priceCurrency: 'THB',
        price: '13000',
        url: 'https://oneclass.yoga/pricing',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: '6-Class Bundle with Friend (1.5 hours per session)',
        priceCurrency: 'THB',
        price: '17800', // 13000 + 4800
        url: 'https://oneclass.yoga/pricing',
        availability: 'https://schema.org/InStock',
      },
    ],
  };

  return (
    <PageContainer>
      <div className="min-h-screen px-4 flex flex-col items-center bg-white text-gray-900">
        {/* Hero Section */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          Transparent & Flexible Yoga Pricing in Chiang Mai
        </h1>
        <p className="text-lg sm:text-xl mb-6 text-center max-w-2xl text-gray-700">
          Enjoy private yoga sessions tailored to your schedule, your level, and
          your goals—no hidden fees, no surprises.
        </p>

        <ul className="flex flex-col sm:flex-row text-center gap-3 justify-center mb-8 text-gray-700">
          <li className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-semibold">
            1.5-hour class
          </li>
          <li className="bg-gray-200 px-3 py-1 rounded-full font-semibold">
            <a href="/location" className="text-emerald-600 hover:underline">
              Studio{' '}
            </a>
            fee included (500฿/session)
          </li>
          <li className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-semibold">
            Bring a friend (+800฿)
          </li>
        </ul>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          {packages.map((option) => (
            <div
              key={option.id}
              className={`relative flex flex-col justify-between border rounded-xl p-6 shadow text-center hover:shadow-lg transition ${
                option.id === 'bundle3' ? 'bg-blue-50' : ''
              }`}
            >
              {option.badge && (
                <Badge
                  className={`
                    absolute top-2 right-2 text-xs px-2 py-1 rounded-full
                    ${option.id === 'bundle3' ? 'bg-orange-500 text-white' : ''}
                    ${option.id === 'bundle6' ? 'bg-green-500 text-white' : ''}
                    ${option.id === 'single' ? 'bg-gray-300 text-gray-800' : ''}
                  `}
                >
                  {option.badge}
                </Badge>
              )}

              <div>
                <h2 className="text-xl font-semibold my-2">{option.title}</h2>
                <p className="text-2xl font-bold mb-2">{option.price}</p>
                <p className="mb-2 text-sm text-gray-700">
                  {option.description}
                </p>
                <p className="text-sm text-gray-500">{option.friendNote}</p>
              </div>

              <div className="flex justify-center mt-4">
                <Link href="/teachers" passHref>
                  <Button
                    variant="default"
                    className="text-sm font-medium px-4 py-2 rounded-xl transition bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Pick a Teacher Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Responsive Comparison Table */}
        <div className="mt-12 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Price Comparison
          </h2>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto mt-8 w-full">
            <table className="min-w-full border border-gray-200 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th rowSpan={2} className="px-4 py-2 border">
                    Package
                  </th>
                  <th colSpan={2} className="px-4 py-2 border">
                    One Person
                  </th>
                  <th colSpan={2} className="px-4 py-2 border">
                    With Friend
                  </th>
                </tr>
                <tr>
                  <th className="px-4 py-2 border">Total Price</th>
                  <th className="px-4 py-2 border">Price / Person / Session</th>
                  <th className="px-4 py-2 border">Total Price</th>
                  <th className="px-4 py-2 border">Price / Person / Session</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">Single</td>
                  <td className="px-4 py-2 border">3,500 THB</td>
                  <td className="px-4 py-2 border">3,500 THB</td>
                  <td className="px-4 py-2 border">4,300 THB</td>
                  <td className="px-4 py-2 border">2,150 THB</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">Bundle of 3</td>
                  <td className="px-4 py-2 border">7,000 THB</td>
                  <td className="px-4 py-2 border">2,333 THB</td>
                  <td className="px-4 py-2 border">9,400 THB</td>
                  <td className="px-4 py-2 border">1,567 THB</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">Bundle of 6</td>
                  <td className="px-4 py-2 border">13,000 THB</td>
                  <td className="px-4 py-2 border">2,167 THB</td>
                  <td className="px-4 py-2 border">17,800 THB</td>
                  <td className="px-4 py-2 border">1,483 THB</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden mt-8 space-y-4">
            {[
              {
                package: 'Single',
                onePerson: { total: '3,500 THB', per: '3,500 THB' },
                withFriend: { total: '4,300 THB', per: '2,150 THB' },
              },
              {
                package: 'Bundle of 3',
                onePerson: { total: '7,000 THB', per: '2,333 THB' },
                withFriend: { total: '9,400 THB', per: '1,567 THB' },
              },
              {
                package: 'Bundle of 6',
                onePerson: { total: '13,000 THB', per: '2,167 THB' },
                withFriend: { total: '17,800 THB', per: '1,483 THB' },
              },
            ].map((item) => (
              <div
                key={item.package}
                className="border rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-semibold mb-2">{item.package}</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">One Person Total:</span>
                  <span>{item.onePerson.total}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">One Person / Session:</span>
                  <span>{item.onePerson.per}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">With Friend Total:</span>
                  <span>{item.withFriend.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">With Friend / Session:</span>
                  <span>{item.withFriend.per}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ / Contact */}
        <div className="mt-10 text-center">
          <p className="text-md text-gray-700">
            Have questions about our classes or pricing?{' '}
            <Link
              href="/contact"
              className="text-emerald-600 font-medium hover:underline"
            >
              Contact us
            </Link>{' '}
            anytime.
          </p>
        </div>
      </div>
      <script
        type="application/ld+json"
        // The JSON must be stringified
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </PageContainer>
  );
}
