import React from 'react';
import Hero from './components/Hero';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import './styles/global.css';

export default function SystemFiles() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Hero />
        
        <div className="mt-16 space-y-8">
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">⚙️ Core System Files</h2>
            <p className="text-gray-300 mb-6">
              Access the core configuration files, automation scripts, and system 
              components that power the entire Omnipreneur ecosystem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Search system files..." />
              <Button>Browse Files</Button>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-cyan-400">Config Files</h3>
              <p className="text-sm text-gray-400">Core system configurations</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Automation</h3>
              <p className="text-sm text-gray-400">n8n workflows and scripts</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-green-400">Templates</h3>
              <p className="text-sm text-gray-400">Reusable system templates</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 