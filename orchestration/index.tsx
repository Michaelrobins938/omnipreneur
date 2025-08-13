import React from 'react';
import Hero from './components/Hero';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import './styles/global.css';

export default function Orchestration() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Hero />
        
        <div className="mt-16 space-y-8">
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-violet-400">🎼 Workflow Orchestration</h2>
            <p className="text-gray-300 mb-6">
              Automate complex business workflows with our advanced orchestration system. 
              Connect tools, automate processes, and scale your operations seamlessly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Connect your workflow..." />
              <Button>Launch Orchestrator</Button>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-cyan-400">Automation</h3>
              <p className="text-sm text-gray-400">Build complex workflows</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Integration</h3>
              <p className="text-sm text-gray-400">Connect all your tools</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-green-400">Scaling</h3>
              <p className="text-sm text-gray-400">Scale operations efficiently</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 