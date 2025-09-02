'use client';

import { Button } from './ui/button';

interface ParticipantsProps {
  onParticipantsChange: (value: number) => void;
  participants: number;
}

export default function ParticipantsCount({
  onParticipantsChange,
  participants,
}: ParticipantsProps) {
  const options = [
    { value: 1, label: 'Just me' },
    { value: 2, label: 'With a friend' },
  ];

  return (
    <div className="w-full mt-4">
      <p className="mb-2 text-gray-500 text-sm">Share it with a friend:</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => onParticipantsChange(option.value)}
            className={`px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 font-medium ${
              participants === option.value
                ? 'bg-emerald-500 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
