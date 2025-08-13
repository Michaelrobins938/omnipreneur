'use client';

import * as React from 'react';

const Progress = ({ value, className, indicatorClassName }: { value: number; className?: string; indicatorClassName?: string }) => (
  <div className={className}>
    <div className="w-full bg-zinc-800 rounded h-2">
      <div className={`${indicatorClassName || 'bg-blue-500'} h-2 rounded`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  </div>
);

interface MetricConfig {
  label: string;
  value: number;
  color?: string;
  suffix?: string;
  format?: (value: number) => string;
}

interface MetricsStripProps {
  metrics: MetricConfig[];
  title?: string;
}

export default function MetricsStrip({
  metrics,
  title = "Metrics"
}: MetricsStripProps) {
  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">{metric.label}</span>
              <span className="text-sm font-medium text-white">
                {metric.format 
                  ? metric.format(metric.value)
                  : `${metric.suffix || ''}${metric.value.toFixed(1)}`
                }
              </span>
            </div>
            <Progress 
              value={metric.value} 
              className="h-2" 
              indicatorClassName={metric.color || 'bg-blue-500'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}