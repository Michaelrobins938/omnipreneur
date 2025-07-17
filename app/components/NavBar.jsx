"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for PremiumLogo
const PremiumLogo = dynamic(() => import('./PremiumLogo'), {
  loading: () => <div className="w-32 h-8 bg-zinc-800 rounded animate-pulse" />,
  ssr: false
});

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (sectionId) => {
    setIsMobileMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'CAL™ Technology', id: 'cal-showcase' },
    { label: 'Products', id: 'products' },
    { label: 'NOVUS', id: 'novus' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <PremiumLogo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.id)}
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <button
              onClick={() => handleNavigation('contact')}
              className="ml-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-300 hover:text-white focus:outline-none transition-colors duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.id)}
              className="block w-full px-3 py-2 text-base font-medium text-zinc-300 hover:text-white transition-colors text-left"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavigation('contact')}
            className="block w-full px-3 py-2 mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-base rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 