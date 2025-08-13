"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsRegistry } from '@/app/lib/products';

const products = productsRegistry;

const resources = [
  { name: 'Documentation', href: '/docs' },
  { name: 'API Reference', href: '/api-reference' },
  { name: 'Status', href: '/status' },
  { name: 'Support', href: '/support' }
];

const company = [
  { name: 'About', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Blog', href: '/blog' },
  { name: 'Press', href: '/press' }
];

const developers = [
  { name: 'Developer Portal', href: '/developer-portal' },
  { name: 'API Documentation', href: '/api-docs' },
  { name: 'Quick Start', href: '/quick-start' },
  { name: 'API Keys', href: '/api-keys' }
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Smooth scroll to section with offset for sticky nav
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for sticky nav height
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-zinc-950/90 backdrop-blur-xl shadow-2xl border-b border-zinc-800/50' : 'bg-zinc-950/20 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">O</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron text-2xl text-white font-bold tracking-wide group-hover:text-cyan-400 transition-colors duration-300">
                  Omnipreneur
                </span>
                <span className="text-xs text-zinc-400 font-medium">AI Suite</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="relative group">
                <Link href="/products" className="text-zinc-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide">
                  Products
                </Link>
                <div className="absolute top-full left-0 w-[28rem] pt-6 hidden group-hover:block">
                  <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[70vh] overflow-y-auto pr-2">
                      {products.map((product) => (
                        <Link
                          key={product.name}
                          href={product.href}
                          className={`block p-4 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 group/item ${
                            pathname === product.href ? 'bg-zinc-800/50 text-white' : 'text-zinc-300'
                          }`}
                        >
                          <div className="font-semibold text-white group-hover/item:text-cyan-400 transition-colors duration-300">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-zinc-400 mt-1">{product.description}</div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <span className="text-zinc-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide cursor-pointer">
                  Resources
                </span>
                <div className="absolute top-full left-0 w-48 pt-6 hidden group-hover:block">
                  <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-4 shadow-2xl">
                    <div className="space-y-2">
                      {resources.map((resource) => (
                        <Link
                          key={resource.name}
                          href={resource.href}
                          className={`block px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 ${
                            pathname === resource.href ? 'bg-zinc-800/50 text-white' : 'text-zinc-300'
                          }`}
                        >
                          {resource.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>


              <div className="relative group">
                <Link href="/company" className="text-zinc-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide">
                  Company
                </Link>
                <div className="absolute top-full left-0 w-48 pt-6 hidden group-hover:block">
                  <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-4 shadow-2xl">
                    <div className="space-y-2">
                      {company.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`block px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 ${
                            pathname === item.href ? 'bg-zinc-800/50 text-white' : 'text-zinc-300'
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Link href="/developers" className="text-zinc-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide">
                  Developers
                </Link>
                <div className="absolute top-full left-0 w-56 pt-6 hidden group-hover:block">
                  <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-4 shadow-2xl">
                    <div className="space-y-2">
                      {developers.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`block px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 ${
                            pathname === item.href ? 'bg-zinc-800/50 text-white' : 'text-zinc-300'
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Link 
                href="/dashboard" 
                className={`text-zinc-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide ${
                  pathname === '/dashboard' ? 'text-white' : ''
                }`}
              >
                Dashboard
              </Link>

              <Link 
                href="/contact" 
                className={`text-zinc-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide ${
                  pathname === '/contact' ? 'text-white' : ''
                }`}
              >
                Contact
              </Link>

              <div className="flex items-center gap-4 ml-2">
                <Link
                  href="/auth/login"
                  className="text-zinc-300 hover:text-white transition-all duration-300 font-medium text-sm tracking-wide"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  className={`px-4 py-2 rounded-xl ${isScrolled ? 'bg-white text-zinc-900' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'} text-sm font-semibold hover:opacity-90 shadow-sm`}
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            className="lg:hidden fixed inset-0 top-20 bg-zinc-950/95 backdrop-blur-xl z-40 overflow-y-auto"
          >
            <div className="p-6">
              <div className="space-y-6">
                <div className="py-4">
                  <div className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wide">Products</div>
                  <div className="grid grid-cols-1 gap-2">
                    {products.map((product) => (
                      <Link
                        key={product.name}
                        href={product.href}
                        className={`block p-4 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 ${
                          pathname === product.href ? 'bg-zinc-800/50 text-white' : 'text-zinc-300'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="font-semibold text-white">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-zinc-400 mt-1">{product.description}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="py-4">
                  <div className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wide">Resources</div>
                  <div className="space-y-2">
                    {resources.map((resource) => (
                      <Link
                        key={resource.name}
                        href={resource.href}
                        className={`block px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 ${
                          pathname === resource.href ? 'bg-zinc-800/50 text-white' : 'text-zinc-300'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {resource.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="py-4">
                  <div className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wide">Developers</div>
                  <div className="space-y-2">
                    {developers.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 ${
                          pathname === item.href ? 'bg-zinc-800/50 text-white' : 'text-zinc-300'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="py-4">
                  <div className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wide">Company</div>
                  <div className="space-y-2">
                    {company.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 ${
                          pathname === item.href ? 'bg-zinc-800/50 text-white' : 'text-zinc-300'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="py-4">
                  <Link
                    href="/contact"
                    className={`block px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 ${
                      pathname === '/contact' ? 'bg-zinc-800/50 text-white' : 'text-zinc-300'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>

                <div className="py-4">
                  <Link
                    href="/dashboard"
                    className={`block px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 ${
                      pathname === '/dashboard' ? 'bg-zinc-800/50 text-white' : 'text-zinc-300'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </div>

                <div className="py-4 grid grid-cols-2 gap-3">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 rounded-xl border border-zinc-700 text-zinc-300 text-center hover:bg-zinc-800/50 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/get-started"
                    className="block px-4 py-3 rounded-xl bg-white text-zinc-900 text-center font-semibold hover:opacity-90 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
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