import { Category } from './types';

export const categories: Category[] = [
  {
    id: 'content-marketing',
    name: 'Content & Marketing',
    description: 'AI-powered content creation, marketing automation, and growth tools',
    icon: 'PenTool',
    gradient: ['from-blue-500', 'to-purple-500'],
    products: [
      'content-spawner',
      'auto-rewrite',
      'social-media-manager',
      'email-marketing-suite',
      'seo-optimizer-pro',
      'content-calendar-pro'
    ]
  },
  {
    id: 'business-intelligence',
    name: 'Business Intelligence',
    description: 'Analytics, performance tracking, and business optimization tools',
    icon: 'BarChart3',
    gradient: ['from-green-500', 'to-teal-500'],
    products: [
      'live-dashboard',
      'performance-learning',
      'lead-generation-pro',
      'affiliate-portal'
    ]
  },
  {
    id: 'ecommerce-sales',
    name: 'E-commerce & Sales',
    description: 'Sales optimization, e-commerce tools, and revenue generation',
    icon: 'ShoppingCart',
    gradient: ['from-orange-500', 'to-red-500'],
    products: [
      'ecommerce-optimizer',
      'bundle-builder',
      'customer-service-ai',
      'invoice-generator'
    ]
  },
  {
    id: 'compliance-professional',
    name: 'Compliance & Professional',
    description: 'Industry-specific compliance, legal, and professional tools',
    icon: 'Shield',
    gradient: ['from-red-500', 'to-pink-500'],
    products: [
      'healthcare-ai-compliance',
      'legal-ai-compliance',
      'financial-ai-compliance',
      'education-ai-compliance',
      'medical-ai-assistant'
    ]
  },
  {
    id: 'productivity-management',
    name: 'Productivity & Management',
    description: 'Project management, productivity tools, and workflow optimization',
    icon: 'Briefcase',
    gradient: ['from-indigo-500', 'to-blue-500'],
    products: [
      'project-management-pro',
      'time-tracking-ai',
      'auto-niche-engine'
    ]
  },
  {
    id: 'advanced-ai-development',
    name: 'Advanced AI & Development',
    description: 'Cutting-edge AI tools, quantum computing, and advanced technology',
    icon: 'Zap',
    gradient: ['from-purple-500', 'to-violet-500'],
    products: [
      'novus-protocol',
      'quantum-ai-processor',
      'aesthetic-generator',
      'podcast-producer',
      'video-editor-ai'
    ]
  }
];