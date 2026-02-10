'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('Home.CookieBanner');
  const locale = useLocale();

  useEffect(() => {
    setMounted(true); // 1. Signal that we are now on the client
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true); // 2. Only then check visibility
    }
  }, []);
  // 3. If we aren't mounted yet, return null to avoid hydration mismatch
  if (!mounted || !isVisible) return null;

  const handleChoice = (choice: 'accepted' | 'declined') => {
    localStorage.setItem('cookie-consent', choice);
    setIsVisible(false);
    // If you have analytics scripts (like GA), you can trigger them here
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white border border-gray-200 shadow-xl rounded-2xl md:max-w-4xl mx-auto">
      <div className="text-sm text-gray-600">
        {t('description')}{' '}
        <Link
          href={`/${locale}/privacy`}
          className="underline hover:text-black"
        >
          {t('policy')}
        </Link>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <button
          onClick={() => handleChoice('declined')}
          className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          {t('decline')}
        </button>
        <button
          onClick={() => handleChoice('accepted')}
          className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition"
        >
          {t('accept')}
        </button>
      </div>
    </div>
  );
}
