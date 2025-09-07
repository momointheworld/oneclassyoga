import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { createClient } from '@/utils/supabase/supabaseServer';
import BookingSteps from '@/components/BookingSteps';
import FAQSection from '@/components/FAQSection';
import { Metadata } from 'next';
import YouTubeVideo from '@/components/YoutubeViedo';

export const metadata: Metadata = {
  title:
    'Handpicked Private Yoga in Chiang Mai | Share a Class with a Friend for More Fun & Savings',
  description:
    'Discover handpicked, experienced yoga teachers in Chiang Mai. Book a private class, or share it with a friend for a more fun and cost-effective experience, perfect for travelers, expats, and locals of all levels.',
  openGraph: {
    title:
      'Handpicked Private Yoga in Chiang Mai | Share a Class with a Friend for More Fun & Savings',
    description:
      'Experience personalized yoga in Chiang Mai with handpicked expert teachers. Book a private session, or bring a friend to share the class for extra fun and savings.',
    url: 'https://oneclass.yoga',
    siteName: 'OneClass Yoga',
    images: [
      {
        url: 'https://oneclass.yoga/logos/home-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Handpicked private yoga classes in Chiang Mai – share a class with a friend for more fun and savings',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Handpicked Private Yoga in Chiang Mai | Share a Class with a Friend for More Fun & Savings',
    description:
      'Book a private yoga class with handpicked teachers, or share it with a friend in Chiang Mai for a fun and cost-effective experience. Personalized sessions for all levels.',
    images: ['https://oneclass.yoga/logos/home-og-image.png'],
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const { data: teachers, error } = await (await supabase)
    .from('teachers')
    .select('slug, name, photo, bio, styles')
    .limit(6);

  if (error) {
    console.error(error);
  }

  return (
    <PageContainer>
      <div className="px-4 space-y-24">
        {/* Hero Section */}
        <section className="text-center mt-12 space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {' '}
            Yoga Teachers in Chiang Mai — Handpicked by a Practitioner{' '}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hi, I’m a longtime yoga practitioner in Chiang Mai. I’ve explored
            many teachers and styles here, and this video gives a short
            introduction about me, my journey, and how this site can help you
            discover the perfect yoga teacher.
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-lg">
              <YouTubeVideo
                videoId="dQw4w9WgXcQ"
                bilibiliId="BV1Nr4y1r7ps?t=1.5"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="text-center space-y-10">
          <h2 className="text-3xl font-semibold">How It Works</h2>
          <BookingSteps />
        </section>

        {/* FAQ section */}
        <section>
          <FAQSection />
        </section>

        {/* Featured Teachers */}
        <section className="space-y-10">
          <h2 className="text-3xl font-semibold text-center">
            Hand-Picked Teachers for Personalized Yoga Sessions
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Our teachers specialize in a variety of yoga styles and levels, each
            bringing their unique approach and knowledge. They provide hands-on
            guidance to help you safely explore advanced movements such as
            handstands, backbends, and inversions, while also tailoring sessions
            for beginners or those looking to deepen their practice.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {teachers?.slice(0, 3).map((teacher) => (
              <div
                key={teacher.slug}
                className="bg-white rounded-2xl p-6 shadow border border-gray-100 text-center"
              >
                <Image
                  src={teacher.photo}
                  alt={`${teacher.name} – Yoga Teacher specializing in ${teacher.styles?.join(', ')}`}
                  width={96}
                  height={96}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                />

                <h3 className="text-xl font-medium capitalize">
                  {teacher.name}
                </h3>
                <div className="text-gray-600 text-sm mb-4">
                  <strong>Specializes in:</strong>{' '}
                  {teacher.styles?.slice(0, 3).join(', ')}
                  {teacher.styles && teacher.styles.length > 3 ? ', ...' : ''}
                </div>

                <Link href={`/teachers/${teacher.slug}`}>
                  <Button
                    variant="outline"
                    className="text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-200 transition"
                  >
                    View Profile
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/teachers">
              <Button className="bg-emerald-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition">
                See All Teachers
              </Button>
            </Link>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="space-y-6 text-center">
          <h2 className="text-3xl font-semibold text-center">Simple Pricing</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Every class is 1.5 hours and includes the studio fee. Choose a
            one-time session or a discounted bundle for extra savings. Bring a
            friend and share the experience—it&apos;s even more cost-effective
            while enjoying personalized guidance and a fun, supportive
            environment.
          </p>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="p-6 border border-gray-200 rounded-2xl shadow">
              {' '}
              <h3 className="text-xl font-semibold">Single Session</h3>{' '}
              <p className="text-gray-500 mt-2">
                ฿3,400 per 1.5-hour session
              </p>{' '}
            </div>{' '}
            <div className="p-6 border border-gray-200 rounded-2xl shadow">
              {' '}
              <h3 className="text-xl font-semibold">3-Session Bundle</h3>{' '}
              <p className="text-gray-500 mt-2">฿7,000 – Save ฿3,250</p>{' '}
            </div>
          </div>
          <Link href="/pricing">
            <Button className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-700 transition">
              Compare Pricing Options
            </Button>
          </Link>
        </section>

        {/* Trust Section */}
        <section className="bg-gray-50 py-12 rounded-2xl px-6 md:px-12 space-y-8">
          <h2 className="text-3xl font-semibold text-center">
            Why OneClass Yoga?
          </h2>

          <div className="grid gap-8 md:grid-cols-3 text-center">
            {[
              {
                title: 'Personalized Recommendations',
                desc: 'Based on years of personal practice and exploration.',
                icon: '🎯',
              },
              {
                title: 'Support Local Teachers',
                desc: 'Helping talented yoga teachers in Chiang Mai gain the recognition they deserve.',
                icon: '🧘‍♀️',
              },
              {
                title: 'Private, Flexible Classes',
                desc: 'Tailored to your schedule and goals — choose 1-on-1 sessions or “share it with a friend” for a more fun experience',
                icon: '📅',
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2 flex flex-col items-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-semibold">Have Questions?</h2>
          <p className="text-gray-600">
            We&apos;re happy to help. Reach out anytime.
          </p>
          <Link href="/contact">
            <Button
              variant="outline"
              className="text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-200 transition"
            >
              Contact Us
            </Button>
          </Link>
        </section>
      </div>
    </PageContainer>
  );
}
