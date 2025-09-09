'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Review = {
  id: string;
  customer_name: string;
  content: string;
  rating?: number;
  created_at: string;
};

interface TeacherReviewsProps {
  reviews: Review[];
}

const TeacherReviews: React.FC<TeacherReviewsProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return <p className="text-gray-500 mt-4">No reviews yet.</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
        <Card key={review.id} className="shadow-sm hover:shadow-md transition">
          <CardHeader className="flex justify-between items-center">
            <h3 className="font-semibold">{review.customer_name}</h3>
            {review.rating && (
              <Badge className="bg-yellow-400 text-black">
                {review.rating} ★
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{review.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeacherReviews;
