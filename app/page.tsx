import React from 'react';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <NavBar />
      <HeroSection />
      <ProductsSection />
      <ContactSection />
      <Footer />
    </main>
  );
} 