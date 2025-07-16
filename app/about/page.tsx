"use client";

import React from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-futuristic font-bold text-white mb-8">About Omnipreneur</h1>
        <div className="prose prose-invert max-w-none">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-futuristic font-bold text-white mb-4">Our Mission</h2>
            <p className="text-zinc-400 mb-4">
              Omnipreneur AI Suite is dedicated to transforming businesses through advanced AI technology. Our CAL™ (Cognitive Architecture Layering) technology represents the pinnacle of AI prompt engineering and automation.
            </p>
            <Link 
              href="/"
              className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-futuristic font-bold rounded-full hover:scale-105 transition-transform"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 