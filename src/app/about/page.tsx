// app/about/page.tsx
import { PageContainer } from '@/components/PageContainer';
import YouTubeVideo from '@/components/YoutubeViedo';
import { Target, UserCheck, Layout } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Chiang Mai Yoga Teachers',
  description:
    'Discover the story behind OneClass Yoga — created to help yogis in Chiang Mai find the right teachers, support local instructors, and grow a connected yoga community.',
  openGraph: {
    title: 'About | Chiang Mai Yoga Teachers',
    description:
      'Discover the story behind OneClass Yoga — created to help yogis in Chiang Mai find the right teachers, support local instructors, and grow a connected yoga community.',
    url: 'https://oneclass.yoga/about',
    siteName: 'OneClass Yoga',
    images: [
      {
        url: '/images/ogs/about-og.jpeg',
        width: 1200,
        height: 630,
        alt: 'About OneClass Yoga — community-driven yoga teachers in Chiang Mai',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Chiang Mai Yoga Teachers',
    description:
      'Discover the story behind OneClass Yoga — created to help yogis in Chiang Mai find the right teachers, support local instructors, and grow a connected yoga community.',
    images: ['/images/ogs/about-og.jpeg'],
  },
};

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-20">
        {/* Hero Section with Video */}
        <section className="space-y-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Focused Programs & My Yoga Journey
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A project created by a longtime practitioner in Chiang Mai to help
            you progress through one-on-one programs built around each teacher’s
            unique strengths.
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
              <h3 className="text-xl font-bold text-gray-900">Lifen Li</h3>
              <p className="text-gray-700 leading-relaxed">
                I took my first yoga class in{' '}
                <span className="font-semibold">2015</span>. Nearly a decade
                later, yoga remains the most grounding part of my life. Over
                these 10 years in Chiang Mai, I’ve followed many different
                teachers, learning their specific skills and seeing firsthand
                how they help students grow.
              </p>
              <p className="text-gray-700 leading-relaxed">
                What I noticed was that while Chiang Mai has amazing teachers,
                it can be hard to find a clear path to get better at a specific
                skill. I created this site to turn the &quot;random group
                class&quot; experience into
                <span className="font-semibold text-emerald-700">
                  {' '}
                  focused, one-on-one programs
                </span>
                . This helps talented teachers get the exposure they deserve
                while giving you the personal attention needed to actually see
                progress.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section - Updated for Programs */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why I Built These Programs
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              I’ve seen students spend years in group classes without ever
              really mastering the skills they want, like inversions or a solid
              foundation. At the same time, I know teachers who are absolute
              experts in these areas but don&apos;t have a way to share that
              deep knowledge in a busy studio.
            </p>
            <p className="text-gray-700 leading-relaxed">
              I decided to work directly with these teachers to package their
              best skills into structured programs. This way, you aren&apos;t
              just &quot;doing yoga&quot;—you are following a clear path
              designed by an expert, just for you.
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/50">
            <ul className="space-y-6 text-gray-700">
              <li className="flex items-start space-x-4">
                <Target className="text-emerald-500 w-6 h-6 mt-1 flex-shrink-0" />
                <span>
                  <strong>Goal-Oriented:</strong> Every program has a clear
                  focus, so you know exactly what skill you are building.
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <UserCheck className="text-emerald-500 w-6 h-6 mt-1 flex-shrink-0" />
                <span>
                  <strong>One-on-One:</strong> Private sessions mean the teacher
                  is focused entirely on your body and your safety.
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <Layout className="text-emerald-500 w-6 h-6 mt-1 flex-shrink-0" />
                <span>
                  <strong>Structured Path:</strong> Sessions build on each
                  other, unlike drop-in classes that start from scratch every
                  time.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Closing Invite */}
        <section className="text-center space-y-6 pb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to start your path?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Whether you want to nail your first handstand or just learn the
            basics correctly, there is a focused program waiting for you.
          </p>
          <div className="pt-4">
            <Link
              href="/programs"
              className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all hover:scale-105"
            >
              Explore Focused Programs
            </Link>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
