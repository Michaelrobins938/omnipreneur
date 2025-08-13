'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { trackEvent } from '@/lib/utils/analytics';
import { useReducedMotion } from '@/lib/utils/motion';

export default function FinalCTA() {
  const prefersReducedMotion = useReducedMotion();

  const handleCTAClick = (type: 'final_start_free' | 'final_demo') => {
    trackEvent(`cta_${type}`, { location: 'final_cta_section' });
  };

  const urgencyIndicators = [
    { icon: Users, text: '15 people viewing this page', color: 'text-blue-400' },
    { icon: Clock, text: 'Early pricing ends in 48h', color: 'text-red-400' },
    { icon: Zap, text: '2min setup, instant access', color: 'text-green-400' }
  ];

  const motionProps = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } };

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-900/50 via-blue-900/20 to-purple-900/20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
      
      {/* Floating background elements */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.2, 1],
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
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Urgency indicators */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          {urgencyIndicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Icon className={`w-4 h-4 ${indicator.color}`} />
                <span className="text-zinc-400">{indicator.text}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Main headline */}
        <motion.h2
          {...{ ...motionProps, transition: { ...motionProps.transition, delay: 0.2 } }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
        >
          Stop Dreaming.
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Start Shipping.
          </span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          {...{ ...motionProps, transition: { ...motionProps.transition, delay: 0.4 } }}
          className="text-xl md:text-2xl text-zinc-400 mb-8 leading-relaxed max-w-3xl mx-auto"
        >
          Join 50,000+ businesses scaling with AI. Get instant access to 27 integrated tools 
          and ship 10× faster than your competition.
        </motion.p>

        {/* Value proposition points */}
        <motion.div
          {...{ ...motionProps, transition: { ...motionProps.transition, delay: 0.6 } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto"
        >
          {[
            'Setup in 2 minutes',
            'No credit card required',
            'Cancel anytime'
          ].map((point, index) => (
            <div key={index} className="flex items-center justify-center space-x-2 text-zinc-300">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-sm">{point}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          {...{ ...motionProps, transition: { ...motionProps.transition, delay: 0.8 } }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/auth/register">
            <motion.button 
              onClick={() => handleCTAClick('final_start_free')}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold text-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center space-x-3 group min-w-[280px]"
            >
              <Zap className="w-6 h-6 group-hover:animate-pulse" />
              <span>Start Free Today</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          
          <Link href="/demo">
            <motion.button 
              onClick={() => handleCTAClick('final_demo')}
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              className="px-10 py-5 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-xl hover:border-blue-500 hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-3 group min-w-[280px]"
            >
              <span>See Live Demo</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Social proof reminder */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.6, delay: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-4 bg-zinc-800/30 backdrop-blur-sm rounded-full px-6 py-3 border border-zinc-700/50">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-zinc-800 flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-white font-semibold text-sm">Join 50,000+ users</div>
              <div className="text-zinc-400 text-xs">Growing by 500+ weekly</div>
            </div>
            {!prefersReducedMotion && (
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>

        {/* Final urgency note */}
        <motion.p
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.4, delay: 1.2 }}
          viewport={{ once: true }}
          className="mt-6 text-sm text-zinc-500"
        >
          Early access pricing expires in 48 hours. Don't miss out.
        </motion.p>
      </div>
    </section>
  );
}