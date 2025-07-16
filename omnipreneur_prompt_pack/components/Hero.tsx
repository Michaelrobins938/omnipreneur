import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          ⚙️ Claude Rewrite Engine
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Reformat prompts with surgical precision using our proprietary CAL™ technology. 
          Transform any AI input into optimized, emotionally-aware copy that converts.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg">
          Rebuild Prompt
        </Button>
        <Button variant="outline" size="lg">
          View Examples
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="text-gray-400">
          <span className="text-cyan-400 font-semibold">✓</span> 4-D Methodology
        </div>
        <div className="text-gray-400">
          <span className="text-purple-400 font-semibold">✓</span> CAL™ Technology
        </div>
        <div className="text-gray-400">
          <span className="text-pink-400 font-semibold">✓</span> Instant Results
        </div>
      </div>
    </div>
  );
} 