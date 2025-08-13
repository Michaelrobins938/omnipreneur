import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import GeometricCharacter from '../components/GeometricCharacter';

const MentalHealthPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Mental Health Support | Breaking Free From Depression</title>
        <meta name="description" content="Professional mental health support and resources for those dealing with depression" />
      </Head>

      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0">
                  <div className="w-12 h-12">
                    <svg viewBox="0 0 50 50" className="w-full h-full">
                      <path
                        d="M25 0 L50 25 L25 50 L0 25 Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/about" className="nav-highlight text-gray-900 hover:text-gray-600 transition-colors">ABOUT</Link>
                <Link href="/specialist" className="nav-highlight text-gray-900 hover:text-gray-600 transition-colors">SPECIALIST</Link>
                <Link href="/mental-health" className="px-6 py-2 bg-black text-white rounded-full">MENTAL HEALTH</Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-900 hover:text-gray-600 focus:outline-none"
                >
                  {isMobileMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-white border-t border-gray-200">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                    href="/about"
                    className="block px-3 py-2 text-gray-900 hover:text-gray-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ABOUT
                  </Link>
                  <Link
                    href="/specialist"
                    className="block px-3 py-2 text-gray-900 hover:text-gray-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    SPECIALIST
                  </Link>
                  <Link
                    href="/mental-health"
                    className="block px-3 py-2 bg-black text-white rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    MENTAL HEALTH
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-32 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="relative mb-32">
              <h1 className="text-2xl md:text-3xl text-center mb-24 tracking-wider">
                I DON'T WANT TO BE THAT CHARACTER ANYMORE
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Side - Geometric Text and Character */}
                <div className="relative">
                  <div className="geometric-text">
                    DEPRESSION
                  </div>
                  <GeometricCharacter className="w-48 h-48 absolute -right-8 bottom-0 transform translate-y-1/2" />
                  <div className="shape-left geometric-shape" />
                  <div className="shape-right geometric-shape" />
                  <div className="absolute -bottom-12 left-0">
                    <p className="text-sm text-gray-600">Sand rains down and here I sit</p>
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                      We don't always have a choice in feeling depressed; sometimes it can be due to circumstances as we might be experiencing grief and loss, other times, it comes from a chemical imbalance
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">01</span>
                    <div className="flex-1 mx-4 h-px bg-gray-300"></div>
                    <span className="text-gray-500">05</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between mt-12">
                <Link href="/change-your-life" className="text-black hover:text-gray-600 transition-colors">
                  CHANGE YOUR LIFE
                </Link>
                <Link href="/contact" className="text-black hover:text-gray-600 transition-colors">
                  CONTACT WITH US
                </Link>
              </div>

              {/* Discover More Button */}
              <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2">
                <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
                  DISCOVER MORE
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MentalHealthPage; 