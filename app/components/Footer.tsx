"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaYoutube, 
  FaDiscord,
  FaHeart,
  FaArrowUp
} from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { name: 'AutoRewrite Engine™', href: '/products/auto-rewrite' },
      { name: 'AutoNiche Engine™', href: '/products/auto-niche' },
      { name: 'Bundle Builder™', href: '/products/bundle-builder' },
      { name: 'Content Spawner™', href: '/products/content-spawner' },
      { name: 'Live Dashboard™', href: '/products/live-dashboard' }
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/docs/api' },
      { name: 'Status', href: '/status' },
      { name: 'Support', href: '/support' },
      { name: 'Blog', href: '/blog' }
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' },
      { name: 'Legal', href: '/legal' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/legal/privacy' },
      { name: 'Terms of Service', href: '/legal/terms' },
      { name: 'Cookie Policy', href: '/legal/cookies' },
      { name: 'GDPR Compliance', href: '/legal/gdpr' },
      { name: 'Security', href: '/legal/security' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/omnipreneur', icon: FaTwitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/omnipreneur', icon: FaLinkedin },
    { name: 'GitHub', href: 'https://github.com/omnipreneur', icon: FaGithub },
    { name: 'YouTube', href: 'https://youtube.com/@omnipreneur', icon: FaYoutube },
    { name: 'Discord', href: 'https://discord.gg/omnipreneur', icon: FaDiscord }
  ];

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),transparent_80%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron text-2xl text-white font-bold tracking-wide group-hover:text-cyan-400 transition-colors duration-300">
                  Omnipreneur
                </span>
                <span className="text-xs text-zinc-400 font-medium">AI Suite</span>
              </div>
            </Link>
            
            <p className="text-zinc-400 mb-6 max-w-md">
              Transform your business with enterprise-grade AI technology. Our CAL™-powered solutions deliver unprecedented results across content creation, analytics, and automation.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-zinc-400 text-sm">
              <span>© {currentYear} Omnipreneur. All rights reserved.</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <FaHeart className="w-3 h-3 text-red-400" />
                <span>in Dallas, Texas</span>
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center space-x-6 text-zinc-400 text-sm">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  className="hover:text-white transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Scroll to Top */}
            <motion.button
              onClick={scrollToTop}
              className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 