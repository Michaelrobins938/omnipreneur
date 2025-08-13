'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Zap, Users, BarChart3, Cog } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
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

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Live Platform Demo
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Experience how 27 AI tools work together to automate your business operations
          </p>
        </motion.div>

        {/* Demo Video Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-zinc-800/30 rounded-3xl p-8 border border-zinc-700/50 backdrop-blur-xl mb-16"
        >
          {/* Interactive Demo Placeholder */}
          <div className="relative aspect-video bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-2xl overflow-hidden border border-zinc-700/50 mb-8">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-8 mx-auto"
                >
                  <Play className="w-12 h-12 text-white ml-1" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4">Interactive Demo Loading...</h2>
                <p className="text-zinc-300 max-w-md mx-auto">
                  This would be a live, interactive demo of the Omnipreneur platform showing real workflows
                </p>
              </div>
            </div>

            {/* Demo overlay elements */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                Live Demo
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-4 py-2 text-green-300 text-sm">
                Real Data
              </div>
            </div>
          </div>

          {/* Demo Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Content Generation</h3>
              <p className="text-zinc-400 text-sm">See AI create blogs, ads, and social content</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Cog className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Workflow Automation</h3>
              <p className="text-zinc-400 text-sm">Watch complex processes run automatically</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-zinc-400 text-sm">Real-time insights and performance metrics</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-zinc-400 mb-8">Join thousands of businesses already using Omnipreneur</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 group">
                <Users className="w-5 h-5" />
                <span>Start Free Trial</span>
              </button>
            </Link>
            <Link href="/pricing">
              <button className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>View Pricing</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}