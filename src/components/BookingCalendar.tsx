'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DatePicker } from './DatePicker';
import { TimeSlotPicker } from './TimeSlot';
import ParticipantsCount from './ParticipantsCount';

interface BookingCalendarProps {
  onSelect: (date: Date | null, timeSlot: string | null) => void;
  timeSlots: string[];
  teacherSlug: string;
  onReadyForCheckout?: (
    date: Date | undefined,
    timeSlot: string | null,
    participants: number,
    includeStudio: boolean
  ) => void;
  initialParticipants?: number; // Add this
  onParticipantsChange?: (count: number) => void; // Add this
  onStudioChange?: (include: boolean) => void; // Add this
}

export default function BookingCalendar({
  onSelect,
  timeSlots,
  teacherSlug,
  onReadyForCheckout,
  initialParticipants = 1, // Default value
  onParticipantsChange,
  onStudioChange,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [rate, setRate] = useState(() => {
    const base = 1250 + (initialParticipants - 1) * 250;
    const studioFee = 250; // since studio is selected by default
    return `${base + studioFee} THB`;
  });

  const [participants, setParticipants] = useState(initialParticipants);
  const [includeStudio, setIncludeStudio] = useState(true);

  // 1. Immediate state update when selections change
  useEffect(() => {
    onSelect(selectedDate || null, timeSlot);
  }, [onSelect, selectedDate, timeSlot]);

  // 2. New effect to handle checkout readiness
  useEffect(() => {
    if (selectedDate && timeSlot && onReadyForCheckout) {
      onReadyForCheckout(selectedDate, timeSlot, participants, includeStudio);
    }
  }, [selectedDate, timeSlot, onReadyForCheckout, participants, includeStudio]);

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
          `/api/search-booking/slots?date=${dateStr}&timeSlot=${timeSlot || ''}&teacherSlug=${teacherSlug}`
        );
        const data = await res.json();
        setBookedSlots(data?.bookedTimeSlots || []);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, teacherSlug, timeSlot]);

  useEffect(() => {
    calculateRate(participants, includeStudio);
  }, [includeStudio, participants]);

  const handleParticipantsChange = (value: number) => {
    setParticipants(value);

    if (value >= 3 && !includeStudio) {
      setIncludeStudio(true);
      if (onStudioChange) onStudioChange(true);
    }

    if (value < 3 && includeStudio) {
      setIncludeStudio(true);
      if (onStudioChange) onStudioChange(false);
    }

    calculateRate(value, value >= 3 || includeStudio);

    if (onParticipantsChange) onParticipantsChange(value);
  };

  const handleStudioChange = (checked: boolean) => {
    setIncludeStudio(checked);
    calculateRate(participants, checked);

    // Notify parent about the change
    if (onStudioChange) {
      onStudioChange(checked);
    }
  };

  const calculateRate = (participants: number, studio: boolean) => {
    const baseRate = 1250 + (participants - 1) * 250;
    const studioFee = studio ? 250 : 0;
    const total = baseRate + studioFee;

    setRate(`${total} THB`);
  };

  return (
    <div className="p-4 mt-5 rounded-xl">
      <DatePicker selected={selectedDate} onSelect={setSelectedDate} />
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
          <span className="text-sm text-gray-500">Rates:</span>
          <p
            className={`text-sm mt-1 sm:mt-0 ${
              participants ? 'font-semibold text-blue-600' : 'text-gray-600'
            }`}
          >
            {`${rate} THB` || 'Not selected'}
          </p>
        </div>
      </div>
    </div>
  );
}
