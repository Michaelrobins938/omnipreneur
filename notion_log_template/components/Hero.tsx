import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent mb-4">
          📝 Notion Log Template
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Professional Notion templates for tracking business activities, progress, 
          and results. Stay organized and accountable with structured logging.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg">
          Import Template
        </Button>
        <Button variant="outline" size="lg">
          View Demo
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="text-gray-400">
          <span className="text-teal-400 font-semibold">✓</span> Daily Logs
        </div>
        <div className="text-gray-400">
          <span className="text-cyan-400 font-semibold">✓</span> Results Tracker
        </div>
        <div className="text-gray-400">
          <span className="text-blue-400 font-semibold">✓</span> Goal Setting
        </div>
      </div>
    </div>
  );
} 