// components/novus/RunControls.tsx
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Play, 
  Save, 
  Copy, 
  Download,
  CheckCircle,
  FileText,
  Code
} from 'lucide-react';

interface RunControlsProps {
  onRun: () => void;
  onSave: () => void;
  onCopy: () => void;
  onExport: (format: 'json' | 'md') => void;
  isRunning?: boolean;
}

export default function RunControls({
  onRun,
  onSave,
  onCopy,
  onExport,
  isRunning = false
}: RunControlsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Optimizing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Optimization
            </>
          )}
        </Button>
        
        <Button
          onClick={onSave}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Session
        </Button>
        
        <Button
          onClick={handleCopy}
          variant="secondary"
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
        
        <Button
          onClick={() => onExport('md')}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Export MD
        </Button>
        
        <Button
          onClick={() => onExport('json')}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Code className="w-4 h-4" />
          Export JSON
        </Button>
      </div>
    </div>
  );
}