import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent mb-4">
          🌐 Partner Portal
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Earn while they automate. Track your earnings, manage referrals, and access 
          exclusive partner resources in our premium affiliate dashboard.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg">
          View My Stats
        </Button>
        <Button variant="secondary" size="lg">
          Partner Resources
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="text-gray-400">
          <span className="text-green-400 font-semibold">✓</span> Track Earnings
        </div>
        <div className="text-gray-400">
          <span className="text-cyan-400 font-semibold">✓</span> Manage Referrals
        </div>
        <div className="text-gray-400">
          <span className="text-blue-400 font-semibold">✓</span> Exclusive Access
        </div>
      </div>
    </div>
  );
} 