import React from 'react';
import { Button } from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-zinc-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Premium Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8">
          <span className="text-blue-400 text-sm font-medium">🚀 Premium AI Suite</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Omnipreneur
          </span>
          <br />
          <span className="text-zinc-300">AI Suite</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-xl sm:text-2xl text-zinc-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Complete digital product empire powered by Claude 4 Opus and CAL™ technology. 
          Build, package, publish, and profit with 6 AI-powered tools.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4">
            Start Building Now
          </Button>
          <Button variant="outline" size="lg" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-lg px-8 py-4">
            Watch Demo
          </Button>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center space-x-8 text-zinc-500">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⭐</span>
            <span className="text-sm">4.9/5 Rating</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👥</span>
            <span className="text-sm">10K+ Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🚀</span>
            <span className="text-sm">6 AI Tools</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-zinc-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
} 