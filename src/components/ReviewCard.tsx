'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ToBangkokDateOnly } from './BkkTimeConverter';

type Review = {
  id: string;
  customer_name: string;
  review_text: string;
  rating?: number;
  updated_at: Date;
};

const ReviewCard = ({
  review,
  onClick,
}: {
  review: Review;
  onClick: () => void;
}) => {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <div
      className="bg-gray-100 rounded-lg p-4 shadow-sm flex flex-col justify-between text-sm h-full cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <div>
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold">
            {getInitials(review.customer_name || 'Anonymous')}
          </div>
          <div className="text-yellow-500 flex ml-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        </div>
        <p className="text-gray-800 line-clamp-3 px-2">{review.review_text}</p>
      </div>

      <div className="text-sm text-gray-600 mt-3 font-medium">
        - {review.customer_name || 'Anonymous'},{' '}
        {ToBangkokDateOnly(new Date(review.updated_at))}
      </div>
    </div>
  );
};

export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onClick={() => setSelectedReview(review)}
          />
        ))}
      </div>

      {selectedReview && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 relative">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center mb-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-lg">
                {selectedReview.customer_name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase() || 'A'}
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-800">
                  {selectedReview.customer_name || 'Anonymous'}
                </div>
                <div className="text-sm text-gray-500">
                  {ToBangkokDateOnly(new Date(selectedReview.updated_at))}
                </div>
              </div>
            </div>

            <div className="text-yellow-500 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {selectedReview.review_text}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
