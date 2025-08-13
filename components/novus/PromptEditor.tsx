// components/novus/PromptEditor.tsx
'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { calculateTokenCount } from '../../lib/novus/metrics';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onOptimize: () => void;
  variables?: Record<string, string>;
  onVariablesChange?: (variables: Record<string, string>) => void;
  templateVariables?: string[];
}

export default function PromptEditor({
  value,
  onChange,
  onOptimize,
  variables = {},
  onVariablesChange,
  templateVariables = []
}: PromptEditorProps) {
  const [tokenCount, setTokenCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTokenCount(calculateTokenCount(value));
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onOptimize();
    }
  };

  const handleVariableChange = (variable: string, value: string) => {
    if (onVariablesChange) {
      onVariablesChange({
        ...variables,
        [variable]: value
      });
    }
  };

  // Replace variables in the prompt with their values
  const getPromptWithVariables = () => {
    let prompt = value;
    Object.entries(variables).forEach(([key, val]) => {
      prompt = prompt.replace(new RegExp(key, 'g'), val);
    });
    return prompt;
  };

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Prompt Editor</h2>
        <div className="text-sm text-zinc-400">
          {tokenCount} tokens
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your prompt here..."
            className="w-full h-64 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        {templateVariables.length > 0 && (
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-3">Variables</h3>
            <div className="space-y-3">
              {templateVariables.map((variable) => (
                <div key={variable}>
                  <label className="block text-sm text-zinc-300 mb-1">
                    {variable}
                  </label>
                  <input
                    type="text"
                    value={variables[variable] || ''}
                    onChange={(e) => handleVariableChange(variable, e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder={`Enter value for ${variable}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={onOptimize}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          Optimize Prompt
        </Button>
      </div>
    </div>
  );
}