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
  weekly_schedule: Record<string, string[]>; // e.g., { Monday: ["10:00", "14:00"], ... }
};
