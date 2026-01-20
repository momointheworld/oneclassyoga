'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgramListRow } from '@/components/ProgramListRow';
import { PROGRAMS, programTeachers } from '@/lib/packages';
import { createClient } from '@/utils/supabase/supabaseClient';

const supabase = createClient();

const ProgramsPageClient = () => {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teacherRates, setTeacherRates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      // Get all teachers who are linked to programs
      const slugs = Object.values(programTeachers);

      const { data, error } = await supabase
        .from('teachers')
        .select('slug, rates')
        .in('slug', slugs);

      if (!error && data) {
        // Create a lookup object: { toon: { bundle3: 4500, ... }, patrick: { ... } }
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
      <div className="py-20 text-center text-gray-400">Loading programs...</div>
    );

  return (
    <div className="max-w-3xl mx-auto py-16 bg-white">
      <div className="mb-6 border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Focused Private Programs
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          I worked with these teachers to turn their best skills into simple
          programs. Instead of just a random class, you get a clear path to
          follow with personal help on every movement.
        </p>
      </div>

      <div className="divide-y divide-gray-100 border-t border-gray-100">
        {PROGRAMS.map((p) => {
          const instructorSlug = programTeachers[p.id];
          const rates = teacherRates[instructorSlug];

          // Determine if we need bundle3 or bundle6 price
          const bundleKey = p.id.endsWith('-6') ? 'bundle6' : 'bundle3';
          const price = rates ? rates[bundleKey] : '—';

          const instructorName =
            instructorSlug.charAt(0).toUpperCase() + instructorSlug.slice(1);

          return (
            <ProgramListRow
              key={p.id}
              program={p}
              price={price}
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
  );
};

export default ProgramsPageClient;
