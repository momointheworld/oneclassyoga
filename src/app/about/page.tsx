// app/about/page.tsx
import { PageContainer } from '@/components/PageContainer';
import YouTubeVideo from '@/components/YoutubeViedo';
import { Users, Heart, Globe, Sparkles } from 'lucide-react';
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
        url: '/images/ogs/about-og.jpg',
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
    images: ['/images/ogs/about-og.jpg'],
  },
};

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-20">
        {/* Hero Section with Video */}
        <section className="space-y-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
            About OneClass Yoga and Me
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A community-driven project created by a long-term yoga practitioner
            in Chiang Mai — connecting yogis with teachers, building exposure
            for instructors, and cultivating a shared space for growth.
          </p>
          <div className="mt-8">
            <YouTubeVideo youtubeId="dQw4w9WgXcQ" maxDescriptionLength={180} />
            {/* Replace with your real YouTube videoId or bilibiliId */}
          </div>
        </section>
        {/* Personal Profile Section */}
        <section className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md">
              <Image
                src="/images/about.jpeg" // replace with your actual profile photo
                alt="Your Name"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">Lifen Li</h3>
              <p className="text-gray-700 leading-relaxed">
                I took my very first yoga class in{' '}
                <span className="font-medium">2015</span>, and now, nearly a
                decade later, yoga is still a grounding part of my life. Over
                these 10 years, I’ve explored many different teachers and
                styles, learning not only the physical practice but also how
                yoga connects mind, breath, and community.
              </p>
              <p className="text-gray-700 leading-relaxed">
                What keeps me inspired is the balance yoga brings—whether it’s
                strength, flexibility, or simply finding calm in a busy world.
                On this site, I also created a{' '}
                <Link
                  href="/community"
                  className="font-medium underline hover:text-gray-500"
                >
                  Community
                </Link>{' '}
                section where I answer FAQs, share insights from my regular
                practice, and highlight any upcoming community events. Through
                these resources, I hope to share my love for yoga and help
                others find the right teachers and practices to guide their own
                journeys.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Why I Started This
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              After years of practicing yoga with many teachers in Chiang Mai, I
              noticed there wasn’t a central space to explore teachers, compare
              offerings, or connect with fellow yogis. Many dedicated teachers
              also lacked visibility, despite their incredible skills.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This site was born to bridge that gap — making it easier for
              students to find the right teacher, helping teachers share their
              gifts, and creating a platform for our yoga community to grow.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start space-x-3">
                <Heart className="text-pink-500 w-6 h-6 mt-1" />
                <span>
                  Support local teachers by giving them more visibility and
                  opportunities.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Users className="text-blue-500 w-6 h-6 mt-1" />
                <span>
                  Help yogis discover teachers who fit their journey and goals.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Globe className="text-green-500 w-6 h-6 mt-1" />
                <span>
                  Build a connected hub for yoga lovers to share experiences and
                  connect.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Community Vision Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-orange-50 rounded-2xl py-12 px-8 shadow-sm text-center space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800">Our Vision</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Yoga is more than postures. It’s about self-discovery, connection,
            and growth. OneClass Yoga is a living hub where teachers and
            practitioners can meet, learn, and support each other. Together, we
            can make Chiang Mai’s yoga scene more vibrant, accessible, and
            supportive.
          </p>
          <Sparkles className="w-10 h-10 text-yellow-500 mx-auto" />
        </section>

        {/* Closing Invite */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Be Part of the Community
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you’re a new student, an experienced yogi, or a teacher,
            this platform is here for you. Explore teachers, share your
            experiences, and let’s grow together.
          </p>
          <div className="mt-6">
            <Link
              href="/teachers"
              className="inline-block bg-emerald-500 text-white px-6 py-3 rounded-xl shadow hover:bg-emerald-600 transition"
            >
              Explore Teachers
            </Link>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
