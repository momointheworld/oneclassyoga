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
        {/* Single Session */}
        <div className="flex flex-col justify-between border rounded-xl p-6 shadow text-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Single Session</h2>
            <p className="text-2xl font-bold mb-2">฿1,250</p>
            <p className="mb-6 text-sm text-gray-700">
              Choose your preferred teacher, pick the perfect date and time, and
              invite up to 5 participants to join. Just ฿250 for each additional
              guest—ideal for friends or family!
            </p>
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

        {/* Bundle of 5 */}
        <div className="flex flex-col justify-between border rounded-xl p-6 shadow text-center bg-blue-50">
          <div>
            <h2 className="text-xl font-semibold mb-2">5-Session Bundle</h2>
            <p className="text-2xl font-bold mb-2">฿6,000</p>
            <p className="mb-6 text-sm text-gray-700">
              Stay consistent and <strong>save ฿250 </strong>compared to booking
              single sessions. Ideal for short-term goals or trying out
              different teachers. You&apos;ll coordinate dates and times
              directly with your teacher.
            </p>
          </div>
          <div className="flex justify-center">
            <Link href="/booking/checkout" passHref>
              <Button
                variant="default"
                className="bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-orange-700 transition"
              >
                Checkout
              </Button>
            </Link>
          </div>
        </div>

        {/* Bundle of 10 */}
        <div className="flex flex-col justify-between border rounded-xl p-6 shadow text-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">10-Session Bundle</h2>
            <p className="text-2xl font-bold mb-2">฿11,700</p>
            <p className="mb-6 text-sm text-gray-700">
              Commit to your long-term well-being and enjoy the best value—
              <strong>save ฿800</strong> compared to booking individual
              sessions. Work closely with your chosen teacher to plan your
              journey.
            </p>
          </div>
          <div className="flex justify-center">
            <Link href="/booking/checkout" passHref>
              <Button
                variant="default"
                className="bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-orange-700 transition"
              >
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-md text-gray-700">
          Have questions? Contact us here!
        </p>
      </div>
    </div>
  );
}
