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
import { formatInTimeZone } from 'date-fns-tz';
import { createClient } from '@/utils/supabase/supabaseClient';
import {
  BUNDLE3,
  BUNDLE6,
  PackageType,
  packageTitles,
  packages,
  priceIdMap,
} from '@/lib/packages';
import { Teacher } from '@/types/teacher'; // adjust the path
import ReviewCarousel from '@/components/ReviewCard';

type Review = {
  id: string;
  customer_name: string;
  review_text: string;
  rating?: number;
  updated_at: Date;
};

const supabase = createClient();

export default function TeacherProfileClient({
  teacher,
}: {
  teacher: Teacher;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [participants, setParticipants] = useState<number>(1);
  // const [participantsCount, setParticipantsCount] = useState(1);
  const [rate, setRate] = useState<number | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [bookingTitle, setBookingTitle] = useState<string>(
    'Choose Your Date & Time'
  );
  const [showNote, setShowNote] = useState(false);
  const note = showNote
    ? ' (Rest of sessions scheduled with your teacher.)'
    : '';
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#booking-calendar' || hash === '#reviewCarousel') {
      const timeout = setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          const yOffset = -80; // adjust for sticky header if any
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });

          // Add highlight ring
          element.classList.add('ring-2', 'ring-blue-500');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-blue-500');
          }, 2000);
        }
      }, 300); // wait for layout

      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('teacher_slug', teacher.slug)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      setReviews(data || []);
    };
    fetchReviews();
  }, [teacher.slug]);

  const handleBooking = () => {
    if (!selectedPackage) {
      setError('Please select a package.');
      return;
    }
    if (!selectedDate || !selectedTimeSlot) {
      setError('Please select a date and time slot before booking.');
      return;
    }
    console.log(selectedPackage);

    let priceId = null;
    if (selectedPackage) {
      const participantCount = participants;
      priceId = priceIdMap[selectedPackage][participantCount] || null;
    }
    console.log(priceId);

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
      participants: participants.toString(),
      booking_type: selectedPackage,
      package: selectedPackage,
    }).toString();

    router.push(`/booking/checkout?${query}`);
  };

  const handlePackageSelect = (packageType: PackageType) => {
    setSelectedPackage(packageType);
    setBookingTitle(packageTitles[packageType]);
    setShowNote(packageType !== 'single');
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (selectedPackage) {
      const priceId = priceIdMap[selectedPackage][participants];
      setSelectedPriceId(priceId || null);
    }
  };

  const galleryImages = teacher.gallery || [];
  // Get days that have at least one time slot
  const weeklySchedule = teacher.weekly_schedule || {};
  const availableDays = Object.entries(weeklySchedule)
    .filter(([day, slots]) => slots.length > 0)
    .map(([day]) => day); // ["Monday", "Tuesday", "Thursday", "Friday"]

  const selectedDay = selectedDate
    ? formatInTimeZone(selectedDate, 'Asia/Bangkok', 'EEEE') // "Monday", "Tuesday", ...
    : null;
  const timeSlots = selectedDay ? weeklySchedule[selectedDay] || [] : [];

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

          {/* REVIEWS SECTION */}
          {reviews.length > 0 && (
            <section className="mt-15 mb-5" id="reviewCarousel">
              <div className="mt-5 font-semibold">
                <h1 className="text-xl font-bold text-center mb-2 text-gray-800">
                  Student Reviews
                </h1>
                <p className="text-center text-gray-600 mb-8">
                  Real experiences from those who’ve practiced with{' '}
                  {teacher.name}
                </p>
                <ReviewCarousel reviews={reviews} />
              </div>
              {/* <ResponsiveCarouselDemo /> */}
            </section>
          )}

          {/* PACKAGES */}
          <section className="grid grid-cols-1 gap-6" id="booking-calendar">
            <h2 className="text-xl text-center font-semibold mt-12 mb-4">
              Select Your Package & Time Slot
              <br />
              <span className="text-md text-orange-500">
                Add a Friend for 800฿ more only!
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg.id)}
                  className={`cursor-pointer p-6 rounded-2xl border shadow-sm transition relative
          ${selectedPackage === pkg.id ? 'border-orange-500 ring-2 ring-orange-400' : 'border-gray-200 hover:shadow-md'}
          ${pkg.id === BUNDLE3 ? 'shadow-md hover:shadow-lg' : ''}
        `}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <Badge
                      className={`
      absolute top-2 right-2 text-xs px-2 py-1 rounded-full
      ${pkg.id === BUNDLE3 ? 'bg-orange-500 text-white' : ''}
      ${pkg.id === BUNDLE6 ? 'bg-green-500 text-white' : ''}
      ${pkg.id === 'single' ? 'bg-gray-300 text-gray-800' : ''}
    `}
                    >
                      {pkg.badge}
                    </Badge>
                  )}

                  <h3 className="text-lg font-semibold my-3 text-center">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 text-center">
                    {pkg.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-4 text-center">
                    {pkg.friendNote}
                  </p>
                  <p className="text-xl font-bold text-gray-800 text-center">
                    {pkg.price}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ALWAYS SHOW CALENDAR ONCE PACKAGE SELECTED */}
          {selectedPackage && (
            <div className="mt-8 p-6 rounded-3xl">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {bookingTitle}
                <br />
                <span className="text-sm">{note}</span>
              </h2>
              <BookingCalendar
                onSelect={(date, timeSlot) => {
                  setSelectedDate(date);
                  setSelectedTimeSlot(timeSlot);
                }}
                teacherSlug={teacher.slug}
                timeSlots={timeSlots}
                onParticipantsChange={setParticipants}
                participants={participants}
                onRateChange={handleRateChange}
                availableDays={availableDays}
                selectedPackage={selectedPackage}
              />
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="mt-6 flex flex-row justify-end items-center flex-wrap gap-4">
            <div className="flex items-end flex-col gap-2 flex-wrap">
              <div className="flex flex-row items-center gap-2">
                <input
                  type="checkbox"
                  id="tos"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 accent-orange-600"
                />
                <label htmlFor="tos" className="text-gray-700 text-sm">
                  I agree to the{' '}
                  <Link href="/tos" className="text-blue-600 underline">
                    Terms of Service
                  </Link>
                </label>
              </div>
              <Button
                onClick={handleBooking}
                disabled={!selectedPackage || !agreedToTerms}
                className="bg-orange-600 text-white text-lg font-medium px-4 py-2 rounded-xl hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Now
              </Button>

              {error && (
                <p className="text-red-600 text-sm mt-2 sm:mt-0 text-center sm:text-right w-full sm:w-auto">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
