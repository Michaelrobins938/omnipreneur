"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { posts } from './_posts';

export default function Blog() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Blog &
              <span className="block bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Insights
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Expert insights, tutorials, and strategies to help you succeed with AI-powered content creation and digital marketing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Latest Articles
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Discover insights, strategies, and tutorials to help you succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="aspect-video bg-zinc-800/60 rounded-xl mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">📝</span>
                    </div>
                    <p className="text-zinc-400 text-sm">Post Image</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                  <span className="text-zinc-400 text-sm">{post.readMinutes} min read</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{post.title}</h3>
                <p className="text-zinc-400 mb-4 leading-relaxed">{post.excerpt}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-zinc-400">
                    <span>👤</span>
                    <span>{post.author}</span>
                  </div>
                  <span className="text-zinc-400 text-sm">{post.views.toLocaleString()} views</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Get the latest insights and strategies delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 