'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BookingSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const teacherSlug = searchParams.get('teacher');
  const date = searchParams.get('date');
  const time = searchParams.get('timeSlot');
  const participants = searchParams.get('participants');
  const isBundle = searchParams.get('bundle') === 'true';

  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const teacherName = teacherSlug
    ? teacherSlug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char: string) => char.toUpperCase())
    : null;

  const hasBookingDetails = teacherSlug && date && time && participants;

  const copyToClipboard = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Send booking confirmation email
  useEffect(() => {
    if (!sessionId) return;

    const sendEmail = async () => {
      try {
        const res = await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (data.success) setEmailSent(true);
        else setEmailError(true);
      } catch (err) {
        console.error('Failed to send confirmation email', err);
        setEmailError(true);
      }
    };

    sendEmail();
  }, [sessionId]);

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Booking Confirmed!</h1>
      <p className="text-lg text-gray-700 mb-4">Your payment was successful.</p>

      {/* Booking Reference */}
      {sessionId && (
        <div className="mb-6">
          <p className="text-gray-700 text-sm mb-2">Booking Reference:</p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {sessionId.slice(0, 16)}...
            </span>
            <button
              onClick={copyToClipboard}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              {copied ? 'Copied!' : 'Copy Full ID'}
            </button>
          </div>
        </div>
      )}

      {/* Email status */}
      {emailSent && (
        <p className="text-sm text-green-600 mb-4">
          Confirmation email sent! 📧
        </p>
      )}
      {emailError && (
        <p className="text-sm text-red-600 mb-4">
          Failed to send confirmation email. Please contact support.
        </p>
      )}

      {hasBookingDetails ? (
        <div className="bg-white shadow-md p-6 rounded-xl mb-8 text-left border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {isBundle ? 'Bundle Details' : 'Class Details'}
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {teacherName && (
              <li>
                <span className="font-medium">Teacher:</span> {teacherName}
              </li>
            )}
            {date && (
              <li>
                <span className="font-medium">
                  {isBundle ? 'First Class Date:' : 'Date:'}
                </span>{' '}
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
                <span className="font-medium">Participants:</span>{' '}
                {participants}{' '}
                {Number(participants) === 1 ? 'person' : 'people'}
              </li>
            )}
          </ul>

          {isBundle && (
            <p className="mt-4 text-emerald-700 text-sm">
              The rest of your classes will be scheduled together with your
              teacher.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white text-emerald-700 my-5">
          <p>
            Thank you for your purchase! We will contact you to arrange the
            classes.
          </p>
        </div>
      )}

      {/* Contact Info */}
      <div className="bg-gray-50 border border-gray-100 text-gray-500 p-5 rounded-lg text-left text-sm">
        <h3 className="text-base font-semibold text-gray-600 mb-4">
          Have questions?
        </h3>

        {/* QR codes section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 justify-items-center">
          {/* Line */}
          <div className="flex flex-col items-center">
            <p className="mb-2 font-semibold text-gray-600">Line</p>
            <Image
              src="/line.JPG"
              alt="Line QR Code"
              width={250}
              height={250}
              className="w-24 h-24 rounded-md border"
            />
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col items-center">
            <p className="mb-2 font-semibold text-gray-600">WhatsApp</p>
            <Image
              src="/whatsapp.JPG"
              alt="WhatsApp QR Code"
              width={250}
              height={250}
              className="w-24 h-24 rounded-md border"
            />
          </div>
        </div>

        {/* WeChat and Email */}
        <div className="flex flex-col sm:items-center gap-4 justify-center text-center">
          <p>
            <strong>WeChat ID:</strong> OneClassYoga
          </p>
          <p>
            📧 <strong>Email:</strong> support@oneclass.yoga
          </p>
        </div>
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
