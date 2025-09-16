export type TeacherRates = {
  single: number | null;
  bundle3: number | null;
  bundle6: number | null;
  extra: {
    single: number | null;
    bundle3: number | null;
    bundle6: number | null;
  };
};

export type Teacher = {
  id: string;
  name: string;
  photo: string;
  bio: string;
  styles: string[];
  levels: string[];
  gallery: string[];
  videoUrl: string;
  slug: string;
  isFeatured: boolean;
  weekly_schedule: Record<string, string[]>; // e.g., { Monday: ["10:00", "14:00"], ... }
  rates: TeacherRates;
  stripe_product_id?: string;
};
