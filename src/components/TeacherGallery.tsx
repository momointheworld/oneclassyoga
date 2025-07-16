'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TeacherGalleryProps {
  galleryImages: string[];
}

export default function TeacherGallery({ galleryImages }: TeacherGalleryProps) {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 8 },
  });

  return (
    <div className="relative mt-6">
      <div ref={sliderRef} className="keen-slider rounded-lg overflow-hidden">
        {galleryImages.map((src, index) => (
          <div key={index} className="keen-slider__slide">
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-gray-800/60 text-white hover:bg-gray-800/80 rounded-full"
        onClick={() => instanceRef.current?.prev()}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* Next Button */}
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-gray-800/60 text-white hover:bg-gray-800/80 rounded-full"
        onClick={() => instanceRef.current?.next()}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
