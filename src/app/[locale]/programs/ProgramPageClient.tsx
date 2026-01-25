'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl'; // Import this
import { ProgramListRow } from '@/components/ProgramListRow';
import { Program, PROGRAMS, programTeachers } from '@/lib/packages';
import { createClient } from '@/utils/supabase/supabaseClient';
import { PageContainer } from '@/components/PageContainer';

const supabase = createClient();

const ProgramsPageClient = () => {
  const router = useRouter();
  const t = useTranslations('Programs'); // Initialize hook

  const [openId, setOpenId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teacherRates, setTeacherRates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      const slugs = Object.values(programTeachers);
      const { data, error } = await supabase
        .from('teachers')
        .select('slug, rates')
        .in('slug', slugs);

      if (!error && data) {
        const ratesMap = data.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.slug]: curr.rates,
          }),
          {},
        );
        setTeacherRates(ratesMap);
      }
      setLoading(false);
    };

    fetchRates();
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center text-gray-400">{t('Page.loading')}</div>
    );

  return (
    <PageContainer>
      <div>
        <div className="mb-6 border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {t('Page.title')}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t('Page.description')}
          </p>
        </div>

        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {PROGRAMS.map((p) => {
            const instructorSlug = programTeachers[p.id];
            const rates = teacherRates[instructorSlug];

            // Use bundleType from packages.ts logic
            const bundleKey = p.bundleType;
            const priceValue = rates ? rates[bundleKey] : null;

            // Format price: "4,500 THB" or "—"
            const displayPrice = priceValue
              ? `${Number(priceValue).toLocaleString()}`
              : t('UI.programsPage.notAvailable');

            // Capitalize fallback or use a translation if you have a teachers' list
            const instructorName =
              instructorSlug.charAt(0).toUpperCase() + instructorSlug.slice(1);

            return (
              <ProgramListRow
                key={p.id}
                program={p as Program}
                price={displayPrice}
                instructor={instructorName}
                isOpen={openId === p.id}
                onToggle={() => setOpenId(openId === p.id ? null : p.id)}
                onBook={() =>
                  router.push(`/teachers/${instructorSlug}?program=${p.id}`)
                }
              />
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};

export default ProgramsPageClient;
