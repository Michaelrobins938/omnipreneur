import React from 'react';
import Hero from './components/Hero';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import './styles/global.css';

export default function OmnipreneurPromptPack() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Hero />
        
        <div className="mt-16 space-y-8">
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">⚙️ CAL™ Engine</h2>
            <p className="text-gray-300 mb-6">
              Cognitive Architecture Layering technology that preprocesses and optimizes AI inputs 
              using our proprietary 4-D methodology: Deconstruct, Diagnose, Develop, Deliver.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Paste your prompt here..." />
              <Button>Optimize with CAL™</Button>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Deconstruct</h3>
              <p className="text-sm text-gray-400">Break down complex prompts into analyzable components</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-pink-400">Diagnose</h3>
              <p className="text-sm text-gray-400">Identify optimization opportunities and clarity gaps</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-green-400">Develop</h3>
              <p className="text-sm text-gray-400">Enhance structure, tone, and output consistency</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 