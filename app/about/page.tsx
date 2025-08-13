"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaUsers, 
  FaGlobe, 
  FaLightbulb,
  FaShieldAlt,
  FaHeart,
  FaStar
} from 'react-icons/fa';

export default function About() {
  const stats = [
    { number: '10,000+', label: 'Active Users', icon: FaUsers },
    { number: '50+', label: 'Countries', icon: FaGlobe },
    { number: '99.9%', label: 'Uptime', icon: FaShieldAlt },
    { number: '4.9/5', label: 'User Rating', icon: FaStar }
  ];

  const values = [
    {
      icon: FaRocket,
      title: 'Innovation First',
      description: 'We push the boundaries of what&apos;s possible with AI and technology.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaUsers,
      title: 'User-Centric',
      description: 'Everything we build is designed with our users&apos; success in mind.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaLightbulb,
      title: 'Continuous Learning',
      description: 'We stay ahead of the curve with cutting-edge AI research and development.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaHeart,
      title: 'Integrity',
      description: 'We operate with transparency, honesty, and ethical AI practices.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former AI researcher at Google, passionate about democratizing AI technology.',
      image: '/team/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Expert in machine learning and scalable AI systems with 15+ years experience.',
      image: '/team/michael.jpg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'Product visionary with deep understanding of creator economy and user needs.',
      image: '/team/emily.jpg'
    },
    {
      name: 'David Kim',
      role: 'Lead AI Engineer',
      bio: 'Specialist in CAL™ technology and advanced language model development.',
      image: '/team/david.jpg'
    }
  ];

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
              About
              <span className="block bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Omnipreneur
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-8">
              We&apos;re on a mission to democratize AI-powered content creation and empower creators, 
              businesses, and entrepreneurs worldwide with cutting-edge tools and technology.
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-zinc-400 text-sm">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-zinc-400 mb-6">
                To revolutionize content creation by making AI-powered tools accessible to everyone, 
                from individual creators to enterprise businesses.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Founded in 2023, Omnipreneur was born from a simple belief: that AI should empower 
                human creativity, not replace it. Our CAL™ (Cognitive Architecture Layering) technology 
                represents a breakthrough in AI understanding and content generation, enabling users to 
                create professional-quality content at unprecedented speed and scale.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">What We Do</h3>
              <ul className="space-y-4 text-zinc-400">
                <li className="flex items-start space-x-3">
                  <FaRocket className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span>Develop cutting-edge AI content creation tools</span>
                </li>
                <li className="flex items-start space-x-3">
                  <FaUsers className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span>Empower creators and businesses worldwide</span>
                </li>
                <li className="flex items-start space-x-3">
                  <FaGlobe className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span>Build scalable, enterprise-grade solutions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <FaLightbulb className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span>Drive innovation in AI technology</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-zinc-900/80 to-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Values
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              The passionate individuals behind Omnipreneur&apos;s success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm">Photo</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-cyan-400 text-sm mb-3">{member.role}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Ready to transform your content creation with AI-powered tools?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Get Started</span>
                <FaRocket className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Contact Us</span>
                <FaUsers className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 