'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Review = {
  id: string;
  customer_name: string;
  review_text: string;
  rating?: number;
  updated_at: Date;
};

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Get customer initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="border-gray-200 rounded-lg p-4 shadow-sm bg-white min-h-[150px] flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold mr-3">
            {getInitials(review.customer_name || 'N/A')}
          </div>
          <div className="text-yellow-500 flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="mr-1">
                ★
              </span>
            ))}
          </div>
        </div>
        <p className="text-gray-800">{review.review_text}</p>
      </div>
      <div className="text-sm text-gray-600 mt-3 font-medium">
        - {review.customer_name} |{' '}
        {new Date(review.updated_at).toLocaleDateString()}
      </div>
    </div>
  );
};

interface ResponsiveReviewCarouselProps {
  reviews: Review[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ResponsiveReviewCarousel: React.FC<ResponsiveReviewCarouselProps> = ({
  reviews,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2); // Tablet
      } else {
        setItemsPerView(3); // Desktop
      }
      // Reset index when screen size changes
      setCurrentIndex(0);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate max index based on items per view
  const maxIndex = Math.max(0, reviews.length - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && reviews.length > itemsPerView) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, maxIndex, reviews.length, itemsPerView]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative overflow-hidden">
        {/* Navigation Buttons - Hide on mobile if only showing 1 item */}
        {reviews.length > itemsPerView && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border-gray-200 md:flex hidden"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border-gray-200 md:flex hidden"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div className="px-0 md:px-12">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: `${(reviews.length / itemsPerView) * 100}%`,
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0"
                style={{ width: `${100 / reviews.length}%` }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      {reviews.length > itemsPerView && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentIndex === index
                  ? 'bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile Navigation Buttons (Bottom) */}
      {reviews.length > itemsPerView && (
        <div className="flex justify-center mt-4 space-x-4 md:hidden">
          <button
            onClick={goToPrevious}
            className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goToNext}
            className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponsiveReviewCarousel;

// // Demo component with sample data
// const ResponsiveCarouselDemo = () => {
//   const sampleReviews: Review[] = [
//     {
//       id: '1',
//       customer_name: 'John Smith',
//       review_text:
//         'Amazing service! The team went above and beyond to deliver exactly what we needed. Highly recommended!',
//       rating: 5,
//     },
//     {
//       id: '2',
//       customer_name: 'Sarah Johnson',
//       review_text:
//         'Professional, timely, and excellent quality. Will definitely work with them again.',
//       rating: 5,
//     },
//     {
//       id: '3',
//       customer_name: 'Mike Davis',
//       review_text:
//         'Great experience from start to finish. Communication was clear and results exceeded expectations.',
//       rating: 4,
//     },
//     {
//       id: '4',
//       customer_name: 'Emily Wilson',
//       review_text:
//         'Outstanding work! Very impressed with the attention to detail and customer service.',
//       rating: 5,
//     },
//     {
//       id: '5',
//       customer_name: 'David Brown',
//       review_text:
//         'Reliable and professional. They delivered on time and within budget.',
//       rating: 4,
//     },
//     {
//       id: '6',
//       customer_name: 'Lisa Anderson',
//       review_text:
//         'Fantastic results! The team was responsive and easy to work with throughout the project.',
//       rating: 5,
//     },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
//         Student Reviews
//       </h1>
//       <p className="text-center text-gray-600 mb-8">
//         Resize your browser to see the responsive behavior
//       </p>

//       <ResponsiveReviewCarousel
//         reviews={sampleReviews}
//         autoPlay={true}
//         autoPlayInterval={5000}
//       />
//     </div>
//   );
// };

// export default ResponsiveCarouselDemo;
