'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ToBangkokDateOnly } from './BkkTimeConverter';

type Review = {
  id: string;
  customer_name: string;
  review_text: string;
  rating?: number;
  updated_at: Date;
};

const ReviewCard = ({ review }: { review: Review }) => {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <div className="bg-gray-100 rounded-lg p-4 shadow-sm flex flex-col justify-between text-sm h-full">
      <div>
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold">
            {getInitials(review.customer_name || 'Anonymous')}
          </div>
          <div className="text-yellow-500 flex">
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

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  autoPlay?: boolean;
}

export function Carousel<T>({
  items,
  renderItem,
  autoPlay = false,
}: CarouselProps<T>) {
  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
      setCurrent(0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  // Autoplay
  useEffect(() => {
    if (autoPlay && items.length > itemsPerView) {
      const id = setInterval(() =>
        setCurrent((p) => (p >= maxIndex ? 0 : p + 1))
      );
      return () => clearInterval(id);
    }
  }, [autoPlay, items.length, itemsPerView, maxIndex]);

  const goTo = (i: number) => setCurrent(i);
  const prev = () => setCurrent((p) => (p <= 0 ? maxIndex : p - 1));
  const next = () => setCurrent((p) => (p >= maxIndex ? 0 : p + 1));

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative overflow-hidden">
        {items.length > itemsPerView && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        <div>
          <div
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{
              transform: `translateX(-${current * (100 / itemsPerView)}%)`,
              width: `${(items.length / itemsPerView) * 100}%`,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full flex"
                style={{ flex: `0 0 ${100 / itemsPerView}%` }}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {items.length > itemsPerView && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full ${current === i ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Example usage
export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  return (
    <Carousel items={reviews} renderItem={(r) => <ReviewCard review={r} />} />
  );
}
