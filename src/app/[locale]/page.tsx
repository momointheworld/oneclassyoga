import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { createClient } from '@/utils/supabase/supabaseServer';
import BookingSteps from '@/components/BookingSteps';
import FAQSection from '@/components/FAQSection';
import YouTubeVideo from '@/components/YoutubeViedo';
import ReviewCarousel from '@/components/ReviewCard';
import { Badge } from '@/components/ui/badge';
import { PROGRAMS, programTeachers } from '@/lib/packages';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Corrected Metadata Generation for Next.js 15
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const headerList = await headers();
  const cookieStore = await cookies();

  // 1. Check if user already has a language preference cookie
  const hasLocaleCookie = cookieStore.has('NEXT_LOCALE');

  // 2. Detect Browser/Device Language and Physical Location
  const acceptLanguage = headerList.get('accept-language') || '';
  const country = headerList.get('x-vercel-ip-country');

  // 🌍 AUTO-SWITCH LOGIC (Only for first-time visitors on /en)
  if (locale === 'en' && !hasLocaleCookie) {
    const isChineseDevice = acceptLanguage.toLowerCase().includes('zh');
    const isInChina = country === 'CN';

    if (isChineseDevice || isInChina) {
      redirect('/zh');
    }
  }

  const t = await getTranslations({ locale, namespace: 'Home.Metadata' });

  return {
    metadataBase: new URL('https://oneclass.yoga'),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: 'https://oneclass.yoga',
      siteName: 'OneClass Yoga',
      images: [
        {
          url: '/images/ogs/home-og.jpeg',
          width: 1200,
          height: 630,
          alt: t('ogAlt'),
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: ['/images/ogs/home-og.jpeg'],
    },
  };
}

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const tPrograms = await getTranslations({ locale, namespace: 'Programs' });
  const supabase = createClient();

  // Data fetching
  const { data: teachers } = await (await supabase)
    .from('teachers')
    .select('slug, name, photo, bio, styles, strengths, rates')
    .order('isFeatured', { ascending: false })
    .limit(6);

  const { data: reviews } = await (await supabase)
    .from('reviews')
    .select('id, customer_name, review_text, rating, updated_at, teacher_slug')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <PageContainer>
      <div className="px-4 space-y-24">
        {/* Hero Section */}
        <section className="text-center mt-12 space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl max-w-4xl mx-auto whitespace-pre-line">
            {t('Hero.title')}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            {t('Hero.description')}
          </p>
          <div className="flex justify-center px-4">
            <div className="w-full max-w-3xl">
              <YouTubeVideo youtubeId="hJgt8rKMRek" bilibiliId="BV1opCvBiEfo" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="text-center space-y-10">
          <h2 className="text-3xl font-semibold">{t('Process.title')}</h2>
          <BookingSteps />
        </section>

        {/* Programs Preview Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold">
              {tPrograms('UI.home.title')}
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {PROGRAMS.slice(0, 3).map((program) => {
              const instructorSlug = programTeachers[program.id];
              const instructor = teachers?.find(
                (t) => t.slug === instructorSlug,
              );

              // Fetch the syllabus array using .raw from the Programs namespace
              const syllabus = tPrograms.raw(`list.${program.id}.syllabus`);

              return (
                <div
                  key={program.id}
                  className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="mb-6">
                    <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 text-[10px] uppercase font-bold tracking-widest mb-4">
                      {program.id.endsWith('-6')
                        ? tPrograms('UI.home.bundle6')
                        : tPrograms('UI.home.bundle3')}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-emerald-600 transition-colors">
                      {tPrograms(`list.${program.id}.title`)}
                    </h3>
                  </div>

                  <div className="flex-grow space-y-6">
                    <div className="space-y-3">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        {tPrograms('UI.home.syllabusLabel')}
                      </p>
                      <ul className="space-y-2">
                        {syllabus.slice(0, 3).map((item: any, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-gray-600"
                          >
                            <span className="text-emerald-500 font-bold">
                              {i + 1}.
                            </span>
                            <span className="line-clamp-2">
                              {typeof item === 'string' ? item : item.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-50">
                    <div className="flex items-center justify-center">
                      <Link href={`/teachers/${instructorSlug}`}>
                        <span className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                          {tPrograms('UI.home.meetTeacher', {
                            name:
                              instructor?.name?.split(' ')[0] || 'the teacher',
                          })}{' '}
                          <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center">
            <Link href="/programs">
              <Button className="bg-emerald-600 text-white px-8 py-6 rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-50">
                {tPrograms('UI.home.exploreAll')}
              </Button>
            </Link>
          </div>
        </section>

        {/* Added FAQ Section */}
        <section className="space-y-10">
          <FAQSection />
        </section>

        {/* Trust Section */}
        <section className="bg-gray-50 py-16 rounded-[2.5rem] px-6 md:px-12 space-y-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            {t('Trust.title')}
          </h2>
          <div className="grid gap-12 md:grid-cols-3 text-center">
            {[
              { ...t.raw('Trust.items.progress'), icon: '🎯' },
              { ...t.raw('Trust.items.trust'), icon: '💎' },
              { ...t.raw('Trust.items.savings'), icon: '🤝' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="space-y-4 flex flex-col items-center group"
              >
                <div className="text-5xl mb-2 transition-all duration-300 transform group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <section className="mt-15 space-y-6 mx-auto">
            <h1 className="text-3xl font-semibold text-center mb-2 text-gray-800">
              {t('Reviews.title')}
            </h1>
            <p className="text-center text-gray-600 mb-8">
              {t('Reviews.subtitle')}
            </p>
            <ReviewCarousel reviews={reviews} />
          </section>
        )}

        {/* Contact CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-semibold">{t('Contact.title')}</h2>
          <p className="text-gray-600">{t('Contact.description')}</p>
          <Link href="/contact">
            <Button
              variant="outline"
              className="text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-200 transition"
            >
              {t('Contact.button')}
            </Button>
          </Link>
        </section>
      </div>
    </PageContainer>
  );
}
