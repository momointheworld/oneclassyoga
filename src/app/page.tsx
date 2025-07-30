'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // assuming shadcn/ui
import { ArrowRight } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';

export default function HomePage() {
  return (
    <PageContainer>
      <main className="px-4 md:px-8 lg:px-16 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Personalized 1-on-1 Sessions with Trusted Teachers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the right teacher, book a time that works for you, and start
            your journey today.
          </p>
          <div className="flex justify-center">
            <Link href="/teachers">
              <Button
                size="lg"
                className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-700 transition flex items-center gap-2"
              >
                Find a Teacher
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="text-center space-y-10">
          <h2 className="text-3xl font-semibold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: '1. Choose a Teacher',
                desc: 'Browse and select the teacher that fits your needs.',
              },
              {
                title: '2. Book a Time',
                desc: 'Pick a session time that works with your schedule.',
              },
              {
                title: '3. Start Your Session',
                desc: 'Join your private session and grow with guidance.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl shadow border border-gray-100 text-left"
              >
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Teachers */}
        <section className="space-y-10">
          <h2 className="text-3xl font-semibold text-center">
            Meet Some of Our Teachers
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Replace with dynamic data */}
            {['lim', 'noi', 'jane'].map((slug) => (
              <div
                key={slug}
                className="bg-white rounded-2xl p-6 shadow border border-gray-100 text-center"
              >
                <Image
                  src="/placeholder.png"
                  alt="Teacher profile"
                  width={96}
                  height={96}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                />

                <h3 className="text-xl font-medium capitalize">{slug}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Certified Yoga Teacher
                </p>
                <Link href={`/teachers/${slug}`}>
                  <Button
                    variant="outline"
                    className=" text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-200 transition"
                  >
                    View Profile
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="space-y-6 text-center">
          <h2 className="text-3xl font-semibold">Simple Pricing</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Choose from a one-time session or a discounted bundle package.
          </p>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="p-6 border border-gray-200 rounded-2xl shadow">
              <h3 className="text-xl font-semibold">Single Session</h3>
              <p className="text-gray-500 mt-2">฿1,250 per 1-hour session</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-2xl shadow">
              <h3 className="text-xl font-semibold">5-Session Bundle</h3>
              <p className="text-gray-500 mt-2">฿6,000 – Save ฿250</p>
            </div>
          </div>
          <Link href="/pricing">
            <Button className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-emerald-700 transition">
              See Full Pricing
            </Button>
          </Link>
        </section>

        {/* Trust Section */}
        <section className="bg-gray-50 py-12 rounded-2xl px-6 md:px-12 space-y-8">
          <h2 className="text-3xl font-semibold text-center">Why Choose Us?</h2>
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {[
              {
                title: 'Flexible Scheduling',
                desc: 'Book sessions that fit your lifestyle.',
              },
              {
                title: 'Carefully Selected Teachers',
                desc: 'We hand-pick every teacher to ensure quality.',
              },
              {
                title: '1-on-1 Personalized Attention',
                desc: 'Private sessions tailored to your goals.',
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
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
              className=" text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-200 transition"
            >
              Contact Us
            </Button>
          </Link>
        </section>
      </main>
    </PageContainer>
  );
}
