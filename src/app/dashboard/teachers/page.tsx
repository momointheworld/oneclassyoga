'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import parse from 'html-react-parser';
import { BreadcrumbTrail } from '@/components/BreadCrumbTrail';

type Teacher = {
  id: number;
  name: string;
  bio: string;
  slug: string;
  photo?: string;
  styles: string[];
  levels: string[];
  gallery?: string[];
  videoUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  updatedAt: string;
  createdAt: string;
};

const TEACHERS_PER_PAGE = 12;

export default function TeachersDashboardPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const fetchTeachers = async () => {
    const res = await fetch('/api/teachers', { cache: 'no-store' });
    const data = await res.json();
    setTeachers(data);
  };

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? 'N/A'
      : date.toLocaleString('en-US', {
          timeZone: 'Asia/Bangkok', // GMT+7
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        fetchTeachers();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete teacher.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error while deleting teacher.');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Pagination calculation
  const totalPages = Math.ceil(teachers.length / TEACHERS_PER_PAGE);
  const paginatedTeachers = teachers.slice(
    (currentPage - 1) * TEACHERS_PER_PAGE,
    currentPage * TEACHERS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <BreadcrumbTrail
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Teachers' },
        ]}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Teachers</h1>
        <Button
          variant="outline"
          className="text-gray-800 bg-gray-100 hover:bg-gray-200"
          onClick={() => router.push('/dashboard/teachers/new')}
        >
          + Add New Teacher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTeachers.map((teacher) => (
          <Card
            key={teacher.id}
            className={teacher.isActive ? '' : 'border-red-200'}
          >
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{teacher.name}</span>
              </CardTitle>
              <p className="text-sm mb-4">
                Updated At:{' '}
                {teacher.updatedAt ? formatTimestamp(teacher.updatedAt) : 'N/A'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <Image
                  src={teacher.photo || '/placeholder.png'}
                  alt={teacher.name}
                  width={400}
                  height={260}
                  className="rounded-xl object-cover w-full h-52"
                />
              </div>
              <div className="tiptap prose max-w-none">
                {parse(teacher.bio)}
              </div>
              <p className="text-sm mb-2">
                <strong>Styles:</strong> {teacher.styles.join(', ')}
              </p>

              <p className="text-sm mb-2">
                <strong>Levels:</strong> {teacher.levels.join(', ')}
              </p>

              <p className="text-sm mb-4">
                <strong>VideoURL:</strong> {teacher.videoUrl}
              </p>

              <p
                className={`text-sm mb-4 p-2 rounded ${
                  teacher.isFeatured ? 'bg-yellow-100' : ''
                } text-gray-800`}
              >
                <strong>Featured:</strong>
                {teacher.isFeatured ? ' Yes' : ' No'}
              </p>

              <p
                className={`text-sm mb-4 p-2 rounded ${
                  teacher.isActive ? 'bg-green-100' : 'bg-red-100'
                } text-gray-800`}
              >
                {teacher.isActive ? 'Active' : 'Inactive'}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                  onClick={() => router.push(`/teachers/${teacher.slug}`)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/teachers/${teacher.slug}/edit`)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  size="sm"
                  onClick={() => handleDelete(teacher.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <Button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          <Button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
