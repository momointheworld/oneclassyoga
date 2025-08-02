'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/supabaseClient';
import { BreadcrumbTrail } from '@/components/BreadCrumbTrail';

type Booking = {
  id: string;
  createdAt: string;
  customer_name: string;
  customer_email: string;
  teacher_slug: string;
  participants: number;
  date: Date;
  time_slot: string;
  amount_total: number;
};

export default function ViewBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const supabase = createClient();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .order('createdAt', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching bookings:', error.message);
        setLoading(false);
        return;
      }

      setBookings(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      setLoading(false);
    };

    fetchBookings();
  }, [page]);

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <BreadcrumbTrail
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Bookings' }, // no href = current page
        ]}
      />
      <h1 className="text-2xl font-semibold my-4">Booking List</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-3 py-2 border">Created</th>
                <th className="px-3 py-2 border">Customer Name</th>
                <th className="px-3 py-2 border">Customer Email</th>
                <th className="px-3 py-2 border">Teacher</th>
                <th className="px-3 py-2 border">Participants</th>
                <th className="px-3 py-2 border">Date</th>
                <th className="px-3 py-2 border">Time Slot</th>
                <th className="px-3 py-2 border">Amount (THB)</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 border">
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 border">{b.customer_name}</td>
                  <td className="px-3 py-2 border">{b.customer_email}</td>
                  <td className="px-3 py-2 border">{b.teacher_slug}</td>
                  <td className="px-3 py-2 border">{b.participants}</td>
                  <td className="px-3 py-2 border">
                    {new Date(b.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 border">{b.time_slot}</td>
                  <td className="px-3 py-2 border">
                    {b.amount_total?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between items-center text-sm">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {page} of {totalPages}
        </p>
        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
