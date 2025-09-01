'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/supabaseClient';
import { DatePicker } from '@/components/DatePicker';
import { TimeSlotPicker } from '@/components/TimeSlot';
import { ToBangkokDateOnly } from '@/components/BkkTimeConverter';
import Link from 'next/link';
import { BreadcrumbTrail } from '@/components/BreadCrumbTrail';

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
};

type Teacher = {
  slug: string;
  available_days: string[];
  timeSlots: string[] | string; // handle stringified JSON
};

export default function BookingDashboard() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]); // Store all bookings
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [initialBooking, setInitialBooking] = useState<Booking | null>(null);

  // 🔍 Search state
  const [searchEmail, setSearchEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // current page
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
    .filter(
      (b) => b.booking_type === 'bundle5' || b.booking_type === 'bundle10'
    )
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

      // 1️⃣ Fetch all bookings in one query
      const { data: allBookingsData, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false });

      if (error || !allBookingsData) {
        console.error('Error fetching bookings:', error?.message);
        return;
      }

      // 1️⃣ Build counts map: count all bookings by their bundle_id
      const countsMap: Record<string, number> = {};
      (allBookingsData as Booking[]).forEach((booking) => {
        if (booking.bundle_id) {
          const key = booking.bundle_id;
          countsMap[key] = (countsMap[key] || 0) + 1;
        }
      });
      // 2️⃣ Attach bundle_count to all bookings
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

      // 4️⃣ Set state
      setAllBookings(bookingsWithCounts);
    } catch (error) {
      console.error('Error in fetchAllBookings:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchEmail]);

  // Fetch teacher details
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
    }
  };

  const timeSlots = Array.isArray(teacher?.timeSlots)
    ? teacher?.timeSlots
    : JSON.parse((teacher?.timeSlots as string) || '[]');

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

  // Populate edit form when switching entry
  useEffect(() => {
    if (editingBooking) {
      setFormData(editingBooking);
      setSelectedDate(
        editingBooking.date ? new Date(editingBooking.date) : null
      );
      setTimeSlot(editingBooking.time_slot || null);
      setInitialBooking(editingBooking);

      if (editingBooking.teacher_slug) {
        fetchTeacher(editingBooking.teacher_slug);
        if (editingBooking.date) {
          fetchBookedSlots(editingBooking.teacher_slug, editingBooking.date);
        }
      }
    }
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
    fetchAllBookings(); // Refetch all data
  };

  // compare helper
  const hasChanged = (field: keyof Booking) =>
    initialBooking && formData[field] !== initialBooking[field];

  // 🔍 Search filter handler
  const handleSearch = () => {
    // Search is handled automatically by the filteredBookings computed value
    // This function can be used for additional search logic if needed
  };

  const handleResetSearch = () => {
    setSearchEmail('');
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
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
          onClick={handleSearch}
        >
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

            {teacher && (
              <>
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <DatePicker
                    selected={selectedDate || undefined}
                    onSelect={(date) => setSelectedDate(date ?? null)}
                    availableDays={teacher.available_days}
                  />
                </div>

                {/* Time Slot Picker */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Time Slot
                  </label>
                  <TimeSlotPicker
                    selectedSlot={timeSlot || ''}
                    onSelect={setTimeSlot}
                    timeSlots={timeSlots || []}
                    bookedSlots={bookedSlots}
                  />
                </div>
              </>
            )}

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
              onClick={() => setEditingBooking(null)}
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
    </div>
  );
}
