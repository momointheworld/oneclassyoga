'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/supabaseClient';
import { DatePicker } from '@/components/DatePicker';
import { TimeSlotPicker } from '@/components/TimeSlot';
import { ToBangkokDateOnly } from '@/components/BkkTimeConverter';
import Link from 'next/link';

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

export default function BookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [initialBooking, setInitialBooking] = useState<Booking | null>(null);
  // 🔍 Search state
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageBookings = filteredBookings
    .filter((b) => !b.bundle_size)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(startIndex, endIndex);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      const { data, error } = await supabase.from('bookings').select('*');
      if (!error) {
        setBookings(data);
        setFilteredBookings(data); // <— initialize with full data
      }
      setLoading(false);
    }

    fetchBookings();
  }, []);

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  async function fetchBookings(page: number) {
    setLoading(true);
    const start = (page - 1) * pageSize;
    const end = page * pageSize - 1;

    const { data, count, error } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' }) // count for total pages
      .order('date', { ascending: false })
      .range(start, end);

    if (!error && data) {
      setBookings(data);
      setTotalPages(Math.ceil((count || 0) / pageSize));
    }

    setLoading(false);
  }

  // Fetch teacher
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
      }
      if (editingBooking.teacher_slug && editingBooking.date) {
        fetchBookedSlots(editingBooking.teacher_slug, editingBooking.date);
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
        booking_type: formData.booking_type, // ✅ always save booking_type
      })
      .eq('id', editingBooking.id);

    if (error) {
      console.error('Error updating booking:', error.message);
      return alert('Failed to update booking');
    }

    setEditingBooking(null);
    fetchBookings(page);
  };

  // compare helper
  const hasChanged = (field: keyof Booking) =>
    initialBooking && formData[field] !== initialBooking[field];

  // 🔍 Search filter handler
  const handleSearch = () => {
    if (!searchEmail.trim()) {
      setFilteredBookings(bookings); // reset
    } else {
      setFilteredBookings(
        bookings.filter((b) =>
          b.customer_email.toLowerCase().includes(searchEmail.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Dashboard</h1>

      {/* 🔍 Search Bar */}
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
          type="button"
        >
          Search
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          onClick={() => {
            setSearchEmail('');
            setFilteredBookings(bookings);
          }}
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
                <option value="group">Bundle</option>
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

      {/* Single Bookings */}
      <h2 className="text-xl font-semibold mb-2">Single Bookings</h2>
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
                {new Date(b.createdAt).toLocaleString('en-TH', {
                  timeZone: 'Asia/Bangkok',
                })}
              </td>
              <td className="px-3 py-2 border">{b.customer_name}</td>
              <td className="px-3 py-2 border">{b.customer_email}</td>
              <td className="px-3 py-2 border">{b.teacher_slug}</td>
              <td className="px-3 py-2 border">{b.participants}</td>
              <td className="px-3 py-2 border">
                {new Date(b.date).toLocaleDateString('en-TH', {
                  timeZone: 'Asia/Bangkok',
                })}
              </td>
              <td className="px-3 py-2 border">{b.time_slot}</td>
              <td className="px-3 py-2 border">
                {b.amount_total?.toLocaleString()}
              </td>
              <td className="px-3 py-2 border">{b.booking_type}</td>
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

      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={page <= 1 || loading}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages || loading}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Bundle Bookings */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Bundle Bookings</h2>
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 border">#</th>
            <th className="px-3 py-2 border">Name</th>
            <th className="px-3 py-2 border">Email</th>
            <th className="px-3 py-2 border">Teachers</th>
            <th className="px-3 py-2 border">Bundle Size</th>
            <th className="px-3 py-2 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings
            .filter((b) => b.bundle_size)
            .map((b, index) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2 border">{index + 1}</td>
                <td className="px-3 py-2 border">{b.customer_name}</td>
                <td className="px-3 py-2 border">
                  <Link
                    href={`/dashboard/bookings/new?email=${encodeURIComponent(b.customer_email)}`}
                  >
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {b.customer_email}
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-2 border">{b.teacher_slug}</td>
                <td className="px-3 py-2 border">{b.bundle_size}</td>
                <td className="px-3 py-2 border">
                  {b.amount_total?.toLocaleString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
