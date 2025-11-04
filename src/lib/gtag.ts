/* eslint-disable @typescript-eslint/no-explicit-any */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Track pageviews
export const pageview = (url: string): void => {
  if (
    typeof window !== 'undefined' &&
    (window as any).gtag &&
    GA_MEASUREMENT_ID
  ) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

interface GTagEventParams {
  action: string;
  params?: Record<string, any>;
}

export const event = ({ action, params }: GTagEventParams): void => {
  if (
    typeof window !== 'undefined' &&
    (window as any).gtag &&
    GA_MEASUREMENT_ID
  ) {
    (window as any).gtag('event', action, params);
  }
};
