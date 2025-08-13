'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  X, 
  Crown, 
  Rocket, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  Users,
  Bot,
  BarChart3,
  Globe,
  CreditCard,
  Sparkles,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  popular?: boolean;
  features: string[];
  limitations?: string[];
  cta: string;
  icon: any;
  gradient: string;
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Perfect for trying out our AI tools',
    price: { monthly: 0, yearly: 0 },
    features: [
      '3 AI tools access',
      '500 AI requests/month',
      'Basic templates',
      'Community support',
      'Email integration',
      'Content Spawner (basic)',
      'Auto Rewrite (limited)',
      'Basic analytics'
    ],
    limitations: [
      'Limited to 3 tools',
      'No priority support',
      'Basic analytics only',
      'No API access'
    ],
    cta: 'Get Started Free',
    icon: Bot,
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Complete AI business suite - all 27 tools included',
    price: { monthly: 497, yearly: 4970 },
    popular: true,
    features: [
      'All 27 AI tools & platforms',
      'Unlimited AI requests',
      'NOVUS Protocol™ access',
      'Content Spawner Pro',
      'Auto Rewrite Engine',
      'Bundle Builder Pro',
      'Affiliate Portal System',
      'Live Dashboard Analytics',
      'SEO Optimizer Pro',
      'Social Media Manager',
      'Email Marketing Suite',
      'Lead Generation Pro',
      'Video Editor AI',
      'Podcast Producer',
      'Time Tracking AI',
      'Project Management Pro',
      'E-commerce Optimizer',
      'Customer Service AI',
      'Invoice Generator',
      'Content Calendar Pro',
      'Quantum AI Processor',
      'Aesthetic Generator',
      'Medical AI Assistant',
      'Priority support',
      'Advanced analytics',
      'API access',
      'Up to 10 team members',
      'Export capabilities'
    ],
    cta: 'Start Pro Trial',
    icon: Rocket,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Everything + compliance & custom solutions',
    price: { monthly: 997, yearly: 9970 },
    features: [
      'Everything in Professional',
      'All compliance tools',
      'Legal AI Compliance',
      'Healthcare AI Compliance',
      'Financial AI Compliance',
      'Education AI Compliance',
      'Unlimited team members',
      'Custom AI models',
      'Dedicated support manager',
      'Advanced security & SOC2',
      'SSO integration',
      'Custom onboarding',
      '99.9% uptime SLA',
      'White-label options',
      'Custom development',
      'Priority feature requests',
      'Advanced automations',
      'Custom integrations',
      'Data residency options',
      'Dedicated infrastructure'
    ],
    cta: 'Contact Sales',
    icon: Crown,
    gradient: 'from-purple-500 to-pink-500'
  }
];

const faqs = [
  {
    question: 'What are the 27 AI tools included?',
    answer: 'Our comprehensive suite includes: Content & Creation (NOVUS Protocol™, Content Spawner, Auto Rewrite, Bundle Builder, Video Editor AI, Podcast Producer, Aesthetic Generator), Marketing & Growth (SEO Optimizer, Social Media Manager, Email Marketing Suite, Lead Generation Pro, Affiliate Portal, Content Calendar Pro, E-commerce Optimizer), Business Operations (Project Management Pro, Time Tracking AI, Customer Service AI, Invoice Generator, Live Dashboard, Quantum AI Processor, Auto Niche Engine), and Compliance & Specialized tools (Legal, Healthcare, Financial, Education AI Compliance, Medical AI Assistant, Prompt Packs Library).'
  },
  {
    question: 'What\'s the difference between Professional and Enterprise?',
    answer: 'Professional ($497/month) includes all 27 AI tools with unlimited usage for up to 10 team members, perfect for growing businesses. Enterprise ($997/month) adds compliance tools, unlimited team members, custom AI models, dedicated support, advanced security, white-label options, and dedicated infrastructure - ideal for large organizations with specific regulatory requirements.'
  },
  {
    question: 'Can I use these tools for my specific industry?',
    answer: 'Absolutely! Our tools are designed for versatility across industries. We include specialized compliance tools for healthcare, legal, financial, and educational sectors. Whether you\'re in e-commerce, consulting, content creation, or any other field, our AI tools adapt to your business needs.'
  },
  {
    question: 'Is there a free trial and what\'s included?',
    answer: 'Yes! The Starter plan is free forever with 3 AI tools and 500 requests/month. Professional and Enterprise plans include a 14-day free trial with full access to all 27 tools. No credit card required for the free plan.'
  },
  {
    question: 'What kind of support and training do you provide?',
    answer: 'Starter users get community support and documentation. Professional users get priority email support with 24-hour response times plus video tutorials. Enterprise users get a dedicated support manager, phone support, custom onboarding, training sessions, and 99.9% uptime SLA guarantees.'
  },
  {
    question: 'Can I integrate these tools with my existing workflow?',
    answer: 'Yes! Professional and Enterprise plans include API access, webhooks, and integrations with popular tools. Enterprise plans also offer custom integrations, SSO, and white-label options to seamlessly fit into your existing business infrastructure.'
  }
];

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const hasAuth = document.cookie.includes('auth_token=');
        if (hasAuth) {
          const response = await fetch('/api/users/me', { credentials: 'include' });
          if (response.ok) {
            const data = await response.json();
            setUser(data?.data || data?.user || data);
          }
        }
      } catch (error) {
        // Silent fail - user not authenticated
      }
    };
    checkAuth();
  }, []);

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth/register');
      }
    } else if (planId === 'enterprise') {
      router.push('/contact');
    } else {
      if (user) {
        // Handle subscription upgrade
        router.push('/dashboard/subscription');
      } else {
        router.push(`/auth/register?plan=${planId}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              27 AI Tools, One
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                Simple Price
              </span>
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-3xl mx-auto">
              Access our complete suite of 27 AI-powered business tools. From content creation to compliance management, 
              everything you need to scale your business with artificial intelligence.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center mb-16"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-2 flex items-center gap-2">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Yearly
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative bg-zinc-900/50 border rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/20' 
                    : 'border-zinc-800 hover:border-zinc-700'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-zinc-400 mb-6">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-zinc-400">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  
                  {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                    <p className="text-green-400 text-sm mt-2">
                      Save ${(plan.price.monthly * 12) - plan.price.yearly}/year
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations?.map((limitation, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-500">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete AI Business Suite
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              27 specialized AI tools organized into 4 comprehensive categories. 
              Everything you need to build, market, and scale your business with artificial intelligence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <Bot className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Content & Creation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">NOVUS Protocol™</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Content Spawner</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Auto Rewrite Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Bundle Builder Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Video Editor AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Podcast Producer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Aesthetic Generator</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <BarChart3 className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Marketing & Growth</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">SEO Optimizer Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Social Media Manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Email Marketing Suite</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Lead Generation Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Affiliate Portal System</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Content Calendar Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">E-commerce Optimizer</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <Globe className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Business Operations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Project Management Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Time Tracking AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Customer Service AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Invoice Generator</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Live Dashboard Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Quantum AI Processor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Auto Niche Engine</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <Shield className="w-8 h-8 text-red-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Compliance & Specialized</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Legal AI Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Healthcare AI Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Financial AI Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Education AI Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Medical AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-zinc-300">Prompt Packs Library</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-zinc-400">
              Everything you need to know about our pricing and plans.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="text-white font-semibold">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-zinc-400 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Justification Section */}
      <section className="py-20 px-4 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why This Investment Makes Sense
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Compare the cost of building these capabilities in-house or buying individual tools separately
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Individual Tool Costs</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Content AI Tools</span>
                  <span className="text-white">$200/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Marketing Suite</span>
                  <span className="text-white">$300/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Project Management</span>
                  <span className="text-white">$150/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Compliance Tools</span>
                  <span className="text-white">$400/month</span>
                </div>
                <div className="border-t border-zinc-700 pt-3 flex justify-between font-semibold">
                  <span className="text-white">Separate Total</span>
                  <span className="text-red-400">$1,050+/month</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Development Costs</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">AI Engineers (2)</span>
                  <span className="text-white">$30,000/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Full-stack Developers (3)</span>
                  <span className="text-white">$25,000/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Infrastructure & APIs</span>
                  <span className="text-white">$5,000/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Time to Build</span>
                  <span className="text-white">12-18 months</span>
                </div>
                <div className="border-t border-zinc-700 pt-3 flex justify-between font-semibold">
                  <span className="text-white">Monthly Cost</span>
                  <span className="text-red-400">$60,000+/month</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Omnipreneur Professional</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">All 27 AI Tools</span>
                  <span className="text-green-400">✓ Included</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Unlimited Usage</span>
                  <span className="text-green-400">✓ Included</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Ready Today</span>
                  <span className="text-green-400">✓ Instant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Support & Updates</span>
                  <span className="text-green-400">✓ Included</span>
                </div>
                <div className="border-t border-blue-500/30 pt-3 flex justify-between font-semibold">
                  <span className="text-white">Total Cost</span>
                  <span className="text-green-400">$497/month</span>
                </div>
                <div className="text-center pt-2">
                  <span className="text-green-400 font-bold">Save 95%+ vs Building</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to transform your business?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join thousands of entrepreneurs using our AI tools to scale their businesses. 
              Start free, no credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handlePlanSelect('free')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Free Today
              </button>
              
              <Link
                href="/contact"
                className="px-8 py-4 border border-zinc-600 text-zinc-300 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-400 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}