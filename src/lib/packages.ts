// import { TeacherRates } from '@/types/teacher';

import { formatDuration } from 'date-fns';

// export const getPackages = (rates: TeacherRates) => {
//   const singlePrice = rates.single ?? 0;
//   const bundle3Price = rates.bundle3 ?? 0;
//   const bundle6Price = rates.bundle6 ?? 0;
//   const extraPerson = rates.extra.single ?? 0;

//   return [
//     {
//       id: 'single' as PackageType,
//       title: 'Single Session',
//       description:
//         'Enjoy a hassle-free 1.5-hour yoga session guided by your teacher!',
//       friendNote: `Bring a friend for just +${extraPerson}฿ — mats & props included!`,
//       price: singlePrice.toString(),
//       badge: null,
//       badgeVariant: undefined as BadgeVariant | undefined,
//     },
//     {
//       id: 'bundle3' as PackageType,
//       title: 'Bundle of 3',
//       description: `Save ${singlePrice * 3 - bundle3Price}฿ — only ${Math.round(bundle3Price / 3)}฿ per session! Perfect for regular practice.`,
//       friendNote: `Add a friend for only +${extraPerson}฿ per class — share the joy!`,
//       price: bundle3Price.toString(),
//       badge: 'Most Popular',
//       badgeVariant: 'destructive' as BadgeVariant,
//     },
//     {
//       id: 'bundle6' as PackageType,
//       title: 'Bundle of 6',
//       description: `Save ${singlePrice * 6 - bundle6Price}฿ — only ${Math.round(bundle6Price / 6)}฿ per session! Commit to your growth.`,
//       friendNote: `Bring a friend for ${extraPerson}฿ each session — double the fun!`,
//       price: bundle6Price.toString(),
//       badge: 'Best Value',
//       badgeVariant: 'secondary' as BadgeVariant,
//     },
//   ];
// };

// ✅ Bundle identifiers
export const BUNDLE3 = 'bundle3' as const;
export const BUNDLE6 = 'bundle6' as const;

// ✅ Union type for all package types
export type PackageType = 'single' | typeof BUNDLE3 | typeof BUNDLE6;

// ✅ Badge variants
export type BadgeVariant =
  | 'secondary'
  | 'destructive'
  | 'default'
  | 'outline'
  | null
  | undefined;

// ✅ Package titles (used in booking flow)
export const packageTitles: Record<PackageType, string> = {
  single: 'Choose Your Date & Time',
  [BUNDLE3]: 'Choose Your First Class Date & Time',
  [BUNDLE6]: 'Choose Your First Class Date & Time',
};

// 1. Define who teaches what in one place
export const programTeachers: Record<string, string> = {
  'foundations-3': 'toon',
  'mobility-6': 'toon',
  'inversions-3': 'patrick',
  'arm-balance-3': 'patrick',
};

// 2. The Main Constant
export const PROGRAMS = [
  {
    id: 'foundations-3',
    title: 'Yoga Foundations Intensive',
    duration: '3 Sessions • 90 Min each',
    bundleType: 'bundle3',
    suitableFor: 'Beginners • No experience required',
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
    duration: '6 Sessions • 90 Min each',
    bundleType: 'bundle6',
    suitableFor: 'Intermediate • Stable Downward Dog required',
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
    bundleType: 'bundle3',
    duration: '3 Sessions • 90 Min each',
    suitableFor: 'Intermediate • Stable Downward Dog required',
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
    duration: '3 Sessions • 90 Min each',
    bundleType: 'bundle3',
    suitableFor: 'All Levels • Some yoga experience recommended',
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

// ✅ Helper: get bundle size (e.g. "bundle3" → 3)
export function getBundleSize(bookingType: PackageType): number {
  if (bookingType === 'single') return 1;
  if (bookingType.startsWith('bundle')) {
    const num = parseInt(bookingType.replace('bundle', ''), 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
}
