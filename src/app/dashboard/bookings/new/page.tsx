'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/supabaseClient';
import { DatePicker } from '@/components/DatePicker';
import { TimeSlotPicker } from '@/components/TimeSlot';
import { ToBangkokDateOnly } from '@/components/BkkTimeConverter';

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
};

type Teacher = {
  slug: string;
  available_days: string[];
  timeSlots: string[] | string; // handle stringified JSON
};

export default function AddBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerEmail = searchParams.get('email') || '';

  const [customerName, setCustomerName] = useState('');
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[] | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bundleBooking, setBundleBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch bundle booking for this customer
  useEffect(() => {
    if (!customerEmail) return;

    const fetchBundle = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_email', customerEmail)
        .eq('booking_type', 'bundle')
        .limit(1)
        .single();

      if (error) console.error(error);
      else {
        setBundleBooking(data);
        setCustomerName(data?.customer_name || '');
        if (data?.teacher_slug) await fetchTeacher(data.teacher_slug);
      }
      setLoading(false);
    };

    fetchBundle();
  }, [customerEmail]);

  // Fetch teacher data
  const fetchTeacher = async (slug: string) => {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching teacher:', error.message);
      setTeacher(null);
    } else {
      setTeacher(data);
      try {
        const slots = Array.isArray(data?.timeSlots)
          ? data.timeSlots
          : JSON.parse(data?.timeSlots || '[]');
        setTimeSlots(slots);
      } catch (err) {
        console.error('Failed to parse timeSlots', err);
        setTimeSlots([]);
      }
    }
  };

  // Fetch booked slots for selected date
  useEffect(() => {
    if (!teacher?.slug || !selectedDate) return;

    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(
          `/api/search-booking?teacherSlug=${teacher.slug}&date=${selectedDate.toISOString()}`
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
    if (!selectedDate || !timeSlot || !customerName) return;

    setSubmitting(true);
    const { data, error } = await supabase.from('bookings').insert([
      {
        customer_name: customerName,
        customer_email: customerEmail,
        date: ToBangkokDateOnly(selectedDate),
        time_slot: timeSlot,
        teacher_slug: bundleBooking?.teacher_slug || null,
        booking_type: 'single',
        bundle_size: bundleBooking?.id,
        participants: 1,
        createdAt: new Date().toISOString(),
      },
    ]);

    setSubmitting(false);
    if (error) {
      console.error(error);
      alert('Failed to add booking');
    } else {
      alert('Booking added successfully!');
      router.push('/bookings'); // redirect to booking list
    }
  };

  if (loading) return <p>Loading customer bundle info...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded space-y-4">
      <h1 className="text-2xl font-bold mb-2">Add Single Booking</h1>

      <p>
        Customer: <strong>{customerName || customerEmail}</strong>{' '}
        {bundleBooking && (
          <span className="ml-2 text-blue-600 font-medium">
            (Linked to bundle)
          </span>
        )}
      </p>

      <div>
        <label className="block mb-1 font-medium">Select Date</label>
        <DatePicker
          selected={selectedDate || undefined}
          onSelect={(date) => setSelectedDate(date ?? null)}
          availableDays={teacher?.available_days}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Select Time Slot</label>
        <TimeSlotPicker
          selectedSlot={timeSlot || ''}
          onSelect={setTimeSlot}
          timeSlots={timeSlots || []}
          bookedSlots={bookedSlots}
        />
      </div>

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
