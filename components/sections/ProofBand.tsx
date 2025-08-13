'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, TrendingUp } from 'lucide-react';
import { siteConfig } from '@/lib/data/site';
import { useReducedMotion } from '@/lib/utils/motion';
import { trackEvent } from '@/lib/utils/analytics';

export default function ProofBand() {
  const prefersReducedMotion = useReducedMotion();

  const handleMetricClick = (metric: string) => {
    trackEvent('proof_metric_click' as any, { metric, location: 'proof_band' });
    window.location.href = '/case-studies';
  };

  const metrics = [
    {
      value: siteConfig.proof?.users || '50k+',
      label: 'Active Users',
      icon: Users,
      color: 'from-blue-400 to-blue-600'
    },
    {
      value: siteConfig.proof?.generated || '1M+',
      label: 'Content Generated',
      icon: FileText,
      color: 'from-green-400 to-green-600'
    },
    {
      value: siteConfig.proof?.success || '98%',
      label: 'Success Rate',
      icon: TrendingUp,
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const motionProps = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  return (
    <section className="py-16 bg-zinc-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Real Results from Real Users
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Join thousands of businesses already scaling with our integrated AI platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            
            return (
              <motion.div
                key={metric.label}
                {...{ ...motionProps, transition: { ...motionProps.transition, delay: index * 0.2 } }}
                onClick={() => handleMetricClick(metric.label)}
                className="relative bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50 text-center group hover:border-zinc-600/50 transition-all duration-300 cursor-pointer hover:transform hover:scale-105"
              >
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${metric.color} rounded-full mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Metric Value */}
                <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2`}>
                  {metric.value}
                </div>

                {/* Label */}
                <div className="text-zinc-400 text-lg font-medium">
                  {metric.label}
                </div>

                {/* Decorative elements */}
                {!prefersReducedMotion && (
                  <>
                    <motion.div
                      className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${metric.color} rounded-full`}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.7 }}
                    />
                    <motion.div
                      className={`absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r ${metric.color} rounded-full`}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.5 }}
                    />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Additional proof elements */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-6 text-zinc-400 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>Enterprise Grade</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span>24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}