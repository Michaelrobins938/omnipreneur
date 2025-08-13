"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaNewspaper, 
  FaDownload, 
  FaEnvelope, 
  FaPhone,
  FaGlobe,
  FaTwitter,
  FaLinkedin,
  FaArrowRight,
  FaCalendar,
  FaUser,
  FaExternalLinkAlt
} from 'react-icons/fa';

export default function Press() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Press', count: 15 },
    { id: 'releases', name: 'Press Releases', count: 8 },
    { id: 'coverage', name: 'Media Coverage', count: 5 },
    { id: 'awards', name: 'Awards & Recognition', count: 2 }
  ];

  const pressItems = [
    {
      id: 1,
      title: 'Omnipreneur AI Suite Raises $25M Series A to Revolutionize Content Creation',
      category: 'releases',
      date: '2024-01-15',
      source: 'Company Press Release',
      excerpt: 'Funding will accelerate development of AI-powered content creation tools and expand global operations.',
      url: '#',
      featured: true
    },
    {
      id: 2,
      title: 'TechCrunch: "Omnipreneur\'s AI Tools Are Changing How Creators Work"',
      category: 'coverage',
      date: '2024-01-12',
      source: 'TechCrunch',
      excerpt: 'Comprehensive review of our AI-powered content creation suite and its impact on the creator economy.',
      url: '#'
    },
    {
      id: 3,
      title: 'Forbes: "The Future of Content Creation is AI-Powered"',
      category: 'coverage',
      date: '2024-01-10',
      source: 'Forbes',
      excerpt: 'Feature article on how AI is transforming content creation, featuring Omnipreneur AI Suite.',
      url: '#'
    },
    {
      id: 4,
      title: 'Omnipreneur AI Suite Launches AutoRewrite Engine with CAL™ Technology',
      category: 'releases',
      date: '2024-01-08',
      source: 'Company Press Release',
      excerpt: 'Revolutionary AI-powered content rewriting tool now available to creators and businesses worldwide.',
      url: '#'
    },
    {
      id: 5,
      title: 'Best AI Content Creation Tool 2024 - AI Awards',
      category: 'awards',
      date: '2024-01-05',
      source: 'AI Awards',
      excerpt: 'Omnipreneur AI Suite recognized as the leading AI-powered content creation platform.',
      url: '#'
    },
    {
      id: 6,
      title: 'VentureBeat: "Omnipreneur\'s Approach to AI Ethics in Content Creation"',
      category: 'coverage',
      date: '2024-01-03',
      source: 'VentureBeat',
      excerpt: 'Deep dive into our ethical AI practices and commitment to responsible content creation.',
      url: '#'
    }
  ];

  const pressKit = {
    logo: {
      name: 'Omnipreneur AI Suite Logo',
      formats: ['SVG', 'PNG', 'JPG'],
      description: 'High-resolution logo files in various formats'
    },
    screenshots: {
      name: 'Product Screenshots',
      formats: ['PNG', 'JPG'],
      description: 'High-quality screenshots of our AI-powered tools'
    },
    team: {
      name: 'Team Photos',
      formats: ['JPG'],
      description: 'Professional headshots of our leadership team'
    },
    factSheet: {
      name: 'Company Fact Sheet',
      formats: ['PDF'],
      description: 'Key company information and statistics'
    }
  };

  const contactInfo = {
    press: {
      email: 'press@omnipreneur.ai',
      phone: '+1 (555) 123-4567',
      name: 'Sarah Johnson',
      title: 'Head of Communications'
    },
    general: {
      email: 'hello@omnipreneur.ai',
      phone: '+1 (555) 123-4567',
      address: 'San Francisco, CA'
    }
  };

  const filteredPress = pressItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

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
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaNewspaper className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Press &
              <span className="block bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Media
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Latest news, press releases, and media coverage about Omnipreneur AI Suite and our mission to revolutionize content creation.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a href="/press/kit" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center space-x-2">
                <FaDownload className="w-5 h-5" />
                <span>Download Press Kit</span>
              </a>
              <a href="mailto:press@omnipreneur.ai" className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-purple-500 hover:text-purple-400 transition-all duration-300 flex items-center justify-center space-x-2">
                <FaEnvelope className="w-5 h-5" />
                <span>Contact Press</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Press Kit */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Press Kit
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Download high-resolution assets and company information for media use.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(pressKit).map(([key, item], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaDownload className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                <p className="text-zinc-400 text-sm mb-3">{item.description}</p>
                <div className="flex flex-wrap gap-1">
                  {item.formats.map((format, formatIndex) => (
                    <span key={formatIndex} className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">
                      {format}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Coverage */}
      <section className="py-20 bg-gradient-to-br from-zinc-900/80 to-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Press Coverage
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Latest news and media coverage about Omnipreneur AI Suite.
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
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700/60'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredPress.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 ${
                  item.featured ? 'border-purple-500/50 shadow-purple-500/25' : ''
                }`}
              >
                {item.featured && (
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-zinc-400 mb-4 leading-relaxed">{item.excerpt}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                      <span className="flex items-center space-x-1">
                        <FaUser className="w-4 h-4" />
                        <span>{item.source}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FaCalendar className="w-4 h-4" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </span>
                      <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <a
                    href={item.url}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  >
                    Read More <FaExternalLinkAlt className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Press Contact
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Get in touch with our press team for media inquiries, interviews, and press opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Press Team</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-zinc-400 text-sm">Press Contact</p>
                  <p className="text-white font-semibold">{contactInfo.press.name}</p>
                  <p className="text-zinc-400">{contactInfo.press.title}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Email</p>
                  <a href={`mailto:${contactInfo.press.email}`} className="text-purple-400 hover:text-purple-300">
                    {contactInfo.press.email}
                  </a>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Phone</p>
                  <a href={`tel:${contactInfo.press.phone}`} className="text-purple-400 hover:text-purple-300">
                    {contactInfo.press.phone}
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">General Inquiries</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-zinc-400 text-sm">Email</p>
                  <a href={`mailto:${contactInfo.general.email}`} className="text-purple-400 hover:text-purple-300">
                    {contactInfo.general.email}
                  </a>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Phone</p>
                  <a href={`tel:${contactInfo.general.phone}`} className="text-purple-400 hover:text-purple-300">
                    {contactInfo.general.phone}
                  </a>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Address</p>
                  <p className="text-white">{contactInfo.general.address}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Follow Us
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Stay updated with the latest news and announcements.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <FaTwitter className="w-5 h-5" />
                <span>Follow on Twitter</span>
              </a>
              <a
                href="#"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-600/25 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <FaLinkedin className="w-5 h-5" />
                <span>Connect on LinkedIn</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 