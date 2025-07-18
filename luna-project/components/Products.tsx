'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check, Star, Zap, TrendingUp, Users, BarChart3, Package, MessageSquare, Globe } from 'lucide-react'

const products = [
  {
    id: 'novus-protocol',
    name: 'NOVUS Protocol',
    tagline: 'AI Prompt Optimizer',
    description: 'Revolutionary AI prompt engineering that transforms your ideas into optimized, high-converting content with unprecedented accuracy.',
    icon: Star,
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Advanced prompt engineering',
      'Real-time optimization',
      'Multi-language support',
      'Performance analytics',
      'Custom templates',
      'API integration'
    ],
    stats: {
      accuracy: '99.2%',
      speed: '10x faster',
      users: '50K+'
    },
    price: 'From $29/month'
  },
  {
    id: 'auto-rewrite',
    name: 'AutoRewrite Engine',
    tagline: 'Content Refinement',
    description: 'Intelligent content rewriting that maintains your voice while optimizing for engagement, SEO, and conversion rates.',
    icon: Zap,
    gradient: 'from-cyan-500 to-blue-500',
    features: [
      'Smart content rewriting',
      'SEO optimization',
      'Tone preservation',
      'Plagiarism detection',
      'Bulk processing',
      'Version control'
    ],
    stats: {
      accuracy: '98.7%',
      speed: '5x faster',
      users: '75K+'
    },
    price: 'From $49/month'
  },
  {
    id: 'bundle-builder',
    name: 'Bundle Builder',
    tagline: 'Product Packaging',
    description: 'Create premium digital products and courses with AI-powered packaging, pricing optimization, and marketing automation.',
    icon: Package,
    gradient: 'from-green-500 to-emerald-500',
    features: [
      'AI-powered packaging',
      'Pricing optimization',
      'Marketing automation',
      'Sales funnel builder',
      'Analytics dashboard',
      'Customer segmentation'
    ],
    stats: {
      accuracy: '97.5%',
      speed: '8x faster',
      users: '25K+'
    },
    price: 'From $79/month'
  },
  {
    id: 'content-spawner',
    name: 'Content Spawner',
    tagline: 'Viral Content Generator',
    description: 'Generate 100+ viral pieces with AI that understands trending topics, audience psychology, and viral mechanics.',
    icon: TrendingUp,
    gradient: 'from-orange-500 to-red-500',
    features: [
      'Viral content generation',
      'Trend analysis',
      'Audience targeting',
      'Multi-platform optimization',
      'Performance tracking',
      'A/B testing'
    ],
    stats: {
      accuracy: '96.8%',
      speed: '15x faster',
      users: '100K+'
    },
    price: 'From $99/month'
  },
  {
    id: 'live-dashboard',
    name: 'Live Dashboard',
    tagline: 'Analytics & Tracking',
    description: 'Real-time analytics and insights with predictive modeling, automated reporting, and actionable recommendations.',
    icon: BarChart3,
    gradient: 'from-indigo-500 to-purple-500',
    features: [
      'Real-time analytics',
      'Predictive modeling',
      'Automated reporting',
      'Custom dashboards',
      'Data visualization',
      'Alert system'
    ],
    stats: {
      accuracy: '99.5%',
      speed: 'Real-time',
      users: '200K+'
    },
    price: 'From $149/month'
  },
  {
    id: 'affiliate-portal',
    name: 'Affiliate Portal',
    tagline: 'Referral System',
    description: 'Complete affiliate management system with automated tracking, commission optimization, and performance analytics.',
    icon: Users,
    gradient: 'from-teal-500 to-cyan-500',
    features: [
      'Automated tracking',
      'Commission optimization',
      'Performance analytics',
      'Multi-tier system',
      'Payment automation',
      'Fraud detection'
    ],
    stats: {
      accuracy: '99.1%',
      speed: 'Instant',
      users: '30K+'
    },
    price: 'From $199/month'
  }
]

export default function Products() {
  return (
    <section id="products" className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Complete AI Suite
            <span className="block bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              for Modern Business
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your business with our comprehensive suite of AI-powered tools. From content creation to analytics, we've got everything you need to scale.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {products.map((product, index) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.id}
                className="group relative"
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: 'easeOut'
                    }
                  }
                }}
              >
                <motion.div
                  className="h-full p-8 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500 group-hover:bg-zinc-900/60"
                  whileHover={{
                    scale: 1.02,
                    y: -8,
                    boxShadow: '0 25px 50px rgba(6, 182, 212, 0.1)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-sm text-zinc-400">{product.tagline}</p>
                      </div>
                    </div>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                    </motion.div>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-400 mb-6 leading-relaxed">{product.description}</p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {product.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * featureIndex }}
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-cyan-400" />
                        </div>
                        <span className="text-sm text-zinc-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{product.stats.accuracy}</div>
                      <div className="text-xs text-zinc-400">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{product.stats.speed}</div>
                      <div className="text-xs text-zinc-400">Speed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{product.stats.users}</div>
                      <div className="text-xs text-zinc-400">Users</div>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">{product.price}</span>
                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get Started
                    </motion.button>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
} 