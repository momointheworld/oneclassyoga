// components/SkeletonCard.tsx
export default function SkeletonCard() {
  return (
    <div className="animate-pulse p-4 rounded-xl shadow bg-white w-full max-w-md">
      <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
      <div className="h-6 w-48 bg-gray-300 rounded mb-4" />
      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-2/3 bg-gray-200 rounded" />
    </div>
  );
}
