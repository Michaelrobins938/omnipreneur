'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, Zap, Calendar, ArrowRight, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const caseStudies = [
  {
    id: 1,
    title: '12× Content Output Increase',
    company: 'TechFlow Solutions',
    industry: 'SaaS',
    challenge: 'Struggling to produce enough content for multiple marketing channels',
    solution: 'Implemented Content Spawner + Auto-Rewrite Engine workflow',
    results: {
      metric: '12× output',
      details: 'From 2 blog posts per week to 24 pieces of content weekly',
      timeframe: '60 days',
      additionalMetrics: [
        'Blog traffic up 340%',
        'Lead generation increased 280%',
        'Content team time saved: 15 hours/week'
      ]
    },
    tools: ['Content Spawner', 'Auto-Rewrite Engine', 'SEO Optimizer Pro'],
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    id: 2,
    title: '38% CAC Reduction',
    company: 'GrowthHackers Pro',
    industry: 'Marketing Agency',
    challenge: 'High customer acquisition costs eating into profit margins',
    solution: 'Integrated Lead Generation Pro + Email Marketing Suite + Analytics Dashboard',
    results: {
      metric: '-38% CAC',
      details: 'Customer acquisition cost dropped from $150 to $93',
      timeframe: '45 days',
      additionalMetrics: [
        'Conversion rate improved 67%',
        'Email open rates up 45%',
        'Marketing ROI increased 124%'
      ]
    },
    tools: ['Lead Generation Pro', 'Email Marketing Suite', 'Live Dashboard'],
    gradient: 'from-green-500 to-blue-500'
  },
  {
    id: 3,
    title: '5× Revenue Growth',
    company: 'E-commerce Pro',
    industry: 'E-commerce',
    challenge: 'Stagnant sales despite increasing traffic',
    solution: 'Full e-commerce optimization with AI-driven pricing and inventory',
    results: {
      metric: '5× revenue',
      details: 'Monthly revenue grew from $50k to $250k',
      timeframe: '90 days',
      additionalMetrics: [
        'Conversion rate up 89%',
        'Average order value +67%',
        'Customer lifetime value +134%'
      ]
    },
    tools: ['E-commerce Optimizer', 'Price Optimizer', 'Customer Service AI'],
    gradient: 'from-purple-500 to-pink-500'
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Case Studies
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Real results from real businesses using Omnipreneur to scale their operations
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="space-y-16">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-8 border border-zinc-700/50"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Story */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`w-3 h-3 bg-gradient-to-r ${study.gradient} rounded-full`} />
                    <span className="text-zinc-400 text-sm uppercase tracking-wide">{study.industry}</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">{study.title}</h2>
                  <p className="text-xl text-zinc-300 mb-8">{study.company}</p>

                  {/* Challenge & Solution */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Challenge</h3>
                      <p className="text-zinc-400">{study.challenge}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Solution</h3>
                      <p className="text-zinc-400">{study.solution}</p>
                    </div>
                  </div>

                  {/* Tools Used */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Tools Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {study.tools.map(tool => (
                        <span key={tool} className={`px-3 py-1 bg-gradient-to-r ${study.gradient} bg-opacity-20 border border-current rounded-full text-sm`}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Results */}
                <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-700/30">
                  <div className="text-center mb-8">
                    <div className={`text-5xl font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent mb-2`}>
                      {study.results.metric}
                    </div>
                    <p className="text-zinc-300 mb-2">{study.results.details}</p>
                    <div className="flex items-center justify-center space-x-2 text-zinc-500">
                      <Calendar className="w-4 h-4" />
                      <span>Achieved in {study.results.timeframe}</span>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Additional Results</h4>
                    {study.results.additionalMetrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <TrendingUp className={`w-4 h-4 text-green-400`} />
                        <span className="text-zinc-300">{metric}</span>
                      </div>
                    ))}
                  </div>

                  {/* Visual Element */}
                  <div className="mt-8 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <BarChart3 className={`w-8 h-8 text-green-400`} />
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{study.results.timeframe}</div>
                        <div className="text-zinc-400 text-sm">Time to Results</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-20 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 rounded-3xl p-12 border border-zinc-700/50"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Join these businesses and thousands more who've transformed their operations with Omnipreneur
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 group">
                <Users className="w-5 h-5" />
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/demo">
              <button className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>See Live Demo</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}