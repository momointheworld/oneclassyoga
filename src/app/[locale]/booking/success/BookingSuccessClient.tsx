'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTranslations, useFormatter, useLocale } from 'next-intl';

export default function BookingSuccessClient() {
  const t = useTranslations('Booking.BookingSuccess');
  const format = useFormatter();
  const locale = useLocale();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const teacherSlug = searchParams.get('teacher');
  const date = searchParams.get('date');
  const time = searchParams.get('timeSlot');
  const participants = searchParams.get('participants');
  const packageTitle = searchParams.get('packageTitle');
  const isBundle = searchParams.get('bundle') === 'true';

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // Capitalization logic remains same but used for display
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

  const handleResendEmail = async () => {
    if (!sessionId) return;
    setLoading(true);
    setEmailSent(false);
    setEmailError(false);

    try {
      const res = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailSent(true);
      } else {
        setEmailError(true);
      }
    } catch (err) {
      console.error('Failed to send confirmation email', err);
      setEmailError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    handleResendEmail();
  }, [sessionId]);

  // Guard Clause: If there is no session OR no details, show the error state
  if (!sessionId || !hasBookingDetails) {
    return (
      <div className="max-w-2xl mx-auto p-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('noBookingTitle')}</h1>
        <p className="text-gray-600 mb-8">{t('noBookingDesc')}</p>
        <Link
          href={`/${locale}/programs`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('backToPrograms')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <p className="text-lg text-gray-700 mb-4">{t('subtitle')}</p>

      {/* Booking Reference */}
      {sessionId && (
        <div className="mb-6">
          <p className="text-gray-700 text-sm mb-2">{t('referenceLabel')}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {sessionId.slice(0, 16)}...
            </span>
            <button
              onClick={copyToClipboard}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
        </div>
      )}

      {/* Resend button */}
      {sessionId && (
        <div className="mb-6">
          <Button
            onClick={handleResendEmail}
            variant="outline"
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 border-none"
          >
            {loading ? t('sending') : t('resendButton')}
          </Button>

          {emailSent && (
            <p className="text-sm text-green-600 mt-2">{t('emailSent')}</p>
          )}
          {emailError && (
            <p className="text-sm text-red-600 mt-2">{t('emailError')}</p>
          )}
        </div>
      )}

      {hasBookingDetails ? (
        <div className="bg-white shadow-md p-6 rounded-xl mb-8 text-left border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {t('detailsTitle', { isBundle: isBundle.toString() })}
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {packageTitle && (
              <li>
                <span className="font-medium">{t('program')}:</span>{' '}
                {packageTitle}
              </li>
            )}
            {teacherName && (
              <li>
                <span className="font-medium">{t('teacher')}:</span>{' '}
                {teacherName}
              </li>
            )}

            {date && (
              <li>
                <span className="font-medium">
                  {t('dateLabel', { isBundle: isBundle.toString() })}
                </span>{' '}
                {/* Localized Date Formatting */}
                {format.dateTime(new Date(date), {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'Asia/Bangkok',
                })}
              </li>
            )}
            {time && (
              <li>
                <span className="font-medium">{t('time')}:</span> {time}
              </li>
            )}
            {participants && (
              <li>
                <span className="font-medium">{t('participants')}:</span>{' '}
                {t('person', { count: Number(participants) })}
              </li>
            )}
          </ul>

          {isBundle && (
            <p className="mt-4 text-emerald-700 text-sm">{t('bundleNote')}</p>
          )}
        </div>
      ) : (
        <div className="bg-white text-emerald-700 my-5">
          <p>{t('noDetailsNote')}</p>
        </div>
      )}

      {/* Contact Info */}
      <div className="bg-gray-50 border border-gray-100 text-gray-500 p-5 rounded-lg text-left text-sm">
        <h3 className="text-base font-semibold text-gray-600 mb-4">
          {t('contactTitle')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 justify-items-center">
          <div className="flex flex-col items-center">
            <p className="mb-2 font-semibold text-gray-600">Line</p>
            <Image
              src="/images/line.JPG"
              alt="Line"
              width={100}
              height={100}
              className="rounded-md border"
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="mb-2 font-semibold text-gray-600">WhatsApp</p>
            <Image
              src="/images/whatsapp.JPG"
              alt="WhatsApp"
              width={100}
              height={100}
              className="rounded-md border"
            />
          </div>
        </div>

        <div className="flex flex-col sm:items-center gap-4 justify-center text-center">
          <p>
            <strong>{t('wechat')}:</strong> OneClassYoga
          </p>
          <p>
            📧 <strong>{t('email')}:</strong> support@oneclass.yoga
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/programs"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {t('otherPrograms')}
        </Link>
      </div>
    </div>
  );
}
