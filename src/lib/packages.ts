// ✅ Bundle identifiers
export const BUNDLE3 = 'bundle3' as const;
export const BUNDLE6 = 'bundle6' as const;

export type PackageType = 'single' | typeof BUNDLE3 | typeof BUNDLE6;

// ✅ Package titles (Moved to JSON, but keeping keys here if needed for logic)
export const packageTitleKeys: Record<PackageType, string> = {
  single: 'single',
  [BUNDLE3]: 'bundle3',
  [BUNDLE6]: 'bundle6',
};

// ✅ Instructor Mapping (Logic remains here)
export const programTeachers: Record<string, string> = {
  'foundations-3': 'toon',
  'mobility-6': 'toon',
  'inversions-3': 'patrick',
  'arm-balance-3': 'patrick',
};

// ✅ The Main Constant (Clean of hardcoded strings)
export const PROGRAMS = [
  {
    id: 'foundations-3',
    bundleType: BUNDLE3,
  },
  {
    id: 'mobility-6',
    bundleType: BUNDLE6,
  },
  {
    id: 'inversions-3',
    bundleType: BUNDLE3,
  },
  {
    id: 'arm-balance-3',
    bundleType: BUNDLE3,
  },
] as const;

export type ProgramId = (typeof PROGRAMS)[number]['id'];

// ✅ Helper: get bundle size
export function getBundleSize(bookingType: PackageType): number {
  if (bookingType === 'single') return 1;
  const num = parseInt(bookingType.replace('bundle', ''), 10);
  return isNaN(num) ? 1 : num;
}
