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
  participants?: number;
  onParticipantsChange?: (value: number) => void;
  selectedPackage?: 'single' | 'bundle5' | 'bundle10'; // new prop
  onReadyForCheckout?: (
    date: Date | undefined,
    timeSlot: string | null,
    participants: number,
    packageType: string | null
  ) => void;
  onRateChange?: (rate: number) => void;
}

export default function BookingCalendar({
  onSelect,
  timeSlots,
  availableDays,
  teacherSlug,
  participants = 1,
  onParticipantsChange,
  selectedPackage = 'single',
  onReadyForCheckout,
  onRateChange,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [rate, setRate] = useState<number | null>(null);

  const calculateRate = useCallback(() => {
    let total = 0;

    // Base rate based on selected package
    if (selectedPackage === 'single') total = 2300;
    if (selectedPackage === 'bundle5') total = 9500;
    if (selectedPackage === 'bundle10') total = 18000;

    // Extra for second participant
    if (participants === 2) {
      if (selectedPackage === 'single') total += 500;
      if (selectedPackage === 'bundle5') total += 2000;
      if (selectedPackage === 'bundle10') total += 4000;
    }

    setRate(total);
    if (onRateChange) onRateChange(total);
  }, [participants, selectedPackage, onRateChange]);

  useEffect(() => {
    calculateRate();
  }, [participants, selectedPackage, calculateRate]);

  // call parent callbacks
  useEffect(() => {
    onSelect(selectedDate || null, timeSlot);
  }, [selectedDate, timeSlot, onSelect]);

  useEffect(() => {
    if (selectedDate && timeSlot && onReadyForCheckout) {
      onReadyForCheckout(selectedDate, timeSlot, participants, selectedPackage);
    }
  }, [
    selectedDate,
    timeSlot,
    participants,
    onReadyForCheckout,
    selectedPackage,
  ]);

  console.log(participants);

  // fetch booked slots
  useEffect(() => {
    if (!selectedDate || !teacherSlug) {
      setBookedSlots([]);
      return;
    }

    const bkkDate = ToBangkokDateOnly(selectedDate);

    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(
          `/api/search-booking?date=${bkkDate}&teacherSlug=${teacherSlug}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setBookedSlots(data?.bookedTimeSlots || []);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
        setBookedSlots([]);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, teacherSlug]);

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
        onParticipantsChange={onParticipantsChange ?? (() => {})}
        participants={participants}
      />

      {/* Summary */}
      <div className="mt-8 flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <span className="text-sm text-gray-500">Selected Date:</span>
          <p
            className={`text-sm mt-1 sm:mt-0 ${selectedDate ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
          >
            {selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <span className="text-sm text-gray-500">Selected Time:</span>
          <p
            className={`text-sm mt-1 sm:mt-0 ${timeSlot ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
          >
            {timeSlot || 'Not selected'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <span className="text-sm text-gray-500">Rate:</span>
          <p
            className={`text-sm mt-1 sm:mt-0 ${rate !== null ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
          >
            {rate !== null ? `${rate} THB` : 'Not selected'}
          </p>
        </div>
      </div>
    </div>
  );
}
