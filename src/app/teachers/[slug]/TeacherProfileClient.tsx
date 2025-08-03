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
    slug: string;
    timeSlots: string[];
  };
  booking_type: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [participantsCount, setParticipantsCount] = useState(1);
  const [rate, setRate] = useState<number | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [includeStudio, setIncludeStudio] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Map rates to Stripe price IDs, fallback to empty string if env vars missing
  const rateToPriceIdMap: Record<number, string> = {
    1250: process.env.NEXT_PUBLIC_STRIPE_SINGLE_PRICE_1250 || '',
    1500: process.env.NEXT_PUBLIC_STRIPE_SINGLE_PRICE_1500 || '',
    1750: process.env.NEXT_PUBLIC_STRIPE_SINGLE_PRICE_1750 || '',
    2000: process.env.NEXT_PUBLIC_STRIPE_SINGLE_PRICE_2000 || '',
    2250: process.env.NEXT_PUBLIC_STRIPE_SINGLE_PRICE_2250 || '',
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
    if (!selectedDate || !selectedTimeSlot) {
      setError('Please select a date and time slot before booking.');
      return;
    }

    if (!selectedPriceId) {
      setError('Could not determine price for selected options.');
      return;
    }

    setError('');
    const query = new URLSearchParams({
      teacher: teacher.slug,
      priceId: selectedPriceId,
      date: selectedDate.toISOString(),
      timeSlot: selectedTimeSlot,
      participants: participantsCount.toString(),
      includeStudio: includeStudio.toString(),
      booking_type,
    }).toString();

    router.push(`/booking/checkout?${query}`);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    const priceId = rateToPriceIdMap[newRate];
    setSelectedPriceId(priceId || null);
  };

  const galleryImages = teacher.gallery || [];
  const timeSlots = Array.isArray(teacher.timeSlots)
    ? teacher.timeSlots
    : JSON.parse(teacher.timeSlots || '[]');

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
                <span className="font-semibold text-gray-700">Level:</span>{' '}
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

          <div
            id="booking-calendar"
            className="mt-8 bg-gray-100 p-6 rounded-3xl shadow border border-blue-200"
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Choose Your Date & Time
            </h2>
            <BookingCalendar
              onSelect={(date, timeSlot) => {
                setSelectedDate(date);
                setSelectedTimeSlot(timeSlot);
              }}
              teacherSlug={teacher.slug}
              timeSlots={timeSlots}
              onParticipantsChange={setParticipantsCount}
              onStudioChange={setIncludeStudio}
              initialParticipants={participantsCount}
              onRateChange={handleRateChange}
            />
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Link
              href="/teachers"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              ← Back to teachers
            </Link>

            <Button
              onClick={handleBooking}
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
