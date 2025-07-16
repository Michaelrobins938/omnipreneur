"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const features = [
  { 
    title: 'Professional Mode',
    description: 'Transform content into polished, executive-level communication',
    icon: '👔'
  },
  { 
    title: 'Creative Mode',
    description: 'Enhance content with artistic flair and engaging expression',
    icon: '🎨'
  },
  { 
    title: 'Technical Mode',
    description: 'Optimize for clarity and precision in technical documentation',
    icon: '⚙️'
  },
  { 
    title: 'Persuasive Mode',
    description: 'Craft compelling arguments and persuasive content',
    icon: '🎯'
  }
];

export default function AutoRewritePage() {
  return (
    <main className="min-h-screen bg-zinc-950 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <motion.h1 
                className="text-5xl md:text-6xl font-orbitron font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                AutoRewrite Engine™
                <span className="block text-blue-400 mt-2">CAL™ Powered Content Refinement</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-zinc-400 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Transform any content with professional-grade tone matching, style optimization, and clarity enhancement using our advanced CAL™ technology.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/try-now" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                  Try Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/docs/auto-rewrite" className="inline-flex items-center justify-center px-8 py-4 border border-zinc-700 text-white rounded-xl font-medium hover:bg-zinc-900 transition-colors">
                  Documentation
                </Link>
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.div
                className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/auto_rewrite_engine_project/showcase images/2025-07-05 16_50_22-Mozilla Firefox.png"
                  alt="AutoRewrite Engine Interface"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-orbitron font-bold text-white mb-6">
              Intelligent Content Refinement
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Choose from multiple refinement modes powered by our CAL™ technology for perfect content every time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-zinc-800 rounded-2xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-orbitron font-bold text-white mb-6">
              Ready to Transform Your Content?
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
              Join thousands of professionals using AutoRewrite Engine™ to perfect their content with CAL™ technology.
            </p>
            <Link href="/try-now" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 