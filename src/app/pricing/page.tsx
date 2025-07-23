// app/pricing/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <div className="min-h-screen px-4 py-12 flex flex-col items-center bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Pricing</h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        Private yoga sessions with clear, simple pricing. No hidden fees.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        {[
          {
            title: '1 Session',
            price: '฿1,250',
            desc: 'Perfect for trying out a session or one-off bookings.',
          },
          {
            title: '5 Sessions',
            price: '฿6,150',
            desc: 'Great for short-term consistency. ฿1,230 per session.',
            highlight: true,
          },
          {
            title: '10 Sessions',
            price: '฿12,000',
            desc: 'Best value. ฿1,200 per session for long-term commitment.',
          },
        ].map(({ title, price, desc, highlight }, idx) => (
          <div
            key={idx}
            className={`flex flex-col justify-between border rounded-xl p-6 shadow text-center ${
              highlight ? 'bg-blue-50' : ''
            }`}
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-2xl font-bold mb-2">{price}</p>
              <p className="mb-6">{desc}</p>
            </div>
            <div className="flex justify-center">
              <Link href="/teachers" passHref>
                <Button
                  variant="default"
                  className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
                >
                  Pick a Teacher Now
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-md text-gray-700">
          Need a studio? An additional ฿250 per session will apply.
        </p>
      </div>
    </div>
  );
}
