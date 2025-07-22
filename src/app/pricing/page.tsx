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
        <div className="border rounded-xl p-6 shadow text-center">
          <h2 className="text-xl font-semibold mb-2">1 Session</h2>
          <p className="text-2xl font-bold mb-2">฿1,250</p>
          <p>Perfect for trying out a session or one-off bookings.</p>
        </div>

        <div className="border rounded-xl p-6 shadow text-center bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">5 Sessions</h2>
          <p className="text-2xl font-bold mb-2">฿6,150</p>
          <p>Great for short-term consistency. ฿1,230 per session.</p>
        </div>

        <div className="border rounded-xl p-6 shadow text-center">
          <h2 className="text-xl font-semibold mb-2">10 Sessions</h2>
          <p className="text-2xl font-bold mb-2">฿12,000</p>
          <p>Best value. ฿1,200 per session for long-term commitment.</p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-md text-gray-700 mb-2">
          Need a studio? An additional ฿250 per session will apply.
        </p>

        <Link href="/teachers" passHref>
          <Button
            variant="outline"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Find a Teacher to Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
