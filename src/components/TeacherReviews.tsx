'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/supabaseClient';

type Review = {
  id: string;
  booking_id: string;
  customer_name: string;
  review_text: string;
  rating?: number;
  created_at: string;
  email: string;
  teacher_slug: string;
  status: string;
};

interface TeacherReviewsTableProps {
  reviews: Review[];
}

const supabase = createClient();

const TeacherReviewsTable: React.FC<TeacherReviewsTableProps> = ({
  reviews: initialReviews,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleApprove = async (review: Review) => {
    try {
      // 1️⃣ Update the review status
      const { error: reviewError } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', review.id);

      if (reviewError) throw reviewError;

      // 2️⃣ Update the booking flags
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          review_submitted: true,
          review_approved: true,
        })
        .eq('id', review.booking_id); // make sure your Review type has booking_id

      if (bookingError) throw bookingError;

      // 3️⃣ Optimistically update UI
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, status: 'approved' } : r))
      );
    } catch (err: unknown) {
      console.error('Error approving review:', err);
    }
  };

  if (reviews.length === 0) {
    return <p className="text-gray-500 mt-4">No reviews yet.</p>;
  }

  // group by teacher
  const groupedReviews = reviews.reduce(
    (acc, review) => {
      if (!acc[review.teacher_slug]) {
        acc[review.teacher_slug] = [];
      }
      acc[review.teacher_slug].push(review);
      return acc;
    },
    {} as Record<string, Review[]>
  );

  return (
    <div className="overflow-x-auto">
      {Object.entries(groupedReviews).map(([slug, teacherReviews]) => (
        <div key={slug} className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            {teacherReviews[0].teacher_slug}
          </h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Review</th>
                <th className="p-2 border">Rating</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {teacherReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {review.customer_name || 'n/a'}
                  </td>
                  <td className="p-2 border">{review.email}</td>
                  <td className="p-2 border">{review.review_text}</td>
                  <td className="p-2 border">
                    {review.rating ? `${review.rating} ★` : '-'}
                  </td>
                  <td className="p-2 border text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{review.status}</td>
                  <td className="p-2 border">
                    {review.status !== 'approved' ? (
                      <button
                        className="px-2 py-1 bg-green-600 text-white rounded"
                        onClick={() => handleApprove(review)}
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-green-700">Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TeacherReviewsTable;
