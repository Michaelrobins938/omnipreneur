import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-4">
          🎼 Orchestration
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Automate complex business workflows with our advanced orchestration system. 
          Connect tools, automate processes, and scale your operations seamlessly.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg">
          Launch Orchestrator
        </Button>
        <Button variant="outline" size="lg">
          View Workflows
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="text-gray-400">
          <span className="text-violet-400 font-semibold">✓</span> Automation
        </div>
        <div className="text-gray-400">
          <span className="text-purple-400 font-semibold">✓</span> Integration
        </div>
        <div className="text-gray-400">
          <span className="text-cyan-400 font-semibold">✓</span> Scaling
        </div>
      </div>
    </div>
  );
} 