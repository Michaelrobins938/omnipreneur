"use client"
import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import ProductsSection from '../components/ProductsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Premium Navigation */}
      <Header />
      
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section with floating particles and premium animations */}
        <HeroSection />
        
        {/* Products Showcase with 6 complete AI tools */}
        <ProductsSection />
        
        {/* Contact Section with glass effects and form validation */}
        <ContactSection />
      </main>
      
      {/* Premium Footer with social links and scroll-to-top */}
      <Footer />
    </div>
  );
} 