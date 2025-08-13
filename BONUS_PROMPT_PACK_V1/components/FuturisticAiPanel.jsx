"use client";

import React, { useCallback } from 'react';

const FuturisticAiPanel = () => {
  const scrollToSection = useCallback((sectionId) => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Video/Animation Card */}
            <div className="glass-card notched-card p-6 mb-8">
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4 text-sm font-medium text-white/80">
                  EMPOWER AI SHAPING<br/>
                  TOMORROW WITH<br/>
                  CAL™ TECHNOLOGY
                </div>
              </div>
            </div>

            {/* Partners Card */}
            <div className="glass-card notched-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm text-white/60">Partners</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/80 mb-1">Join our network of innovators and</div>
                  <div className="text-sm text-white/80">start building the future together</div>
                  <button 
                    onClick={() => scrollToSection('products')}
                    className="mt-2 px-4 py-2 glass-button rounded-lg text-sm font-medium text-white hover:text-blue-400 transition-colors"
                  >
                    Get Involved
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Robot with SVG Panel Background */}
          <div className="relative w-full h-[800px]">
            {/* SVG Background Panel */}
            <svg
              viewBox="0 0 1400 800"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full z-0"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="15" stdDeviation="30" floodColor="#000000" floodOpacity="0.2"/>
                  <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="#000000" floodOpacity="0.1"/>
                </filter>
              </defs>
              <rect
                x="0"
                y="0"
                rx="60"
                ry="60"
                width="100%"
                height="100%"
                fill="rgba(255, 255, 255, 0.95)"
                filter="url(#softShadow)"
              />
              {/* Enhanced Corner Notch */}
              <path
                d="M1300 0 L1400 0 L1400 100 Z"
                fill="rgba(180, 180, 180, 0.4)"
              />
              <path
                d="M1320 0 L1400 0 L1400 80 Z"
                fill="rgba(160, 160, 160, 0.2)"
              />
            </svg>

            {/* Robot Image with Content Overlay */}
            <div className="relative flex items-center justify-center h-full p-8 z-10">
              <div className="relative animate-float">
                <img 
                  src="/robot.png" 
                  alt="Advanced AI Robot" 
                  className="max-h-[700px] w-auto rounded-2xl shadow-2xl"
                />
                
                {/* Explore More Button */}
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => scrollToSection('cal-showcase')}
                    className="glass-button px-4 py-2 rounded-full text-sm font-medium text-white hover:text-blue-400 transition-all duration-300 border border-white/20"
                  >
                    EXPLORE MORE
                  </button>
                </div>
                
                {/* Company Description */}
                <div className="absolute bottom-6 left-6 text-white max-w-xs">
                  <div className="text-sm font-medium mb-1">CAL™ AI ROBOTICS COMPANY SPECIALIZES</div>
                  <div className="text-sm opacity-80">IN THE DEVELOPMENT OF CUTTING-EDGE</div>
                  <div className="text-sm opacity-80">TECHNOLOGY FOR A WIDE RANGE OF</div>
                  <div className="text-sm opacity-80">INDUSTRIES.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              WHY CHOOSE CAL™?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the revolutionary Cognitive Architecture Layering that transforms ordinary prompts into extraordinary results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "95% Success Rate",
                description: "Proven methodology with industry-leading optimization results"
              },
              {
                icon: "🚀",
                title: "Multi-Platform Ready",
                description: "Works seamlessly across ChatGPT, Claude, Gemini, and more"
              },
              {
                icon: "⚡",
                title: "Enterprise Ready",
                description: "Scalable solutions for businesses of all sizes"
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card notched-card p-6 text-center hover:neon-glow transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FuturisticAiPanel;
