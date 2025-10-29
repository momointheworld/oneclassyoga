import { PageContainer } from '@/components/PageContainer';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yoga Studio Location in Chiang Mai | OneClass Yoga',
  description:
    'Find the OneClass Yoga studio in Chiang Mai Old Town. Private yoga classes in a quiet, airy venue with mats and props provided. Perfect for focused sessions.',
};

export default function LocationPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-8 text-center">Location</h1>

      <div className="space-y-6">
        <p className="text-center">
          Private classes take place in a semi-open venue in the heart of Chiang
          Mai&apos;s Old Town, offering a quiet and airy environment, perfect
          for focused yoga sessions.
        </p>

        {/* Info Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Private Class Features
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                Venue rental included (normally 500 THB per 1.5-hour session)
              </li>
              <li>Mats and props provided</li>
              <li>Quiet surroundings in the center of Old Town</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/studio-oneclass.jpg"
            alt="Yoga Venue"
            width={800}
            height={600}
            className="h-auto rounded-lg shadow-md"
          />
        </div>
        {/* Address */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">Address</h2>
          <p className="text-gray-700">
            Rachadamnoen Rd Soi 5, Tambon Si Phum, Mueang Chiang Mai District,
            Chiang Mai 50200
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/location-map.png"
            alt="Yoga Venue"
            width={400}
            height={300}
            className="h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </PageContainer>
  );
}
