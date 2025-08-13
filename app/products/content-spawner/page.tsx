"use client"

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import CheckoutButton from '@/app/components/CheckoutButton';
import { apiPost, ensureCsrfCookie } from '@/lib/client/fetch';
import ProductAccessControl from '@/app/components/ProductAccessControl';
import { 
  Sparkles,
  BookOpen,
  ExternalLink,
  Flame,
  Zap,
  BarChart3,
  Globe,
  Shield,
  Settings,
  Users,
  Clock,
  Star,
  Lightbulb,
  Target,
  Play,
  Download,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Brain,
  MessageSquare,
  FileText,
  Video,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Hash,
  Eye,
  Heart,
  Share2,
  AlertCircle,
  Rocket
} from 'lucide-react';

export default function ContentSpawner() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState('SOCIAL');
  const [niche, setNiche] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

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
          productId: `content-spawner-${tierName.toLowerCase()}`, 
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

  const handleGenerateContent = async () => {
    if (!niche.trim()) {
      alert('Please enter a topic/niche');
      return;
    }

    setIsGenerating(true);
    try {
      const hasAuth = document.cookie.includes('auth_token');
      if (!hasAuth) {
        setGeneratedContent('Please log in to generate content.');
        setIsGenerating(false);
        return;
      }

      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        body: JSON.stringify({
          niche: niche,
          contentType: contentType,
          tone: 'inspirational',
          platform: 'general',
          keywords: keywords,
          targetAudience: 'entrepreneurs and creators',
          contentGoal: 'engagement',
          quantity: 5
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 'SUBSCRIPTION_REQUIRED') {
          setGeneratedContent('🔒 Content Spawner subscription required. Please upgrade to access AI content generation.');
        } else if (data.error?.code === 'USAGE_LIMIT_EXCEEDED') {
          setGeneratedContent('📊 Monthly content generation limit reached. Please upgrade your plan for more content.');
        } else {
          setGeneratedContent('❌ Error generating content. Please try again.');
        }
        return;
      }

      if (data.success && data.data && data.data.content) {
        let formattedContent = '🔥 VIRAL CONTENT GENERATED:\n\n';
        
        data.data.content.forEach((piece, index) => {
          formattedContent += `📝 CONTENT ${index + 1}:\n`;
          formattedContent += `${piece.text}\n`;
          if (piece.hashtags && piece.hashtags.length > 0) {
            formattedContent += `\n📱 HASHTAGS: ${piece.hashtags.join(' ')}\n`;
          }
          formattedContent += `📊 VIRAL SCORE: ${Math.round(piece.viralScore * 100)}%\n`;
          formattedContent += `💬 ENGAGEMENT SCORE: ${Math.round(piece.engagementScore * 100)}%\n\n`;
          formattedContent += '─'.repeat(50) + '\n\n';
        });

        if (data.data.metrics) {
          formattedContent += '📈 OVERALL METRICS:\n';
          formattedContent += `• Total Generated: ${data.data.metrics.totalGenerated} pieces\n`;
          formattedContent += `• Avg Viral Score: ${Math.round(data.data.metrics.avgViralScore * 100)}%\n`;
          formattedContent += `• Avg Engagement: ${Math.round(data.data.metrics.avgEngagementScore * 100)}%\n`;
          formattedContent += `• Platform Optimization: ${Math.round(data.data.metrics.platformOptimization * 100)}%\n\n`;
        }

        if (data.data.suggestions && data.data.suggestions.length > 0) {
          formattedContent += '💡 OPTIMIZATION SUGGESTIONS:\n';
          data.data.suggestions.forEach((suggestion, index) => {
            formattedContent += `${index + 1}. ${suggestion}\n`;
          });
          formattedContent += '\n';
        }

        if (data.data.usage) {
          formattedContent += `📊 USAGE: ${data.data.usage.current}/${data.data.usage.limit === -1 ? '∞' : data.data.usage.limit} (${data.data.usage.remaining === -1 ? '∞' : data.data.usage.remaining} remaining)`;
        }

        setGeneratedContent(formattedContent);
      } else {
        setGeneratedContent('❌ Unexpected response format. Please try again.');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setNiche('');
    setKeywords('');
    setGeneratedContent('');
    setContentType('SOCIAL');
  };

  const features = [
    {
      icon: <Flame className="w-6 h-6" />,
      title: 'Viral Content Generation',
      description: 'Generate 100+ viral pieces with AI that understands trending topics and viral mechanics'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Audience Targeting',
      description: 'Precise audience segmentation and content optimization for maximum engagement'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Trend Analysis',
      description: 'Real-time trend detection and content adaptation for maximum virality'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multi-platform Optimization',
      description: 'Optimize content for Instagram, Twitter, LinkedIn, TikTok, and more'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Performance Tracking',
      description: 'Advanced analytics and A/B testing to maximize content performance'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Generation',
      description: 'Generate hundreds of pieces in seconds with our lightning-fast AI'
    }
  ];

  const stats = [
    { label: "Viral Content Rate", value: "97.3%", icon: <Flame className="w-5 h-5" /> },
    { label: "Faster Creation", value: "15x", icon: <Zap className="w-5 h-5" /> },
    { label: "Content Types", value: "50+", icon: <Settings className="w-5 h-5" /> },
    { label: "Active Creators", value: "100K+", icon: <Users className="w-5 h-5" /> }
  ];

  const contentTypes = [
    {
      title: 'Social Media Posts',
      description: 'Engaging posts for all major platforms',
      icon: Users,
      examples: ['Instagram posts', 'Twitter threads', 'LinkedIn articles', 'TikTok scripts']
    },
    {
      title: 'Blog Content',
      description: 'SEO-optimized articles and blog posts',
      icon: Globe,
      examples: ['Long-form articles', 'SEO content', 'Guest posts', 'Newsletters']
    },
    {
      title: 'Video Scripts',
      description: 'Scripts for YouTube, TikTok, and other video platforms',
      icon: Play,
      examples: ['YouTube scripts', 'TikTok videos', 'Instagram Reels', 'Educational content']
    },
    {
      title: 'Email Campaigns',
      description: 'High-converting email sequences and campaigns',
      icon: BarChart3,
      examples: ['Welcome sequences', 'Newsletter content', 'Promotional emails', 'Drip campaigns']
    }
  ];

  return (
    <ProductAccessControl 
      productId="content-spawner" 
      productName="Content Spawner" 
      requiredPlans={["CONTENT_SPAWNER","PRO","ENTERPRISE"]}
      demoMode={true}
    >
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-red-900/20"
          style={{ y }}
        />
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Viral Content Engine
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Content Spawner
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Viral AI Generator
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Generate 100+ viral pieces with AI that understands trending topics, audience psychology, and viral mechanics. Create content that spreads like wildfire.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/products/content-spawner/demo">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Try Content Spawner
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href="/products/content-spawner/docs">
                <motion.button
                  className="px-8 py-4 border border-zinc-700 text-zinc-300 rounded-full font-semibold text-lg hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Documentation
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              AI-Powered Viral Content Engine
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Advanced artificial intelligence that understands viral mechanics, trending topics, and audience psychology to create content that spreads naturally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Demo CTA Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Experience Viral Content Generation
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
              Try our AI-powered viral content generator with real-time trend analysis and engagement optimization.
            </p>
            
            {/* Demo Preview */}
            <motion.div
              className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-500/10 border border-orange-500/20 rounded-2xl p-8 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">97.3%</div>
                  <div className="text-sm text-zinc-400">Viral Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">15x</div>
                  <div className="text-sm text-zinc-400">Faster Creation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">100K+</div>
                  <div className="text-sm text-zinc-400">Active Creators</div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-zinc-300 mb-6">
                  🔥 Viral Mechanics • 🎯 Audience Targeting • 📈 Trend Analysis
                </p>
                
                <Link href="/products/content-spawner/demo">
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5" />
                    <span>Launch Interactive Demo</span>
                    <Sparkles className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            {/* Features Preview */}
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <motion.div
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Brain className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Viral Intelligence</h3>
                <p className="text-zinc-400 text-sm">
                  Watch as our AI analyzes viral patterns and creates content designed to maximize engagement and sharing.
                </p>
              </motion.div>
              
              <motion.div
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <BarChart3 className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Performance Analytics</h3>
                <p className="text-zinc-400 text-sm">
                  Get real-time insights on content performance, viral potential, and optimization recommendations.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="py-20 bg-gradient-to-br from-zinc-900/80 to-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Content Types
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Generate viral content across all major platforms and formats.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contentTypes.map((contentType, index) => {
              const Icon = contentType.icon;
              return (
                <motion.div
                  key={contentType.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{contentType.title}</h3>
                  </div>
                  <p className="text-zinc-400 mb-6">{contentType.description}</p>
                  <ul className="space-y-2">
                    {contentType.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-center space-x-2 text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
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
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Start creating viral content today with our flexible pricing plans.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Creator Plan */}
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Creator</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $99<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  100 viral pieces per month
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  5 content types
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Basic trend analysis
                </li>
              </ul>
              <CheckoutButton
                productName="Content Spawner Creator"
                productId="content-spawner-creator"
                price={{
                  monthly: 99,
                  yearly: 990
                }}
                features={[
                  "100 viral pieces per month",
                  "5 content types",
                  "Basic trend analysis",
                  "Email support",
                  "API access"
                ]}
                className="w-full"
                variant="secondary"
              />
            </motion.div>

            {/* Agency Plan */}
            <motion.div
              className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-500/50 rounded-xl p-8 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Agency</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $299<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  1,000 viral pieces per month
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  All content types
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Advanced analytics
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Priority support
                </li>
              </ul>
              <CheckoutButton
                productName="Content Spawner Agency"
                productId="content-spawner-agency"
                price={{
                  monthly: 299,
                  yearly: 2990
                }}
                features={[
                  "1,000 viral pieces per month",
                  "All content types",
                  "Advanced analytics",
                  "Priority support",
                  "White-label options",
                  "Team collaboration"
                ]}
                className="w-full"
                variant="primary"
              />
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $799<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Unlimited viral pieces
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Custom AI training
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Dedicated support
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Custom integrations
                </li>
              </ul>
              <button className="w-full px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-900/20 to-red-900/20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Go Viral?
          </motion.h2>
          <motion.p
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join 100,000+ creators who have revolutionized their content strategy with AI-powered viral generation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <CheckoutButton
              productName="Content Spawner"
              productId="content-spawner"
              price={{
                monthly: 299,
                yearly: 2990
              }}
              features={[
                "AI-powered viral content",
                "Trend analysis & optimization",
                "Multi-platform generation",
                "Performance analytics",
                "Advanced targeting",
                "Priority support"
              ]}
              variant="secondary"
            />
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
              <h3 className="text-2xl font-bold text-white">Content Spawner™ Demo</h3>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Content Type</label>
                  <select 
                    value={contentType} 
                    onChange={(e) => setContentType(e.target.value)} 
                    className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  >
                    <option value="SOCIAL">Instagram Post</option>
                    <option value="SOCIAL">Twitter Thread</option>
                    <option value="BLOG">LinkedIn Article</option>
                    <option value="VIDEO">TikTok Script</option>
                    <option value="BLOG">Blog Post</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Topic/Niche</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="e.g., fitness, technology, cooking..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Keywords/Tags</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  placeholder="Enter keywords separated by commas..."
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleGenerateContent}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate Viral Content'}
                </button>
                <button 
                  onClick={handleClear}
                  className="px-6 py-3 border border-zinc-600 text-zinc-300 rounded-xl font-semibold hover:border-orange-500 hover:text-orange-400 transition-all duration-300"
                >
                  Clear
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Generated Content</label>
                <div className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white h-48 overflow-y-auto">
                  {generatedContent ? (
                    <p className="text-white whitespace-pre-wrap">{generatedContent}</p>
                  ) : (
                    <p className="text-zinc-400">Your viral content will appear here...</p>
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