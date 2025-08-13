export type Metric = { 
  label: string; 
  value: string; 
  icon?: string;
};

export type Feature = { 
  icon?: string; 
  text: string;
  title?: string;
  description?: string;
};

export type PricingTier = {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  priceMonthly: number;
  priceYearly?: number;
  bullets: string[];
  cta: 'checkout' | 'contact';
  popular?: boolean;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  gradient: [string, string];
  metrics: Metric[];
  features: Feature[];
  demoLink?: string;
  docsLink?: string;
  pricingKey?: string;
  testimonial?: { 
    quote: string; 
    author: string; 
    role?: string; 
  };
  description?: string;
  heroText?: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: [string, string];
  products: string[]; // product IDs
};

export type SiteConfig = {
  urgencyBanner?: {
    text: string;
    enabled: boolean;
    dismissible: boolean;
  };
  socialProof: {
    userCount: string;
    contentGenerated: string;
    successRate: string;
  };
  testimonials: Array<{
    quote: string;
    author: string;
    role?: string;
    company?: string;
  }>;
};

export type AnalyticsEvent = 
  | 'cta_hero_start_free'
  | 'cta_hero_demo'
  | 'gateway_category_open'
  | 'gateway_product_click'
  | 'pricing_select_tier'
  | 'faq_open'
  | 'urgency_dismiss'
  | 'product_demo_launch'
  | 'checkout_initiated';