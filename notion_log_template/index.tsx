import React from 'react';
import Hero from './components/Hero';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import './styles/global.css';

export default function NotionLogTemplate() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Hero />
        
        <div className="mt-16 space-y-8">
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-teal-400">📝 Structured Logging</h2>
            <p className="text-gray-300 mb-6">
              Professional Notion templates for tracking business activities, progress, 
              and results. Stay organized and accountable with structured logging.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Enter your Notion workspace..." />
              <Button>Import Template</Button>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-cyan-400">Daily Logs</h3>
              <p className="text-sm text-gray-400">Track daily activities and progress</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Results Tracker</h3>
              <p className="text-sm text-gray-400">Monitor outcomes and metrics</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-green-400">Goal Setting</h3>
              <p className="text-sm text-gray-400">Set and track business objectives</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 