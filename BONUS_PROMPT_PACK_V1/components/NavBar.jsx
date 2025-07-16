"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'hero', type: 'scroll' },
    { label: 'CAL™ Technology', id: 'cal-showcase', type: 'scroll' },
    { label: 'Products', id: 'products', type: 'scroll' },
    { label: 'NOVUS', href: '/novus', type: 'link' },
    { label: 'Contact', id: 'contact', type: 'scroll' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderNavItem = (item) => {
    if (item.type === 'link') {
      return (
        <Link
          href={item.href}
          className="glass-button px-4 py-2 rounded-full text-sm font-medium text-white hover:text-blue-400 transition-all duration-300"
        >
          {item.label}
        </Link>
      );
    }
    return (
      <button
        onClick={() => scrollToSection(item.id)}
        className="glass-button px-4 py-2 rounded-full text-sm font-medium text-white hover:text-blue-400 transition-all duration-300"
      >
        {item.label}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold gradient-text">
                Omnipreneur AI Suite
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <div key={item.label}>
                  {renderNavItem(item)}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="glass-button p-2 rounded-lg text-white hover:text-blue-400 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-card rounded-lg mt-2">
              {navItems.map((item) => (
                <div key={item.label} className="block">
                  {item.type === 'link' ? (
                    <Link
                      href={item.href}
                      className="glass-button text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        scrollToSection(item.id);
                        setIsOpen(false);
                      }}
                      className="glass-button text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar; 