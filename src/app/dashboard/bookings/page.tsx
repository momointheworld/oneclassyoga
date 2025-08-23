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
  time_slot: string;
  participants: number;
  createdAt: string;
  teacher_slug?: string;
  amount_total?: number;
  booking_type?: string;
  bundle_size?: number;
};

export default function BookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Fetch bookings from Supabase
  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) console.error(error);
    else setBookings(data || []);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Populate formData when editingBooking changes
  useEffect(() => {
    if (editingBooking) {
      setFormData(editingBooking);
      setSelectedDate(
        editingBooking.date ? new Date(editingBooking.date) : null
      );
      setTimeSlot(editingBooking.time_slot || null);

      // Fetch booked slots for this teacher/date
      if (editingBooking.teacher_slug && editingBooking.date) {
        fetchBookedSlots(editingBooking.teacher_slug, editingBooking.date);
      }
    }
  }, [editingBooking]);

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

  // Update booking
  const updateBooking = async () => {
    if (!editingBooking) return;

    const { error } = await supabase
      .from('bookings')
      .update({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        date: selectedDate?.toISOString(),
        time_slot: timeSlot,
        participants: formData.participants,
      })
      .eq('id', editingBooking.id);

    if (error) {
      console.error('Error updating booking:', error.message);
      return alert('Failed to update booking');
    }

    setEditingBooking(null);
    fetchBookings();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Dashboard</h1>

      {/* Edit Form */}
      {editingBooking && (
        <div className="p-4 mb-6 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Edit Booking</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customer_name || ''}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="email"
              placeholder="Customer Email"
              value={formData.customer_email || ''}
              onChange={(e) =>
                setFormData({ ...formData, customer_email: e.target.value })
              }
              className="border px-2 py-1 rounded"
            />

            <DatePicker
              selected={selectedDate || undefined}
              onSelect={(date) => setSelectedDate(date ?? null)}
              availableDays={availableDays}
            />
            <TimeSlotPicker
              selectedSlot={timeSlot || ''}
              onSelect={setTimeSlot}
              timeSlots={timeSlots}
              bookedSlots={bookedSlots}
            />

            <input
              type="number"
              placeholder="Participants"
              value={formData.participants || 1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  participants: Number(e.target.value),
                })
              }
              className="border px-2 py-1 rounded"
            />
          </div>

          <div className="mt-2 flex gap-2">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={updateBooking}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setEditingBooking(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Single Bookings Table */}
      <h2 className="text-xl font-semibold mb-2">Single Bookings</h2>
      <table className="w-full border-collapse border">
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
          {bookings
            .filter((b) => !b.bundle_size)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((b, index) => (
              <tr
                key={b.id}
                className={`border-t hover:bg-gray-50 ${
                  new Date(b.date) < new Date() ? 'text-gray-400' : ''
                }`}
              >
                <td className="px-3 py-2 border">{index + 1}</td>
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

      {/* Bundle Bookings Table */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Bundle Bookings</h2>
      <table className="w-full border-collapse border">
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
          {bookings
            .filter((b) => b.bundle_size)
            .map((b, index) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2 border">{index + 1}</td>
                <td className="px-3 py-2 border">{b.customer_name}</td>
                <td className="px-3 py-2 border">{b.customer_email}</td>
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
