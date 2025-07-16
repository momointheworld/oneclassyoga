import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Teacher {
  id: string | number;
  name: string;
  slug?: string;
  photo?: string;
  bio: string;
  styles: string[];
  levels: string[];
  gallery?: string[];
  videoUrl?: string;
  rate: number;
  email?: string;
  phone?: string;
  lineId?: string;
}

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Card className="w-full max-w-sm rounded-3xl">
      <CardHeader className="p-5 overflow-hidden rounded-t-3xl">
        <CardTitle className="text-xl font-bold mb-2 text-gray-900">
          {teacher.name}
        </CardTitle>
        <Image
          src={teacher.photo || '/placeholder.png'}
          alt={teacher.name}
          width={400}
          height={300}
          className="rounded-xl object-cover w-full h-52"
        />
      </CardHeader>

      <CardContent className="p-5">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{teacher.bio}</p>

        <div className="text-sm text-gray-800 space-y-1">
          <p>
            <span className="font-semibold text-gray-700">Styles:</span>{' '}
            <span className="flex flex-wrap gap-2 mt-2 ">
              {teacher.styles.slice(0, 3).map((style) => (
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

          <div className="flex justify-start items-center mt-5">
            <span className="font-semibold text-gray-700">Rate:</span>
            <Badge variant="secondary" className="text-blue-600 text-md ml-2">
              {teacher.rate.toLocaleString()} THB / Hour
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 flex justify-between items-center border-t border-gray-100">
        <Link
          href={`/teachers/${teacher.slug}`}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View Profile
        </Link>
        <Link
          href={`/booking/${teacher.slug}`}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Book
        </Link>
      </CardFooter>
    </Card>
  );
}
