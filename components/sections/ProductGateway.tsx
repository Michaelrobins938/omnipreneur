'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, BarChart3, Mail, ShoppingCart, Headphones } from 'lucide-react';
import Link from 'next/link';
import { trackEvent } from '@/lib/utils/analytics';
import { useReducedMotion } from '@/lib/utils/motion';

export default function ProductGateway() {
  const prefersReducedMotion = useReducedMotion();

  const productCategories = [
    {
      title: 'Content Creation',
      description: 'Auto-Rewrite Engine, Content Spawner, Bundle Builder',
      icon: Zap,
      gradient: 'from-blue-500 to-purple-500',
      href: '/products/content-spawner',
      tools: 3,
      popular: true
    },
    {
      title: 'Affiliate Marketing',
      description: 'Affiliate Portal, Commission Tracking, Performance Analytics',
      icon: Users,
      gradient: 'from-green-500 to-blue-500',
      href: '/products/affiliate-portal',
      tools: 4,
      popular: false
    },
    {
      title: 'Business Analytics',
      description: 'Live Dashboard, SEO Optimizer Pro, Quantum AI Processor',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-500',
      href: '/products/live-dashboard',
      tools: 5,
      popular: false
    },
    {
      title: 'Email & Marketing',
      description: 'Email Marketing Suite, Social Media Manager, Lead Gen Pro',
      icon: Mail,
      gradient: 'from-pink-500 to-red-500',
      href: '/products/email-marketing-suite',
      tools: 6,
      popular: true
    },
    {
      title: 'E-commerce Suite',
      description: 'E-commerce Optimizer, Invoice Generator, Payment Processing',
      icon: ShoppingCart,
      gradient: 'from-orange-500 to-yellow-500',
      href: '/products/ecommerce-optimizer',
      tools: 4,
      popular: false
    },
    {
      title: 'Support & Service',
      description: 'Customer Service AI, Time Tracking, Project Management Pro',
      icon: Headphones,
      gradient: 'from-cyan-500 to-blue-500',
      href: '/products/customer-service-ai',
      tools: 5,
      popular: false
    }
  ];

  const handleCategoryClick = (category: string) => {
    trackEvent('gateway_category_open', { category, location: 'product_gateway' });
  };

  const motionProps = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  return (
    <section className="py-20 bg-zinc-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            27 AI Tools, 6 Categories
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-6">
            Choose your path to scale. Each category contains integrated tools that work seamlessly together.
          </p>
          <Link href="/products" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors font-medium">
            <span>Browse all 27 tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCategories.map((category, index) => {
            const Icon = category.icon;
            
            return (
              <motion.div
                key={category.title}
                {...{ ...motionProps, transition: { ...motionProps.transition, delay: index * 0.1 } }}
                className="group relative"
              >
                <Link href={category.href} onClick={() => trackEvent('gateway_product_click', { href: category.href, category: category.title })}>
                  <div 
                    onClick={() => handleCategoryClick(category.title)}
                    className="relative bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 cursor-pointer h-full overflow-hidden"
                  >
                    {/* Popular badge */}
                    {category.popular && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                        POPULAR
                      </div>
                    )}

                    {/* Background gradient effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-xl mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-zinc-200 transition-all duration-300">
                      {category.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Tools count */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 bg-gradient-to-r ${category.gradient} rounded-full`} />
                        <span className="text-zinc-500 text-sm">{category.tools} tools included</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    {/* Progress bar showing integration level */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-zinc-500">
                        <span>Integration Level</span>
                        <span>100%</span>
                      </div>
                      <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${category.gradient}`}
                          initial={{ width: '0%' }}
                          whileInView={{ width: '100%' }}
                          transition={{ duration: prefersReducedMotion ? 0.3 : 1, delay: 0.3 + index * 0.1 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>

                    {/* Decorative corner elements */}
                    {!prefersReducedMotion && (
                      <>
                        <motion.div
                          className={`absolute top-2 left-2 w-1 h-1 bg-gradient-to-r ${category.gradient} rounded-full`}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        />
                        <motion.div
                          className={`absolute bottom-2 right-2 w-1 h-1 bg-gradient-to-r ${category.gradient} rounded-full`}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.4 }}
                        />
                      </>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Call-to-action */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
            <h3 className="text-2xl font-bold text-white mb-4">
              Not sure where to start?
            </h3>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              Get a personalized recommendation based on your business needs and current workflow.
            </p>
            <Link href="/get-started">
              <button 
                onClick={() => trackEvent('cta_tool_recommendation' as any, { location: 'product_gateway' })}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
              >
                <span>Get Tool Recommendation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}