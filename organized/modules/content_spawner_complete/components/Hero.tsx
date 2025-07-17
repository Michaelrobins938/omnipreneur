import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
          🧠 Content Spawner
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Generate 100+ content pieces in one click. From viral social posts to SEO-optimized 
          blog articles, create engaging content that converts at scale.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg">
          Spawn Now
        </Button>
        <Button variant="outline" size="lg">
          View Templates
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="text-gray-400">
          <span className="text-pink-400 font-semibold">✓</span> 100+ Pieces
        </div>
        <div className="text-gray-400">
          <span className="text-purple-400 font-semibold">✓</span> Multi-Platform
        </div>
        <div className="text-gray-400">
          <span className="text-cyan-400 font-semibold">✓</span> Instant Results
        </div>
      </div>
    </div>
  );
} 