'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { useReducedMotion } from '@/lib/utils/motion';

export default function ContrastPanel() {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stop the Revenue Leak
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            The difference between struggling and scaling isn't talent—it's systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Before Panel */}
          <motion.div
            {...{ ...motionProps, transition: { ...motionProps.transition, delay: 0.2 } }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 relative"
          >
            <div className="flex items-center mb-6">
              <TrendingDown className="w-8 h-8 text-red-400 mr-3" />
              <h3 className="text-2xl font-bold text-red-400">Before</h3>
            </div>
            
            <ul className="space-y-4 text-zinc-300 mb-8">
              <li className="flex items-start space-x-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span><strong>Revenue leaks.</strong> Customers slip through cracks in your funnel.</span>
              </li>
              <li className="flex items-start space-x-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span><strong>Manual operations.</strong> Hours wasted on tasks that should be automated.</span>
              </li>
              <li className="flex items-start space-x-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span><strong>Content bottlenecks.</strong> Weeks to produce what should take hours.</span>
              </li>
              <li className="flex items-start space-x-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span><strong>Scattered tools.</strong> Data silos and broken workflows everywhere.</span>
              </li>
            </ul>

            <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
              <div className="text-2xl font-bold text-red-400 mb-1">Status Quo</div>
              <div className="text-sm text-zinc-400">Grinding harder, not smarter</div>
            </div>
          </motion.div>

          {/* After Panel */}
          <motion.div
            {...{ ...motionProps, transition: { ...motionProps.transition, delay: 0.4 } }}
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 relative"
          >
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
              <h3 className="text-2xl font-bold text-green-400">After</h3>
            </div>
            
            <ul className="space-y-4 text-zinc-300 mb-8">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong>Compound output.</strong> Every piece of content works harder for you.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong>Automated ops.</strong> Systems handle the routine so you focus on growth.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong>Predictable growth.</strong> Consistent output drives consistent results.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span><strong>Unified platform.</strong> All tools talk to each other, data flows seamlessly.</span>
              </li>
            </ul>

            <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
              <div className="text-2xl font-bold text-green-400 mb-1">Teams cut CAC by 38% in 60 days</div>
              <div className="text-sm text-zinc-400">Real results from integrated systems</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}