// components/novus/OptimizationPreview.tsx
'use client';

import * as React from 'react';

interface OptimizationPreviewProps {
  original: string;
  optimized: string;
  improvements: string[];
}

export default function OptimizationPreview({
  original,
  optimized,
  improvements
}: OptimizationPreviewProps) {
  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
      <h2 className="text-xl font-bold text-white mb-4">Optimization Preview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Original</h3>
          <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 h-64 overflow-auto">
            <pre className="text-zinc-300 whitespace-pre-wrap">{original}</pre>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Optimized</h3>
          <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 h-64 overflow-auto">
            <pre className="text-zinc-300 whitespace-pre-wrap">{optimized}</pre>
          </div>
        </div>
      </div>
      
      {improvements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Key Improvements</h3>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-2 text-zinc-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}