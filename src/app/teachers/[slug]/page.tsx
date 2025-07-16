import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import TeacherGallery from '@/components/TeacherGallery';

interface TeacherProfilePageProps {
  params: { slug: string };
}

export default async function TeacherProfilePage({
  params,
}: TeacherProfilePageProps) {
  const { slug } = await params;

  const teacher = await prisma.teacher.findUnique({
    where: { slug },
  });
  const galleryImages = teacher?.gallery || [];

  if (!teacher) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100">
        <Image
          src={teacher.photo || '/placeholder.png'}
          alt={teacher.name}
          width={800}
          height={600}
          className="object-cover h-80"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {teacher.name}
          </h1>
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            {teacher.bio}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
            <div>
              <p>
                <span className="font-semibold text-gray-700">Styles:</span>{' '}
                <span className="flex flex-wrap gap-2 mt-2 ">
                  {teacher.styles.map((style) => (
                    <Badge
                      key={style}
                      variant="secondary"
                      className="bg-blue-200 dark:bg-blue-600 text-sm"
                    >
                      {style}
                    </Badge>
                  ))}
                </span>
              </p>
            </div>
            <div className="mt-6 text-lg text-gray-800 flex justify-end items-center">
              <span className="font-semibold text-gray-700">Rate:</span>

              <Badge variant="secondary" className="text-blue-600 text-md ml-2">
                {teacher.rate.toLocaleString()} THB / Hour
              </Badge>
            </div>
            <div>
              <p>
                <span className="font-semibold text-gray-700">Level:</span>{' '}
                <span className="flex flex-wrap gap-2 mt-2">
                  {teacher.levels.map((level) => (
                    <Badge
                      key={level}
                      variant="secondary"
                      className="bg-green-200 dark:bg-green-600 text-sm"
                    >
                      {level}
                    </Badge>
                  ))}
                </span>
              </p>
            </div>
          </div>
          <div>
            {galleryImages.length > 0 && (
              <TeacherGallery galleryImages={galleryImages} />
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Link
              href="/teachers"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              ← Back to teachers
            </Link>
            <Link
              href={`/booking/${teacher.id}`}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
