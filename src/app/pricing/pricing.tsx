'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Teacher } from '@/types/teacher';
import { createClient } from '@/utils/supabase/supabaseClient';
import { getPackages } from '@/lib/packages';

// Custom Skeleton component in case the UI library one isn't working
const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

export default function Pricing() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: allTeachers } = await supabase
        .from('teachers')
        .select('id, rates,isFeatured,name,photo,slug');

      if (allTeachers) {
        const sortedTeachers = (allTeachers as Teacher[]).sort((a, b) => {
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        });
        setTeachers(sortedTeachers);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Package skeleton component
  const PackageSkeleton = () => (
    <div className="border rounded-xl p-6 shadow animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3 mt-2" />
    </div>
  );

  // Desktop table skeleton row
  const DesktopTableSkeleton = () => (
    <tr className="border-t animate-pulse">
      <td className="p-3 flex items-center space-x-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-3 text-center">
        <Skeleton className="h-4 w-12 mx-auto" />
      </td>
      <td className="p-3 text-center">
        <Skeleton className="h-4 w-12 mx-auto" />
      </td>
      <td className="p-3 text-center">
        <Skeleton className="h-4 w-12 mx-auto" />
      </td>
      <td className="p-3 text-center">
        <Skeleton className="h-4 w-12 mx-auto" />
      </td>
      <td className="p-3 text-center">
        <Skeleton className="h-9 w-32 mx-auto rounded-lg" />
      </td>
    </tr>
  );

  // Mobile card skeleton
  const MobileCardSkeleton = () => (
    <div className="border rounded-lg p-4 shadow-sm animate-pulse">
      <div className="flex items-center space-x-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Bundle 3 skeleton */}
      <div className="mb-2">
        <Skeleton className="h-4 w-16 mb-1" />
        <div className="flex justify-between mt-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-24 rounded" />
        </div>
      </div>

      {/* Bundle 6 skeleton */}
      <div className="mb-2">
        <Skeleton className="h-4 w-16 mb-1" />
        <div className="flex justify-between mt-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-24 rounded" />
        </div>
      </div>

      <div className="mt-3 text-center">
        <Skeleton className="h-9 w-32 mx-auto rounded-lg" />
      </div>
    </div>
  );

  // --- JSON-LD Schema for SEO ---
  const renderSchema = () => {
    if (teachers.length === 0) return null;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Chiang Mai Yoga Teachers Pricing',
      description:
        'Compare pricing for private 1-on-1 yoga classes with experienced Chiang Mai teachers.',
      itemListElement: teachers.map((teacher, index) => {
        const prices = [
          teacher.rates.single,
          teacher.rates.bundle3
            ? Math.round(teacher.rates.bundle3 / 3)
            : undefined,
          teacher.rates.bundle6
            ? Math.round(teacher.rates.bundle6 / 6)
            : undefined,
        ].filter(Boolean) as number[];

        const startingPrice =
          prices.length > 0 ? Math.min(...prices) : undefined;

        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Person',
            name: teacher.name,
            url: `https://oneclass.yoga/teachers/${teacher.slug}`,
            ...(startingPrice && {
              offers: {
                '@type': 'Offer',
                priceCurrency: 'THB',
                price: startingPrice,
                url: `https://oneclass.yoga/teachers/${teacher.slug}/#booking-calendar`,
              },
            }),
          },
        };
      }),
    };

    return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-6">
        Private Yoga Sessions in Chiang Mai (Single & Bundles)
      </h1>

      <p className="text-center text-gray-600 mb-12">
        Deepen your yoga journey in Chiang Mai with our experienced teachers.
        Each private session lasts 1.5 hours. Start with a single class, or
        enjoy greater value and commitment with our 3-session and 6-session
        bundles, designed to support your growth over time.
      </p>

      {/* Inject dynamic JSON-LD schema */}
      {renderSchema()}

      {/* Badges */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-2 mb-6 flex-wrap">
        <span className="text-emerald-600 text-md font-semibold px-3 py-1 rounded-full flex items-center gap-2">
          ⏱️ 1.5 hrs per session
        </span>
        <Link
          href="/location"
          className="text-emerald-600 text-md font-semibold underline px-3 py-1 rounded-full hover:text-emerald-800 transition flex items-center gap-2"
        >
          🏢 Studio included (usually 500฿)
        </Link>
        <span className="text-emerald-600 text-md font-semibold px-3 py-1 rounded-full flex items-center gap-2">
          👯 Add a friend +800฿
        </span>
      </div>

      <p className="text-gray-500 text-sm italic mx-auto text-center my-5">
        Prices are based on each teacher’s rates. What you see here is
        illustrative—actual rates may vary per teacher.
      </p>

      {/* Package Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {loading ? (
          <>
            <div className="text-center text-gray-500 mb-4 col-span-full">
              Loading packages...
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <PackageSkeleton key={i} />
            ))}
          </>
        ) : (
          teachers[0] &&
          getPackages(teachers[0].rates).map((pkg) => (
            <div
              key={pkg.id}
              className="border border-gray-200 rounded-xl p-6 shadow  text-center relative"
            >
              {pkg.badge && (
                <span
                  className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${
                    pkg.badge === 'Best Value'
                      ? 'bg-emerald-100 text-emerald-700'
                      : pkg.badge === 'Most Popular'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {pkg.badge}
                </span>
              )}
              <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
              <p className="font-semibold mt-2 text-xl">฿{pkg.price}</p>
              <p className="text-gray-600">{pkg.description}</p>
              <p className="text-gray-500 text-sm mt-2">{pkg.friendNote}</p>
            </div>
          ))
        )}
      </div>

      {/* Teachers Pricing Table */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Choose Your Yoga Teacher</h2>
        <p className="text-gray-600 mb-6">
          Discover our full lineup of Chiang Mai yoga teachers and compare
          bundle pricing to enjoy extra savings. Bring a friend to make your
          session even more affordable and fun, and pick the teacher and package
          that perfectly matches your practice.
        </p>
      </div>

      {loading ? (
        <>
          <div className="text-center text-gray-500 mb-4">
            Loading teachers...
          </div>
          {/* Desktop Table Skeleton */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th rowSpan={2} className="p-3 text-left">
                    Teacher
                  </th>
                  <th colSpan={2} className="p-3 text-center">
                    Single <br />
                    <span>/person/session</span>
                  </th>
                  <th colSpan={2} className="p-3 text-center">
                    Bundle 3 <br />
                    <span>/person/session</span>
                  </th>
                  <th colSpan={2} className="p-3 text-center">
                    Bundle 6 <br />
                    <span>/person/session</span>
                  </th>
                  <th rowSpan={2} className="p-3 text-center"></th>
                </tr>
                <tr>
                  <th className="p-3 text-center">Alone</th>
                  <th className="p-3 text-center">With Friend</th>
                  <th className="p-3 text-center">Alone</th>
                  <th className="p-3 text-center">With Friend</th>
                  <th className="p-3 text-center">Alone</th>
                  <th className="p-3 text-center">With Friend</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <DesktopTableSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards Skeleton */}
          <div className="flex flex-col gap-4 md:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <MobileCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th rowSpan={2} className="p-3 text-left">
                    Teacher
                  </th>
                  <th colSpan={2} className="p-3 text-center">
                    Single <br />
                    <span>/person/session</span>
                  </th>
                  <th colSpan={2} className="p-3 text-center bg-orange-100">
                    Bundle 3 <br />
                    <span>/person/session</span>
                  </th>
                  <th colSpan={2} className="p-3 text-center">
                    Bundle 6 <br />
                    <span>/person/session</span>
                  </th>
                  <th rowSpan={2} className="p-3 text-center"></th>
                </tr>
                <tr>
                  <th className="p-3 text-center text-gray-400">Alone</th>
                  <th className="p-3 text-center">With Friend</th>
                  <th className="p-3 text-center text-gray-400 bg-orange-100 ">
                    Alone
                  </th>
                  <th className="p-3 text-center bg-orange-100 ">
                    With Friend
                  </th>
                  <th className="p-3 text-center text-gray-400">Alone</th>
                  <th className="p-3 text-center ">With Friend</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => {
                  const singleAlone = teacher.rates.single ?? 0;
                  const singleFriend = teacher.rates.extra.single ?? 0;

                  const bundle3Alone = teacher.rates.bundle3 ?? 0;
                  const bundle3Friend = teacher.rates.extra.bundle3 ?? 0;

                  const bundle6Alone = teacher.rates.bundle6 ?? 0;
                  const bundle6Friend = teacher.rates.extra.bundle6 ?? 0;

                  return (
                    <tr key={teacher.id} className="border-t">
                      <td className="p-3 flex items-center space-x-3">
                        <Image
                          src={teacher.photo || '/placeholder.png'}
                          alt={teacher.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <Link href={`/teachers/${teacher.slug}`}>
                          <span className="font-medium text-emerald-600 hover:text-emerald-800">
                            {teacher.name}
                          </span>
                        </Link>
                      </td>

                      {/* Single */}
                      <td className="p-3 text-center text-gray-500 ">
                        {singleAlone}฿
                      </td>
                      <td className="p-3 text-center ">
                        {singleFriend
                          ? Math.round((singleAlone + singleFriend) / 2)
                          : '-'}
                        ฿
                      </td>

                      {/* Bundle 3 */}
                      <td className="p-3 text-center text-gray-500 bg-orange-100 ">
                        {bundle3Alone ? Math.round(bundle3Alone / 3) : '-'}฿
                      </td>
                      <td className="p-3 text-center bg-orange-100 ">
                        {bundle3Friend
                          ? Math.round((bundle3Alone + bundle3Friend) / 6)
                          : '-'}
                        ฿
                      </td>

                      {/* Bundle 6 */}
                      <td className="p-3 text-center text-gray-500">
                        {bundle6Alone ? Math.round(bundle6Alone / 6) : '-'}฿
                      </td>
                      <td className="p-3 text-center">
                        {bundle6Friend
                          ? Math.round((bundle6Alone + bundle6Friend) / 12)
                          : '-'}
                        ฿
                      </td>

                      <td className="p-3 text-center">
                        <Link
                          href={`/teachers/${teacher.slug}/#booking-calendar`}
                        >
                          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                            Book this Teacher
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Table */}
          <div className="flex flex-col gap-4 md:hidden">
            {teachers.map((teacher) => {
              const singleAlone = teacher.rates.single ?? 0;
              const singleFriend = teacher.rates.extra.single ?? 0;
              const bundle3 = teacher.rates.bundle3 ?? 0;
              const bundle3Extra = teacher.rates.extra.bundle3 ?? 0;
              const bundle6 = teacher.rates.bundle6 ?? 0;
              const bundle6Extra = teacher.rates.extra.bundle6 ?? 0;

              return (
                <div
                  key={teacher.id}
                  className="border rounded-lg p-4 shadow-sm animate-fade-in"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Image
                      src={teacher.photo || '/placeholder.png'}
                      alt={teacher.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <span className="font-medium">{teacher.name}</span>
                  </div>

                  {/* Single */}
                  <div className="mb-2">
                    <span className="font-semibold">Single</span>
                    <div className="flex justify-between mt-1">
                      <span>{singleAlone}฿ / person</span>
                      {singleFriend ? (
                        <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded">
                          With friend: {singleAlone + singleFriend}฿
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Bundle 3 */}
                  <div className="mb-2">
                    <span className="font-semibold">Bundle 3</span>
                    <div className="flex justify-between mt-1">
                      <span>
                        {bundle3 ? Math.round(bundle3 / 3) : '-'}฿ / person
                      </span>
                      {bundle3Extra ? (
                        <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded">
                          With friend:{' '}
                          {Math.round((bundle3 + bundle3Extra) / 6)}฿
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Bundle 6 */}
                  <div className="mb-2">
                    <span className="font-semibold">Bundle 6</span>
                    <div className="flex justify-between mt-1">
                      <span>
                        {bundle6 ? Math.round(bundle6 / 6) : '-'}฿ / person
                      </span>
                      {bundle6Extra ? (
                        <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded">
                          With friend:{' '}
                          {Math.round((bundle6 + bundle6Extra) / 12)}฿
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <Link href={`/teachers/${teacher.slug}/#booking-calendar`}>
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                        Book this Teacher
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
