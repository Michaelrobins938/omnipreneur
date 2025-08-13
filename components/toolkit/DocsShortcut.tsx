'use client';

import * as React from 'react';
import { Button } from '../ui/button';
import { BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface DocsShortcutProps {
  productName: string;
  docsLink?: string;
}

export default function DocsShortcut({
  productName,
  docsLink
}: DocsShortcutProps) {
  if (!docsLink) return null;

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-white font-medium">Documentation</p>
            <p className="text-sm text-zinc-400">Learn how to use {productName}</p>
          </div>
        </div>
        
        <Link href={docsLink} target="_blank">
          <Button variant="secondary" size="sm" className="flex items-center gap-1">
            <span>View Docs</span>
            <ExternalLink className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}