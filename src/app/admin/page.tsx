// src/app/admin/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface Teacher {
  id: string;
  name: string;
  styles: string[];
  rate: number;
}

export default async function AdminPage() {
  const teachers = await prisma.teacher.findMany();

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin - Manage Teachers</h1>
      <Link
        href="/admin/teachers/new"
        className="btn-primary mb-6 inline-block"
      >
        + Add New Teacher
      </Link>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Styles</th>
            <th className="text-left p-2">Rate</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t: Teacher) => (
            <tr key={t.id} className="border-b hover:bg-gray-100">
              <td className="p-2">{t.name}</td>
              <td className="p-2">{t.styles.join(', ')}</td>
              <td className="p-2">{t.rate} THB</td>
              <td className="p-2 space-x-2">
                <Link
                  href={`/admin/teachers/${t.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                {/* Delete button will be added later */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
