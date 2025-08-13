"use client";
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import TechnologyCards from './TechnologyCards';
import FeaturesSection from './FeaturesSection';
import CALShowcase from './CALShowcase';
import ProductShowcase from './ProductShowcase';
import TestimonialsSection from './TestimonialsSection';
import ContactSection from './ContactSection';
import ParticleBackground from './ParticleBackground';
import Footer from './Footer';

const HeroSection = dynamic(() => import('./HeroSection'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div></div>,
  ssr: false
});
const ProjectsSection = dynamic(() => import('./ProjectsSection'), {
  loading: () => <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div></div>,
  ssr: false
});
const FuturisticAIPanel = dynamic(() => import('./FuturisticAIPanel'), {
  loading: () => <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div></div>,
  ssr: false
});
const ProfileCardDemo = dynamic(() => import('./ProfileCardDemo'), {
  loading: () => <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div></div>,
  ssr: false
});
const InfiniteMenu = dynamic(() => import('./InfiniteMenu'), {
  loading: () => <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div></div>,
  ssr: false
});
const AuroraBackground = dynamic(() => import('./AuroraBackground'), {
  loading: () => <div className="fixed inset-0 bg-zinc-950" />,
  ssr: false
});

export default function HomeClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      {/* Premium Background Effects */}
      <AuroraBackground />
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
      {/* Main Content Sections */}
      <div className="relative z-10">
        <Suspense fallback={<div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div></div>}>
          <HeroSection />
          <TechnologyCards />
          <InfiniteMenu />
          <FeaturesSection />
          <CALShowcase />
          <ProductShowcase />
          <ProjectsSection />
          <FuturisticAIPanel />
          <ProfileCardDemo />
          <TestimonialsSection />
          <ContactSection />
        </Suspense>
        <Footer />
      </div>
    </main>
  );
} 