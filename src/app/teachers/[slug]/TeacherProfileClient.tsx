'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import TeacherGallery from '@/components/TeacherGallery';
import parse from 'html-react-parser';
import BookingCalendar from '@/components/BookingCalendar';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import YouTubeVideo from '@/components/YoutubeViedo';
import { format } from 'date-fns-tz';
import { createClient } from '@/utils/supabase/supabaseClient';
import {
  BUNDLE3,
  BUNDLE6,
  PROGRAMS,
  PackageType,
  packageTitles,
  programTeachers,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rate, setRate] = useState<number | null>(null);
  const [bookingTitle, setBookingTitle] = useState<string>(
    'Choose Your Date & Time',
  );
  const [showNote, setShowNote] = useState(false);
  const note = showNote
    ? ' (Rest of sessions scheduled with your teacher.)'
    : '';
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null,
  );
  const [packageTitle, setPackageTitle] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldScroll = searchParams.get('select');
  const preSelectedId = searchParams.get('program');

  useEffect(() => {
    // Case A: Coming from the Programs Page with a specific ID
    if (preSelectedId) {
      const program = teacherPrograms.find((p) => p.id === preSelectedId);
      if (program) {
        onSelectProgram(
          program.id,
          program.bundleType as PackageType,
          program.title,
        );
        scrollToPrograms();
      }
    }
    // Case B: Coming from TeacherCard just to "View Programs"
    else if (shouldScroll) {
      scrollToPrograms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSelectedId, shouldScroll]);

  const scrollToPrograms = () => {
    const el = document.getElementById('programs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formattedDate = selectedDate ? format(selectedDate, 'MMM d, yyyy') : '';

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

    let basePrice = 0;
    switch (selectedPackage) {
      case 'single':
        basePrice = teacher.rates.single ?? 0;
        break;
      case BUNDLE3:
        basePrice = teacher.rates.bundle3 ?? 0;
        break;
      case BUNDLE6:
        basePrice = teacher.rates.bundle6 ?? 0;
        break;
      default:
        setError('Invalid package selected.');
        return;
    }

    // Add participant extra fee
    if (participants === 2 && teacher.rates?.extra) {
      basePrice +=
        selectedPackage === 'single'
          ? (teacher.rates.extra.single ?? 0)
          : selectedPackage === BUNDLE3
            ? (teacher.rates.extra.bundle3 ?? 0)
            : (teacher.rates.extra.bundle6 ?? 0);
    }

    setError('');
    const query = new URLSearchParams({
      teacher: teacher.slug,
      unitAmount: basePrice.toString(),
      date: formattedDate,
      timeSlot: selectedTimeSlot,
      participants: participants.toString(),
      booking_type: selectedPackage,
      package_title: bookingTitle,
    }).toString();

    router.push(`/booking/checkout?${query}`);
  };

  // console.log(selectedDate, selectedDate && ToBangkokDateOnly(selectedDate));

  const handlePackageSelect = (packageType: PackageType) => {
    setSelectedPackage(packageType);
    setBookingTitle(packageTitles[packageType]);
    setShowNote(packageType !== 'single');
  };

  // Inside TeacherProfileClient
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);

  // Filter the shared constant for this teacher
  const teacherPrograms = PROGRAMS.filter(
    (p) => programTeachers[p.id] === teacher.slug,
  );

  const onSelectProgram = (
    progId: string,
    bundleType: PackageType,
    title: string,
  ) => {
    setActiveProgramId(progId);
    handlePackageSelect(bundleType);
    setBookingTitle(title); // Updates the title above the calendar
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);

    if (!selectedPackage) return;

    let calculatedRate = 0;

    if (teacher.rates) {
      switch (selectedPackage) {
        case 'single':
          calculatedRate = teacher.rates.single ?? 0;
          break;
        case BUNDLE3:
          calculatedRate = teacher.rates.bundle3 ?? 0;
          break;
        case BUNDLE6:
          calculatedRate = teacher.rates.bundle6 ?? 0;
          break;
      }
    }

    // Add extra participant fee
    if (participants === 2) {
      calculatedRate +=
        selectedPackage === 'single'
          ? 800
          : selectedPackage === BUNDLE3
            ? 2400
            : 4800;
    }

    setRate(calculatedRate);
  };

  const extraRate = teacher.rates.extra.single;

  function parseVideoIds(input: string) {
    if (!input) return { youtubeId: '', bilibiliId: '' };

    const [youtubeRaw, bilibiliRaw] = input.split('|').map((str) => str.trim());
    const youtubeId = youtubeRaw.split('?')[0]; // remove ?si=... if present
    const bilibiliId = bilibiliRaw || '';

    return { youtubeId, bilibiliId };
  }
  const { youtubeId, bilibiliId } = parseVideoIds(teacher.videoUrl || '');

  const galleryImages = teacher.gallery || [];
  // Get days that have at least one time slot
  const weeklySchedule = teacher.weekly_schedule || {};
  const availableDays = Object.entries(weeklySchedule)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([day, slots]) => slots.length > 0)
    .map(([day]) => day); // ["Monday", "Tuesday", "Thursday", "Friday"]

  const selectedDay = selectedDate
    ? format(selectedDate, 'EEEE') // no time zone conversion
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

          <div className="grid grid-cols-2 gap-4 text-gray-800 mt-6">
            {/* Styles */}
            <div>
              <p className="font-semibold text-gray-700 mb-2">Styles</p>
              <div className="flex flex-wrap gap-2">
                {teacher.styles.map((style) => (
                  <Badge
                    key={style}
                    variant="secondary"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs px-2 py-1"
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Levels */}
            <div>
              <p className="font-semibold text-gray-700 mb-2">Levels</p>
              <div className="flex flex-wrap gap-2">
                {teacher.levels.map((level) => (
                  <Badge
                    key={level}
                    variant="secondary"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs px-2 py-1"
                  >
                    {level}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="my-8">
            <p className="font-semibold text-gray-700 mb-2">Strengths</p>
            <div className="flex flex-col gap-3">
              {teacher.strengths &&
                Object.entries(teacher.strengths).map(([category, items]) => (
                  <div key={category} className="px-3">
                    <p className="font-medium text-gray-500 text-sm mb-1">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((strength) => (
                        <Badge
                          key={`${category}-${strength}`}
                          variant="secondary"
                          className={`text-xs px-2 py-1 font-semibold ${
                            category === 'Movement'
                              ? 'border-orange-600 dark:bg-orange-700 text-orange-600'
                              : category === 'Mind & Body'
                                ? 'border-blue-600 dark:bg-blue-700 text-blue-600'
                                : 'border-emerald-600 dark:bg-green-700 text-emerald-600'
                          }`}
                        >
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
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
              <YouTubeVideo youtubeId={youtubeId} bilibiliId={bilibiliId} />
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

          {/* PROGRAMS RADIO SELECTION */}
          <section className="space-y-6" id="programs">
            <div className="text-center mt-12 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Select Your Program
              </h2>
              <p className="text-emerald-600 font-semibold mt-1 text-sm uppercase tracking-wider">
                Add a Friend for {extraRate}฿ more only!
              </p>
            </div>

            <div className="space-y-3">
              {/* SINGLE SESSION RADIO */}
              <label
                className={`relative flex flex-col p-5 rounded-3xl border cursor-pointer transition-all duration-200 ${
                  selectedPackage === 'single'
                    ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="program-select"
                      checked={selectedPackage === 'single'}
                      onChange={() =>
                        onSelectProgram(
                          'single',
                          'single',
                          'Single Trial Session',
                        )
                      }
                      className="w-5 h-5 accent-emerald-600"
                    />
                    <div>
                      <span className="block font-bold text-gray-900">
                        Single Trial Session
                      </span>
                      <span className="block text-xs text-gray-500">
                        90 Min • Personal Consultation
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-gray-900">
                    {teacher.rates.single}฿
                  </span>
                </div>
              </label>

              {/* DYNAMIC TEACHER PROGRAMS */}
              {teacherPrograms.map((p) => {
                const isSelected = activeProgramId === p.id;
                const price =
                  p.bundleType === 'bundle6'
                    ? teacher.rates.bundle6
                    : teacher.rates.bundle3;

                return (
                  <label
                    key={p.id}
                    className={`relative flex flex-col p-5 rounded-3xl border cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-emerald-500 bg-white shadow-md ring-1 ring-emerald-500'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="program-select"
                          checked={isSelected}
                          onChange={() =>
                            onSelectProgram(
                              p.id,
                              p.bundleType as PackageType,
                              p.title,
                            )
                          }
                          className="w-5 h-5 accent-emerald-600"
                        />
                        <div>
                          <span className="block font-bold text-gray-900">
                            {p.title}
                          </span>
                          <span className="block text-xs font-bold text-emerald-600 uppercase mt-0.5">
                            {p.duration}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-lg text-gray-900">
                        {price}฿
                      </span>
                    </div>
                  </label>
                );
              })}
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
                rates={teacher.rates}
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
                className="bg-orange-600 text-white text-lg font-medium px-4 py-2 rounded-xl hover:bg-orange-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
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
