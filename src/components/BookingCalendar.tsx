'use client';
import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { DatePicker } from './DatePicker';
import { TimeSlotPicker } from './TimeSlot';
import ParticipantsCount from './ParticipantsCount';
import { ToBangkokDateOnly } from './BkkTimeConverter';
import { BUNDLE3, BUNDLE6, PackageType } from '@/lib/packages';
import { TeacherRates } from '@/types/teacher';

// --- LOCALIZATION IMPORTS ---
import { useTranslations, useLocale } from 'next-intl';
import { zhCN, enUS } from 'date-fns/locale';

interface BookingCalendarProps {
  onSelect: (date: Date | null, timeSlot: string | null) => void;
  timeSlots: string[];
  availableDays: string[];
  teacherSlug: string;
  participants?: number;
  onParticipantsChange?: (value: number) => void;
  selectedPackage?: PackageType;
  onReadyForCheckout?: (
    date: Date | undefined,
    timeSlot: string | null,
    participants: number,
    packageType: string | null,
  ) => void;
  onRateChange?: (rate: number) => void;
  rates: TeacherRates;
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
  rates,
}: BookingCalendarProps) {
  // --- HOOKS ---
  const t = useTranslations('Teachers.TeacherProfile.calendar'); // Access the namespace
  const locale = useLocale();
  const dateLocale = locale === 'zh' ? zhCN : enUS;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [rate, setRate] = useState<number | null>(null);

  const calculateRate = useCallback(() => {
    let total = 0;
    if (selectedPackage === 'single') total = rates.single ?? 0;
    else if (selectedPackage === BUNDLE3) total = rates.bundle3 ?? 0;
    else if (selectedPackage === BUNDLE6) total = rates.bundle6 ?? 0;

    if (participants === 2) {
      if (selectedPackage === 'single') total += rates.extra.single ?? 0;
      else if (selectedPackage === BUNDLE3) total += rates.extra.bundle3 ?? 0;
      else if (selectedPackage === BUNDLE6) total += rates.extra.bundle6 ?? 0;
    }
    setRate(total);
    onRateChange?.(total);
  }, [participants, selectedPackage, rates, onRateChange]);

  useEffect(() => {
    calculateRate();
  }, [participants, selectedPackage, calculateRate]);
  useEffect(() => {
    setTimeSlot(null);
  }, [selectedDate]);
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

  useEffect(() => {
    if (!selectedDate || !teacherSlug) {
      setBookedSlots([]);
      return;
    }
    const bkkDate = ToBangkokDateOnly(selectedDate);
    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(
          `/api/search-booking?date=${bkkDate}&teacherSlug=${teacherSlug}`,
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

      {/* Summary Section - Fully Localized */}
      <div className="mt-8 flex flex-col space-y-4">
        {/* Date Summary */}
        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <span className="text-sm text-gray-500">
            {t('summary.selectedDate')}
          </span>
          <p
            className={`text-sm mt-1 sm:mt-0 ${selectedDate ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
          >
            {selectedDate
              ? format(selectedDate, 'PPP', { locale: dateLocale })
              : t('summary.notSelected')}
          </p>
        </div>

        {/* Time Summary */}
        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <span className="text-sm text-gray-500">
            {t('summary.selectedTime')}
          </span>
          <p
            className={`text-sm mt-1 sm:mt-0 ${timeSlot ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
          >
            {timeSlot || t('summary.notSelected')}
          </p>
        </div>

        {/* Rate Summary */}
        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <span className="text-sm text-gray-500">{t('summary.rate')}</span>
          <p
            className={`text-sm mt-1 sm:mt-0 ${rate !== null ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
          >
            {rate !== null ? `${rate} THB` : t('summary.notSelected')}
          </p>
        </div>
      </div>
    </div>
  );
}
