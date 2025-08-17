// components/SkeletonCard.tsx
interface SkeletonCardProps {
  lines?: {
    width?: string; // Tailwind width class, e.g., "w-32", "w-3/4"
    height?: string; // Tailwind height class, e.g., "h-4", "h-6"
    className?: string; // additional styling
  }[];
  className?: string; // wrapper additional styling
  rounded?: string; // border radius, default: rounded
  gap?: string; // gap between lines, default: mb-2
}

export default function SkeletonCard({
  lines = [
    { width: 'w-32', height: 'h-4', className: '' },
    { width: 'w-48', height: 'h-6', className: '' },
    { width: 'w-full', height: 'h-4', className: '' },
    { width: 'w-5/6', height: 'h-4', className: '' },
    { width: 'w-2/3', height: 'h-4', className: '' },
  ],
  className = '',
  rounded = 'rounded-xl',
  gap = 'mb-2',
}: SkeletonCardProps) {
  return (
    <div
      className={`animate-pulse p-4 shadow bg-white dark:bg-gray-800 w-full max-w-md ${rounded} ${className}`}
    >
      {lines.map((line, idx) => (
        <div
          key={idx}
          className={`${line.width} ${line.height} bg-gray-300 dark:bg-gray-700 ${rounded} ${line.className} ${idx < lines.length - 1 ? gap : ''}`}
        />
      ))}
    </div>
  );
}
