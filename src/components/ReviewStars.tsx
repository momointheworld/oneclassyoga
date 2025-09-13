'use client';
import { createClient } from '@/utils/supabase/supabaseClient';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react'; // or your own Star component

type Review = {
  id: string;
  customer_name: string;
  review_text: string;
  rating?: number;
  updated_at: string;
};

const supabase = createClient();

interface ReviewStarsProps {
  teacherSlug: string;
}

export default function ReviewStars({ teacherSlug }: ReviewStarsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('teacher_slug', teacherSlug)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      setReviews(data || []);

      if (data && data.length > 0) {
        const avg =
          data.reduce((sum, r) => sum + (r.rating || 0), 0) / data.length;
        setAverageRating(avg);
      }
    };
    fetchReviews();
  }, [teacherSlug]);

  return (
    <div className="flex items-center mb-3">
      <div className="flex text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => {
          const starContent = (() => {
            if (!reviews.length || averageRating === null) {
              return <Star key={i} className="h-4 w-4 fill-gray-200" />;
            }

            const diff = averageRating - i;
            if (diff >= 1) {
              return <Star key={i} className="h-4 w-4 fill-yellow-500" />;
            } else if (diff > 0) {
              return (
                <div key={i} className="relative">
                  <Star className="h-4 w-4 fill-gray-200" />
                  <Star
                    className="h-4 w-4 fill-yellow-500 absolute top-0 left-0"
                    style={{ clipPath: 'inset(0 50% 0 0)' }}
                  />
                </div>
              );
            } else {
              return <Star key={i} className="h-4 w-4 fill-gray-200" />;
            }
          })();

          return (
            <a
              key={i}
              href={`/teachers/${teacherSlug}/#reviewCarousel`}
              className="cursor-pointer"
            >
              {starContent}
            </a>
          );
        })}
      </div>

      <span className="ml-2 text-sm text-gray-600">
        {reviews.length > 0
          ? `${averageRating?.toFixed(1)} (${reviews.length})`
          : 'No reviews yet'}
      </span>
    </div>
  );
}
