'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/lib/data/site';
import { useReducedMotion } from '@/lib/utils/motion';

export default function SocialProofStrip() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % siteConfig.testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Company logos (placeholder data - in real implementation, these would be in siteConfig)
  const trustedCompanies = [
    'TechFlow Solutions',
    'DataVision Inc',
    'GrowthHackers Pro',
    'MedTech Innovations',
    'E-commerce Pro',
    'Digital Agency Co'
  ];

  const motionProps = prefersReducedMotion 
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } };

  return (
    <section className="py-12 bg-zinc-900/30 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          {...motionProps}
          className="text-center mb-8"
        >
          <p className="text-zinc-400 text-lg mb-6">Trusted by teams at</p>
          
          {/* Company Logos - Horizontal scroll on mobile, fixed row on desktop */}
          <div className="flex justify-center items-center space-x-8 mb-8 overflow-x-auto md:overflow-x-visible scrollbar-hide">
            {trustedCompanies.map((company, index) => (
              <div
                key={company}
                className="flex-shrink-0 px-4 py-2 bg-zinc-800/30 rounded-lg border border-zinc-700/50 text-zinc-300 text-sm font-medium whitespace-nowrap"
              >
                {company}
              </div>
            ))}
          </div>

          {/* Social Proof Numbers */}
          <div className="flex items-center justify-center space-x-8 text-zinc-300 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>{siteConfig.socialProof.userCount} Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{siteConfig.socialProof.contentGenerated} Content Generated</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>{siteConfig.socialProof.successRate} Success Rate</span>
            </div>
          </div>
          
          {/* Rotating Testimonial */}
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <blockquote className="text-lg text-zinc-300 italic mb-4">
              "{siteConfig.testimonials[currentTestimonial].quote}"
            </blockquote>
            <div className="text-sm text-zinc-400">
              <strong className="text-zinc-200">{siteConfig.testimonials[currentTestimonial].author}</strong>
              {siteConfig.testimonials[currentTestimonial].role && (
                <>, {siteConfig.testimonials[currentTestimonial].role}</>
              )}
              {siteConfig.testimonials[currentTestimonial].company && (
                <> at {siteConfig.testimonials[currentTestimonial].company}</>
              )}
            </div>
          </motion.div>

          {/* Testimonial dots indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {siteConfig.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-blue-400' : 'bg-zinc-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}