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

// ✅ UI packages list
export const packages: Array<{
  id: PackageType;
  title: string;
  description: string;
  friendNote: string;
  price: string;
  badge: string | null;
  badgeVariant: BadgeVariant;
}> = [
  {
    id: 'single',
    title: 'Single Session',
    description:
      'Enjoy a hassle-free 1.5-hour yoga session guided by your teacher!',
    friendNote: 'Bring a friend for just +800฿ — mats & props included!',
    price: '3,500 THB',
    badge: null,
    badgeVariant: undefined,
  },
  {
    id: 'bundle3',
    title: 'Bundle of 3',
    description:
      'Save 3,500฿ — only 2,333฿ per session! Perfect for regular practice.',
    friendNote: 'Add a friend for only +800฿ per class — share the joy!',
    price: '7,000 THB',
    badge: 'Most Popular',
    badgeVariant: 'destructive',
  },
  {
    id: 'bundle6',
    title: 'Bundle of 6',
    description:
      'Save 8,000฿ — only 2,167฿ per session! Commit to your growth.',
    friendNote: 'Bring a friend for +800฿ each session — double the fun!',
    price: '13,000 THB',
    badge: 'Best Value',
    badgeVariant: 'secondary',
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
