/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/supabaseClient';
import { DatePicker } from '@/components/DatePicker';
import { TimeSlotPicker } from '@/components/TimeSlot';
import { ToBangkokDateOnly } from '@/components/BkkTimeConverter';
import Link from 'next/link';
import { BreadcrumbTrail } from '@/components/BreadCrumbTrail';
import { formatInTimeZone } from 'date-fns-tz';
import { weekly_schedule } from '@/lib/constants';
import TeacherReviews from '@/components/TeacherReviews';
import { Button } from '@/components/ui/button';

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
  bundle_id?: string | null;
  bundle_count?: number;
  review_sent: boolean;
  review_submitted: boolean;
  review_approved: boolean;
  review_token: string;
};

type Teacher = {
  slug: string;
  weekly_schedule: Record<string, string[]>;
};

type Review = {
  id: string;
  booking_id: string;
  customer_name: string;
  email: string;
  review_text: string;
  teacher_slug: string;
  rating?: number;
  created_at: string;
  status: string;
};

export default function BookingDashboard() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [initialBooking, setInitialBooking] = useState<Booking | null>(null);
  const [weeklySchedule, setWeeklySchedule] =
    useState<Record<string, string[]>>(weekly_schedule);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStatusMsg, setReviewStatusMsg] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  // Add loading state for timeslots
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);

  // 🔍 Search state
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Filter bookings based on search
  const filteredBookings = searchEmail.trim()
    ? allBookings.filter((b) =>
        b.customer_email.toLowerCase().includes(searchEmail.toLowerCase())
      )
    : allBookings;

  // Sort all bookings by date descending
  const sortedBookings = filteredBookings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get bundle bookings
  const bundleBookings = filteredBookings
    .filter((b) => b.booking_type?.startsWith('bundle'))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // Pagination
  const totalPages = Math.ceil(sortedBookings.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageBookings = sortedBookings.slice(startIndex, endIndex);

  async function fetchAllBookings() {
    try {
      setLoading(true);

      const { data: allBookingsData, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false });

      if (error || !allBookingsData) {
        console.error('Error fetching bookings:', error?.message);
        return;
      }

      const countsMap: Record<string, number> = {};
      (allBookingsData as Booking[]).forEach((booking) => {
        if (booking.bundle_id) {
          const key = booking.bundle_id;
          countsMap[key] = (countsMap[key] || 0) + 1;
        }
      });

      const bookingsWithCounts = (allBookingsData as Booking[]).map(
        (booking) => {
          return {
            ...booking,
            bundle_count: booking.bundle_id
              ? countsMap[booking.bundle_id] || 0
              : 0,
          };
        }
      );

      setAllBookings(bookingsWithCounts);
    } catch (error) {
      console.error('Error in fetchAllBookings:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching reviews:', error.message);
          setReviews([]);
          return;
        }

        const mapped = (data || []).map((r) => ({
          id: r.id,
          booking_id: r.booking_id,
          customer_name: r.customer_name,
          review_text: r.review_text,
          rating: r.rating,
          created_at: r.created_at,
          email: r.email,
          status: r.status,
          teacher_slug: r.teacher_slug,
        }));

        setReviews(mapped);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, []);

  const groupedReviews = reviews.reduce(
    (acc, review) => {
      if (!acc[review.teacher_slug]) {
        acc[review.teacher_slug] = [];
      }
      acc[review.teacher_slug].push(review);
      return acc;
    },
    {} as Record<string, Review[]>
  );

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchEmail]);

  // Optimized function to update timeslots immediately
  const updateTimeSlotsForDate = (
    date: Date | null,
    schedule: Record<string, string[]>
  ) => {
    if (!date) {
      setTimeSlots([]);
      return;
    }

    const selectedDay = formatInTimeZone(date, 'Asia/Bangkok', 'EEEE');
    const daySlots = schedule[selectedDay] || [];
    setTimeSlots(daySlots);
  };

  // Fetch teacher details - optimized version
  const fetchTeacher = async (slug: string) => {
    setTimeSlotsLoading(true);

    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching teacher:', error.message);
        setTeacher(null);
        // Fallback to default schedule
        const availDays = Object.entries(weekly_schedule)
          .filter(([_, slots]) => (slots as string[]).length > 0)
          .map(([day]) => day);

        setWeeklySchedule(weekly_schedule);
        setAvailableDays(availDays);
        updateTimeSlotsForDate(selectedDate, weekly_schedule);
        return;
      }

      const schedule = data.weekly_schedule || weekly_schedule;
      const availDays = Object.entries(schedule)
        .filter(([_, slots]) => (slots as string[]).length > 0)
        .map(([day]) => day);

      setTeacher({
        ...data,
        weekly_schedule: schedule,
      });
      setWeeklySchedule(schedule);
      setAvailableDays(availDays);

      // Update timeslots immediately with the fetched schedule
      updateTimeSlotsForDate(selectedDate, schedule);
    } catch (error) {
      console.error('Error fetching teacher:', error);
      // Fallback to default schedule
      const availDays = Object.entries(weekly_schedule)
        .filter(([_, slots]) => (slots as string[]).length > 0)
        .map(([day]) => day);

      setWeeklySchedule(weekly_schedule);
      setAvailableDays(availDays);
      updateTimeSlotsForDate(selectedDate, weekly_schedule);
    } finally {
      setTimeSlotsLoading(false);
    }
  };

  // Fetch booked slots
  const fetchBookedSlots = async (teacherSlug: string, date: string) => {
    try {
      const res = await fetch(
        `/api/search-booking?teacherSlug=${teacherSlug}&date=${date}`
      );
      const data = await res.json();
      setBookedSlots(data?.bookedTimeSlots || []);
    } catch (err) {
      console.error('Failed to fetch booked slots', err);
      setBookedSlots([]);
    }
  };

  // Optimized effect for when selectedDate changes
  useEffect(() => {
    if (selectedDate && weeklySchedule) {
      updateTimeSlotsForDate(selectedDate, weeklySchedule);

      // Fetch booked slots if we have a teacher
      if (editingBooking?.teacher_slug) {
        fetchBookedSlots(
          editingBooking.teacher_slug,
          ToBangkokDateOnly(selectedDate)
        );
      }
    }
  }, [editingBooking?.teacher_slug, selectedDate, weeklySchedule]);

  // Populate edit form when switching entry - optimized
  useEffect(() => {
    if (editingBooking) {
      setFormData(editingBooking);
      const bookingDate = editingBooking.date
        ? new Date(editingBooking.date + 'T00:00:00') // force local midnight
        : null;

      setSelectedDate(bookingDate);
      console.log('bookingDate:', bookingDate);
      setTimeSlot(editingBooking.time_slot || null);
      setInitialBooking(editingBooking);

      if (editingBooking.teacher_slug) {
        // Immediately set fallback schedule and timeslots
        const availDays = Object.entries(weekly_schedule)
          .filter(([_, slots]) => (slots as string[]).length > 0)
          .map(([day]) => day);

        setAvailableDays(availDays);
        setWeeklySchedule(weekly_schedule);

        // Set timeslots immediately with fallback
        if (bookingDate) {
          updateTimeSlotsForDate(bookingDate, weekly_schedule);
        }

        // Then fetch actual teacher schedule (this will update timeslots again when complete)
        fetchTeacher(editingBooking.teacher_slug);

        if (editingBooking.date) {
          fetchBookedSlots(editingBooking.teacher_slug, editingBooking.date);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingBooking]);

  // Update booking
  const updateBooking = async () => {
    if (!editingBooking) return;

    const { error } = await supabase
      .from('bookings')
      .update({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        date: selectedDate ? ToBangkokDateOnly(selectedDate) : '',
        time_slot: timeSlot,
        participants: formData.participants,
        booking_type: formData.booking_type,
      })
      .eq('id', editingBooking.id);

    if (error) {
      console.error('Error updating booking:', error.message);
      return alert('Failed to update booking');
    }

    setEditingBooking(null);
    resetEditingState();
    fetchAllBookings();
  };

  // compare helper
  const hasChanged = (field: keyof Booking) =>
    initialBooking && formData[field] !== initialBooking[field];

  const handleResetSearch = () => {
    setSearchEmail('');
  };

  const resetEditingState = () => {
    setFormData({});
    setSelectedDate(null);
    setTimeSlot(null);
    setBookedSlots([]);
    setTeacher(null);
    setWeeklySchedule(weekly_schedule);
    setAvailableDays([]);
    setTimeSlots([]);
    setInitialBooking(null);
    setTimeSlotsLoading(false);
  };

  const cancelEditing = () => {
    setEditingBooking(null);
    resetEditingState();
  };
  const handleSendReview = async (bookingId: number) => {
    try {
      setButtonLoading(true); // ✅ set loading immediately when clicked

      // Call your API to send the review email
      const res = await fetch('/api/send-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send review link');

      setReviewStatusMsg('Review Link Sent successfully');
      fetchAllBookings(); // Refresh your booking table
    } catch (err: unknown) {
      console.error('Failed to send review link', err);
      setReviewStatusMsg(`Error: ${err}`);
    } finally {
      setButtonLoading(false); // ✅ re-enable button after request completes
    }
  };

  return (
    <div className="p-6">
      <BreadcrumbTrail
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Bookings' },
        ]}
      />
      <h1 className="text-2xl font-bold mb-4 mt-8">Booking Dashboard</h1>

      {/* Search */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border px-3 py-2 rounded-md w-64"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
          Search
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          onClick={handleResetSearch}
        >
          Reset
        </button>
      </div>

      {/* Edit Form */}
      {editingBooking && (
        <div className="p-6 mb-6 border rounded-xl bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-4">Edit Booking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customer_name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded-md ${
                  hasChanged('customer_name')
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300'
                }`}
              />
            </div>

            {/* Customer Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer Email
              </label>
              <input
                type="email"
                value={formData.customer_email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, customer_email: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded-md ${
                  hasChanged('customer_email')
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300'
                }`}
              />
            </div>

            {/* Date Picker - always show */}
            {selectedDate && (
              <div>
                <DatePicker
                  selected={selectedDate} // ✅ Use selectedDate instead of formData.date
                  onSelect={(date) => {
                    setSelectedDate(date ?? null);
                    // Also update formData to keep them in sync
                    setFormData((prev) => ({
                      ...prev,
                      date: date ? ToBangkokDateOnly(date) : '',
                    }));
                  }}
                  availableDays={availableDays}
                />
              </div>
            )}

            {/* Time Slot Picker - always show with loading state */}
            <div>
              <TimeSlotPicker
                selectedSlot={timeSlot || ''}
                onSelect={setTimeSlot}
                timeSlots={timeSlots}
                bookedSlots={bookedSlots}
              />
              {timeSlotsLoading && (
                <div className="text-sm text-gray-500 mt-1">
                  Loading time slots...
                </div>
              )}
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Participants
              </label>
              <input
                type="number"
                value={formData.participants || 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    participants: Number(e.target.value),
                  })
                }
                className={`w-full border px-3 py-2 rounded-md ${
                  hasChanged('participants')
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300'
                }`}
              />
            </div>

            {/* Booking Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Booking Type
              </label>
              <select
                value={formData.booking_type || 'single'}
                onChange={(e) =>
                  setFormData({ ...formData, booking_type: e.target.value })
                }
                className={`w-full border px-3 py-2 rounded-md ${
                  hasChanged('booking_type')
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300'
                }`}
              >
                <option value="single">Single</option>
                <option value="bundle">Bundle</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
              onClick={updateBooking}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={cancelEditing}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && <p>Loading bookings...</p>}

      {/* All bookings */}
      <h2 className="text-xl font-semibold">
        All Bookings ({sortedBookings.length} total)
      </h2>
      <div className="text-sm text-gray-600">
        Showing {startIndex + 1}-{Math.min(endIndex, sortedBookings.length)} of{' '}
        {sortedBookings.length}
      </div>

      {/* review link status */}
      <div
        className={`text-sm text-center py-5 my-2 ${
          reviewStatusMsg
            ? reviewStatusMsg.includes('Error')
              ? 'text-orange-800 bg-orange-100'
              : 'text-emerald-800 bg-emerald-100'
            : ''
        }`}
      >
        {reviewStatusMsg}
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 border">#</th>
            <th className="px-3 py-2 border">Created At</th>
            <th className="px-3 py-2 border">Name</th>
            <th className="px-3 py-2 border">Email</th>
            <th className="px-3 py-2 border">Teacher</th>
            <th className="px-3 py-2 border">Participants</th>
            <th className="px-3 py-2 border">Date</th>
            <th className="px-3 py-2 border">Time Slot</th>
            <th className="px-3 py-2 border">Amount</th>
            <th className="px-3 py-2 border">Booking Type</th>
            <th className="px-3 py-2 border">Bundle Linked</th>
            <th className="px-3 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageBookings.map((b, index) => (
            <tr
              key={b.id}
              className={`border-t hover:bg-gray-50 ${
                editingBooking?.id === b.id ? 'bg-yellow-100' : ''
              } ${new Date(b.date) < new Date() ? 'text-gray-400' : ''}`}
            >
              <td className="px-3 py-2 border">{startIndex + index + 1}</td>
              <td className="px-3 py-2 border">
                {ToBangkokDateOnly(new Date(b.createdAt))}
              </td>
              <td className="px-3 py-2 border">{b.customer_name}</td>
              <td className="px-3 py-2 border">{b.customer_email}</td>
              <td className="px-3 py-2 border">{b.teacher_slug}</td>
              <td className="px-3 py-2 border">{b.participants}</td>
              <td className="px-3 py-2 border">
                {ToBangkokDateOnly(new Date(b.date))}
              </td>
              <td className="px-3 py-2 border">{b.time_slot}</td>
              <td className="px-3 py-2 border">
                {b.amount_total?.toLocaleString()}
              </td>
              <td className="px-3 py-2 border">{b.booking_type}</td>
              <td className="px-3 py-2 border">
                {b.bundle_size
                  ? `${b.customer_name} | ${b.customer_email}`
                  : '-'}
              </td>
              <td className="px-3 py-2 flex flex-col gap-1 items-center">
                {/* Edit button */}
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:bg-gray-200"
                  onClick={() => setEditingBooking(b)}
                >
                  Edit
                </Button>

                {/* Send Review button */}
                {b.review_token && (
                  <div className="flex flex-col items-center">
                    <Button
                      variant="destructive"
                      className="text-gray-600 hover:bg-gray-200"
                      disabled={buttonLoading}
                      onClick={() => handleSendReview(b.id)}
                    >
                      {buttonLoading ? 'Sending' : 'Send Review'}
                    </Button>
                  </div>
                )}
                {/* Status */}
                {b.review_sent && (
                  <p className="text-emerald-700 text-sm">
                    {b.review_submitted
                      ? b.review_approved
                        ? 'Approved'
                        : 'Submitted'
                      : 'Sent'}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={page <= 1 || loading}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span className="flex items-center gap-2">
          <span>Page</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={page}
            onChange={(e) => {
              const newPage = Number(e.target.value);
              if (newPage >= 1 && newPage <= totalPages) {
                setPage(newPage);
              }
            }}
            className="w-16 px-2 py-1 border rounded text-center"
          />
          <span>of {totalPages}</span>
        </span>

        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages || loading}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Bundle Bookings Table */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        Bundle Bookings ({bundleBookings.length} total)
      </h2>
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 border">#</th>
            <th className="px-3 py-2 border">Name</th>
            <th className="px-3 py-2 border">Email</th>
            <th className="px-3 py-2 border">Teacher</th>
            <th className="px-3 py-2 border">Bundle Size</th>
            <th className="px-3 py-2 border">Bundle count</th>
            <th className="px-3 py-2 border">Amount</th>
            <th className="px-3 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bundleBookings.map((b, index) => (
            <tr key={b.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2 border">{index + 1}</td>
              <td className="px-3 py-2 border">{b.customer_name}</td>
              <td className="px-3 py-2 border">
                <Link
                  href={`/dashboard/bookings/new?email=${encodeURIComponent(
                    b.customer_email
                  )}`}
                >
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {b.customer_email}
                  </span>
                </Link>
              </td>
              <td className="px-3 py-2 border">{b.teacher_slug}</td>
              <td className="px-3 py-2 border">{b.bundle_size}</td>
              <td className="px-3 py-2 border">{b.bundle_count}</td>
              <td className="px-3 py-2 border">
                {b.amount_total?.toLocaleString()}
              </td>
              <td className="px-3 py-2 border">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setEditingBooking(b)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-10">
        <h2 className="text-xl">Reviews</h2>
        {Object.entries(groupedReviews).map(([slug, teacherReviews]) => (
          <div key={slug} className="mb-6">
            <TeacherReviews reviews={teacherReviews} />
          </div>
        ))}
      </div>
    </div>
  );
}
