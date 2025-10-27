import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { createClient } from '@/utils/supabase/supabaseServer';
import BookingSteps from '@/components/BookingSteps';
import FAQSection from '@/components/FAQSection';
import { Metadata } from 'next';
import YouTubeVideo from '@/components/YoutubeViedo';
import ReviewCarousel from '@/components/ReviewCard';
import { Badge } from '@/components/ui/badge';
import { getPackages } from '@/lib/packages';

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
        url: '/images/ogs/home-og.jpg',
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
    images: ['/images/ogs/home-og.png'],
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const { data: teachers, error } = await (await supabase)
    .from('teachers')
    .select('slug, name, photo, bio, styles, strengths, rates')
    .order('isFeatured', { ascending: false })
    .limit(6);

  if (error) {
    console.error(error);
  }
  const topTeachers = teachers?.slice(0, 3) || [];

  // Fetch reviews
  const { data: reviews, error: reviewError } = await (await supabase)
    .from('reviews')
    .select('id, customer_name, review_text, rating, updated_at, teacher_slug')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(6); // show latest 6 reviews

  if (reviewError) console.error(reviewError);

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
                youtubeId="9Rp0TDWqq6w?si=LqR3oH4swwaOsg7u"
                bilibiliId="BV1JQs1zkEJL"
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
            Our teachers specialize in a variety of yoga styles, levels, and
            strengths, each bringing their unique approach and knowledge. They
            provide hands-on guidance to help you safely explore advanced
            movements such as handstands, backbends, and inversions, while also
            tailoring sessions for beginners or those looking to deepen their
            practice.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {topTeachers?.slice(0, 3).map((teacher) => (
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
                {/* Display top 3 strengths */}

                <div className="h-[60px]">
                  <div className="flex flex-wrap gap-2 justify-center my-4">
                    {teacher.strengths?.Movement?.slice(0, 3).map(
                      (strength: string) => (
                        <Badge
                          key={strength}
                          variant="secondary"
                          className="border border-gray-300 text-emerald-600"
                        >
                          {strength}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                {/* Display styles */}
                <div className="h-[70px]">
                  <div className="flex flex-wrap gap-2 justify-center my-4">
                    {teacher.styles?.slice(0, 3).map((style: string) => (
                      <Badge
                        key={style}
                        variant="outline"
                        className="border border-gray-300 text-gray-600"
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>
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

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {topTeachers &&
              getPackages(topTeachers[0].rates).map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-6 border border-gray-200 rounded-2xl shadow relative"
                >
                  <h3 className="text-xl font-semibold">{pkg.title}</h3>
                  <p className="text-gray-500 mt-2">฿{pkg.price}</p>
                  <p className="text-gray-600 mt-2 text-sm h-[70px]">
                    {pkg.description}
                  </p>
                  {pkg.friendNote && (
                    <p className="text-gray-400 mt-1 text-xs italic">
                      {pkg.friendNote}
                    </p>
                  )}
                </div>
              ))}
          </div>
          <p className="text-gray-500 text-sm max-w-xl mx-auto italic">
            Prices are based on each teacher’s rates. What you see here is
            illustrative—actual rates may vary per teacher.
          </p>
          <div className="mt-6">
            <Link href="/pricing">
              <Button className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-700 transition">
                View All Teacher Rates
              </Button>
            </Link>
          </div>
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

        {/* Featured Reviews Section */}
        {reviews && reviews.length > 0 && (
          <section className="mt-15 space-y-6 mx-auto">
            <div className="mt-5">
              <h1 className="text-3xl font-semibold text-center mb-2 text-gray-800">
                Student Reviews
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Real experiences from those who’ve practiced with our teachers
              </p>
              <ReviewCarousel reviews={reviews} />
            </div>
          </section>
        )}

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
