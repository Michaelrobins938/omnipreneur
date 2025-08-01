"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaChartLine, 
  FaShieldAlt, 
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaDownload,
  FaUsers,
  FaGlobe,
  FaClock,
  FaStar,
  FaLightbulb,
  FaBullseye,
  FaCog
} from 'react-icons/fa';
import { 
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineGlobe,
  HiOutlineShieldCheck,
  HiOutlineCog,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineFire
} from 'react-icons/hi';

export default function ContentSpawner() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: HiOutlineFire,
      title: 'Viral Content Generation',
      description: 'Generate 100+ viral pieces with AI that understands trending topics and viral mechanics',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: HiOutlineChartBar,
      title: 'Audience Targeting',
      description: 'Precise audience segmentation and content optimization for maximum engagement',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: HiOutlineChartBar,
      title: 'Trend Analysis',
      description: 'Real-time trend detection and content adaptation for maximum virality',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: HiOutlineGlobe,
      title: 'Multi-platform Optimization',
      description: 'Optimize content for Instagram, Twitter, LinkedIn, TikTok, and more',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: HiOutlineChartBar,
      title: 'Performance Tracking',
      description: 'Advanced analytics and A/B testing to maximize content performance',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: HiOutlineLightningBolt,
      title: 'Instant Generation',
      description: 'Generate hundreds of pieces in seconds with our lightning-fast AI',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  const contentTypes = [
    {
      title: 'Social Media Posts',
      description: 'Engaging posts for all major platforms',
      icon: FaUsers,
      examples: ['Instagram posts', 'Twitter threads', 'LinkedIn articles', 'TikTok scripts']
    },
    {
      title: 'Blog Content',
      description: 'SEO-optimized articles and blog posts',
      icon: FaGlobe,
      examples: ['Long-form articles', 'SEO content', 'Guest posts', 'Newsletters']
    },
    {
      title: 'Video Scripts',
      description: 'Scripts for YouTube, TikTok, and other video platforms',
      icon: FaPlay,
      examples: ['YouTube scripts', 'TikTok videos', 'Instagram Reels', 'Educational content']
    },
    {
      title: 'Email Campaigns',
      description: 'High-converting email sequences and campaigns',
      icon: FaChartLine,
      examples: ['Welcome sequences', 'Newsletter content', 'Promotional emails', 'Drip campaigns']
    }
  ];

  const pricingTiers = [
    {
      name: 'Creator',
      price: '$99',
      period: '/month',
      description: 'Perfect for content creators and influencers',
      features: [
        '100 viral pieces per month',
        '5 content types',
        'Basic trend analysis',
        'Email support',
        'API access'
      ],
      popular: false
    },
    {
      name: 'Agency',
      price: '$299',
      period: '/month',
      description: 'Ideal for marketing agencies and teams',
      features: [
        '1,000 viral pieces per month',
        'All content types',
        'Advanced analytics',
        'Priority support',
        'White-label options',
        'Team collaboration'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$799',
      period: '/month',
      description: 'For large organizations and brands',
      features: [
        'Unlimited viral pieces',
        'Custom AI training',
        'Dedicated support',
        'Custom integrations',
        'Advanced analytics',
        'SLA guarantees'
      ],
      popular: false
    }
  ];

  const stats = [
    { number: '100+', label: 'Viral Pieces', icon: FaRocket },
    { number: '15x', label: 'Faster Creation', icon: FaLightbulb },
    { number: '50+', label: 'Content Types', icon: FaCog },
    { number: '24/7', label: 'Generation', icon: FaClock }
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
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <HiOutlineFire className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Content
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Spawner™
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Generate 100+ viral pieces with AI that understands trending topics, audience psychology, and viral mechanics. Create content that spreads like wildfire.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                onClick={() => setIsDemoOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="w-5 h-5" />
                <span>Try Demo</span>
              </motion.button>

              <motion.button
                className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload className="w-5 h-5" />
                <span>Download SDK</span>
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
              Viral Content Engine
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Our AI understands what makes content go viral and generates pieces that are designed to spread.
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
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 group"
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
              Choose the perfect plan for your viral content generation needs.
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
                    ? 'border-orange-500/50 shadow-orange-500/25' 
                    : 'border-zinc-700/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
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
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
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
      <section className="py-20 bg-gradient-to-br from-orange-500/10 to-red-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Go Viral?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join thousands of creators using Content Spawner™ to create viral content that spreads like wildfire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Free Trial</span>
                <FaArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-300 flex items-center justify-center space-x-2"
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
                  <select className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300">
                    <option>Instagram Post</option>
                    <option>Twitter Thread</option>
                    <option>LinkedIn Article</option>
                    <option>TikTok Script</option>
                    <option>Blog Post</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Topic/Niche</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="e.g., fitness, technology, cooking..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Keywords/Tags</label>
                <input
                  type="text"
                  className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  placeholder="Enter keywords separated by commas..."
                />
              </div>
              
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                  Generate Viral Content
                </button>
                <button className="px-6 py-3 border border-zinc-600 text-zinc-300 rounded-xl font-semibold hover:border-orange-500 hover:text-orange-400 transition-all duration-300">
                  Clear
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Generated Content</label>
                <div className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white h-48 overflow-y-auto">
                  <p className="text-zinc-400">Your viral content will appear here...</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 