'use client';
import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { DatePicker } from './DatePicker';
import { TimeSlotPicker } from './TimeSlot';
import ParticipantsCount from './ParticipantsCount';
import { ToBangkokDateOnly } from './BkkTimeConverter';

interface BookingCalendarProps {
  onSelect: (date: Date | null, timeSlot: string | null) => void;
  timeSlots: string[];
  availableDays: string[];
  teacherSlug: string;
  onReadyForCheckout?: (
    date: Date | undefined,
    timeSlot: string | null,
    participants: number,
    includeStudio: boolean
  ) => void;
  initialParticipants?: number;
  onParticipantsChange?: (count: number) => void;
  onStudioChange?: (include: boolean) => void;
  onRateChange?: (rate: number) => void;
}

export default function BookingCalendar({
  onSelect,
  timeSlots,
  availableDays,
  teacherSlug,
  onReadyForCheckout,
  initialParticipants = 1,
  onParticipantsChange,
  onStudioChange,
  onRateChange,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [participants, setParticipants] = useState(initialParticipants);
  const [includeStudio, setIncludeStudio] = useState(true);
  const [rate, setRate] = useState<number | null>(null);

  // calculateRate wrapped in useCallback for stable reference
  const calculateRate = useCallback(
    (participantsCount: number, studio: boolean) => {
      const baseRate = 1250 + (participantsCount - 1) * 250;
      const studioFee = studio ? 250 : 0;
      const total = baseRate + studioFee;

      setRate(total);
      if (onRateChange) {
        onRateChange(total);
      }
    },
    [onRateChange]
  );

  // Call onSelect when date or timeSlot changes
  useEffect(() => {
    onSelect(selectedDate || null, timeSlot);
  }, [onSelect, selectedDate, timeSlot]);

  // Call onReadyForCheckout when selections and participants/studio change
  useEffect(() => {
    if (selectedDate && timeSlot && onReadyForCheckout) {
      onReadyForCheckout(selectedDate, timeSlot, participants, includeStudio);
    }
  }, [selectedDate, timeSlot, onReadyForCheckout, participants, includeStudio]);

  // Fetch booked slots when selectedDate, teacherSlug, or timeSlot changes

  useEffect(() => {
    if (!selectedDate || !teacherSlug) {
      setBookedSlots([]);
      return;
    }

    const bkkDate = ToBangkokDateOnly(selectedDate);

    const fetchBookedSlots = async () => {
      try {
        const url = `/api/search-booking?date=${bkkDate}&teacherSlug=${teacherSlug}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        // Update both bookings and time slots if needed
        setBookedSlots(data?.bookedTimeSlots || []);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, teacherSlug]);

  // Update rate when participants or studio changes
  useEffect(() => {
    calculateRate(participants, includeStudio);
  }, [participants, includeStudio, calculateRate]);

  const handleParticipantsChange = (value: number) => {
    setParticipants(value);

    // Automatically require studio for 3+ participants
    if (value >= 3 && !includeStudio) {
      setIncludeStudio(true);
      if (onStudioChange) onStudioChange(true);
    }

    // If participants < 3, allow disabling studio
    if (value < 3 && includeStudio) {
    }

    calculateRate(value, value >= 3 || includeStudio);

    if (onParticipantsChange) onParticipantsChange(value);
  };

  const handleStudioChange = (checked: boolean) => {
    // Prevent disabling studio if participants >= 3
    if (participants >= 3 && !checked) return;

    setIncludeStudio(checked);
    calculateRate(participants, checked);

    if (onStudioChange) {
      onStudioChange(checked);
    }
  };

  return (
    <div className="p-4 mt-5 rounded-xl">
      <DatePicker
        selected={selectedDate}
        onSelect={setSelectedDate}
        availableDays={availableDays}
      />
      <TimeSlotPicker
        selectedSlot={timeSlot || ''}
        onSelect={setTimeSlot}
        timeSlots={timeSlots}
        bookedSlots={bookedSlots}
      />
      <ParticipantsCount
        onParticipantsChange={handleParticipantsChange}
        participants={participants}
        people={['1', '2', '3', '4', '5']}
      />

      <div className="mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeStudio}
            onChange={(e) => handleStudioChange(e.target.checked)}
            disabled={participants >= 3}
          />
          <span className="text-sm">
            I need a studio{' '}
            <span className="text-gray-500">
              (required for 3 or more participants)
            </span>
          </span>
        </label>
      </div>

      <div className="mt-8 flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <span className="text-sm text-gray-500">Selected Date:</span>
          <p
            className={`text-sm mt-1 sm:mt-0 ${
              selectedDate ? 'font-semibold text-blue-600' : 'text-gray-600'
            }`}
          >
            {selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <span className="text-sm text-gray-500">Selected Time:</span>
          <p
            className={`text-sm mt-1 sm:mt-0 ${
              timeSlot ? 'font-semibold text-blue-600' : 'text-gray-600'
            }`}
          >
            {timeSlot || 'Not selected'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <span className="text-sm text-gray-500">Rate:</span>
          <p
            className={`text-sm mt-1 sm:mt-0 ${
              rate !== null ? 'font-semibold text-blue-600' : 'text-gray-600'
            }`}
          >
            {rate !== null ? `${rate} THB` : 'Not selected'}
          </p>
        </div>
      </div>
    </div>
  );
}
