"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBox, 
  FaRocket, 
  FaChartLine, 
  FaShieldAlt, 
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaDownload,
  FaCog,
  FaLightbulb,
  FaUsers,
  FaGlobe,
  FaClock,
  FaStar,
  FaShoppingCart,
  FaTags,
  FaPercent
} from 'react-icons/fa';

export default function BundleBuilder() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: FaBox,
      title: 'Smart Bundle Creation',
      description: 'AI-powered bundle optimization for maximum value and appeal',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaRocket,
      title: 'Instant Publishing',
      description: 'Deploy bundles to multiple platforms with one click',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaChartLine,
      title: 'Analytics Dashboard',
      description: 'Track performance, conversions, and revenue in real-time',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Payments',
      description: 'Integrated payment processing with fraud protection',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: FaCog,
      title: 'Custom Branding',
      description: 'White-label solutions with your brand identity',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: FaGlobe,
      title: 'Multi-Platform',
      description: 'Sell on Gumroad, ClickBank, and custom platforms',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  const useCases = [
    {
      title: 'Digital Products',
      description: 'Create irresistible bundles of ebooks, courses, and software',
      icon: FaShoppingCart,
      examples: ['Course bundles', 'Software packages', 'Ebook collections']
    },
    {
      title: 'Affiliate Marketing',
      description: 'Build high-converting affiliate product bundles',
      icon: FaTags,
      examples: ['Affiliate packages', 'Commission optimization', 'Partner bundles']
    },
    {
      title: 'Membership Sites',
      description: 'Package exclusive content into premium memberships',
      icon: FaUsers,
      examples: ['Premium access', 'Exclusive content', 'VIP packages']
    },
    {
      title: 'Launch Campaigns',
      description: 'Create limited-time bundle offers for product launches',
      icon: FaRocket,
      examples: ['Launch bundles', 'Limited editions', 'Early bird offers']
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Perfect for individual creators',
      features: [
        '5 active bundles',
        'Basic analytics',
        'Gumroad integration',
        'Email support',
        'Standard templates'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'Unlimited bundles',
        'Advanced analytics',
        'Multi-platform integration',
        'Priority support',
        'Custom branding',
        'A/B testing'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$299',
      period: '/month',
      description: 'For large organizations',
      features: [
        'White-label solution',
        'Custom integrations',
        'Dedicated support',
        'Advanced automation',
        'API access',
        'Custom reporting'
      ],
      popular: false
    }
  ];

  const stats = [
    { number: '3.2x', label: 'Higher Conversion', icon: FaChartLine },
    { number: '45%', label: 'Revenue Increase', icon: FaPercent },
    { number: '10+', label: 'Platforms Supported', icon: FaGlobe },
    { number: '24/7', label: 'Availability', icon: FaClock }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaBox className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Bundle
              <span className="block bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Builder™
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Create irresistible product bundles that maximize value and boost sales. 
              AI-powered optimization for the perfect package every time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                onClick={() => setIsDemoOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="w-5 h-5" />
                <span>Try Demo</span>
              </motion.button>

              <motion.button
                className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload className="w-5 h-5" />
                <span>Start Free Trial</span>
              </motion.button>
            </div>

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
              Powerful Bundle Creation
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Everything you need to create, optimize, and sell high-converting product bundles.
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
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group"
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
              Choose the perfect plan for your bundle creation needs.
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
                    ? 'border-blue-500/50 shadow-blue-500/25' 
                    : 'border-zinc-700/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
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

                <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Better Bundles?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join thousands of creators using Bundle Builder™ to maximize their product value and sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Free Trial</span>
                <FaArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-2"
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
                  className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder="Enter bundle name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Products to Bundle</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-zinc-800/60 border border-zinc-600/50 rounded-xl">
                    <input type="checkbox" className="text-blue-500" />
                    <span className="text-zinc-300">Product 1 - $29</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-zinc-800/60 border border-zinc-600/50 rounded-xl">
                    <input type="checkbox" className="text-blue-500" />
                    <span className="text-zinc-300">Product 2 - $49</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-zinc-800/60 border border-zinc-600/50 rounded-xl">
                    <input type="checkbox" className="text-blue-500" />
                    <span className="text-zinc-300">Product 3 - $79</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
                  Create Bundle
                </button>
                <button className="px-6 py-3 border border-zinc-600 text-zinc-300 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-400 transition-all duration-300">
                  Clear
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Bundle Preview</label>
                <div className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white h-32 overflow-y-auto">
                  <p className="text-zinc-400">Your bundle preview will appear here...</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 