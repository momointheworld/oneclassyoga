'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/supabaseClient';
import { DatePicker } from '@/components/DatePicker';
import { TimeSlotPicker } from '@/components/TimeSlot';
import { ToBangkokDateOnly } from '@/components/BkkTimeConverter';
import { BreadcrumbTrail } from '@/components/BreadCrumbTrail';
import { weekly_schedule } from '@/lib/constants';
import { formatInTimeZone } from 'date-fns-tz';

const supabase = createClient();

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  date: string;
  time_slot: string;
  participants: number;
  createdAt: string;
  teacher_slug?: string;
  amount_total?: number;
  booking_type?: string;
  bundle_size?: number;
  bundle_id?: number | null;
  session_id?: string;
};

type Teacher = {
  slug: string;
  weekly_schedule: Record<string, string[]>;
};

export default function AddBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerEmail = searchParams.get('email') || '';
  const [weeklySchedule, setWeeklySchedule] =
    useState<Record<string, string[]>>(weekly_schedule);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherSlug, setSelectedTeacherSlug] = useState<string | null>(
    null
  );
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  // const [timeSlots, setTimeSlots] = useState<string[] | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bundleBooking, setBundleBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase.from('teachers').select('*');
      if (error) console.error(error);
      else setTeachers(data || []);
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (!customerEmail) return;

    const fetchBundle = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_email', customerEmail)
        .neq('booking_type', 'single')
        .limit(1)
        .single();

      if (error) console.error(error);
      else {
        setBundleBooking(data);
        setCustomerName(data?.customer_name || '');
        if (data?.teacher_slug) setSelectedTeacherSlug(data.teacher_slug);
      }
      setLoading(false);
    };

    fetchBundle();
  }, [customerEmail]);

  useEffect(() => {
    if (!selectedTeacherSlug) return;

    const fetchTeacher = async (slug: string) => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching teacher:', error.message);
        setTeacher(null);
        setTimeSlots([]);
        return;
      }

      setTeacher(data);

      const schedule = data.weekly_schedule || weekly_schedule;
      setWeeklySchedule(schedule);

      const availDays = Object.entries(schedule)
        .filter(([_, slots]) => (slots as string[]).length > 0)
        .map(([day]) => day);
      setAvailableDays(availDays);

      const selectedDay = selectedDate
        ? formatInTimeZone(selectedDate, 'Asia/Bangkok', 'EEEE')
        : null;

      setTimeSlots(selectedDay ? schedule[selectedDay] || [] : []);
    };

    fetchTeacher(selectedTeacherSlug);
  }, [selectedTeacherSlug, selectedDate]);

  useEffect(() => {
    if (!teacher?.slug || !selectedDate) return;
    const bkkDate = ToBangkokDateOnly(selectedDate);
    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(
          `/api/search-booking?date=${bkkDate}&teacherSlug=${teacher.slug}`
        );
        const data = await res.json();
        setBookedSlots(data?.bookedTimeSlots || []);
      } catch (err) {
        console.error('Failed to fetch booked slots', err);
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [teacher, selectedDate]);

  const handleSubmit = async () => {
    if (!selectedDate || !timeSlot || !customerName || !selectedTeacherSlug) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const { data: bundleBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('id, session_id')
      .eq('customer_email', customerEmail)
      .neq('booking_type', 'single')
      .limit(1)
      .single();

    if (fetchError) {
      console.error(fetchError);
      setMessage('Failed to fetch bundle booking.');
      setSubmitting(false);
      return;
    }

    const { session_id } = bundleBookings;

    const { error } = await supabase.from('bookings').insert([
      {
        customer_name: customerName,
        customer_email: customerEmail,
        date: ToBangkokDateOnly(selectedDate),
        time_slot: timeSlot,
        teacher_slug: teacher?.slug || bundleBooking?.teacher_slug || null,
        booking_type: 'single',
        bundle_size: bundleBooking?.bundle_size || null,
        participants: 1,
        createdAt: ToBangkokDateOnly(new Date()),
        amount_total: 0,
        session_id: session_id,
        bundle_id: bundleBooking?.session_id || null,
      },
    ]);

    setSubmitting(false);
    if (error) {
      console.error(error);
      setMessage('Failed to add booking.');
    } else {
      setMessage('Booking added successfully! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 1500);
    }
  };

  if (loading) return <p>Loading customer bundle info...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded space-y-4">
      <BreadcrumbTrail
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Bookings', href: '/dashboard/bookings' },
          { label: `Add New Booking` }, // no href = current page
        ]}
      />
      <h1 className="text-2xl font-bold mb-2 mt-8">Add Single Booking</h1>

      <p>
        Customer:{' '}
        <strong>
          {customerName} | {customerEmail}
        </strong>{' '}
        {bundleBooking && (
          <span className="ml-2 text-blue-600 font-medium">
            (Linked to bundle)
          </span>
        )}
      </p>

      {message && (
        <p className="p-2 bg-yellow-100 text-yellow-800 rounded">{message}</p>
      )}

      <div>
        <label className="block mb-1 font-medium">Select Teacher</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={selectedTeacherSlug || ''}
          onChange={(e) => setSelectedTeacherSlug(e.target.value)}
        >
          <option value="" disabled>
            -- Select Teacher --
          </option>
          {teachers.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.slug}
            </option>
          ))}
        </select>
      </div>

      <div>
        <DatePicker
          selected={selectedDate || undefined}
          onSelect={(date) => setSelectedDate(date ?? null)}
          availableDays={availableDays}
        />
      </div>

      <TimeSlotPicker
        selectedSlot={timeSlot || ''}
        onSelect={setTimeSlot}
        timeSlots={timeSlots || []}
        bookedSlots={bookedSlots}
      />

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Adding...' : 'Add Booking'}
      </button>
    </div>
  );
}
