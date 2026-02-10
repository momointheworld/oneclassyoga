export default async function TeachersLoading() {
  // Simple grid of skeleton cards matching your layout
  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg p-4 bg-white shadow">
            <div className="h-40 bg-gray-300 rounded mb-4" />
            <div className="h-6 w-3/4 bg-gray-300 rounded mb-2" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </main>
  );
}
