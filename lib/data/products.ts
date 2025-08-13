import { Product } from './types';

export const products: Record<string, Product> = {
  'novus-protocol': {
    id: 'novus-protocol',
    name: 'NOVUS Protocol',
    slug: 'novus-protocol',
    tagline: 'Advanced AI prompt optimization with CAL™ Technology',
    category: 'advanced-ai-development',
    gradient: ['from-purple-500', 'to-pink-500'],
    description: 'Revolutionary prompt engineering platform powered by Cognitive Architecture Layering',
    heroText: 'Optimize your AI prompts with 99.2% success rate and 10x performance improvement',
    metrics: [
      { label: 'Optimization Success Rate', value: '99.2%', icon: 'CheckCircle' },
      { label: 'Average Improvement', value: '10x', icon: 'TrendingUp' },
      { label: 'Languages Supported', value: '50+', icon: 'Globe' },
      { label: 'Active Users', value: '50K+', icon: 'Users' }
    ],
    features: [
      { icon: 'Brain', title: 'CAL™ Technology', text: 'Cognitive Architecture Layering for unprecedented prompt optimization' },
      { icon: 'Zap', title: 'Real-time Optimization', text: 'Instant prompt analysis and improvement suggestions' },
      { icon: 'Target', title: 'Multi-language Support', text: 'Optimize prompts in 50+ languages with cultural context' },
      { icon: 'BarChart3', title: 'Performance Analytics', text: 'Track optimization success rates and improvement metrics' },
      { icon: 'Code', title: 'API Integration', text: 'Seamless integration with your existing AI workflows' },
      { icon: 'Settings', title: 'Custom Templates', text: 'Create and save optimized prompt templates for reuse' }
    ],
    demoLink: '/products/novus-protocol/demo',
    docsLink: '/products/novus-protocol/docs',
    pricingKey: 'novus-protocol'
  },

  'quantum-ai-processor': {
    id: 'quantum-ai-processor',
    name: 'Quantum AI Processor',
    slug: 'quantum-ai-processor',
    tagline: 'Revolutionary quantum computing platform with AI integration',
    category: 'advanced-ai-development',
    gradient: ['from-purple-500', 'to-blue-500'],
    description: 'Quantum computing platform powered by CAL™ Technology for exponentially faster processing',
    heroText: 'Solve complex problems 1000x faster with quantum AI processing',
    metrics: [
      { label: 'Faster Processing', value: '1000x', icon: 'Zap' },
      { label: 'Quantum Algorithms', value: '50+', icon: 'Cpu' },
      { label: 'Quantum Access', value: '24/7', icon: 'Clock' },
      { label: 'Research Partners', value: '100+', icon: 'Users' }
    ],
    features: [
      { icon: 'Atom', title: 'Quantum Processing', text: 'Advanced quantum computing algorithms for complex problem solving' },
      { icon: 'Cpu', title: 'Hybrid Computing', text: 'Seamless integration of quantum and classical computing' },
      { icon: 'Brain', title: 'AI Integration', text: 'CAL™ Technology powered quantum AI processing' },
      { icon: 'Cpu', title: 'Quantum Circuits', text: 'Custom quantum circuit design and optimization' },
      { icon: 'Database', title: 'Quantum Memory', text: 'Quantum state storage and retrieval systems' },
      { icon: 'Network', title: 'Quantum Networks', text: 'Distributed quantum computing networks' }
    ],
    pricingKey: 'quantum-ai-processor'
  },

  'healthcare-ai-compliance': {
    id: 'healthcare-ai-compliance',
    name: 'Healthcare AI Compliance',
    slug: 'healthcare-ai-compliance',
    tagline: 'HIPAA-compliant AI solutions for medical professionals',
    category: 'compliance-professional',
    gradient: ['from-red-500', 'to-pink-500'],
    description: 'Complete HIPAA compliance with AI-powered clinical decision support',
    heroText: 'Ensure complete HIPAA compliance while leveraging AI for clinical excellence',
    metrics: [
      { label: 'HIPAA Compliance', value: '100%', icon: 'Shield' },
      { label: 'Medical Accuracy', value: '99.7%', icon: 'CheckCircle' },
      { label: 'Active Users', value: '15K+', icon: 'Users' },
      { label: 'Security Rating', value: 'A+', icon: 'Lock' }
    ],
    features: [
      { icon: 'Shield', title: 'HIPAA Compliance', text: 'Full HIPAA, HITECH, and state privacy law compliance with automated auditing' },
      { icon: 'Heart', title: 'Clinical Decision Support', text: 'Evidence-based treatment recommendations with drug interaction analysis' },
      { icon: 'Stethoscope', title: 'Medical Content Validation', text: 'AI-powered medical content verification and accuracy checking' },
      { icon: 'FileText', title: 'Risk Assessment', text: 'Comprehensive risk stratification and early warning systems' },
      { icon: 'Lock', title: 'Data Encryption', text: 'End-to-end encryption with SOC2 compliant security protocols' },
      { icon: 'Activity', title: 'Audit Trail', text: 'Complete audit trail system for compliance and legal protection' }
    ],
    pricingKey: 'healthcare-ai-compliance'
  },

  'seo-optimizer-pro': {
    id: 'seo-optimizer-pro',
    name: 'SEO Optimizer Pro',
    slug: 'seo-optimizer-pro',
    tagline: 'AI-powered SEO optimization and ranking improvement',
    category: 'content-marketing',
    gradient: ['from-teal-500', 'to-blue-500'],
    description: 'AI-powered SEO optimization platform for search engine ranking improvement',
    heroText: 'Dominate search rankings with AI-powered SEO optimization',
    metrics: [
      { label: 'Traffic Increase', value: '300%', icon: 'TrendingUp' },
      { label: 'Ranking Factors', value: '50+', icon: 'Target' },
      { label: 'Monitoring', value: '24/7', icon: 'Clock' },
      { label: 'Active Campaigns', value: '1000+', icon: 'BarChart3' }
    ],
    features: [
      { icon: 'Search', title: 'Keyword Research', text: 'Advanced keyword research and analysis tools' },
      { icon: 'TrendingUp', title: 'Ranking Optimization', text: 'AI-powered ranking optimization strategies' },
      { icon: 'Target', title: 'Competitor Analysis', text: 'Comprehensive competitor analysis and insights' },
      { icon: 'BarChart3', title: 'Performance Tracking', text: 'Real-time SEO performance monitoring' },
      { icon: 'CheckCircle', title: 'Technical SEO', text: 'CAL™ Technology powered technical optimization' },
      { icon: 'AlertTriangle', title: 'Content Optimization', text: 'Intelligent content optimization recommendations' }
    ],
    pricingKey: 'seo-optimizer-pro'
  },

  'affiliate-portal': {
    id: 'affiliate-portal',
    name: 'Affiliate Portal',
    slug: 'affiliate-portal',
    tagline: 'AI-powered affiliate program management and optimization',
    category: 'business-intelligence',
    gradient: ['from-green-500', 'to-emerald-500'],
    description: 'Build and scale your affiliate program with AI-powered management tools',
    heroText: 'Scale your affiliate program with intelligent automation and analytics',
    metrics: [
      { label: 'Revenue Growth', value: '2.5x', icon: 'BarChart3' },
      { label: 'Partner Retention', value: '85%', icon: 'Users' },
      { label: 'Platforms Supported', value: '50+', icon: 'Globe' },
      { label: 'Support Available', value: '24/7', icon: 'Clock' }
    ],
    features: [
      { icon: 'Users', title: 'Affiliate Management', text: 'Comprehensive tools to manage your affiliate network and partnerships' },
      { icon: 'Rocket', title: 'Commission Tracking', text: 'Real-time tracking of commissions, conversions, and payouts' },
      { icon: 'BarChart3', title: 'Performance Analytics', text: 'Detailed insights into affiliate performance and ROI' },
      { icon: 'Shield', title: 'Fraud Protection', text: 'Advanced fraud detection and prevention systems' },
      { icon: 'Settings', title: 'Automated Payouts', text: 'Automated commission payments and financial management' },
      { icon: 'Globe', title: 'Multi-Platform', text: 'Support for multiple affiliate networks and platforms' }
    ],
    demoLink: '/products/affiliate-portal/demo',
    docsLink: '/products/affiliate-portal/docs',
    pricingKey: 'affiliate-portal'
  },

  // TODO: Add remaining 22 products with extracted data or placeholders
  'content-spawner': {
    id: 'content-spawner',
    name: 'Content Spawner',
    slug: 'content-spawner',
    tagline: 'AI-powered content generation at scale',
    category: 'content-marketing',
    gradient: ['from-blue-500', 'to-purple-500'],
    description: 'Generate unlimited high-quality content with AI',
    heroText: 'Create unlimited content 10x faster with AI-powered generation',
    metrics: [
      { label: 'Content Generated', value: '1M+', icon: 'FileText' },
      { label: 'Languages', value: '40+', icon: 'Globe' },
      { label: 'Templates', value: '500+', icon: 'Layout' },
      { label: 'Active Users', value: '25K+', icon: 'Users' }
    ],
    features: [
      { icon: 'PenTool', title: 'Content Generation', text: 'AI-powered content creation for blogs, social media, and marketing' },
      { icon: 'Zap', title: 'Bulk Processing', text: 'Generate hundreds of articles, posts, and campaigns simultaneously' },
      { icon: 'Target', title: 'SEO Optimization', text: 'Built-in SEO optimization for better search rankings' },
      { icon: 'Globe', title: 'Multi-language', text: 'Generate content in 40+ languages with cultural context' },
      { icon: 'Calendar', title: 'Content Calendar', text: 'Plan and schedule your content across multiple platforms' },
      { icon: 'BarChart3', title: 'Performance Tracking', text: 'Track content performance and engagement metrics' }
    ],
    pricingKey: 'default'
  },

  'auto-rewrite': {
    id: 'auto-rewrite',
    name: 'Auto Rewrite Engine',
    slug: 'auto-rewrite',
    tagline: 'Intelligent content rewriting and optimization',
    category: 'content-marketing',
    gradient: ['from-indigo-500', 'to-purple-500'],
    description: 'Transform existing content with AI-powered rewriting technology',
    heroText: 'Transform any content into multiple variations while preserving meaning',
    metrics: [
      { label: 'Rewrite Accuracy', value: '98%', icon: 'CheckCircle' },
      { label: 'Unique Variations', value: '∞', icon: 'Shuffle' },
      { label: 'Processing Speed', value: '5s', icon: 'Zap' },
      { label: 'Content Saved', value: '500K+', icon: 'Archive' }
    ],
    features: [
      { icon: 'RefreshCw', title: 'Intelligent Rewriting', text: 'AI-powered content rewriting while preserving original meaning' },
      { icon: 'Copy', title: 'Multiple Variations', text: 'Generate unlimited variations of any piece of content' },
      { icon: 'Search', title: 'SEO Enhancement', text: 'Improve SEO potential while rewriting content' },
      { icon: 'BookOpen', title: 'Tone Adjustment', text: 'Adjust tone, style, and reading level to match your audience' },
      { icon: 'FileCheck', title: 'Plagiarism Check', text: 'Built-in plagiarism detection for original content assurance' },
      { icon: 'Globe', title: 'Language Support', text: 'Rewrite content in 30+ languages' }
    ],
    pricingKey: 'default'
  },

  // Additional placeholder products - TODO: Extract real data
  'social-media-manager': {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    slug: 'social-media-manager',
    tagline: 'AI-powered social media management and automation',
    category: 'content-marketing',
    gradient: ['from-pink-500', 'to-rose-500'],
    description: 'Automate and optimize your social media presence across all platforms',
    heroText: 'Automate your social media presence with AI-powered content and scheduling',
    metrics: [
      { label: 'Platforms Supported', value: '15+', icon: 'Globe' },
      { label: 'Posts Scheduled', value: '100K+', icon: 'Calendar' },
      { label: 'Engagement Increase', value: '250%', icon: 'TrendingUp' },
      { label: 'Active Accounts', value: '10K+', icon: 'Users' }
    ],
    features: [
      { icon: 'Calendar', title: 'Smart Scheduling', text: 'AI-optimized posting times for maximum engagement' },
      { icon: 'MessageSquare', title: 'Content Generation', text: 'Generate engaging posts, captions, and hashtags' },
      { icon: 'BarChart3', title: 'Analytics Dashboard', text: 'Comprehensive analytics and performance insights' },
      { icon: 'Users', title: 'Audience Analysis', text: 'Deep audience insights and demographic analysis' },
      { icon: 'Zap', title: 'Auto-Engagement', text: 'Automated likes, comments, and engagement strategies' },
      { icon: 'Image', title: 'Visual Content', text: 'AI-generated images and visual content creation' }
    ],
    pricingKey: 'default'
  },

  // Continue with more products...
  'bundle-builder': {
    id: 'bundle-builder',
    name: 'Bundle Builder',
    slug: 'bundle-builder',
    tagline: 'Create and optimize product bundles with AI',
    category: 'ecommerce-sales',
    gradient: ['from-orange-500', 'to-red-500'],
    description: 'Build high-converting product bundles with AI-powered optimization',
    heroText: 'Increase sales by up to 300% with AI-optimized product bundles',
    metrics: [
      { label: 'Sales Increase', value: '300%', icon: 'TrendingUp' },
      { label: 'Bundle Combinations', value: '∞', icon: 'Package' },
      { label: 'Conversion Rate', value: '45%', icon: 'Target' },
      { label: 'Active Bundles', value: '50K+', icon: 'Box' }
    ],
    features: [
      { icon: 'Package', title: 'Smart Bundling', text: 'AI-powered product bundling based on purchase patterns' },
      { icon: 'BarChart3', title: 'Price Optimization', text: 'Dynamic pricing optimization for maximum profitability' },
      { icon: 'Target', title: 'A/B Testing', text: 'Built-in A/B testing for bundle performance optimization' },
      { icon: 'TrendingUp', title: 'Sales Analytics', text: 'Comprehensive sales analytics and performance tracking' },
      { icon: 'ShoppingCart', title: 'Cart Integration', text: 'Seamless integration with popular e-commerce platforms' },
      { icon: 'Zap', title: 'Real-time Updates', text: 'Real-time bundle updates based on inventory and demand' }
    ],
    pricingKey: 'default'
  },

  'medical-ai-assistant': {
    id: 'medical-ai-assistant',
    name: 'Medical AI Assistant',
    slug: 'medical-ai-assistant',
    tagline: 'AI-powered medical assistance and clinical support',
    category: 'compliance-professional',
    gradient: ['from-green-500', 'to-blue-500'],
    description: 'Advanced medical AI assistant for clinical decision support and patient care',
    heroText: 'Enhance clinical decision-making with AI-powered medical assistance',
    metrics: [
      { label: 'Medical Accuracy', value: '99.5%', icon: 'CheckCircle' },
      { label: 'Conditions Supported', value: '10K+', icon: 'Heart' },
      { label: 'Languages', value: '25+', icon: 'Globe' },
      { label: 'Medical Providers', value: '5K+', icon: 'Users' }
    ],
    features: [
      { icon: 'Stethoscope', title: 'Clinical Decision Support', text: 'Evidence-based clinical decision support for medical professionals' },
      { icon: 'Brain', title: 'Symptom Analysis', text: 'AI-powered symptom analysis and differential diagnosis suggestions' },
      { icon: 'FileText', title: 'Medical Documentation', text: 'Automated medical documentation and report generation' },
      { icon: 'Shield', title: 'HIPAA Compliant', text: 'Full HIPAA compliance with end-to-end encryption' },
      { icon: 'Clock', title: '24/7 Availability', text: 'Round-the-clock medical AI assistance and support' },
      { icon: 'Database', title: 'Medical Knowledge Base', text: 'Access to comprehensive medical knowledge and research' }
    ],
    pricingKey: 'healthcare-ai-compliance'
  }

  // TODO: Add remaining products:
  // - live-dashboard
  // - project-management-pro
  // - time-tracking-ai
  // - email-marketing-suite
  // - content-calendar-pro
  // - lead-generation-pro
  // - ecommerce-optimizer
  // - customer-service-ai
  // - invoice-generator
  // - legal-ai-compliance
  // - financial-ai-compliance
  // - education-ai-compliance
  // - auto-niche-engine
  // - aesthetic-generator
  // - podcast-producer
  // - video-editor-ai
  // etc.
};

export function getProduct(id: string): Product | undefined {
  return products[id];
}

export function getAllProducts(): Product[] {
  return Object.values(products);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return Object.values(products).filter(product => product.category === categoryId);
}