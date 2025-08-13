// components/novus/HotkeysHelp.tsx
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Keyboard, X } from 'lucide-react';

interface HotkeysHelpProps {
  onApplyTemplate: () => void;
}

export default function HotkeysHelp({ onApplyTemplate }: HotkeysHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hotkeys = [
    { key: 'Ctrl/Cmd + Enter', action: 'Optimize prompt' },
    { key: 'Ctrl/Cmd + S', action: 'Save session' },
    { key: 'Ctrl/Cmd + B', action: 'Copy optimized prompt' },
    { key: 'Ctrl/Cmd + E', action: 'Export as Markdown' },
    { key: 'Ctrl/Cmd + T', action: 'Apply template' }
  ];

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        variant="secondary"
        size="sm"
        className="flex items-center gap-1"
      >
        <Keyboard className="w-4 h-4" />
        <span>Shortcuts</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Keyboard Shortcuts</h3>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3">
              {hotkeys.map((hotkey, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-lg">
                  <span className="text-zinc-300">{hotkey.action}</span>
                  <kbd className="px-2 py-1 bg-zinc-700 rounded text-sm text-zinc-300 font-mono">
                    {hotkey.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-zinc-400">
              <p>Tip: These shortcuts work anywhere in the NOVUS workspace</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}