'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import parse from 'html-react-parser';
import { Button } from './ui/button';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Added useParams
import { useTranslations } from 'next-intl'; // Added useTranslations
import { Loader2Icon, Star } from 'lucide-react';
import ReviewStars from './ReviewStars';
import { TeacherRates } from '@/types/teacher';
import Link from 'next/link';

interface TeacherCardProps {
  teacher: {
    id: string | number;
    name: string;
    bio?: string;
    bio_zh?: string; // Added bio_zh
    slug?: string;
    photo?: string;
    rates: TeacherRates;
    strengths: Record<string, string[]>;
    isActive?: boolean;
    isFeatured?: boolean;
  };
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale } = useParams(); // Get current locale
  const t = useTranslations('Teachers');
  const tMovement = useTranslations('Teachers.Strengths.Movement');

  const handleViewPrograms = async () => {
    setLoading(true);
    // Note: ensure your router is localized or uses the full path
    router.push(`/${locale}/teachers/${teacher.slug}?select=true#programs`);
  };

  // Localized Bio Fallback
  const displayBio =
    locale === 'zh' && teacher.bio_zh ? teacher.bio_zh : teacher.bio;

  return (
    <Card className="w-full max-w-sm rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-5 overflow-hidden rounded-t-3xl relative">
        <CardTitle className="text-xl font-bold mb-2 text-gray-900 flex justify-between items-center">
          <span>{teacher.name}</span>
          {teacher.isFeatured && (
            <div
              className="text-orange-500 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
              title={t('UI.featuredTitle')}
            >
              <Star className="h-4 w-4 fill-orange-500" />
              {t('UI.mostPopular')}
            </div>
          )}
        </CardTitle>

        <Image
          src={teacher.photo || '/placeholder.png'}
          alt={teacher.name}
          priority={true}
          width={400}
          height={300}
          className="rounded-xl object-cover w-full h-52"
        />
      </CardHeader>

      <CardContent className="p-5">
        {teacher.slug && <ReviewStars teacherSlug={teacher.slug} />}

        <div className="text-sm text-gray-600 mb-4 line-clamp-3">
          {parse(displayBio || '')}
        </div>

        {/* Localized Strengths */}
        <div className="text-gray-600 mb-4 h-[90px]">
          <p className="font-semibold text-gray-600 mb-2">
            {t('UI.strengthLabel')}
          </p>
          <div className="flex flex-wrap gap-2">
            {teacher.strengths?.Movement?.slice(0, 3).map((strength) => (
              <Badge
                key={strength}
                variant="secondary"
                className="text-xs px-2 py-1 font-semibold border-emerald-500 text-emerald-600"
              >
                {tMovement.has(strength) ? tMovement(strength) : strength}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="mt-5 text-sm font-semibold text-gray-600 flex justify-end items-center gap-1">
            {t('UI.from')}{' '}
            <span className="text-lg text-gray-900">
              {teacher.rates.bundle6
                ? Math.round(teacher.rates.bundle6 / 6)
                : teacher.rates.single || '—'}
              {t('UI.priceSuffix')}
            </span>
            {t('UI.perSession')}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-5 flex justify-between items-center border-t border-gray-100">
        <Link
          href={`/teachers/${teacher.slug}`}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          {t('UI.viewProfile')}
        </Link>

        <Button
          disabled={loading}
          onClick={handleViewPrograms}
          className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-700 transition flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              {t('UI.loading')}
            </>
          ) : (
            t('UI.explorePrograms')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
