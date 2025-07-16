"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const products = [
  { name: 'AutoRewrite Engine™', href: '/products/auto-rewrite', description: 'CAL™-powered content refinement' },
  { name: 'AutoNiche Engine™', href: '/products/auto-niche', description: 'Market opportunity discovery' },
  { name: 'Bundle Builder™', href: '/products/bundle-builder', description: 'Digital product packaging' },
  { name: 'Content Spawner™', href: '/products/content-spawner', description: 'Viral content generation' },
  { name: 'Live Dashboard™', href: '/products/live-dashboard', description: 'Real-time analytics' }
];

const resources = [
  { name: 'Documentation', href: '/docs' },
  { name: 'API Reference', href: '/docs/api' },
  { name: 'Status', href: '/status' },
  { name: 'Support', href: '/support' }
];

const company = [
  { name: 'About', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Blog', href: '/blog' },
  { name: 'Press', href: '/press' }
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-zinc-950/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-block w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">
                🧠
              </span>
              <span className="font-orbitron text-xl text-white font-bold tracking-wide">
                Omnipreneur
                <span className="block font-normal text-xs text-zinc-400">AI Suite</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="relative group">
                <button className="text-zinc-400 hover:text-white transition-colors">Products</button>
                <div className="absolute top-full left-0 w-80 pt-4 hidden group-hover:block">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl">
                    {products.map((product) => (
                      <Link
                        key={product.name}
                        href={product.href}
                        className={`block p-3 rounded-lg hover:bg-zinc-800 transition-colors ${
                          pathname === product.href ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                        }`}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-zinc-500">{product.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="text-zinc-400 hover:text-white transition-colors">Resources</button>
                <div className="absolute top-full left-0 w-48 pt-4 hidden group-hover:block">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-xl">
                    {resources.map((resource) => (
                      <Link
                        key={resource.name}
                        href={resource.href}
                        className={`block px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors ${
                          pathname === resource.href ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                        }`}
                      >
                        {resource.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="text-zinc-400 hover:text-white transition-colors">Company</button>
                <div className="absolute top-full left-0 w-48 pt-4 hidden group-hover:block">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-xl">
                    {company.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors ${
                          pathname === item.href ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link 
                href="/contact" 
                className={`text-zinc-400 hover:text-white transition-colors ${
                  pathname === '/contact' ? 'text-white' : ''
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 top-16 bg-zinc-950 z-40 overflow-y-auto"
          >
            <div className="p-4">
              <div className="space-y-1">
                <div className="py-4">
                  <div className="text-sm font-medium text-zinc-500 mb-2">Products</div>
                  {products.map((product) => (
                    <Link
                      key={product.name}
                      href={product.href}
                      className={`block p-3 rounded-lg ${
                        pathname === product.href ? 'bg-zinc-900 text-white' : 'text-zinc-400'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-zinc-500">{product.description}</div>
                    </Link>
                  ))}
                </div>

                <div className="py-4">
                  <div className="text-sm font-medium text-zinc-500 mb-2">Resources</div>
                  {resources.map((resource) => (
                    <Link
                      key={resource.name}
                      href={resource.href}
                      className={`block px-4 py-2 rounded-lg ${
                        pathname === resource.href ? 'bg-zinc-900 text-white' : 'text-zinc-400'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {resource.name}
                    </Link>
                  ))}
                </div>

                <div className="py-4">
                  <div className="text-sm font-medium text-zinc-500 mb-2">Company</div>
                  {company.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg ${
                        pathname === item.href ? 'bg-zinc-900 text-white' : 'text-zinc-400'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="py-4">
                  <Link
                    href="/contact"
                    className={`block px-4 py-2 rounded-lg ${
                      pathname === '/contact' ? 'bg-zinc-900 text-white' : 'text-zinc-400'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 