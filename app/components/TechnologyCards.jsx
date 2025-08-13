"use client"
import React from 'react';
import Image from 'next/image';

const technologies = [
  {
    title: 'ROBOTIC TECHNOLOGY',
    image: '/images/robotic-tech.jpg',
    description: 'Advanced robotics solutions for industrial automation and precision control systems.',
  },
  {
    title: 'INDUSTRIAL TECHNOLOGY',
    image: '/images/industrial-tech.jpg',
    description: 'Smart manufacturing and Industry 4.0 solutions powered by AI and IoT.',
  },
  {
    title: 'AVIATION TECHNOLOGY',
    image: '/images/aviation-tech.jpg',
    description: 'Next-generation aviation systems with autonomous capabilities and AI integration.',
  },
];

const TechnologyCards = () => {
  return (
    <section className="w-full py-20 px-4 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      {/* Section Title */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-6">
          WHAT WE DO
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto">
          Explore our cutting-edge technology solutions that are shaping the future of industry and automation.
        </p>
      </div>
      
      {/* Technology Cards Grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {technologies.map((tech, index) => (
          <div 
            key={index}
            className="group relative"
          >
            {/* Card Container */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-glow">
              {/* Notched Corner */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-white/5">
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-r-[32px] border-t-transparent border-r-white/10" />
              </div>
              
              {/* Image Container */}
              <div className="aspect-[4/3] relative">
                <Image
                  src={tech.image}
                  alt={tech.title}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="font-orbitron text-xl font-bold text-white mb-3">
                  {tech.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {tech.description}
                </p>
                {/* Arrow Icon */}
                <div className="mt-4 flex items-center text-primary group-hover:text-white transition-colors">
                  <span className="text-sm font-orbitron">Learn More</span>
                  <svg 
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnologyCards; 