// components/novus/MetricsStrip.tsx
'use client';

import * as React from 'react';
const Progress = ({ value, className, indicatorClassName }: { value: number; className?: string; indicatorClassName?: string }) => (
  <div className={className}>
    <div className="w-full bg-zinc-800 rounded h-2">
      <div className={`${indicatorClassName || 'bg-blue-500'} h-2 rounded`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  </div>
);

interface MetricsStripProps {
  readability: number;
  structure: number;
  safety: number;
  tokenDeltaPct: number;
}

export default function MetricsStrip({
  readability,
  structure,
  safety,
  tokenDeltaPct
}: MetricsStripProps) {
  const metrics = [
    { label: 'Readability', value: readability, color: 'bg-blue-500' },
    { label: 'Structure', value: structure, color: 'bg-green-500' },
    { label: 'Safety', value: safety, color: 'bg-purple-500' },
    { 
      label: 'Token Change', 
      value: Math.abs(tokenDeltaPct), 
      color: tokenDeltaPct >= 0 ? 'bg-yellow-500' : 'bg-red-500',
      suffix: tokenDeltaPct >= 0 ? '+' : ''
    }
  ];

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
      <h2 className="text-xl font-bold text-white mb-4">Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">{metric.label}</span>
              <span className="text-sm font-medium text-white">
                {metric.suffix}{metric.value.toFixed(1)}{metric.label === 'Token Change' ? '%' : ''}
              </span>
            </div>
            <Progress 
              value={metric.value} 
              className="h-2" 
              indicatorClassName={metric.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
}