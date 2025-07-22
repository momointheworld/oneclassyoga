'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DatePicker } from './DatePicker';
import { TimeSlotPicker } from './TimeSlot';

export default function BookingCalendar({
  onSelect,
  timeSlots,
}: {
  onSelect: (date: Date | null, timeSlot: string | null) => void;
  timeSlots: string[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState<string>('');

  useEffect(() => {
    if (selectedDate && timeSlot) {
      onSelect(selectedDate, timeSlot);
    }
  }, [selectedDate, timeSlot, onSelect]); // Ensure onSelect is called when either state changes

  return (
    <div className=" p-4 mt-5 rounded-xl">
      <DatePicker selected={selectedDate} onSelect={setSelectedDate} />
      <TimeSlotPicker
        selectedSlot={timeSlot}
        onSelect={setTimeSlot}
        timeSlots={timeSlots}
      />
      <div className="mt-8 flex flex-col items-start space-y-2">
        <div className="flex justify-between w-full">
          {' '}
          Selected Date:
          <p
            className={`text-sm  ${
              selectedDate ? 'font-semibold text-blue-600' : 'text-gray-600'
            }`}
          >
            {selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}
          </p>
        </div>
        <div className="flex justify-between w-full">
          Selected Time:
          <p
            className={`text-sm  ${
              timeSlot ? 'font-semibold text-blue-600' : 'text-gray-600'
            }`}
          >
            {timeSlot || 'Not selected'}
          </p>
        </div>
      </div>
    </div>
  );
}
