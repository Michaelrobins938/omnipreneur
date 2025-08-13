'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, FileText, Shield, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage() {
  const legalSections = [
    {
      icon: FileText,
      title: 'Terms of Service',
      description: 'Our terms and conditions for using Omnipreneur services',
      href: '/legal/terms',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Eye,
      title: 'Privacy Policy', 
      description: 'How we collect, use, and protect your personal information',
      href: '/legal/privacy',
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: Shield,
      title: 'GDPR Compliance',
      description: 'Your rights under the General Data Protection Regulation',
      href: '/legal/gdpr',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Enterprise-grade security measures and certifications',
      href: '/legal/security',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Legal Center</h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Transparency and compliance documentation for Omnipreneur services
          </p>
        </motion.div>

        {/* Legal Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {legalSections.map((section, index) => {
            const Icon = section.icon;
            
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={section.href}>
                  <div className="group bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 cursor-pointer hover:transform hover:scale-105 h-full">
                    {/* Background gradient effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center mb-6`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-zinc-200 transition-all duration-300">
                      {section.title}
                    </h3>
                    
                    <p className="text-zinc-400 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50 mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Commitments</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Built in Dallas, Texas with enterprise-grade standards for security, privacy, and compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Data Protection</h3>
              <p className="text-zinc-400 text-sm">GDPR compliant with enterprise-grade encryption and access controls</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Security First</h3>
              <p className="text-zinc-400 text-sm">SOC 2 Type II certified with 24/7 monitoring and incident response</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Transparency</h3>
              <p className="text-zinc-400 text-sm">Clear policies and regular updates on how we handle your data</p>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">Legal Questions?</h2>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              If you have questions about our legal policies or need clarification on any terms, our legal team is here to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@omnipreneur.com"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
              >
                Contact Legal Team
              </a>
              <Link href="/support">
                <button className="px-6 py-3 border-2 border-white/20 text-white rounded-full font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                  General Support
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-700">
            <p className="text-zinc-400 text-sm">
              <strong>Made in Dallas, Texas, USA</strong> • Last Updated: {new Date().toLocaleDateString()}<br/>
              Omnipreneur LLC • All legal documents available in English
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}