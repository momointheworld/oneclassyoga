import { TeacherRates } from '@/types/teacher';

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

export const getPackages = (rates: TeacherRates) => {
  const singlePrice = rates.single ?? 0;
  const bundle3Price = rates.bundle3 ?? 0;
  const bundle6Price = rates.bundle6 ?? 0;
  const extraPerson = rates.extra.single ?? 0;

  return [
    {
      id: 'single' as PackageType,
      title: 'Single Session',
      description:
        'Enjoy a hassle-free 1.5-hour yoga session guided by your teacher!',
      friendNote: `Bring a friend for just +${extraPerson}฿ — mats & props included!`,
      price: singlePrice.toString(),
      badge: null,
      badgeVariant: undefined as BadgeVariant | undefined,
    },
    {
      id: 'bundle3' as PackageType,
      title: 'Bundle of 3',
      description: `Save ${singlePrice * 3 - bundle3Price}฿ — only ${Math.round(bundle3Price / 3)}฿ per session! Perfect for regular practice.`,
      friendNote: `Add a friend for only +${extraPerson}฿ per class — share the joy!`,
      price: bundle3Price.toString(),
      badge: 'Most Popular',
      badgeVariant: 'destructive' as BadgeVariant,
    },
    {
      id: 'bundle6' as PackageType,
      title: 'Bundle of 6',
      description: `Save ${singlePrice * 6 - bundle6Price}฿ — only ${Math.round(bundle6Price / 6)}฿ per session! Commit to your growth.`,
      friendNote: `Bring a friend for ${extraPerson}฿ each session — double the fun!`,
      price: bundle6Price.toString(),
      badge: 'Best Value',
      badgeVariant: 'secondary' as BadgeVariant,
    },
  ];
};

// ✅ Helper: get bundle size (e.g. "bundle3" → 3)
export function getBundleSize(bookingType: PackageType): number {
  if (bookingType === 'single') return 1;
  if (bookingType.startsWith('bundle')) {
    const num = parseInt(bookingType.replace('bundle', ''), 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
}
