'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useReducedMotion } from '@/lib/utils/motion';
import { trackEvent } from '@/lib/utils/analytics';

export default function CaseSnapGrid() {
  const prefersReducedMotion = useReducedMotion();

  const handleCaseStudyClick = (caseId: number, caption: string) => {
    trackEvent('case_study_click', { case_id: caseId, caption, location: 'case_snap_grid' });
    window.location.href = '/case-studies';
  };

  const caseSnaps = [
    {
      id: 1,
      caption: '12× output',
      description: 'Content creation velocity',
      image: '/api/placeholder/600/400', // Placeholder - replace with actual screenshot
      gradient: 'from-blue-500 to-purple-500',
      stats: 'From 2 posts/week to 24 posts/week'
    },
    {
      id: 2,
      caption: '-38% CAC',
      description: 'Customer acquisition cost',
      image: '/api/placeholder/600/400', // Placeholder - replace with actual screenshot  
      gradient: 'from-green-500 to-blue-500',
      stats: 'Reduced from $150 to $93 per customer'
    }
  ];

  const motionProps = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6 } };

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Visual Proof
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            See the tangible results our platform delivers for businesses just like yours
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseSnaps.map((snap, index) => (
            <motion.div
              key={snap.id}
              {...{ ...motionProps, transition: { ...motionProps.transition, delay: index * 0.2 } }}
              onClick={() => handleCaseStudyClick(snap.id, snap.caption)}
              className="group relative bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 overflow-hidden cursor-pointer hover:transform hover:scale-105"
            >
              {/* Background gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${snap.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Screenshot placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 rounded-xl mb-6 overflow-hidden border border-zinc-600/30">
                {/* Mock screenshot content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-24 h-24 bg-gradient-to-br ${snap.gradient} rounded-full flex items-center justify-center`}>
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                {/* Screenshot overlay elements */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-white text-xs">Dashboard</span>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded px-2 py-1">
                    <span className="text-green-300 text-xs">Live Data</span>
                  </div>
                </div>

                {/* Mock data visualization */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">{snap.description}</span>
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    </div>
                    <div className={`h-1 bg-gradient-to-r ${snap.gradient} rounded-full`} />
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                    View Details
                  </div>
                </div>
              </div>

              {/* Case information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`text-3xl font-bold bg-gradient-to-r ${snap.gradient} bg-clip-text text-transparent`}>
                    {snap.caption}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 bg-gradient-to-r ${snap.gradient} rounded-full`} />
                    <span className="text-zinc-400 text-sm">Verified</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white">
                  {snap.description}
                </h3>
                
                <p className="text-zinc-400 text-sm">
                  {snap.stats}
                </p>

                {/* Progress indicator */}
                <div className="pt-2">
                  <div className="flex items-center space-x-2 text-xs text-zinc-500">
                    <span>Impact Timeline:</span>
                    <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${snap.gradient}`}
                        initial={{ width: '0%' }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: prefersReducedMotion ? 0.3 : 1.5, delay: 0.5 + index * 0.2 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <span>60 days</span>
                  </div>
                </div>
              </div>

              {/* Decorative corner element */}
              {!prefersReducedMotion && (
                <motion.div
                  className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${snap.gradient} rounded-full`}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Call-to-action */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-zinc-400 mb-4">Ready to see similar results?</p>
          <Link href="/case-studies">
            <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105">
              <span>View All Case Studies</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}