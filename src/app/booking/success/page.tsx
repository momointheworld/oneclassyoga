'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const teacherSlug = searchParams.get('teacher');
  const date = searchParams.get('date');
  const time = searchParams.get('timeSlot');
  const participants = searchParams.get('participants');
  const [copied, setCopied] = useState(false);

  const teacherName = teacherSlug
    ? teacherSlug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char: string) => char.toUpperCase())
    : 'Unspecified Teacher';

  const copyToClipboard = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Booking Confirmed!</h1>
      <p className="text-lg text-gray-700 mb-4">Your payment was successful.</p>

      {/* Booking Details */}
      <div className="bg-white shadow-md p-6 rounded-xl mb-8 text-left border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Class Details
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {sessionId && (
            <li className="flex items-center gap-2">
              <span className="font-medium">Booking Reference:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {sessionId.slice(0, 16)}...
              </span>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                {copied ? 'Copied!' : 'Copy Full ID'}
              </button>
            </li>
          )}
          <li>
            <span className="font-medium">Teacher:</span> {teacherName}
          </li>
          {date && (
            <li>
              <span className="font-medium">Date:</span>{' '}
              {new Date(date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </li>
          )}
          {time && (
            <li>
              <span className="font-medium">Time:</span> {time}
            </li>
          )}
          {participants && (
            <li>
              <span className="font-medium">Participants:</span> {participants}{' '}
              {Number(participants) === 1 ? 'person' : 'people'}
            </li>
          )}
        </ul>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 border border-gray-100 text-gray-500 p-5 rounded-lg text-left text-sm">
        <h3 className="text-base font-semibold text-gray-600 mb-2">
          Have questions?
        </h3>
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

      <div className="mt-8 text-center">
        <Link
          href="/teachers"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Check out more teachers
        </Link>
      </div>
    </div>
  );
}
