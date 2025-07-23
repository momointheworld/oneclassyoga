'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DatePicker } from './DatePicker';
import { TimeSlotPicker } from './TimeSlot';

export default function BookingCalendar({
  onSelect,
  timeSlots,
  onReadyForCheckout, // New prop
}: {
  onSelect: (date: Date | null, timeSlot: string | null) => void;
  timeSlots: string[];
  onReadyForCheckout?: (
    date: Date | undefined,
    timeSlot: string | null
  ) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // 1. Immediate state update when selections change
  useEffect(() => {
    onSelect(selectedDate || null, timeSlot);
  }, [onSelect, selectedDate, timeSlot]);

  // 2. New effect to handle checkout readiness
  useEffect(() => {
    if (selectedDate && timeSlot && onReadyForCheckout) {
      onReadyForCheckout(selectedDate, timeSlot);
    }
  }, [selectedDate, timeSlot, onReadyForCheckout]);

  // 3. Fetch booked slots
  useEffect(() => {
    if (!selectedDate) {
      setBookedSlots([]);
      return;
    }

    const fetchBookedSlots = async () => {
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await fetch(
          `/api/search-booking/slots?date=${dateStr}&timeSlot=${encodeURIComponent(
            timeSlot || ''
          )}`
        );
        const data = await res.json();
        setBookedSlots(data?.bookedTimeSlots || []);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, timeSlot]);

  return (
    <div className="p-4 mt-5 rounded-xl">
      <DatePicker selected={selectedDate} onSelect={setSelectedDate} />
      <TimeSlotPicker
        selectedSlot={timeSlot || ''}
        onSelect={setTimeSlot}
        timeSlots={timeSlots}
        bookedSlots={bookedSlots}
      />
      <div className="mt-8 flex flex-col items-start space-y-2">
        <div className="flex justify-between w-full">
          Selected Date:
          <p
            className={`text-sm ${
              selectedDate ? 'font-semibold text-blue-600' : 'text-gray-600'
            }`}
          >
            {selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}
          </p>
        </div>
        <div className="flex justify-between w-full">
          Selected Time:
          <p
            className={`text-sm ${
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
