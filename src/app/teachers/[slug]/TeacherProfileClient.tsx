'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import TeacherGallery from '@/components/TeacherGallery';
import parse from 'html-react-parser';
import BookingCalendar from '@/components/BookingCalendar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToBangkokDateOnly } from '@/components/BkkTimeConverter';
import YouTubeVideo from '@/components/YoutubeViedo';
import { set } from 'date-fns';

export default function TeacherProfileClient({
  teacher,
  booking_type,
}: {
  teacher: {
    id: string;
    name: string;
    photo: string;
    bio: string;
    styles: string[];
    levels: string[];
    gallery: string[];
    videoUrl: string;
    slug: string;
    timeSlots: string[];
    available_days: string[];
  };
  booking_type: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [participantsCount, setParticipantsCount] = useState(1);
  const [rate, setRate] = useState<number | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [bookingTitle, setBookingTitle] = useState<string>(
    'Choose Your Date & Time'
  );
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<
    'single' | 'bundle5' | 'bundle10' | null
  >(null);

  const router = useRouter();

  // Single and bundle prices depending on participants
  const priceIdMap: Record<string, Record<number, string>> = {
    single: {
      1: process.env.NEXT_PUBLIC_STRIPE_SINGLE_1 || '',
      2: process.env.NEXT_PUBLIC_STRIPE_SINGLE_2 || '',
    },
    bundle5: {
      1: process.env.NEXT_PUBLIC_STRIPE_BUNDLE5_1 || '',
      2: process.env.NEXT_PUBLIC_STRIPE_BUNDLE5_2 || '',
    },
    bundle10: {
      1: process.env.NEXT_PUBLIC_STRIPE_BUNDLE10_1 || '',
      2: process.env.NEXT_PUBLIC_STRIPE_BUNDLE10_2 || '',
    },
  };

  useEffect(() => {
    if (window.location.hash === '#booking-calendar') {
      const element = document.getElementById('booking-calendar');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('ring-2', 'ring-blue-500');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-blue-500');
        }, 2000);
      }
    }
  }, []);

  const handleBooking = () => {
    if (!selectedPackage) {
      setError('Please select a package.');
      return;
    }
    if (!selectedDate || !selectedTimeSlot) {
      setError('Please select a date and time slot before booking.');
      return;
    }

    let priceId = null;
    if (selectedPackage) {
      const participantCount = participantsCount;
      priceId = priceIdMap[selectedPackage][participantCount] || null;
    }

    if (!priceId) {
      setError('Could not determine price for selected options.');
      return;
    }

    setError('');
    const query = new URLSearchParams({
      teacher: teacher.slug,
      priceId,
      date: ToBangkokDateOnly(selectedDate),
      timeSlot: selectedTimeSlot,
      participants: participantsCount.toString(),
      booking_type,
      package: selectedPackage,
    }).toString();

    router.push(`/booking/checkout?${query}`);
  };
  const packageTitles: Record<'single' | 'bundle5' | 'bundle10', string> = {
    single: 'Choose Your Date & Time',
    bundle5: 'Choose Your First Class Date & Time',
    bundle10: 'Choose Your First Class Date & Time',
  };

  const handlePackageSelect = (
    packageType: 'single' | 'bundle5' | 'bundle10'
  ) => {
    setSelectedPackage(packageType);
    setBookingTitle(packageTitles[packageType]);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (selectedPackage) {
      const priceId = priceIdMap[selectedPackage][participantsCount];
      setSelectedPriceId(priceId || null);
    }
  };

  const galleryImages = teacher.gallery || [];
  const timeSlots = Array.isArray(teacher.timeSlots)
    ? teacher.timeSlots
    : JSON.parse(teacher.timeSlots || '[]');
  const availableDays = Array.isArray(teacher.available_days)
    ? teacher.available_days
    : [];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100">
        <Image
          src={teacher.photo || '/placeholder.png'}
          alt={teacher.name}
          width={800}
          height={600}
          className="object-cover h-80"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {teacher.name}
          </h1>

          <div className="tiptap prose max-w-none">{parse(teacher.bio)}</div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 mt-4">
            <div>
              <p>
                <span className="font-semibold text-gray-700">Styles:</span>{' '}
                <span className="flex flex-wrap gap-2 mt-2">
                  {teacher.styles.map((style) => (
                    <Badge
                      key={style}
                      variant="secondary"
                      className="bg-blue-200 dark:bg-blue-600 text-sm"
                    >
                      {style}
                    </Badge>
                  ))}
                </span>
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold text-gray-700">Levels:</span>{' '}
                <span className="flex flex-wrap gap-2 mt-2">
                  {teacher.levels.map((level) => (
                    <Badge
                      key={level}
                      variant="secondary"
                      className="bg-emerald-200 dark:bg-emerald-600 text-sm"
                    >
                      {level}
                    </Badge>
                  ))}
                </span>
              </p>
            </div>
          </div>

          {galleryImages.length > 0 && (
            <TeacherGallery galleryImages={galleryImages} />
          )}

          {/* VIDEO PREVIEW */}
          {teacher.videoUrl && (
            <section className="mt-6">
              <h2 className="font-semibold my-5 text-xl text-center">
                {teacher.name} on Yoga, Teaching, and Practice
              </h2>
              <YouTubeVideo videoId="dQw4w9WgXcQ" />
            </section>
          )}

          {/* PACKAGE SELECTION */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Single Session */}
            <div
              onClick={handlePackageSelect.bind(null, 'single')}
              className={`cursor-pointer p-6 rounded-2xl border shadow-sm transition 
      ${selectedPackage === 'single' ? 'border-orange-500 ring-2 ring-orange-400' : 'border-gray-200 hover:shadow-md'}
    `}
            >
              <h3 className="text-lg font-semibold my-2">Single Session</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enjoy a hassle-free yoga session! Studio, yoga mat, and props
                are included.
              </p>
              <p className="text-xl font-bold text-gray-800">2,200 THB</p>
            </div>

            {/* Bundle 5 */}
            <div
              onClick={handlePackageSelect.bind(null, 'bundle5')}
              className={`cursor-pointer p-6 rounded-2xl border shadow-md transition relative 
    ${selectedPackage === 'bundle5' ? 'border-orange-500 ring-2 ring-orange-400' : 'border-gray-200 hover:shadow-lg'}
  `}
            >
              <Badge
                variant="destructive"
                className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-orange-400 text-white"
              >
                Most Popular
              </Badge>

              <h3 className="text-lg font-semibold my-2">Bundle of 5</h3>
              <p className="text-sm text-gray-600 mb-4">
                Save 1,000 THB vs single sessions! Studio, yoga mats, and props
                included.
              </p>
              <p className="text-xl font-bold text-gray-800">10,000 THB</p>
            </div>

            {/* Bundle 10 */}
            <div
              onClick={handlePackageSelect.bind(null, 'bundle10')}
              className={`cursor-pointer p-6 rounded-2xl border shadow-sm transition relative
    ${selectedPackage === 'bundle10' ? 'border-orange-500 ring-2 ring-orange-400' : 'border-gray-200 hover:shadow-md'}
  `}
            >
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-green-600 text-white"
              >
                Best Value
              </Badge>

              <h3 className="text-lg font-semibold my-2">Bundle of 10</h3>
              <p className="text-sm text-gray-600 mb-4">
                Save 3,200 THB vs single sessions! Studio, yoga mats, and props
                included.
              </p>
              <p className="text-xl font-bold text-gray-800">18,800 THB</p>
            </div>
          </div>

          {/* ALWAYS SHOW CALENDAR ONCE PACKAGE SELECTED */}
          {selectedPackage && (
            <div
              id="booking-calendar"
              className="mt-8 p-6 rounded-3xl shadow border border-blue-200"
            >
              <h2 className="text-xl font-semibold mb-4 text-center">
                {bookingTitle}
              </h2>
              <BookingCalendar
                onSelect={(date, timeSlot) => {
                  setSelectedDate(date);
                  setSelectedTimeSlot(timeSlot);
                }}
                teacherSlug={teacher.slug}
                timeSlots={timeSlots}
                onParticipantsChange={setParticipantsCount}
                initialParticipants={participantsCount}
                onRateChange={handleRateChange}
                availableDays={availableDays}
                selectedPackage={selectedPackage}
              />
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="mt-6 flex justify-between items-center">
            <Link
              href="/teachers"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              ← Back to teachers
            </Link>
            <Button
              onClick={handleBooking}
              disabled={!selectedPackage}
              className="bg-orange-600 text-white text-lg font-medium px-4 py-2 rounded-xl hover:bg-orange-700 transition"
            >
              Book Now
            </Button>
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-2 text-right">{error}</p>
          )}
        </div>
      </div>
    </main>
  );
}
