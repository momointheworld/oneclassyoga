'use client';

import { useTranslations } from 'next-intl';
import { Button } from './ui/button';

interface ParticipantsProps {
  onParticipantsChange: (value: number) => void;
  participants: number;
}

export default function ParticipantsCount({
  onParticipantsChange,
  participants,
}: ParticipantsProps) {
  // Access the participants namespace
  const t = useTranslations('Teachers.TeacherProfile.calendar.participants');

  const options = [
    { value: 1, label: t('alone') },
    { value: 2, label: t('friend') },
  ];

  return (
    <div className="w-full mt-4">
      <p className="mb-2 text-gray-500 text-sm">{t('label')}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="ghost" // Using variant ghost or outline to keep clean UI
            onClick={() => onParticipantsChange(option.value)}
            className={`px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium transition-all ${
              participants === option.value
                ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
