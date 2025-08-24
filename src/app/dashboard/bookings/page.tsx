'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/supabaseClient';
import { DatePicker } from '@/components/DatePicker';
import { TimeSlotPicker } from '@/components/TimeSlot';

const supabase = createClient();

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  date: string;
  teacher_id: number;
  teacher_slug: string;
  session_id: string;
  createdAt: string;
  time_slot: string;
  payment_intent: string;
  amount_total: number;
  participants: number;
  booking_type: string;
  bundle_size: number;
};

export default function BookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const pageSize = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) console.error(error);
    else setBookings(data);
  }

  // Pagination helpers
  const filteredBookings = bookings.filter(
    (b) =>
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_email.toLowerCase().includes(search.toLowerCase())
  );

  const singleBookings = filteredBookings
    .filter((b) => b.booking_type !== 'bundle')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(singleBookings.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const pageBookings = singleBookings.slice(startIndex, startIndex + pageSize);

  const bundleBookings = bookings
    .filter((b) => b.booking_type === 'bundle')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border px-2 py-1 rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page on search
          }}
        />
        <a
          href="/dashboard/bookings/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Booking
        </a>
      </div>

      {/* Single Bookings Table */}
      <h2 className="text-xl font-bold mb-2">Single Bookings</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1">Created At</th>
            <th className="border px-2 py-1">Customer</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Teacher</th>
            <th className="border px-2 py-1">Participants</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Time</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Actions</th>
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Bundle Bookings */}
      <h2 className="text-xl font-bold mt-8 mb-2">Bundle Bookings</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1">Created At</th>
            <th className="border px-2 py-1">Customer</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Teacher</th>
            <th className="border px-2 py-1">Bundle Size</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Time</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Type</th>
          </tr>
        </thead>
        <tbody>
          {bundleBookings.map((b, index) => (
            <tr key={b.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2 border">{index + 1}</td>
              <td className="px-3 py-2 border">
                {new Date(b.createdAt).toLocaleString('en-TH', {
                  timeZone: 'Asia/Bangkok',
                })}
              </td>
              <td className="px-3 py-2 border">{b.customer_name}</td>
              <td className="px-3 py-2 border">{b.customer_email}</td>
              <td className="px-3 py-2 border">{b.teacher_slug}</td>
              <td className="px-3 py-2 border">{b.bundle_size}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
