'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

interface TimeSlotPickerProps {
  selectedSlot: string;
  onSelect: (slot: string) => void;
  timeSlots: string[];
  bookedSlots?: string[];
}

export function TimeSlotPicker({
  selectedSlot,
  onSelect,
  timeSlots,
  bookedSlots = [],
}: TimeSlotPickerProps) {
  const t = useTranslations('Teachers.TeacherProfile.calendar.timeSlot');

  function sortTimeSlots(slots: string[]) {
    return slots.slice().sort((a, b) => {
      const [aStart] = a.split('-');
      const [bStart] = b.split('-');

      const [aHour, aMin] = aStart.split(':').map(Number);
      const [bHour, bMin] = bStart.split(':').map(Number);

      return aHour * 60 + aMin - (bHour * 60 + bMin);
    });
  }

  const sortedSlots = sortTimeSlots(timeSlots);

  return (
    <div className="w-full mt-4">
      <p className="mb-2 text-gray-500 text-sm">{t('label')}</p>

      {sortedSlots.length > 0 ? (
        <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(80px,1fr))] md:grid-cols-4">
          {sortedSlots.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            return (
              <button
                key={slot}
                onClick={() => !isBooked && onSelect(slot)}
                disabled={isBooked}
                title={isBooked ? t('booked') : undefined}
                className={`px-3 py-2 rounded-md border text-sm transition-colors duration-150 ${
                  isBooked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : selectedSlot === slot
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white border-gray-300 hover:bg-gray-100'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic py-2">{t('noSlots')}</p>
      )}
    </div>
  );
}
