'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useReducedMotion } from '@/lib/utils/motion';

export default function GuaranteeBadge() {
  const prefersReducedMotion = useReducedMotion();

  const guarantees = [
    {
      icon: Shield,
      title: '30-Day Money Back',
      description: 'Not satisfied? Get a full refund, no questions asked.',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: CheckCircle,
      title: '99.9% Uptime',
      description: 'Enterprise-grade reliability with SLA guarantee.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Expert help whenever you need it, day or night.',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: RefreshCw,
      title: 'Free Migration',
      description: 'We\'ll help you transition from your current tools.',
      color: 'from-orange-400 to-orange-600'
    }
  ];

  const motionProps = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Zero Risk Guarantee
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Try Omnipreneur with complete confidence. We stand behind our platform with these ironclad guarantees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            
            return (
              <motion.div
                key={guarantee.title}
                {...{ ...motionProps, transition: { ...motionProps.transition, delay: index * 0.1 } }}
                className="group relative bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 text-center"
              >
                {/* Background glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${guarantee.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                
                {/* Icon with glow */}
                <div className="relative mb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${guarantee.color} rounded-full shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Subtle glow effect */}
                  {!prefersReducedMotion && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${guarantee.color} rounded-full blur-xl opacity-20`}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    />
                  )}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-3">
                  {guarantee.title}
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {guarantee.description}
                </p>

                {/* Verified badge */}
                <div className="mt-4 inline-flex items-center space-x-2 text-xs text-zinc-500">
                  <div className={`w-2 h-2 bg-gradient-to-r ${guarantee.color} rounded-full`} />
                  <span>Verified Guarantee</span>
                </div>

                {/* Decorative corner elements */}
                {!prefersReducedMotion && (
                  <>
                    <motion.div
                      className={`absolute top-3 right-3 w-1 h-1 bg-gradient-to-r ${guarantee.color} rounded-full`}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
                    />
                    <motion.div
                      className={`absolute bottom-3 left-3 w-1 h-1 bg-gradient-to-r ${guarantee.color} rounded-full`}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.4 }}
                    />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Main guarantee callout */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center justify-center space-x-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-full px-8 py-4 border border-green-500/20">
            <Shield className="w-6 h-6 text-green-400" />
            <div className="text-left">
              <div className="text-white font-bold text-lg">100% Satisfaction Guaranteed</div>
              <div className="text-zinc-400 text-sm">Join 50,000+ businesses with confidence</div>
            </div>
            {!prefersReducedMotion && (
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}