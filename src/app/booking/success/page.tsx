// app/booking/success/page.tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const teacherSlug = searchParams.get('teacher');

  const [teacher, setTeacher] = useState<{
    name?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teacherSlug) {
      setError('No teacher information provided');
      return;
    }

    const fetchTeacher = async () => {
      setLoading(true);
      try {
        // Optimized query with timeout
        const { data, error } = await supabase
          .from('teachers')
          .select('name, lineId, phone, email')
          .eq('slug', teacherSlug)
          .maybeSingle(); // Returns null instead of throwing if no record found

        if (error) throw error;
        if (!data) throw new Error('Teacher not found');

        setTeacher(data);
      } catch (err) {
        console.error('Failed to fetch teacher:', err);
        setError('Contact details unavailable - please check your email');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we haven't already loaded the teacher
    if (!teacher.name) {
      fetchTeacher();
    }
  }, [teacher.name, teacherSlug]);

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed! 🎉</h1>
      <p className="text-lg mb-6">Your payment was successful.</p>

      {/* Always show the session ID for reference */}
      {sessionId && (
        <p className="text-sm text-gray-500 mb-6">
          Booking ID: {sessionId.slice(0, 16)}
        </p>
      )}

      {/* Teacher information section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
        <h2 className="text-xl font-semibold mb-4">
          {teacher.name || 'Your Teacher'}
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/teachers"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center"
        >
          Find More Teachers
        </Link>
        <Link
          href="/account/bookings"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 text-center"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
}
