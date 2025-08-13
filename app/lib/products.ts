export interface ProductDefinition {
  id: string;
  name: string;
  href: string;
  description?: string;
}

const rawProducts: Array<Omit<ProductDefinition, 'id'>> = [
  { name: 'NOVUS Protocol', href: '/products/novus-protocol', description: 'AI Prompt Optimizer' },
  { name: 'AutoRewrite Engine', href: '/products/auto-rewrite', description: 'Content Refinement' },
  { name: 'Bundle Builder', href: '/products/bundle-builder', description: 'Product Packaging' },
  { name: 'Content Spawner', href: '/products/content-spawner', description: 'Viral Content Generator' },
  { name: 'Live Dashboard', href: '/products/live-dashboard', description: 'Analytics & Tracking' },
  { name: 'Affiliate Portal', href: '/products/affiliate-portal', description: 'Referral System' },
  { name: 'Auto Niche Engine', href: '/products/auto-niche-engine', description: 'Market Discovery' },
  { name: 'Aesthetic Generator', href: '/products/aesthetic-generator', description: 'Design Automation' },
  { name: 'Content Calendar Pro', href: '/products/content-calendar-pro', description: 'Content Planning' },
  { name: 'Email Marketing Suite', href: '/products/email-marketing-suite', description: 'Email Automation' },
  { name: 'Social Media Manager', href: '/products/social-media-manager', description: 'Social Automation' },
  { name: 'SEO Optimizer Pro', href: '/products/seo-optimizer-pro', description: 'Search Optimization' },
  { name: 'Lead Generation Pro', href: '/products/lead-generation-pro', description: 'Lead Automation' },
  { name: 'Project Management Pro', href: '/products/project-management-pro', description: 'Team Coordination' },
  { name: 'Time Tracking AI', href: '/products/time-tracking-ai', description: 'Productivity Analytics' },
  { name: 'Invoice Generator', href: '/products/invoice-generator' },
  { name: 'Customer Service AI', href: '/products/customer-service-ai', description: 'Support Automation' },
  { name: 'Video Editor AI', href: '/products/video-editor-ai', description: 'Video Automation' },
  { name: 'Podcast Producer', href: '/products/podcast-producer', description: 'Audio Content' },
  { name: 'E-commerce Optimizer', href: '/products/ecommerce-optimizer', description: 'Sales Enhancement' },
  { name: 'Prompt Packs', href: '/products/prompt-packs', description: 'AI Templates' },
  { name: 'Healthcare AI Compliance', href: '/products/healthcare-ai-compliance', description: 'Medical Standards' },
  { name: 'Financial AI Compliance', href: '/products/financial-ai-compliance', description: 'Financial Standards' },
  { name: 'Legal AI Compliance', href: '/products/legal-ai-compliance', description: 'Legal Standards' },
  { name: 'Education AI Compliance', href: '/products/education-ai-compliance', description: 'Educational Standards' },
  { name: 'Medical AI Assistant', href: '/products/medical-ai-assistant', description: 'Healthcare Support' },
  { name: 'Quantum AI Processor', href: '/products/quantum-ai-processor', description: 'Advanced Computing' }
];

export const productsRegistry: ProductDefinition[] = rawProducts.map((p) => ({
  id: p.href.replace('/products/', ''),
  ...p,
}));



