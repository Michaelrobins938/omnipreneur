"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sparkles } from 'lucide-react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      name: 'Products', 
      href: '#products', 
      submenu: [
        { name: 'AutoRewrite Engine', href: '#auto-rewrite', description: 'AI-powered content optimization' },
        { name: 'Content Spawner', href: '#content-spawner', description: 'Generate 100+ viral pieces' },
        { name: 'Bundle Builder', href: '#bundle-builder', description: 'Create premium digital products' },
        { name: 'Live Dashboard', href: '#dashboard', description: 'Real-time analytics & insights' }
      ]
    },
    { 
      name: 'Solutions', 
      href: '#solutions', 
      submenu: [
        { name: 'For Creators', href: '#creators', description: 'Scale your content creation' },
        { name: 'For Businesses', href: '#businesses', description: 'Enterprise AI solutions' },
        { name: 'For Agencies', href: '#agencies', description: 'White-label AI tools' }
      ]
    },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl opacity-20 blur-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl">Omnipreneur</span>
              <span className="text-zinc-400 text-xs font-medium">AI Suite</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <motion.button
                  whileHover={{ y: -2 }}
                  className="flex items-center space-x-1 text-zinc-300 hover:text-white transition-colors duration-200 font-medium py-2"
                >
                  <span>{item.name}</span>
                  {item.submenu && <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />}
                </motion.button>
                
                {/* Dropdown Menu */}
                {item.submenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    whileHover={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute top-full left-0 mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                  >
                    <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                      <div className="grid gap-3">
                        {item.submenu.map((subItem) => (
                          <motion.a
                            key={subItem.name}
                            href={subItem.href}
                            whileHover={{ x: 5 }}
                            className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors duration-200 group/item"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200"></div>
                            <div>
                              <div className="text-white font-medium group-hover/item:text-blue-400 transition-colors duration-200">{subItem.name}</div>
                              <div className="text-zinc-400 text-sm">{subItem.description}</div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-zinc-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg bg-zinc-900/50 backdrop-blur-sm border border-white/10 hover:bg-zinc-800/50 transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    className="block text-white font-medium py-2 hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                  {item.submenu && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block text-zinc-400 text-sm py-1 hover:text-white transition-colors duration-200"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-3 border-t border-white/10">
                <button className="w-full px-6 py-3 text-zinc-300 hover:text-white transition-colors duration-200 font-medium">
                  Sign In
                </button>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar; 