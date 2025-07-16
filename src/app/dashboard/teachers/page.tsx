'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

type Teacher = {
  id: number;
  name: string;
  bio: string;
  slug: string;
  photo?: string;
  styles: string[];
  levels: string[];
  gallery?: string[];
  phone: string;
  email: string;
  lineId: string;
  rate: number;
  videoUrl?: string;
  createdAt: string;
};

export default function TeachersDashboardPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const router = useRouter();

  const fetchTeachers = async () => {
    const res = await fetch('/api/teachers', { cache: 'no-store' });
    const data = await res.json();
    setTeachers(data);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchTeachers();
    } else {
      alert('Failed to delete teacher.');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
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
        {teachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardHeader>
              <CardTitle className="text-lg">{teacher.name}</CardTitle>
              <p className="text-sm mb-4">
                <strong>createdAt:</strong> {teacher.createdAt.split('T')[0]}{' '}
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
              <p className="text-sm mb-2">
                <strong>Bio:</strong> {teacher.bio || 'No bio available'}
              </p>
              <p className="text-sm mb-2">
                <strong>Styles:</strong> {teacher.styles.join(', ')}
              </p>
              <p className="text-sm mb-2">
                <strong>Contact:</strong> Phone: {teacher.phone} |{' '}
                {teacher.email} | Line: {teacher.lineId}
              </p>
              <p className="text-sm mb-2">
                <strong>Levels:</strong> {teacher.levels.join(', ')}
              </p>
              <p className="text-sm mb-4">
                <strong>Rate:</strong> {teacher.rate.toLocaleString()} THB
              </p>
              <p className="text-sm mb-4">
                <strong>VideoURL:</strong> {teacher.videoUrl}
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
    </main>
  );
}
