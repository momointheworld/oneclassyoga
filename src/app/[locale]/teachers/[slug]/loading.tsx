// app/teacher/[slug]/loading.tsx

export default function TeacherProfileLoading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-gray-300 rounded-lg" />
        <div className="h-8 w-48 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>
    </main>
  );
}
