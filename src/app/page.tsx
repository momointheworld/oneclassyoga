import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { createClient } from '@/utils/supabase/supabaseServer';
import BookingSteps from '@/components/BookingSteps';
import FAQSection from '@/components/FAQSection';
import { Metadata } from 'next';
import YouTubeVideo from '@/components/YoutubeViedo';
import ReviewCarousel from '@/components/ReviewCard';
import { Badge } from '@/components/ui/badge';
import { PROGRAMS, programTeachers } from '@/lib/packages';

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
        url: '/images/ogs/home-og.jpeg',
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
    images: ['/images/ogs/home-og.jpeg'],
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
          {/* Header Section */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl max-w-4xl mx-auto">
            Master Yoga Skills: <br />
            Private Programs in Chiang Mai
          </h1>

          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            I am a longtime practitioner in Chiang Mai and I’ve followed a lot
            of teachers over the years, learning their skills in different
            areas. I created this to help these teachers gain the exposure they
            deserve by putting together private, one-on-one programs built
            around their specific strengths. This allows students to progress
            with much more focus than a group class, with every session tailored
            to exactly what they need.
          </p>

          {/* Simplified Video Container */}
          <div className="flex justify-center px-4">
            <div className="w-full max-w-3xl">
              <YouTubeVideo youtubeId="hJgt8rKMRek" bilibiliId="BV1opCvBiEfo" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="text-center space-y-10">
          <h2 className="text-3xl font-semibold">How It Works</h2>
          <BookingSteps />
        </section>

        {/* Programs Preview Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold">
              Get better at specific skills
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              I worked with these teachers to turn their best skills into simple
              programs. Instead of just a random class, you get a clear path to
              follow with personal help on every movement.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {PROGRAMS.slice(0, 3).map((program) => {
              const instructorSlug = programTeachers[program.id];
              const instructor = teachers?.find(
                (t) => t.slug === instructorSlug,
              );

              return (
                <div
                  key={program.id}
                  className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="mb-6">
                    <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 text-[10px] uppercase font-bold tracking-widest mb-4">
                      {program.id.endsWith('-6')
                        ? '6-Session Series'
                        : '3-Session Intensive'}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-emerald-600 transition-colors">
                      {program.title}
                    </h3>
                  </div>

                  <div className="flex-grow space-y-6">
                    <div className="space-y-3">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        Syllabus
                      </p>
                      <ul className="space-y-2">
                        {program.syllabus.slice(0, 3).map((step, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-gray-600"
                          >
                            <span className="text-emerald-500 font-bold">
                              {i + 1}.
                            </span>
                            <span>
                              {typeof step === 'string' ? step : step.title}
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
                          Meet{' '}
                          {instructor?.name?.split(' ')[0] || 'the teacher'}{' '}
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
                Explore All Programs
              </Button>
            </Link>
          </div>
        </section>

        {/* FAQ section */}
        <section>
          <FAQSection />
        </section>
        {/* Trust Section */}
        <section className="bg-gray-50 py-16 rounded-[2.5rem] px-6 md:px-12 space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose Our Programs?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We bridge the gap between casual drop-in classes and professional,
              result-oriented yoga practice.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 text-center">
            {[
              {
                title: 'Curated Curriculums',
                desc: 'Every program is designed based on years of practice to ensure you don’t just "do yoga," but actually progress in specific skills.',
                icon: '📋',
              },
              {
                title: 'Handpicked Excellence',
                desc: 'I personally vet every teacher for their technical depth and ability to guide students safely through advanced movements.',
                icon: '💎',
              },
              {
                title: 'Shared Growth',
                desc: 'Our unique "Share with a Friend" model makes private, high-quality instruction more accessible and enjoyable for everyone.',
                icon: '🤝',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="space-y-4 flex flex-col items-center group"
              >
                <div className="text-5xl mb-2  transition-all duration-300 transform group-hover:scale-110">
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
