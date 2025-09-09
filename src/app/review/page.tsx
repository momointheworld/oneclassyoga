'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('t');
  const [rating, setRating] = useState<number | null>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [submittedReview, setSubmittedReview] = useState<{
    rating: number;
    reviewText: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const renderStar = (star: number) => {
    const fill = hoverRating ? star <= hoverRating : star <= (rating ?? 0);
    return (
      <Star
        className={`w-6 h-6 ${fill ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    );
  };

  const handleSubmit = async () => {
    if (!rating) return alert('Please select a rating');
    setLoading(true);

    try {
      const res = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rating, review_text: reviewText }),
      });

      if (!res.ok) throw new Error('Failed to submit review');

      // Save submitted review locally to show it
      setSubmittedReview({ rating, reviewText });
      setRating(5);
      setReviewText('');
      setErrorMessage('');
    } catch (err) {
      console.error(err);
      setErrorMessage('Error submitting review, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Leave a Review
          </h1>

          {/* Rating */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="focus:outline-none"
                >
                  {renderStar(star)}
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Review</label>
            <Textarea
              placeholder="Write your review (optional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full h-32"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>

          {errorMessage && (
            <p className="text-orange-600 text-end mb-4">{errorMessage}</p>
          )}

          {/* Submitted Review */}
          {submittedReview && (
            <div className="border-t pt-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">Your Review</h2>
              <div className="flex items-center mb-2">
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
                <p className="mb-2">{submittedReview.reviewText}</p>
              )}
              <span className="text-sm text-gray-500">Status: Pending</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
