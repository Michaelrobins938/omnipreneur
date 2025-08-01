"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBook, 
  FaCode, 
  FaRocket, 
  FaSearch,
  FaDownload,
  FaPlay,
  FaExternalLinkAlt,
  FaGithub,
  FaTerminal,
  FaCog,
  FaLightbulb
} from 'react-icons/fa';

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Docs', count: 25 },
    { id: 'getting-started', name: 'Getting Started', count: 8 },
    { id: 'api', name: 'API Reference', count: 12 },
    { id: 'tutorials', name: 'Tutorials', count: 5 }
  ];

  const docs = [
    {
      id: 1,
      title: 'Quick Start Guide',
      category: 'getting-started',
      description: 'Get up and running with Omnipreneur AI Suite in under 5 minutes.',
      readTime: '5 min read',
      difficulty: 'Beginner',
      featured: true
    },
    {
      id: 2,
      title: 'AutoRewrite Engine API',
      category: 'api',
      description: 'Complete API reference for the AutoRewrite Engine with examples.',
      readTime: '15 min read',
      difficulty: 'Advanced'
    },
    {
      id: 3,
      title: 'Content Spawner Integration',
      category: 'tutorials',
      description: 'Learn how to integrate Content Spawner into your existing workflow.',
      readTime: '12 min read',
      difficulty: 'Intermediate'
    },
    {
      id: 4,
      title: 'CAL™ Technology Deep Dive',
      category: 'api',
      description: 'Understanding the Cognitive Architecture Layering technology.',
      readTime: '20 min read',
      difficulty: 'Advanced'
    },
    {
      id: 5,
      title: 'Building Your First AI Tool',
      category: 'tutorials',
      description: 'Step-by-step guide to creating custom AI-powered applications.',
      readTime: '25 min read',
      difficulty: 'Intermediate'
    },
    {
      id: 6,
      title: 'Authentication & Security',
      category: 'getting-started',
      description: 'Set up secure authentication and API key management.',
      readTime: '10 min read',
      difficulty: 'Beginner'
    }
  ];

  const quickLinks = [
    {
      icon: FaRocket,
      title: 'Quick Start',
      description: 'Get started in 5 minutes',
      href: '/docs/quick-start',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaCode,
      title: 'API Reference',
      description: 'Complete API documentation',
      href: '/docs/api',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaPlay,
      title: 'Tutorials',
      description: 'Step-by-step guides',
      href: '/docs/tutorials',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaGithub,
      title: 'SDK Downloads',
      description: 'Client libraries and SDKs',
      href: '/docs/sdk',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaBook className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Documentation
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Everything you need to build with Omnipreneur AI Suite. From quick start guides to advanced API documentation.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-12 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Quick Links
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Get started quickly with our most popular resources.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{link.title}</h3>
                  <p className="text-zinc-400 text-sm mb-4">{link.description}</p>
                  <a 
                    href={link.href}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Learn More <FaExternalLinkAlt className="w-4 h-4 ml-2" />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20 bg-gradient-to-br from-zinc-900/80 to-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Documentation
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Comprehensive guides and references for all Omnipreneur AI Suite features.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700/60'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDocs.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 ${
                  doc.featured ? 'border-blue-500/50 shadow-blue-500/25' : ''
                }`}
              >
                {doc.featured && (
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
                    {doc.category}
                  </span>
                  <span className="text-zinc-400 text-sm">{doc.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{doc.title}</h3>
                <p className="text-zinc-400 mb-4 leading-relaxed">{doc.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    doc.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    doc.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {doc.difficulty}
                  </span>
                  <a
                    href={`/docs/${doc.id}`}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Read More <FaExternalLinkAlt className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SDK Downloads */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              SDK Downloads
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Official client libraries and SDKs for popular programming languages.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'JavaScript', icon: 'JS', color: 'from-yellow-500 to-orange-500' },
              { name: 'Python', icon: 'PY', color: 'from-blue-500 to-cyan-500' },
              { name: 'Node.js', icon: 'N', color: 'from-green-500 to-emerald-500' },
              { name: 'React', icon: 'R', color: 'from-cyan-500 to-blue-500' }
            ].map((sdk, index) => (
              <motion.div
                key={sdk.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${sdk.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white font-bold text-lg">{sdk.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{sdk.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">Official SDK</p>
                <button className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                  Download <FaDownload className="w-4 h-4 ml-2" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Need Help?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Contact Support</span>
                <FaLightbulb className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>View Examples</span>
                <FaCode className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 