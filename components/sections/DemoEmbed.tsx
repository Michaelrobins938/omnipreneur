'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';
import { trackEvent } from '@/lib/utils/analytics';
import { useReducedMotion } from '@/lib/utils/motion';
import VideoModal from '@/components/ui/VideoModal';

export default function DemoEmbed() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleDemoClick = () => {
    setIsModalOpen(true);
    trackEvent('product_demo_launch', { location: 'mechanism_section' });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPlaying(false);
  };

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
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See It In Action
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Watch how Omnipreneur transforms businesses in under 60 seconds
          </p>
        </motion.div>

        <motion.div
          {...motionProps}
          className="relative bg-zinc-800/50 rounded-3xl p-6 border border-zinc-700/50 backdrop-blur-xl"
        >
          {/* Demo Video Player - Professional branded thumbnail */}
          <div className="relative aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl overflow-hidden border border-zinc-700/50">
            {isPlaying ? (
              /* Demo content - In a real implementation, this would be an actual video embed */
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl font-bold mb-4"
                  >
                    🚀
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Demo Loading...</h3>
                  <p className="text-blue-100">Experience the Omnipreneur platform</p>
                </div>
              </div>
            ) : (
              <>
                {/* Branded thumbnail background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30" />
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                
                {/* Thumbnail content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Professional play button */}
                  <motion.button
                    onClick={handleDemoClick}
                    className="group relative w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 border border-white/20"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  >
                    <Play className="w-10 h-10 text-white ml-1 group-hover:scale-110 transition-transform" />
                    
                    {/* Elegant pulse animation */}
                    {!prefersReducedMotion && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-blue-400/40 animate-ping"></div>
                        <div className="absolute inset-0 rounded-full border border-purple-400/30 animate-pulse"></div>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Demo highlights overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm font-medium">2:00</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">Platform Tour</span>
                  </div>
                </div>

                {/* Feature callouts */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-3 py-1">
                      <span className="text-blue-300 text-sm">27 AI Tools</span>
                    </div>
                    <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-3 py-1">
                      <span className="text-green-300 text-sm">Integrated Platform</span>
                    </div>
                    <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-3 py-1">
                      <span className="text-purple-300 text-sm">Real Results</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Demo Info */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Complete Platform Walkthrough</h3>
            <p className="text-zinc-400 mb-4">
              See how 27 AI tools work together to automate content creation, marketing, and business operations.
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-zinc-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Live Demo Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>No Sign-up Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>2 Minutes</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alternative CTA */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-zinc-400 mb-4">Want to try it yourself?</p>
          <Link
            href="/demo"
            onClick={() => trackEvent('cta_hero_demo', { location: 'demo_section' })}
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Launch Interactive Demo</span>
          </Link>
        </motion.div>
      </div>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Omnipreneur Platform Tour"
      />
    </section>
  );
}