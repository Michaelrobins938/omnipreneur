"use client"
import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { 
    title: 'CAL™ Technology', 
    desc: 'Our proprietary Cognitive Architecture Layering engine transforms basic inputs into precision-crafted AI commands using advanced 4-D methodology.',
    icon: '🧠',
    stats: '95% optimization rate'
  },
  { 
    title: 'Enterprise Ready', 
    desc: 'Built for scale with SOC 2 compliance, role-based access control, and commercial licensing for organizations of any size.',
    icon: '🏢',
    stats: '99.9% uptime'
  },
  { 
    title: 'Multi-Model Orchestration', 
    desc: 'Seamlessly coordinate Claude 3 Opus, GPT-4, Command R+, and Mistral models for optimal performance across all tasks.',
    icon: '🔄',
    stats: '4 AI models'
  },
  { 
    title: '7 Integrated Applications', 
    desc: 'Complete suite of professional tools for content creation, product packaging, analytics, and monetization.',
    icon: '⚡',
    stats: '100+ features'
  },
];

const FeaturesSection = () => (
  <section className="w-full py-24 bg-zinc-950/50 relative overflow-hidden">
    {/* Background Effects */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
    
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6 tracking-tight">
          Enterprise-Grade AI Suite
        </h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Powered by CAL™ technology, our platform delivers unmatched performance and reliability for organizations that demand excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl transform -rotate-1" />
            <div className="relative bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-full hover:border-white/20 transition-all duration-300">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-orbitron font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm mb-4">{feature.desc}</p>
              <div className="text-cyan-400 font-mono text-sm">{feature.stats}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection; 