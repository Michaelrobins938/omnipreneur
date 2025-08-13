'use client';

import * as React from 'react';

interface ResultPreviewProps {
  original: string;
  result: string;
  improvements?: string[];
  originalLabel?: string;
  resultLabel?: string;
  improvementsLabel?: string;
}

export default function ResultPreview({
  original,
  result,
  improvements = [],
  originalLabel = "Original",
  resultLabel = "Result",
  improvementsLabel = "Key Improvements"
}: ResultPreviewProps) {
  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
      <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{originalLabel}</h3>
          <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 h-64 overflow-auto">
            <pre className="text-zinc-300 whitespace-pre-wrap">{original}</pre>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{resultLabel}</h3>
          <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 h-64 overflow-auto">
            <pre className="text-zinc-300 whitespace-pre-wrap">{result}</pre>
          </div>
        </div>
      </div>
      
      {improvements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">{improvementsLabel}</h3>
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