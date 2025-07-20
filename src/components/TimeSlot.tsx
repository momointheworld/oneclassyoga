const timeSlots = [
  '08:00',
  '09:30',
  '11:00',
  '13:00',
  '15:00',
  '17:00',
  '19:00',
  '20:30',
];

interface TimeSlotPickerProps {
  selectedSlot: string;
  onSelect: (slot: string) => void;
}

export function TimeSlotPicker({
  selectedSlot,
  onSelect,
}: TimeSlotPickerProps) {
  return (
    <div className="w-full mt-4">
      <p className="mb-2">Select a time</p>
      <div className="grid grid-cols-3 gap-2">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            className={`px-3 py-2 rounded-md border text-sm ${
              selectedSlot === slot ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}
