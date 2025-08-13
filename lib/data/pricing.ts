import { PricingTier } from './types';

type PricingConfig = Record<string, PricingTier[]>;

export const pricing: PricingConfig = {
  'novus-protocol': [
    {
      id: 'starter',
      name: 'NOVUS Starter',
      priceMonthly: 29,
      priceYearly: 290,
      bullets: [
        '100 optimizations/month',
        'Basic prompt analysis',
        'Email support',
        '10+ language support',
        'Standard processing speed'
      ],
      cta: 'checkout',
      popular: false
    },
    {
      id: 'pro',
      name: 'NOVUS Pro',
      priceMonthly: 79,
      priceYearly: 790,
      bullets: [
        'Unlimited optimizations',
        'Advanced CAL™ Technology',
        'Priority support',
        '50+ language support',
        'API access',
        'Custom templates',
        'Performance analytics'
      ],
      cta: 'checkout',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'NOVUS Enterprise',
      priceMonthly: 199,
      priceYearly: 1990,
      bullets: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
        'On-premise deployment',
        'Priority processing',
        '24/7 phone support'
      ],
      cta: 'contact',
      popular: false
    }
  ],

  'quantum-ai-processor': [
    {
      id: 'starter',
      name: 'Quantum Starter',
      priceMonthly: 299,
      priceYearly: 2990,
      bullets: [
        'Basic quantum algorithms',
        'Simulation environment',
        'Email support',
        '5 quantum jobs/month',
        'Standard processing time',
        'Basic analytics'
      ],
      cta: 'checkout',
      popular: false
    },
    {
      id: 'pro',
      name: 'Quantum Professional',
      priceMonthly: 799,
      priceYearly: 7990,
      bullets: [
        'All quantum algorithms',
        'Advanced hybrid computing',
        'Priority processing',
        'Unlimited quantum jobs',
        'Real-time monitoring',
        'Custom quantum circuits',
        'API access',
        'Advanced analytics'
      ],
      cta: 'checkout',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Quantum Enterprise',
      priceMonthly: 1999,
      priceYearly: 19990,
      bullets: [
        'Everything in Professional',
        'Custom quantum hardware',
        'White-label solutions',
        'Dedicated quantum engineer',
        '24/7 phone support',
        'On-premise deployment',
        'Advanced quantum networks',
        'Custom algorithm development'
      ],
      cta: 'contact',
      popular: false
    }
  ],

  'healthcare-ai-compliance': [
    {
      id: 'starter',
      name: 'Healthcare Basic',
      priceMonthly: 299,
      priceYearly: 2990,
      bullets: [
        'HIPAA compliance monitoring',
        'Basic audit logging',
        'Email support',
        'Standard reporting',
        'Basic risk assessment'
      ],
      cta: 'checkout',
      popular: false
    },
    {
      id: 'pro',
      name: 'Healthcare Pro',
      priceMonthly: 599,
      priceYearly: 5990,
      bullets: [
        'Complete HIPAA compliance',
        'Clinical decision support',
        'Advanced audit trail',
        'Priority support',
        'Risk stratification',
        'Custom compliance rules'
      ],
      cta: 'checkout',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Healthcare Enterprise',
      priceMonthly: 1299,
      priceYearly: 12990,
      bullets: [
        'Everything in Pro',
        'Custom compliance solutions',
        'White-label options',
        'Dedicated support',
        'Multi-facility management',
        '24/7 phone support'
      ],
      cta: 'contact',
      popular: false
    }
  ],

  'seo-optimizer-pro': [
    {
      id: 'starter',
      name: 'SEO Starter',
      priceMonthly: 49,
      priceYearly: 490,
      bullets: [
        'Basic keyword research',
        'On-page SEO analysis',
        'Email support',
        'Basic analytics',
        'Content suggestions',
        'Meta tag optimization'
      ],
      cta: 'checkout',
      popular: false
    },
    {
      id: 'pro',
      name: 'SEO Professional',
      priceMonthly: 149,
      priceYearly: 1490,
      bullets: [
        'Advanced keyword research',
        'Competitor analysis',
        'Priority support',
        'Advanced analytics',
        'Technical SEO audit',
        'Content optimization',
        'API access',
        'Custom integrations'
      ],
      cta: 'checkout',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'SEO Enterprise',
      priceMonthly: 399,
      priceYearly: 3990,
      bullets: [
        'Everything in Professional',
        'Multi-site management',
        'White-label solutions',
        'Dedicated SEO specialist',
        '24/7 phone support',
        'On-premise deployment',
        'Advanced AI features',
        'Custom SEO infrastructure'
      ],
      cta: 'contact',
      popular: false
    }
  ],

  'affiliate-portal': [
    {
      id: 'starter',
      name: 'Affiliate Starter',
      priceMonthly: 79,
      priceYearly: 790,
      bullets: [
        'Up to 100 affiliates',
        'Basic tracking',
        'Email support',
        'Standard reports',
        'Manual payouts',
        'Basic analytics'
      ],
      cta: 'checkout',
      popular: false
    },
    {
      id: 'pro',
      name: 'Affiliate Professional',
      priceMonthly: 199,
      priceYearly: 1990,
      bullets: [
        'Up to 1,000 affiliates',
        'AI-powered analytics',
        'Priority support',
        'Automated payouts',
        'Custom tracking',
        'Fraud protection',
        'Commission optimization',
        'Performance predictions'
      ],
      cta: 'checkout',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Affiliate Enterprise',
      priceMonthly: 499,
      priceYearly: 4990,
      bullets: [
        'Unlimited affiliates',
        'Advanced AI insights',
        'Dedicated support',
        'Advanced automation',
        'White-label options',
        'API access',
        'Custom AI models',
        'Predictive modeling'
      ],
      cta: 'contact',
      popular: false
    }
  ],

  // Generic pricing for products without specific data
  'default': [
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 49,
      priceYearly: 490,
      bullets: [
        'Core features',
        'Email support',
        'Basic analytics',
        'Standard processing'
      ],
      cta: 'checkout',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      priceMonthly: 99,
      priceYearly: 990,
      bullets: [
        'All core features',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Custom integrations'
      ],
      cta: 'checkout',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      priceMonthly: 299,
      priceYearly: 2990,
      bullets: [
        'Everything in Pro',
        'Dedicated support',
        'Custom solutions',
        'White-label options',
        '24/7 phone support'
      ],
      cta: 'contact',
      popular: false
    }
  ]
};

export function getPricing(productId: string): PricingTier[] {
  return pricing[productId] || pricing['default'];
}