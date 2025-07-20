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
import parse from 'html-react-parser';
import { Button } from './ui/button';

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
  isActive?: boolean;
  isFeatured?: boolean;
}

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  const price_id = process.env.NEXT_STRIPE_SINGLE_PRICE_ID;
  // const priceId =
  // selectedPlan === 'single'
  //   ? process.env.NEXT_STRIPE_SINGLE_PRICE_ID
  //   : selectedPlan === 'bundle5'
  //   ? process.env.NEXT_STRIPE_BUNDLE5_PRICE_ID
  //   : process.env.NEXT_STRIPE_BUNDLE10_PRICE_ID;

  return (
    <Card className="w-full max-w-sm rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
        <div className="text-sm text-gray-600 mb-4 line-clamp-3">
          {parse(teacher.bio)}
        </div>

        <div className="text-sm text-gray-800 space-y-1">
          <p>
            <span className="font-semibold text-gray-700">Styles:</span>{' '}
            <span className="flex flex-wrap gap-2 mt-2">
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
        </div>
      </CardContent>

      <CardFooter className="p-5 flex justify-between items-center border-t border-gray-100">
        <Link
          href={`/teachers/${teacher.slug}`}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View Profile
        </Link>

        <Button
          asChild
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <Link href={`/teachers/${teacher.slug}/#booking-calendar`}>
            Check Availability
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
