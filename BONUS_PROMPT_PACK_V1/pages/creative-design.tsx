import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Menu, X } from 'lucide-react';

const CreativeDesign = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Creative Design | CHI ART</title>
        <meta name="description" content="Creativity is allowing yourself to make mistakes; Art is knowing which ones to keep" />
      </Head>

      <div className="min-h-screen bg-[#E8EDF2]">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 bg-[#E8EDF2]/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-12">
              <Link href="/" className="text-[#2D1A45] text-xl font-bold">
                CHI
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/home" className="nav-link">HOME</Link>
                <Link href="/about" className="nav-link">ABOUT</Link>
                <Link href="/work" className="nav-link">WORK</Link>
                <Link href="/services" className="nav-link">SERVICES</Link>
                <Link href="/shop" className="nav-link">SHOP</Link>
                <Link href="/contacts" className="nav-link">CONTACTS</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:opacity-70 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
              <button className="p-2 hover:opacity-70 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button 
                className="md:hidden p-2 hover:opacity-70 transition-opacity"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#E8EDF2] border-t border-gray-200">
              <div className="px-8 py-4 space-y-4">
                <Link href="/home" className="block nav-link py-2">HOME</Link>
                <Link href="/about" className="block nav-link py-2">ABOUT</Link>
                <Link href="/work" className="block nav-link py-2">WORK</Link>
                <Link href="/services" className="block nav-link py-2">SERVICES</Link>
                <Link href="/shop" className="block nav-link py-2">SHOP</Link>
                <Link href="/contacts" className="block nav-link py-2">CONTACTS</Link>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="pt-32 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Smoke Effect */}
            <div className="relative">
              <div className="smoke-animation w-full h-[600px] bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 smoke-particle"></div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-sm tracking-wider text-[#2D1A45] mb-4">CHI ART</h2>
                <h1 className="text-6xl font-bold text-[#2D1A45] leading-tight mb-6">
                  Creative<br />Design
                </h1>
                <p className="text-gray-600 text-lg">
                  Creativity is allowing yourself to make mistakes;<br />
                  Art is knowing which ones to keep
                </p>
              </div>

              {/* Social Links */}
              <div className="flex space-x-6">
                <a href="#" className="text-[#2D1A45] hover:opacity-70 transition-opacity">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-[#2D1A45] hover:opacity-70 transition-opacity">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-[#2D1A45] hover:opacity-70 transition-opacity">
                  <Youtube size={24} />
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CreativeDesign; 