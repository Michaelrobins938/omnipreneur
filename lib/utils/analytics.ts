import { AnalyticsEvent } from '@/lib/data/types';

// Analytics event tracking utility
export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, any>) => {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, {
      ...properties,
      timestamp: new Date().toISOString()
    });
  }

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Analytics: ${event}`, properties);
  }

  // Could add other analytics providers here (Mixpanel, Segment, etc.)
};

// Batch event tracking for performance
export const trackEvents = (events: Array<{ event: AnalyticsEvent; properties?: Record<string, any> }>) => {
  events.forEach(({ event, properties }) => trackEvent(event, properties));
};

// Page view tracking
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'GA_TRACKING_ID', {
      page_path: path,
      page_title: title
    });
  }
};