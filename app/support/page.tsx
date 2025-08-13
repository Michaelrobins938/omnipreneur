"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeadset, 
  FaQuestionCircle, 
  FaBook, 
  FaVideo, 
  FaComments,
  FaTicketAlt,
  FaClock,
  FaCheckCircle,
  FaSearch,
  FaArrowRight
} from 'react-icons/fa';
import { 
  HiOutlineSupport,
  HiOutlineDocumentText,
  HiOutlineVideoCamera,
  HiOutlineChat,
  HiOutlineClock
} from 'react-icons/hi';

export default function Support() {
  const [activeTab, setActiveTab] = useState('help');
  const [searchQuery, setSearchQuery] = useState('');

  const supportCategories = [
    {
      icon: HiOutlineDocumentText,
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials',
      color: 'from-blue-500 to-cyan-500',
      href: '/docs'
    },
    {
      icon: HiOutlineVideoCamera,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      color: 'from-purple-500 to-pink-500',
      href: '#'
    },
    {
      icon: HiOutlineChat,
      title: 'Live Chat',
      description: 'Get instant help from our team',
      color: 'from-green-500 to-emerald-500',
      href: '#'
    },
    {
      icon: HiOutlineSupport,
      title: 'Ticket System',
      description: 'Submit and track support tickets',
      color: 'from-orange-500 to-red-500',
      href: '#'
    }
  ];

  const faqItems = [
    {
      question: 'How do I get started with Omnipreneur AI Suite?',
      answer: 'Getting started is easy! Simply create an account, choose your plan, and you\'ll have access to all our AI-powered tools. We provide comprehensive onboarding guides and video tutorials to help you get up and running quickly.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely through Stripe.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all new subscriptions. If you\'re not satisfied with our service, contact our support team within 30 days for a full refund.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely! We use enterprise-grade encryption and security measures to protect your data. We\'re SOC 2 compliant and follow industry best practices for data protection.'
    },
    {
      question: 'Do you offer custom integrations?',
      answer: 'Yes, we offer custom integrations for enterprise customers. Contact our sales team to discuss your specific requirements and we\'ll create a tailored solution for your needs.'
    }
  ];

  const contactMethods = [
    {
      icon: FaComments,
      title: 'Live Chat',
      description: 'Available 24/7',
      contact: 'Start Chat',
      href: '#',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaTicketAlt,
      title: 'Support Tickets',
      description: 'Track your requests',
      contact: 'Submit Ticket',
      href: '#',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaClock,
      title: 'Phone Support',
      description: 'Mon-Fri 9AM-6PM PST',
      contact: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaCheckCircle,
      title: 'Email Support',
      description: 'Response within 24 hours',
      contact: 'support@omnipreneur.ai',
      href: 'mailto:support@omnipreneur.ai',
      color: 'from-orange-500 to-red-500'
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
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaHeadset className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Support
              <span className="block bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Center
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-8">
              We're here to help you succeed. Get the support you need to make the most of our AI-powered tools.
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
                  placeholder="Search for help articles, tutorials, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-12 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How Can We Help?
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Choose the support option that works best for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-zinc-400 leading-relaxed mb-4">{category.description}</p>
                  <a 
                    href={category.href}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Learn More <FaArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-gradient-to-br from-zinc-900/80 to-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Our support team is ready to help you succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-zinc-400 text-sm mb-4">{method.description}</p>
                  <a 
                    href={method.href}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    {method.contact}
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Find quick answers to common questions.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{item.question}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 