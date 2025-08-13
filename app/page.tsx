"use client"
import React from 'react';
 
import HeroSection from '@/components/sections/HeroSection';
import SocialProofStrip from '@/components/sections/SocialProofStrip';
import ContrastPanel from '@/components/sections/ContrastPanel';
import Mechanism3Step from '@/components/sections/Mechanism3Step';
import DemoEmbed from '@/components/sections/DemoEmbed';
import ProofBand from '@/components/sections/ProofBand';
import CaseSnapGrid from '@/components/sections/CaseSnapGrid';
import ProductGateway from '@/components/sections/ProductGateway';
import UrgencyBanner from '@/components/sections/UrgencyBanner';
import GuaranteeBadge from '@/components/sections/GuaranteeBadge';
import FinalCTA from '@/components/sections/FinalCTA';
import FounderNote from '@/components/sections/FounderNote';
import SupportWidget from '@/components/common/SupportWidget';
 

export default function Home() {
  const [urgencyDismissed, setUrgencyDismissed] = React.useState(false);

  return (
    <div className="min-h-screen bg-zinc-950" style={{ scrollBehavior: 'smooth' }}>
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>

      

      <main id="main-content">
        <HeroSection />

        <SocialProofStrip />

        <section id="how" className="scroll-mt-24">
          <ContrastPanel />
          <Mechanism3Step />
          <DemoEmbed />
        </section>

        <section id="proof" className="scroll-mt-24">
          <ProofBand />
          <CaseSnapGrid />
        </section>

        <ProductGateway />

        <UrgencyBanner onDismiss={() => setUrgencyDismissed(true)} isDismissed={urgencyDismissed} />
        <GuaranteeBadge />

        <FinalCTA />
        <FounderNote />
        <SupportWidget />
      </main>
    </div>
  );
}