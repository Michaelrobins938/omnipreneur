"use client"
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterLinks {
  [category: string]: FooterLink[];
}

const footerLinks: FooterLinks = {
  'Products': [
    { name: 'AutoRewrite Engine™', href: '/products/auto-rewrite' },
    { name: 'AutoNiche Engine™', href: '/products/auto-niche' },
    { name: 'Bundle Builder™', href: '/products/bundle-builder' },
    { name: 'Content Spawner™', href: '/products/content-spawner' },
    { name: 'Live Dashboard™', href: '/products/live-dashboard' }
  ],
  'Company': [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' }
  ],
  'Resources': [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/docs/api' },
    { name: 'Status', href: '/status' },
    { name: 'Support', href: '/support' }
  ],
  'Legal': [
    { name: 'Privacy', href: '/legal/privacy' },
    { name: 'Terms', href: '/legal/terms' },
    { name: 'Security', href: '/legal/security' },
    { name: 'Compliance', href: '/legal/compliance' }
  ]
};

export default function Footer() {
  return (
    <footer className="w-full py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-lg font-orbitron font-bold text-white mb-6">{category}</h3>
              <ul className="space-y-4">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (linkIndex * 0.05) }}
                  >
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-orbitron font-bold text-white">
                Omnipreneur
              </Link>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400 text-sm">
                Powered by CAL™ Technology
              </span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="https://twitter.com/omnipreneur"
                className="text-zinc-400 hover:text-cyan-400 transition-colors duration-200"
              >
                Twitter
              </Link>
              <Link
                href="https://github.com/omnipreneur"
                className="text-zinc-400 hover:text-cyan-400 transition-colors duration-200"
              >
                GitHub
              </Link>
              <Link
                href="https://linkedin.com/company/omnipreneur"
                className="text-zinc-400 hover:text-cyan-400 transition-colors duration-200"
              >
                LinkedIn
              </Link>
            </div>

            <div className="text-zinc-600 text-sm">
              © 2025 Omnipreneur. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 