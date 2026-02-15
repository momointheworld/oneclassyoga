'use client';

import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ca } from 'date-fns/locale';

export default function ReviewClient() {
  const t = useTranslations('Review');
  const searchParams = useSearchParams();
  const token = searchParams.get('t');
  const teacher = searchParams.get('teacher') || 'your teacher';
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const [rating, setRating] = useState<number | null>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [submittedReview, setSubmittedReview] = useState<{
    rating: number;
    reviewText: string;
    status: string;
  } | null>(null);
  const [loadingReview, setLoadingReview] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!token) return;

    const fetchReview = async () => {
      setLoadingReview(true);
      try {
        const res = await fetch(`/api/get-review?t=${token}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.review) {
            setSubmittedReview({
              rating: data.review.rating,
              reviewText: data.review.review_text,
              status: data.review.status ?? 'Pending',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching review:', err);
      } finally {
        setLoadingReview(false);
      }
    };

    fetchReview();
  }, [token]);

  const renderStar = (star: number) => {
    const fill = hoverRating ? star <= hoverRating : star <= (rating ?? 0);
    return (
      <Star
        className={`w-6 h-6 ${fill ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    );
  };

  const handleSubmit = async () => {
    // 1. Localized Validation Toast
    if (!rating) {
      toast.error(t('ratingAlert'), {
        // Use a translation key for the description too!
        description: t('ratingAlertDescription'),
      });
      return;
    }

    setLoadingSubmit(true);

    try {
      const res = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          rating,
          review_text: reviewText,
        }),
      });

      if (!res.ok) throw new Error();

      // 2. Success Toast
      toast.success(t('toastSuccess'), {
        description: t('toastSuccessDescription'),
      });

      // 3. Update state to show the "Thank You" view
      setSubmittedReview({
        rating,
        reviewText,
        status: 'Pending',
      });

      // Clean up
      setRating(5);
      setReviewText('');
      setErrorMessage('');
    } catch (err) {
      console.error('Review submission error:', err);

      // 4. Error Toast
      toast.error(t('toastError'), {
        description: t('toastErrorDescription'),
      });

      setErrorMessage(t('error'));
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          {/* 1. Guard Clause: Missing Token or Teacher */}
          {!token || !teacher ? (
            <div className="text-center py-10">
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                {t('invalidLink')}
              </h1>
            </div>
          ) : loadingReview ? (
            /* 2. Loading State */
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          ) : submittedReview ? (
            /* 3. Success State: Review already exists */
            <div>
              <h1 className="text-2xl font-bold mb-6 text-center">
                {t('thankYou', { teacher })}
              </h1>

              <div className="flex items-center mb-4 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= submittedReview.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {submittedReview.reviewText && (
                <p className="mb-4 text-center text-gray-700 italic">
                  &quot;{submittedReview.reviewText}&quot;
                </p>
              )}
              <span className="text-sm text-gray-500 block text-center pt-4 border-t">
                {t('status', { status: submittedReview.status })}
              </span>
            </div>
          ) : (
            /* 4. Form State: Ready to submit */
            <>
              <h1 className="text-2xl font-bold mb-6 text-center">
                {t('title', { teacher: capitalize(teacher) })}
              </h1>

              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  {t('ratingLabel')}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      {renderStar(star)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  {t('reviewLabel')}
                </label>
                <Textarea
                  placeholder={t('placeholder')}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full h-32 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col items-end mb-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loadingSubmit}
                  className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto px-8"
                >
                  {loadingSubmit ? t('submitting') : t('submit')}
                </Button>

                {errorMessage && (
                  <p className="text-red-500 text-sm mt-3">{errorMessage}</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
