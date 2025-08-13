'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { trackEvent } from '@/lib/utils/analytics';
import { siteConfig } from '@/lib/data/site';
import { useReducedMotion } from '@/lib/utils/motion';

interface UrgencyBannerProps {
  onDismiss?: () => void;
  isDismissed?: boolean;
}

export default function UrgencyBanner({ onDismiss, isDismissed = false }: UrgencyBannerProps) {
  const [isVisible, setIsVisible] = useState(!isDismissed);
  const prefersReducedMotion = useReducedMotion();

  const handleDismiss = () => {
    setIsVisible(false);
    trackEvent('urgency_dismiss', { location: 'homepage' });
    onDismiss?.();
  };

  const handleCTAClick = () => {
    trackEvent('cta_urgency_banner', { location: 'urgency_section' });
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: prefersReducedMotion ? 0.3 : 0.5 }}
        className="relative py-4 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm border-b border-blue-500/20 mx-4 rounded-2xl my-8"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Urgency indicator */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Clock className="w-5 h-5 text-white" />
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
                <span className="text-white font-semibold text-sm">LIMITED TIME</span>
              </div>

              {/* Main message */}
              <div className="hidden sm:block">
                <span className="text-white font-medium">
                  {siteConfig.urgencyText || siteConfig.urgencyBanner?.text}
                </span>
              </div>
              
              {/* Mobile message */}
              <div className="sm:hidden">
                <span className="text-white font-medium text-sm">
                  {(siteConfig.urgencyText || siteConfig.urgencyBanner?.text)?.slice(0, 28)}...
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* CTA Button */}
              <Link href="/pricing">
                <motion.button
                  onClick={handleCTAClick}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-sm hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Claim Discount</span>
                  <span className="sm:hidden">Claim</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="p-1 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar showing time remaining */}
          <div className="mt-3 hidden md:block">
            <div className="flex items-center justify-between text-xs text-white/70 mb-1">
              <span>Time remaining:</span>
              <span>48 hours</span>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                initial={{ width: '60%' }}
                animate={{ width: '45%' }}
                transition={{ duration: prefersReducedMotion ? 0.3 : 2 }}
              />
            </div>
          </div>
        </div>

        {/* Animated border */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        )}
      </motion.section>
    </AnimatePresence>
  );
}