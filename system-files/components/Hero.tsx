import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-4">
          ⚙️ System Files
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Core configuration files, automation scripts, and system components that 
          power the entire Omnipreneur ecosystem.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg">
          Browse Files
        </Button>
        <Button variant="outline" size="lg">
          Download All
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="text-gray-400">
          <span className="text-indigo-400 font-semibold">✓</span> Config Files
        </div>
        <div className="text-gray-400">
          <span className="text-purple-400 font-semibold">✓</span> Automation
        </div>
        <div className="text-gray-400">
          <span className="text-cyan-400 font-semibold">✓</span> Templates
        </div>
      </div>
    </div>
  );
} 