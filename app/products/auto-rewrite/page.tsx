"use client"

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import CheckoutButton from '@/app/components/CheckoutButton';
import { apiPost, ensureCsrfCookie } from '@/lib/client/fetch';
import { 
  FaBrain, 
  FaRocket, 
  FaChartLine, 
  FaShieldAlt, 
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaDownload,
  FaCode,
  FaCog,
  FaLightbulb,
  FaUsers,
  FaGlobe,
  FaClock,
  FaStar
} from 'react-icons/fa';
import { 
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineGlobe,
  HiOutlineShieldCheck,
  HiOutlineCog,
  HiOutlineUserGroup,
  HiOutlineClock
} from 'react-icons/hi';
import { 
  Sparkles,
  BookOpen,
  ExternalLink
} from 'lucide-react';

import ProductAccessControl from '@/app/components/ProductAccessControl';

export default function AutoRewriteEngine() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRewriting, setIsRewriting] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [rewrittenContent, setRewrittenContent] = useState('');

  // Nova-style scroll effects
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Checkout function (copied exactly from Nova Protocol CheckoutButton)
  const handleCheckout = async (tierName: string) => {
    try {
      // No authentication required - direct to checkout
      // Ensure we have a CSRF cookie for the API call
      await ensureCsrfCookie();
      
      const resp = await apiPost<{ checkoutUrl: string }>(
        '/api/payments/anonymous-checkout',
        { 
          productId: `auto-rewrite-${tierName.toLowerCase()}`, 
          billingCycle: 'monthly' 
        }
      );

      console.log('CheckoutButton - Full API response:', resp);
      
      const data = (resp?.data as any) || resp;
      console.log('CheckoutButton - Extracted data:', data);

      if ((resp?.success !== false) && data?.checkoutUrl) {
        // Redirect to Stripe checkout
        console.log('CheckoutButton - Redirecting to:', data.checkoutUrl);
        window.location.href = data.checkoutUrl;
      } else {
        console.error('Checkout failed:', (resp as any)?.error);
        console.error('Full response:', resp);
        alert('Failed to initiate checkout. Please try again. Check console for details.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleRewriteContent = async () => {
    if (!originalContent.trim()) {
      alert('Please enter content to rewrite');
      return;
    }

    setIsRewriting(true);
    try {
      const hasAuth = document.cookie.includes('auth_token');
      if (!hasAuth) {
        setRewrittenContent('Please log in to rewrite content.');
        setIsRewriting(false);
        return;
      }

      const response = await fetch('/api/rewrite/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        body: JSON.stringify({
          content: originalContent,
          style: 'professional',
          tone: 'conversational',
          length: 'same',
          audience: 'general audience',
          purpose: 'improve_clarity'
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 'SUBSCRIPTION_REQUIRED') {
          setRewrittenContent('🔒 Auto Rewrite subscription required. Please upgrade to access content rewriting.');
        } else if (data.error?.code === 'USAGE_LIMIT_EXCEEDED') {
          setRewrittenContent('📊 Monthly rewrite limit reached. Please upgrade your plan for more rewrites.');
        } else if (data.error?.code === 'INSUFFICIENT_CREDITS') {
          setRewrittenContent('💰 Insufficient AI credits. Please purchase more credits to continue.');
        } else {
          setRewrittenContent('❌ Error rewriting content. Please try again.');
        }
        return;
      }

      if (data.success && data.data) {
        setRewrittenContent(data.data.rewrittenContent || 'Content rewritten successfully!');
      } else {
        setRewrittenContent('❌ Error rewriting content. Please try again.');
      }
    } catch (error) {
      console.error('Error rewriting content:', error);
      setRewrittenContent('Error rewriting content. Please try again.');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleClear = () => {
    setOriginalContent('');
    setRewrittenContent('');
  };

  const features = [
    {
      icon: FaBrain,
      title: 'CAL™-Powered AI',
      description: 'Advanced Cognitive Architecture Layering for superior content understanding and rewriting',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: HiOutlineLightningBolt,
      title: 'Real-time Processing',
      description: 'Instant content rewriting with sub-second response times',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: HiOutlineShieldCheck,
      title: 'Tone Preservation',
      description: 'Maintains your unique voice while optimizing for engagement',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: HiOutlineChartBar,
      title: 'SEO Optimization',
      description: 'Automatic keyword integration and search engine optimization',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: HiOutlineCog,
      title: 'Bulk Processing',
      description: 'Process thousands of pieces simultaneously with batch operations',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: HiOutlineGlobe,
      title: 'Multi-language Support',
      description: 'Support for 50+ languages with cultural context awareness',
      gradient: 'from-red-500 to-pink-500'
    }
  ];

  const useCases = [
    {
      title: 'Content Marketing',
      description: 'Transform blog posts, social media content, and email campaigns',
      icon: FaUsers,
      examples: ['Blog post optimization', 'Social media content', 'Email campaigns']
    },
    {
      title: 'E-commerce',
      description: 'Optimize product descriptions and marketing copy',
      icon: FaGlobe,
      examples: ['Product descriptions', 'Category pages', 'Marketing copy']
    },
    {
      title: 'Technical Writing',
      description: 'Improve documentation and technical content clarity',
      icon: FaCode,
      examples: ['API documentation', 'User guides', 'Technical blogs']
    },
    {
      title: 'Academic Writing',
      description: 'Enhance research papers and academic content',
      icon: FaLightbulb,
      examples: ['Research papers', 'Theses', 'Academic articles']
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for individuals and small teams',
      features: [
        '1,000 rewrites per month',
        'Basic tone preservation',
        '5 language support',
        'Email support',
        'API access'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        '10,000 rewrites per month',
        'Advanced tone preservation',
        '25 language support',
        'Priority support',
        'Bulk processing',
        'Custom templates'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$299',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Unlimited rewrites',
        'Custom AI training',
        '50+ language support',
        'Dedicated support',
        'White-label options',
        'Custom integrations'
      ],
      popular: false
    }
  ];

  const stats = [
    { number: '98.7%', label: 'Accuracy Rate', icon: FaStar },
    { number: '5x', label: 'Faster Processing', icon: FaRocket },
    { number: '50+', label: 'Languages Supported', icon: FaGlobe },
    { number: '24/7', label: 'Availability', icon: FaClock }
  ];

  return (
    <ProductAccessControl 
      productId="auto-rewrite" 
      productName="Auto Rewrite Engine" 
      requiredPlans={["AUTO_REWRITE","PRO","ENTERPRISE"]}
      demoMode={true}
    >
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"
          style={{ y }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Nova-style Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700/50 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-zinc-300">AI-Powered Content Rewriting</span>
            </motion.div>

            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaBrain className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              AutoRewrite
              <span className="block bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Engine™
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Revolutionary AI-powered content rewriting that maintains your voice while optimizing for engagement, SEO, and conversion rates. Powered by CAL™ technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                onClick={() => setIsDemoOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="w-5 h-5" />
                <span>Try Demo</span>
              </motion.button>

              <motion.button
                className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-purple-500 hover:text-purple-400 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload className="w-5 h-5" />
                <span>Download SDK</span>
              </motion.button>
            </div>

            {/* Quick Navigation */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/products/auto-rewrite/demo">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-full text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay className="w-3 h-3" />
                  <span>Interactive Demo</span>
                </motion.button>
              </Link>
              
              <Link href="/products/auto-rewrite/docs">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-full text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>View Documentation</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-zinc-400 text-sm">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powered by CAL™ Technology
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Our Cognitive Architecture Layering technology ensures superior content understanding and rewriting capabilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-br from-zinc-900/80 to-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Use Cases
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Transform your content across multiple industries and use cases.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{useCase.title}</h3>
                  </div>
                  <p className="text-zinc-400 mb-6">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-center space-x-2 text-zinc-300">
                        <FaCheckCircle className="w-4 h-4 text-green-400" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pricing Plans
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Choose the perfect plan for your content rewriting needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-zinc-900/60 backdrop-blur-xl border rounded-2xl p-8 ${
                  tier.popular 
                    ? 'border-purple-500/50 shadow-purple-500/25' 
                    : 'border-zinc-700/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center space-x-1 mb-4">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-zinc-400">{tier.period}</span>
                  </div>
                  <p className="text-zinc-400">{tier.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <FaCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleCheckout(tier.name)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  Start Subscription
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join thousands of businesses using AutoRewrite Engine™ to create engaging, optimized content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Free Trial</span>
                <FaArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-purple-500 hover:text-purple-400 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Schedule Demo</span>
                <FaPlay className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Modal */}
      {isDemoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsDemoOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">AutoRewrite Engine™ Demo</h3>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Original Content</label>
                <textarea
                  value={originalContent}
                  onChange={(e) => setOriginalContent(e.target.value)}
                  className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-32 resize-none"
                  placeholder="Enter your content to rewrite..."
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleRewriteContent}
                  disabled={isRewriting}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRewriting ? 'Rewriting...' : 'Rewrite Content'}
                </button>
                <button 
                  onClick={handleClear}
                  className="px-6 py-3 border border-zinc-600 text-zinc-300 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-400 transition-all duration-300"
                >
                  Clear
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Rewritten Content</label>
                <div className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white h-32 overflow-y-auto">
                  {rewrittenContent ? (
                    <p className="text-white whitespace-pre-wrap">{rewrittenContent}</p>
                  ) : (
                    <p className="text-zinc-400">Your rewritten content will appear here...</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
    </ProductAccessControl>
  );
} 