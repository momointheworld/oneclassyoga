'use client';

import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const teacherSlug = searchParams.get('teacher');
  const date = searchParams.get('date');
  const time = searchParams.get('timeSlot');

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed! 🎉</h1>
      <p className="text-lg mb-6">Your payment was successful.</p>

      {sessionId && (
        <p className="text-sm text-gray-500 mb-6">
          Booking ID: {sessionId.slice(0, 16)}
        </p>
      )}

      <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
        <div>
          Your booking is confirmed with{' '}
          <span className="font-semibold">{teacherSlug || 'the teacher'}</span>
          {date && time && (
            <span>
              {' '}
              on{' '}
              {new Date(date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              at {time}.
            </span>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg text-left">
        <h2 className="text-xl font-semibold mb-2">Need help?</h2>
        <p className="mb-1">
          📱 <strong>Line ID:</strong> @yourlineid
        </p>
        <p className="mb-1">
          📞 <strong>Phone:</strong> +66-89-123-4567
        </p>
        <p>
          📧 <strong>Email:</strong> support@example.com
        </p>
      </div>
    </div>
  );
}
