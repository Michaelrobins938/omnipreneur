'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ArrowRight, Zap, Users, BarChart3, Mail, ShoppingCart, Headphones, Brain, Video, Clock, FileText, Globe, Shield, Target, Lightbulb, Cpu, Palette, Mic, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { productsRegistry } from '@/app/lib/products';

// Icon mapping for products
const iconMap: { [key: string]: any } = {
  'NOVUS Protocol': Brain,
  'AutoRewrite Engine': FileText,
  'Bundle Builder': Target,
  'Content Spawner': Lightbulb,
  'Live Dashboard': BarChart3,
  'Affiliate Portal': Users,
  'Auto Niche Engine': Search,
  'Aesthetic Generator': Palette,
  'Content Calendar Pro': Clock,
  'Email Marketing Suite': Mail,
  'Social Media Manager': Globe,
  'SEO Optimizer Pro': Search,
  'Lead Generation Pro': Target,
  'Project Management Pro': Target,
  'Time Tracking AI': Clock,
  'Invoice Generator': FileText,
  'Customer Service AI': Headphones,
  'Video Editor AI': Video,
  'Podcast Producer': Mic,
  'E-commerce Optimizer': ShoppingCart,
  'Prompt Packs': Brain,
  'Healthcare AI Compliance': Shield,
  'Financial AI Compliance': Shield,
  'Legal AI Compliance': Shield,
  'Education AI Compliance': GraduationCap,
  'Medical AI Assistant': Shield,
  'Quantum AI Processor': Cpu
};

// Organize products by category based on their function
const categorizeProducts = () => {
  const categories: { [key: string]: any[] } = {
    'AI & Optimization': [],
    'Content & Media': [],
    'Marketing & Sales': [],
    'Business Management': [],
    'E-commerce & Finance': [],
    'Compliance & Healthcare': []
  };

  productsRegistry.forEach(product => {
    const name = product.name;
    const productWithIcon = {
      ...product,
      icon: iconMap[name] || FileText
    };

    // Categorize based on product names and descriptions
    if (name.includes('AI') || name.includes('Quantum') || name.includes('NOVUS')) {
      categories['AI & Optimization'].push(productWithIcon);
    } else if (name.includes('Content') || name.includes('Video') || name.includes('Podcast') || name.includes('Aesthetic')) {
      categories['Content & Media'].push(productWithIcon);
    } else if (name.includes('Marketing') || name.includes('Social') || name.includes('SEO') || name.includes('Lead') || name.includes('Affiliate') || name.includes('Prompt')) {
      categories['Marketing & Sales'].push(productWithIcon);
    } else if (name.includes('Dashboard') || name.includes('Project') || name.includes('Time') || name.includes('Bundle') || name.includes('Customer Service')) {
      categories['Business Management'].push(productWithIcon);
    } else if (name.includes('commerce') || name.includes('Invoice') || name.includes('Niche')) {
      categories['E-commerce & Finance'].push(productWithIcon);
    } else if (name.includes('Compliance') || name.includes('Healthcare') || name.includes('Medical') || name.includes('Legal') || name.includes('Financial') || name.includes('Education')) {
      categories['Compliance & Healthcare'].push(productWithIcon);
    } else {
      // Default to Business Management
      categories['Business Management'].push(productWithIcon);
    }
  });

  return categories;
};

const allTools = categorizeProducts();

const categoryIcons = {
  'AI & Optimization': Brain,
  'Content & Media': Video,
  'Marketing & Sales': Target,
  'Business Management': BarChart3,
  'E-commerce & Finance': ShoppingCart,
  'Compliance & Healthcare': Shield
};

const categoryColors = {
  'AI & Optimization': 'from-blue-500 to-purple-500',
  'Content & Media': 'from-green-500 to-blue-500',
  'Marketing & Sales': 'from-purple-500 to-pink-500',
  'Business Management': 'from-cyan-500 to-blue-500',
  'E-commerce & Finance': 'from-orange-500 to-yellow-500',
  'Compliance & Healthcare': 'from-red-500 to-pink-500'
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTools = Object.entries(allTools).reduce((acc, [category, tools]) => {
    if (selectedCategory && category !== selectedCategory) return acc;
    
    const filtered = tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    
    return acc;
  }, {} as typeof allTools);

  const totalTools = Object.values(filteredTools).flat().length;

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
            All {productsRegistry.length} AI Tools
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Discover every tool in the Omnipreneur suite. Each one designed to automate a specific part of your business.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-full text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {Object.keys(allTools).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <p className="text-zinc-500 mt-4">
            Showing {totalTools} of {productsRegistry.length} tools
          </p>
        </motion.div>

        {/* Tools Grid */}
        {Object.entries(filteredTools).map(([category, tools], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            className="mb-16"
          >
            {/* Category Header */}
            <div className="flex items-center mb-8">
              <div className={`w-12 h-12 bg-gradient-to-r ${categoryColors[category]} rounded-xl flex items-center justify-center mr-4`}>
                {React.createElement(categoryIcons[category], { className: "w-6 h-6 text-white" })}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{category}</h2>
                <p className="text-zinc-400">{tools.length} tools</p>
              </div>
            </div>

            {/* Tools in Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, toolIndex) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: toolIndex * 0.05 }}
                  >
                    <Link href={tool.href}>
                      <div className="group bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 cursor-pointer hover:transform hover:scale-105 h-full">
                        {/* Tool Icon */}
                        <div className={`w-12 h-12 bg-gradient-to-r ${categoryColors[category]} rounded-xl flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Tool Info */}
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-zinc-200 transition-all duration-300">
                          {tool.name}
                        </h3>
                        
                        <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                          {tool.description}
                        </p>

                        {/* Learn More Link */}
                        <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors text-sm">
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-zinc-800/30 rounded-3xl p-12 border border-zinc-700/50"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            All {productsRegistry.length} tools are included in every plan. Start with any tool and expand as your business grows.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 group">
                <Zap className="w-5 h-5" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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