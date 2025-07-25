'use client';

interface ParticipantsProps {
  onParticipantsChange: (value: number) => void;
  participants: number;
  people?: string[];
}

export default function ParticipantsCount({
  onParticipantsChange,
  participants,
  people,
}: ParticipantsProps) {
  return (
    <div className="w-full mt-4">
      <p className="mb-2 text-gray-500">Participants:</p>
      <div className="grid grid-cols-3 gap-2">
        {people?.map((person) => {
          const value = Number(person);
          return (
            <button
              key={person}
              onClick={() => onParticipantsChange(value)} // pass number directly
              className={`px-3 py-2 rounded-md border text-sm text-gray-700 ${
                participants === value ? 'bg-emerald-500 text-white' : ''
              }`}
            >
              {person}
            </button>
          );
        })}
      </div>
    </div>
  );
}
