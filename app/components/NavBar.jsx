"use client"
import React, { useState, useEffect } from 'react';

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
      isScrolled ? 'bg-ui-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="inline-block w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">
                🧠
              </span>
              <span className="font-futuristic text-xl text-white font-bold tracking-wide">
                Omnipreneur<br />
                <span className="font-normal text-xs text-muted-text">AI Suite</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.id)}
                className="px-4 py-2 text-sm font-futuristic text-white hover:text-blue-400 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavigation('contact')}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-futuristic text-sm rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-400 focus:outline-none"
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
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-ui-black/95 backdrop-blur-md border-t border-white/10">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.id)}
              className="block w-full px-3 py-2 text-base font-futuristic text-white hover:text-blue-400 transition-colors text-left"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavigation('contact')}
            className="block w-full px-3 py-2 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-futuristic text-base rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 