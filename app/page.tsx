import FuturisticAIPanel from './components/FuturisticAIPanel';
import TechnologyCards from './components/TechnologyCards';
import FeaturesSection from './components/FeaturesSection';
import CALShowcase from './components/CALShowcase';
import ProductShowcase from './components/ProductShowcase';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import ParticleBackground from './components/ParticleBackground';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 relative">
      <ParticleBackground />
      <FuturisticAIPanel />
      <TechnologyCards />
      <CALShowcase />
      <ProductShowcase />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
} 