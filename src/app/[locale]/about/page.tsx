import { PageContainer } from '@/components/PageContainer';
import YouTubeVideo from '@/components/YoutubeViedo';
import { Target, UserCheck, Layout } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server'; // Import for Server Components

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('About.metadata');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://oneclass.yoga/about',
      siteName: 'OneClass Yoga',
      images: [
        {
          url: '/images/ogs/about-og.jpeg',
          width: 1200,
          height: 630,
          alt: t('ogAlt'),
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/ogs/about-og.jpeg'],
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations('About');

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-20">
        {/* Hero Section with Video */}
        <section className="space-y-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="mt-8">
            <YouTubeVideo
              youtubeId="9Rp0TDWqq6w?si=LqR3oH4swwaOsg7u"
              bilibiliId="BV1JQs1zkEJL"
              maxDescriptionLength={180}
            />
          </div>
        </section>

        {/* Personal Profile Section */}
        <section className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md ring-4 ring-emerald-50">
              <Image
                src="/images/about.jpeg"
                alt="Lifen Li"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                {t('profile.name')}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {/* next-intl handles rich text/bolding via the <b> tag in the JSON */}
                {t.rich('profile.bio1', {
                  b: (chunks) => (
                    <span className="font-semibold">{chunks}</span>
                  ),
                })}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {t.rich('profile.bio2', {
                  b: (chunks) => (
                    <span className="font-semibold text-emerald-700">
                      {chunks}
                    </span>
                  ),
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('mission.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('mission.p1')}
            </p>
            <p className="text-gray-700 leading-relaxed">{t('mission.p2')}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/50">
            <ul className="space-y-6 text-gray-700">
              <li className="flex items-start space-x-4">
                <Target className="text-emerald-500 w-6 h-6 mt-1 flex-shrink-0" />
                <span>
                  <strong>{t('features.goal.label')}:</strong>{' '}
                  {t('features.goal.desc')}
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <UserCheck className="text-emerald-500 w-6 h-6 mt-1 flex-shrink-0" />
                <span>
                  <strong>{t('features.personal.label')}:</strong>{' '}
                  {t('features.personal.desc')}
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <Layout className="text-emerald-500 w-6 h-6 mt-1 flex-shrink-0" />
                <span>
                  <strong>{t('features.structure.label')}:</strong>{' '}
                  {t('features.structure.desc')}
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Closing Invite */}
        <section className="text-center space-y-6 pb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('invite.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t('invite.subtitle')}
          </p>
          <div className="pt-4">
            <Link
              href="/programs"
              className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all hover:scale-105"
            >
              {t('invite.button')}
            </Link>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
