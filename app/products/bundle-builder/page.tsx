"use client"

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { apiPost, ensureCsrfCookie } from '@/lib/client/fetch';
import ProductAccessControl from '@/app/components/ProductAccessControl';
import Link from 'next/link';
import { 
  Package, 
  Rocket, 
  BarChart3, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Settings,
  Lightbulb,
  Users,
  Globe,
  Clock,
  Star,
  ShoppingCart,
  Tag,
  Percent,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  Zap,
  DollarSign,
  Plus,
  Minus,
  Gift,
  Eye,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { FaCheckCircle } from 'react-icons/fa';

export default function BundleBuilder() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreating, setIsCreating] = useState(false);
  const [bundleName, setBundleName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bundlePreview, setBundlePreview] = useState('');
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
          productId: `bundle-builder-${tierName.toLowerCase()}`, 
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

  const products = [
    { id: 'product1', name: 'Digital Planner Template', price: 29 },
    { id: 'product2', name: 'Productivity Course', price: 49 },
    { id: 'product3', name: 'Goal Setting Workbook', price: 79 }
  ];

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCreateBundle = async () => {
    if (!bundleName.trim() || selectedProducts.length === 0) {
      alert('Please enter a bundle name and select at least one product');
      return;
    }

    setIsCreating(true);
    try {
      const hasAuth = typeof document !== 'undefined' && document.cookie.includes('auth_token=');
      if (!hasAuth) {
        setBundlePreview('Please log in to create bundles.');
        setIsCreating(false);
        return;
      }

      const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
      const totalValue = selectedProductsData.reduce((sum, p) => sum + p.price, 0);
      const bundlePrice = Math.floor(totalValue * 0.75); // 25% discount
      const discount = Math.round(((totalValue - bundlePrice) / totalValue) * 100);

      const response = await fetch('/api/bundles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          name: bundleName,
          description: `Complete ${bundleName} bundle with ${selectedProducts.length} premium products for productivity and growth`,
          products: selectedProductsData.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            type: 'digital',
            content: `Premium ${p.name} - A comprehensive resource designed to boost your productivity and achieve your goals faster.`
          })),
          pricing: {
            individual: totalValue,
            bundle: bundlePrice,
            discount: discount
          },
          category: 'productivity',
          tags: ['productivity', 'digital-bundle', 'templates', 'courses'],
          targetAudience: 'Productivity enthusiasts and entrepreneurs',
          marketplaces: ['gumroad', 'etsy']
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 'SUBSCRIPTION_REQUIRED') {
          setBundlePreview('🔒 Bundle Builder subscription required. Please upgrade to create digital bundles.');
        } else if (data.error?.code === 'USAGE_LIMIT_EXCEEDED') {
          setBundlePreview('📊 Monthly bundle limit reached. Please upgrade your plan for more bundles.');
        } else {
          setBundlePreview('❌ Error creating bundle. Please try again.');
        }
        return;
      }

      if (data.success && data.data) {
        setBundlePreview(`✅ Bundle Created Successfully!

📦 Bundle: ${data.data.name}
💰 Bundle Price: $${data.data.pricing.bundle} (was $${data.data.pricing.individual})
🎯 Discount: ${discount}% OFF
📁 Products: ${data.data.productCount} items
📊 ZIP Size: ${Math.round(data.data.zipSize / 1024)} KB
🔗 Download: Ready for download

🎉 WHAT YOU GET:
• Complete ZIP bundle with all products
• Professional marketing materials
• Marketplace listing templates  
• Commercial use license
• Step-by-step launch guide

📈 MARKETING MATERIALS INCLUDED:
• Product descriptions
• Sales copy templates
• Email campaign templates
• Social media posts
• Gumroad & Etsy listings

🚀 Your bundle is ready to launch on any marketplace!`);
      } else {
        setBundlePreview('❌ Unexpected response format. Please try again.');
      }
    } catch (error) {
      console.error('Error creating bundle:', error);
      setBundlePreview('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClear = () => {
    setBundleName('');
    setSelectedProducts([]);
    setBundlePreview('');
  };

  const features = [
    {
      icon: <Package className="w-6 h-6" />,
      title: 'Smart Bundle Creation',
      description: 'AI-powered bundle optimization for maximum value and appeal'
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: 'Instant Publishing',
      description: 'Deploy bundles to multiple platforms with one click'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics Dashboard',
      description: 'Track performance, conversions, and revenue in real-time'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Payments',
      description: 'Integrated payment processing with fraud protection'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Custom Branding',
      description: 'White-label solutions with your brand identity'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multi-Platform',
      description: 'Sell on Gumroad, ClickBank, and custom platforms'
    }
  ];

  const stats = [
    { label: "Bundle Conversion Rate", value: "3.2x", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Revenue Increase", value: "45%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Platforms Supported", value: "10+", icon: <Globe className="w-5 h-5" /> },
    { label: "Active Users", value: "25K+", icon: <Users className="w-5 h-5" /> }
  ];

  const useCases = [
    {
      title: 'Digital Product Creators',
      description: 'Perfect for course creators, template designers, and digital asset sellers looking to maximize their product value.',
      icon: ShoppingCart,
      examples: [
        'Bundle courses with workbooks and templates',
        'Package design assets with commercial licenses', 
        'Combine multiple digital tools into value packs',
        'Create seasonal product collections'
      ]
    },
    {
      title: 'Marketing Agencies',
      description: 'Streamline client offerings with professional bundle packages that deliver comprehensive solutions.',
      icon: Target,
      examples: [
        'Social media management packages',
        'Complete branding and identity bundles',
        'Marketing audit and strategy combinations',
        'Multi-platform advertising solutions'
      ]
    },
    {
      title: 'E-commerce Businesses',
      description: 'Increase average order value and customer satisfaction with intelligent product bundling strategies.',
      icon: Package,
      examples: [
        'Complementary product combinations',
        'Seasonal gift packages and collections',
        'Bulk purchasing incentive bundles',
        'Cross-category value propositions'
      ]
    },
    {
      title: 'Software Companies',
      description: 'Create compelling software packages that combine multiple tools, features, or service tiers.',
      icon: Settings,
      examples: [
        'SaaS tool integration packages',
        'Premium feature combinations',
        'Multi-license family plans',
        'Enterprise solution bundles'
      ]
    }
  ];

  return (
    <ProductAccessControl
      productId="bundle-builder"
      productName="Bundle Builder"
      requiredPlans={['BUNDLE_BUILDER', 'PRO', 'ENTERPRISE']}
      demoMode={true}
    >
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"
          style={{ y }}
        />
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Bundle Intelligence
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Bundle Builder
              <span className="block bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Smart Packaging AI
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Create irresistible product bundles with AI-powered optimization. Maximize value, boost conversions, and automate your entire bundling strategy.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/products/bundle-builder/demo">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Try Bundle Builder
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href="/products/bundle-builder/docs">
                <motion.button
                  className="px-8 py-4 border border-zinc-700 text-zinc-300 rounded-full font-semibold text-lg hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Documentation
                </motion.button>
              </Link>
            </motion.div>

            {/* Quick Navigation */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/products/bundle-builder/demo">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-full text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-3 h-3" />
                  <span>Interactive Demo</span>
                </motion.button>
              </Link>
              
              <Link href="/products/bundle-builder/docs">
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
              AI-Powered Bundle Intelligence
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Create high-converting product bundles with intelligent optimization, automated pricing, and seamless multi-platform deployment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 mr-4">
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
              Experience Bundle Builder in Action
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
              Try our AI-powered bundle creation system with real-time optimization and instant marketplace deployment.
            </p>
            
            {/* Demo Preview */}
            <motion.div
              className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/20 rounded-2xl p-8 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">3.2x</div>
                  <div className="text-sm text-zinc-400">Higher Conversion</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">45%</div>
                  <div className="text-sm text-zinc-400">Revenue Increase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 mb-2">10+</div>
                  <div className="text-sm text-zinc-400">Platform Support</div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-zinc-300 mb-6">
                  📦 Smart Bundling • 💰 Price Optimization • 🚀 Auto-Deploy
                </p>
                
                <Link href="/products/bundle-builder/demo">
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
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
                <Brain className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">AI Bundle Optimization</h3>
                <p className="text-zinc-400 text-sm">
                  Watch as our AI analyzes your products and creates perfect bundles with optimal pricing and positioning.
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
                  Get real-time insights on bundle performance, conversion rates, and revenue optimization opportunities.
                </p>
              </motion.div>
            </div>
          </motion.div>
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
              Perfect for creators, marketers, and businesses looking to maximize their product value.
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
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
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
              Start building profitable bundles today with our flexible pricing plans.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $49<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  5 active bundles
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Basic analytics
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Email support
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('Starter')}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                Start Subscription
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-xl p-8 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $99<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Unlimited bundles
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Advanced analytics
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Multi-platform integration
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Priority support
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('Pro')}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                Start Subscription
              </button>
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
                $299<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Everything in Pro
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  White-label solution
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  API access
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Dedicated support
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
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Build Profitable Bundles?
          </motion.h2>
          <motion.p
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join 25,000+ creators who have revolutionized their product sales with AI-powered bundle optimization.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <button
              onClick={() => handleCheckout('Pro')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              <span>Start Subscription</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
              <h3 className="text-2xl font-bold text-white">Bundle Builder™ Demo</h3>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Bundle Name</label>
                <input
                  type="text"
                  value={bundleName}
                  onChange={(e) => setBundleName(e.target.value)}
                  className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder="Enter bundle name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Products to Bundle</label>
                <div className="space-y-2">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 p-3 bg-zinc-800/60 border border-zinc-600/50 rounded-xl">
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductToggle(product.id)}
                        className="text-blue-500" 
                      />
                      <span className="text-zinc-300">{product.name} - ${product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleCreateBundle}
                  disabled={isCreating}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create Bundle'}
                </button>
                <button 
                  onClick={handleClear}
                  className="px-6 py-3 border border-zinc-600 text-zinc-300 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
                >
                  Clear
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Bundle Preview</label>
                <div className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white h-32 overflow-y-auto">
                  {bundlePreview ? (
                    <p className="text-white whitespace-pre-wrap">{bundlePreview}</p>
                  ) : (
                    <p className="text-zinc-400">Your bundle preview will appear here...</p>
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