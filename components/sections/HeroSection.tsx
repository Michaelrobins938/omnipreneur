'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Shield, BarChart3, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { trackEvent } from '@/lib/utils/analytics';
import { useReducedMotion } from '@/lib/utils/motion';

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const handleCTAClick = (type: 'hero_start_free' | 'hero_demo') => {
    trackEvent(`cta_${type}`, { location: 'hero' });
  };

  const motionProps = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background - Keep existing gradient galaxy */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      {/* Enhanced grid overlay - more subtle and refined */}
      <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-zinc-950/20" />
      
      {/* Floating particles - only on desktop if motion enabled */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 hidden md:block">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          {/* Trust Chips */}
          <motion.div
            {...motionProps}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" />
              Enterprise Security
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              <BarChart3 className="w-4 h-4 mr-2" />
              Real-time Analytics
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-2" />
              Lightning Fast
            </div>
          </motion.div>
          
          {/* Main Headline - High contrast, production-ready */}
          <motion.h1
            {...{ ...motionProps, transition: { ...motionProps.transition, delay: 0.2 } }}
            className="text-5xl md:text-6xl font-bold leading-tight text-white mb-8 tracking-tight"
          >
            Ship 10× faster with an{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              integrated AI business OS
            </span>
          </motion.h1>

          {/* Subheadline - Concise and readable */}
          <motion.p
            {...{ ...motionProps, transition: { ...motionProps.transition, delay: 0.4 } }}
            className="text-lg md:text-xl font-light text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create, automate, and scale with 27 tools that work together. Results in days, not quarters.
          </motion.p>

          {/* CTA Buttons - Side by side, production-ready styling */}
          <motion.div
            {...{ ...motionProps, transition: { ...motionProps.transition, delay: 0.6 } }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
          >
            {/* Primary CTA - Pill-shaped with brand gradient */}
            <Link href="/auth/register" className="w-full sm:w-auto">
              <button 
                onClick={() => handleCTAClick('hero_start_free')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 group"
              >
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                <span>Start Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            {/* Secondary CTA - Transparent with white border */}
            <Link href="/demo" className="w-full sm:w-auto">
              <button 
                onClick={() => handleCTAClick('hero_demo')}
                className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 text-white rounded-full font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2 group backdrop-blur-sm"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>See Live Demo</span>
              </button>
            </Link>
          </motion.div>
          
          {/* Microcopy */}
          <motion.p
            {...{ ...motionProps, transition: { ...motionProps.transition, delay: 0.8 } }}
            className="text-sm text-zinc-500 font-light"
          >
            No credit card required • Free forever plan available
          </motion.p>
        </div>
      </div>
    </section>
  );
}