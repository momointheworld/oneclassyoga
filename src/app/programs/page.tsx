'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';

const ProgramsPage = () => {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);

  const programs = [
    {
      id: 'foundations-3',
      title: 'Yoga Foundations Intensive',
      price: '4,500฿',
      suitableFor: 'Beginners • No experience required',
      instructor: 'Toon',
      instructorSlug: 'toon',
      duration: '3 Sessions • 90 Min',
      description:
        'A comprehensive entry point into yoga. We focus on breath-to-movement connection and spinal safety to build a safe, lifelong foundation.',
      syllabus: [
        'Session 1: Breath & Spine Mechanics',
        'Session 2: Standing Poses & Warrior Alignment',
        'Session 3: Introduction to Sun Salutations',
      ],
    },
    {
      id: 'mobility-6',
      title: 'Core & Mobility Series',
      price: '8,400฿',
      instructor: 'Toon',
      suitableFor: 'Intermediate • Stable Downward Dog required',
      instructorSlug: 'toon',
      duration: '6 Sessions • 90 Min',
      description:
        'Designed to unlock tight hips and shoulders while building deep abdominal stability and functional range of motion.',
      syllabus: [
        'Sessions 1-2: Pelvic Floor & Hip Mobility',
        'Sessions 3-4: Thoracic Opening & Posture',
        'Sessions 5-6: Total Body Integration',
      ],
    },
    {
      id: 'inversions-3',
      title: 'The Art of Inversion',
      price: '5,400฿',
      suitableFor: 'Intermediate • Stable Downward Dog required',
      instructor: 'Patrick',
      instructorSlug: 'patrick',
      duration: '3 Sessions • 90 Min',
      description:
        'A technical workshop series designed to conquer the fear of going upside down. Focus on shoulder stability, wrist health, and core control.',
      syllabus: [
        'Session 1: Foundation & Wall-Supported L-Stands',
        'Session 2: Finding your Center (Headstand Mechanics)',
        'Session 3: Kick-up Techniques & Forearm Stands',
      ],
    },
    {
      id: 'arm-balance-3',
      title: 'Arm Balances & Twists',
      price: '4,500฿',
      suitableFor: 'All Levels • Some yoga experience recommended',
      instructor: 'Patrick',
      instructorSlug: 'patrick',
      duration: '3 Sessions • 90 Min',
      description:
        'Explore the harmony of strength and flexibility. We combine deep spinal rotations with gentle introductions to balancing on the hands, finding lightness through technique.',
      syllabus: [
        {
          title: 'Session 1: Finding Balance & Stability',
          poses: 'Crow Pose, Plank variations, Garland Pose',
        },
        {
          title: 'Session 2: Mobility & Deep Rotations',
          poses: 'Side Crow, Revolved Chair, Revolved Triangle',
        },
        {
          title: 'Session 3: Integration & Lift',
          poses: 'Flying Splits prep, Lizard Pose, Eight-Angle Pose',
        },
      ],
    },
  ];

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 bg-white">
      <header className="mb-12 border-b border-gray-100 pb-8 text-center md:text-left">
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">
          Programs
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Select a structured path led by our expert teachers.
        </p>
      </header>

      <div className="divide-y divide-gray-100 border-t border-gray-100">
        {programs.map((p) => (
          <div key={p.id} className="py-8">
            <button
              onClick={() => toggle(p.id)}
              className="w-full flex justify-between items-start text-left group"
            >
              <div className="pr-4">
                <h2 className="text-xl font-medium text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight">
                  {p.title}
                </h2>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mt-2">
                  {p.suitableFor}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {p.duration} — Led by{' '}
                  <span className="text-gray-600 font-medium">
                    {p.instructor}
                  </span>
                </p>
              </div>
              <div className="flex-shrink-0 text-gray-300 group-hover:text-emerald-500 transition-colors mt-1">
                {openId === p.id ? (
                  <Minus className="h-6 w-6" />
                ) : (
                  <Plus className="h-6 w-6" />
                )}
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openId === p.id ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
            >
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed italic border-l-2 border-emerald-500 pl-4">
                  &quot;{p.description}&quot;
                </p>

                <div className="bg-gray-50 p-6 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Curriculum Outline
                  </p>
                  <ul className="space-y-4">
                    {p.syllabus.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-gray-700"
                      >
                        <span className="text-emerald-500 font-bold tabular-nums">
                          {i + 1}.
                        </span>
                        <div>
                          {typeof step === 'string' ? (
                            <p className="font-medium">{step}</p>
                          ) : (
                            <>
                              <p className="font-medium">{step.title}</p>
                              <p className="text-xs text-gray-400 italic mt-0.5 leading-relaxed">
                                Includes: {step.poses}
                              </p>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and Button Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                      Program Investment
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {p.price}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        p.instructorSlug
                          ? `/teachers/${p.instructorSlug}`
                          : '/teachers'
                      )
                    }
                    className="inline-flex items-center justify-center bg-emerald-600 text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-100"
                  >
                    {p.instructor.includes('or')
                      ? 'Choose Instructor'
                      : `Book with ${p.instructor.split(' ')[0]}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramsPage;
