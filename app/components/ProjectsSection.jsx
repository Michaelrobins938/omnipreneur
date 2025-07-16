"use client"
import React from 'react';

const projects = [
  {
    title: 'NOVUS',
    subtitle: 'AI Prompt Optimizer',
    desc: 'Master-level AI prompt optimization using the 4-D methodology. Transform vague ideas into tactical weapons.',
    image: '/auto_rewrite_engine_project/showcase images/2025-07-05 16_52_27-Mozilla Firefox.png',
    features: ['4-D Methodology', 'Multi-Platform', 'Enterprise Ready']
  },
  {
    title: 'AutoRewrite Engine',
    subtitle: 'Content Refinement',
    desc: 'CAL™-powered content rewriting and optimization. Perfect tone, style, and clarity every time.',
    image: '/auto_rewrite_engine_project/showcase images/2025-07-05 16_50_22-Mozilla Firefox.png',
    features: ['CAL™ Powered', 'Tone Matching', 'Style Optimization']
  },
  {
    title: 'Bundle Builder',
    subtitle: 'Product Packaging',
    desc: 'Create high-converting product bundles with AI-generated copy and professional packaging.',
    image: '/auto_rewrite_engine_project/showcase images/2025-07-05 16_51_29-.png',
    features: ['ZIP Creation', 'AI Copy', 'Gumroad Ready']
  },
  {
    title: 'Content Spawner',
    subtitle: 'Viral Content Generator',
    desc: 'Generate 100+ viral posts, carousels, and TikTok content with CAL™ optimization.',
    image: '/auto-niche-engine/showcase images/2025-07-06 01_46_23-AutoNiche Engine™ - Elite KDP Discovery _ Omnipreneur — Mozilla Firefox.png',
    features: ['100+ Templates', 'Multi-Format', 'Viral Optimization']
  },
  {
    title: 'Live Dashboard',
    subtitle: 'Analytics & Tracking',
    desc: 'Real-time tracking for launches, ROI, and performance metrics with intelligent insights.',
    image: '/auto-niche-engine/showcase images/2025-07-06 01_47_50-AutoNiche Engine™ - Elite KDP Discovery _ Omnipreneur — Mozilla Firefox.png',
    features: ['Real-time Data', 'ROI Tracking', 'Smart Insights']
  },
  {
    title: 'Affiliate Portal',
    subtitle: 'Referral Management',
    desc: 'Build and manage your affiliate network with automated commission tracking and optimization.',
    image: '/auto-niche-engine/showcase images/2025-07-06 01_48_26-AutoNiche Engine™ - Elite KDP Discovery _ Omnipreneur — Mozilla Firefox.png',
    features: ['Auto Tracking', 'Commission Management', 'Network Building']
  }
];

const ProjectsSection = () => {
  const handleLearnMore = (productTitle) => {
    // In a real implementation, this would navigate to product detail pages
    alert(`${productTitle} - Learn More\n\nThis would open detailed information about ${productTitle}, including features, pricing, and demo access.`);
  };

  return (
    <section id="products" className="w-full max-w-7xl mx-auto py-20 px-4 text-center">
      <h2 className="text-3xl md:text-5xl font-futuristic font-bold text-white mb-4 uppercase tracking-wider">Omnipreneur Product Suite</h2>
      <p className="text-lg text-muted-text mb-12">7 integrated applications powered by CAL™ technology for complete AI business automation</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <div key={i} className="relative bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-zinc-900/30 to-zinc-900/50 z-0"></div>
            <div className="relative z-10 p-6">
              <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-zinc-800/50">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-futuristic font-bold text-white mb-1">{project.title}</h3>
              <p className="text-sm text-cyan-400 mb-3 font-futuristic">{project.subtitle}</p>
              <p className="text-zinc-400 text-sm mb-4">{project.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.features.map((feature, idx) => (
                  <span key={idx} className="text-xs bg-zinc-800/80 text-zinc-300 px-2 py-1 rounded-full font-futuristic">
                    {feature}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => handleLearnMore(project.title)}
                className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-futuristic font-bold rounded-full hover:scale-105 transition-transform"
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection; 